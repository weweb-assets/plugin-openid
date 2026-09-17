import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';

// The published plugin bundles Vue settings imports. Load those as empty modules here and
// exercise the unchanged runtime with the real OIDC SDK and an observable cookie boundary.
globalThis.window = {};
const sdk = createRequire(import.meta.url)('oidc-client');
delete globalThis.window;

const domain = 'https://identity.example.test';
const clientId = 'test-client';
const key = `oidc.user:${domain}:${clientId}`;
const suffixes = ['', '.access_token', '.id_token', '.refresh_token', '.user_data'];

async function setup(tokenStorage, initialCookies = {}) {
    const cookies = new Map(Object.entries(initialCookies));
    const writes = [];
    const variables = new Map();
    const transactionStorage = new sdk.InMemoryWebStorage();
    const context = vm.createContext({
        window: { location: { origin: 'https://app.example.test' } },
        wwLib: {
            manager: true,
            useBaseTag: () => false,
            wwLog: {
                error: error => {
                    throw error;
                },
            },
            wwVariable: { updateValue: (name, value) => variables.set(name, value) },
        },
    });
    const oidc = {
        ...sdk,
        UserManager: class extends sdk.UserManager {
            constructor(settings) {
                super({
                    ...settings,
                    monitorSession: false,
                    stateStore: new sdk.WebStorageStateStore({ store: transactionStorage }),
                });
            }
        },
    };
    const cookieApi = {
        get: name => cookies.get(name),
        set: (name, value, attributes) => {
            cookies.set(name, value);
            writes.push({ name, value, attributes });
        },
        remove: name => cookies.delete(name),
    };
    const module = new vm.SourceTextModule(await readFile(new URL('../src/wwPlugin.js', import.meta.url), 'utf8'), {
        context,
    });
    await module.link(specifier => {
        const exports = specifier === 'oidc-client' ? oidc : specifier === 'js-cookie' ? { default: cookieApi } : {};
        return new vm.SyntheticModule(
            Object.keys(exports),
            function () {
                for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
            },
            { context }
        );
    });
    await module.evaluate();
    const plugin = module.namespace.default;
    plugin.id = 'test-plugin';
    plugin.settings = { publicData: { domain, clientId, tokenStorage, disableAutoRefresh: true } };
    await plugin._onLoad(plugin.settings);
    return { plugin, cookies, writes, variables, transactionStorage };
}

function user(accessToken = 'test-access', padding = '') {
    return new sdk.User({
        access_token: accessToken,
        id_token: 'test-id',
        refresh_token: 'test-refresh',
        profile: { sub: 'test-user', padding },
    });
}

test('existing projects keep compact and split token cookies', async () => {
    for (const padding of ['', 'x'.repeat(3100)]) {
        const { plugin, writes } = await setup();
        await plugin.client.storeUser(user('test-access', padding));
        assert.equal((await plugin.fetchUser()).access_token, 'test-access');
        assert.equal(writes.length, padding ? 4 : 1);
        assert.ok(writes.every(write => write.attributes.secure));
        await plugin.client.removeUser();
    }
});

test('memory removes compact and split legacy tokens for this client only', async () => {
    const oldCookies = Object.fromEntries(suffixes.map(suffix => [key + suffix, 'old-token']));
    oldCookies[`${key}-other`] = 'other-client';
    const { plugin, cookies, transactionStorage } = await setup('memory', oldCookies);
    for (const suffix of suffixes) assert.equal(cookies.has(key + suffix), false);
    assert.equal(cookies.get(`${key}-other`), 'other-client');
    transactionStorage.setItem('oidc.pending-state', 'transaction');
    assert.equal(await plugin.client.settings.stateStore.get('pending-state'), 'transaction');
    assert.equal(await plugin.client.getUser(), null);
});

test('memory supports renewed and manually updated tokens and updates WeWeb variables', async () => {
    const { plugin, cookies, writes, variables } = await setup('memory');
    for (const accessToken of ['test-login', 'test-renewed']) {
        await plugin.client.storeUser(user(accessToken));
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(variables.get('test-plugin-user').access_token, accessToken);
        assert.equal(variables.get('test-plugin-isAuthenticated'), true);
    }
    plugin.updateTokens({ accessToken: 'test-manual', idToken: 'test-manual-id', refreshToken: 'test-manual-refresh' });
    await new Promise(resolve => setImmediate(resolve));
    const updated = variables.get('test-plugin-user');
    assert.equal(updated.access_token, 'test-manual');
    assert.equal(updated.id_token, 'test-manual-id');
    assert.equal(updated.refresh_token, 'test-manual-refresh');
    assert.equal(cookies.size, 0);
    assert.equal(writes.length, 0);
    await plugin.client.removeUser();
    await assert.rejects(plugin.fetchUser(), /No user authenticated/);
    assert.equal(variables.get('test-plugin-user'), null);
    assert.equal(variables.get('test-plugin-isAuthenticated'), false);
});

test('a new page cannot recover a memory-only user', async () => {
    const { plugin } = await setup('memory');
    await plugin.client.storeUser(user());
    const nextPage = await setup('memory');
    assert.equal(await nextPage.plugin.client.getUser(), null);
});

test('switching to memory prevents late writes from the previous cookie instance', async () => {
    const { plugin, cookies, variables } = await setup();
    const previous = plugin.client;
    await previous.storeUser(user('old-access'));
    plugin.settings.publicData.tokenStorage = 'memory';
    await plugin._onLoad(plugin.settings);
    await previous.storeUser(user('late-access'));
    assert.equal(cookies.size, 0);
    assert.equal(await plugin.client.getUser(), null);
    assert.notEqual(variables.get('test-plugin-user')?.access_token, 'late-access');
});
