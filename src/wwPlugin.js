/* wwEditor:start */
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
import './components/Redirections/SettingsEdit.vue';
import './components/Redirections/SettingsSummary.vue';
/* wwEditor:end */
import { UserManager, WebStorageStateStore } from 'oidc-client';
import { CookieStorage } from 'cookie-storage';

export default {
    client: null,
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async onLoad(settings) {
        await this.load(
            settings.publicData.domain,
            settings.publicData.clientId,
            settings.publicData.scope,
            settings.publicData.responseType,
            settings.publicData.afterSignInPageId
        );
        try {
            await this.client.signinCallback();
        } catch (err) {}
        try {
            await this.client.signoutCallback();
        } catch (err) {}
        await this.fetchUser();
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        OpenID API
    \================================================================================================*/
    async load(domain, clientId, scope, responseType, afterSignInPageId) {
        try {
            if (!domain || !clientId) return;
            const websiteId = wwLib.wwWebsiteData.getInfo().id;

            const loginRedirectTo = wwLib.manager
                ? `${window.location.origin}/${websiteId}/${afterSignInPageId}`
                : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(afterSignInPageId)}`;

            this.client = new UserManager({
                authority: domain,
                client_id: clientId,
                redirect_uri: loginRedirectTo,
                scope: scope || 'openid',
                response_type: responseType || 'id_token',
                loadUserInfo: true,
                automaticSilentRenew: true,
                userStore: new WebStorageStateStore({ store: new CookieStorage({ path: '/', secure: true }) }),
            });
            if (!this.client) throw new Error('Invalid OpenID Auth configuration.');
        } catch (err) {
            this.client = null;
            wwLib.wwLog.error(err);
            /* wwEditor:start */
            wwLib.wwNotification.open({ text: 'Invalid OpenID Auth configuration.', color: 'red' });
            /* wwEditor:end */
        }
    },
    async fetchUser() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        try {
            await this.client.storeUser(await this.client.signinSilent());
            const user = await this.client.getUser();
            if (!user) throw new Error('No user authenticated.');
            wwLib.wwVariable.updateValue(`${this.id}-user`, user);
            wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, true);
            return user;
        } catch (err) {
            wwLib.wwVariable.updateValue(`${this.id}-user`, null);
            wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);
            throw err;
        }
    },
    async loginWithPopup() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        await this.client.signinPopup();
        const user = await this.fetchUser();
        /* wwFront:start */
        const pagePath = wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterSignInPageId);
        wwLib.goTo(pagePath);
        /* wwFront:end */
        /* wwEditor:start */
        wwLib.goTo(this.settings.publicData.afterSignInPageId);
        /* wwEditor:end */
        return user;
    },
    async loginWithRedirect() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        return await this.client.signinRedirect();
    },
    async logoutWithPopup() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        try {
            await this.client.signoutPopup();
        } catch {}

        wwLib.wwVariable.updateValue(`${this.id}-user`, null);
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);

        /* wwFront:start */
        wwLib.goTo(wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterNotSignInPageId));
        /* wwFront:end */
        /* wwEditor:start */
        wwLib.goTo(this.settings.publicData.afterNotSignInPageId);
        /* wwEditor:end */
    },
    async logoutWithRedirect() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');
        try {
            await this.client.signoutRedirect();
        } catch {}

        wwLib.wwVariable.updateValue(`${this.id}-user`, null);
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);

        /* wwFront:start */
        wwLib.goTo(wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterNotSignInPageId));
        /* wwFront:end */
        /* wwEditor:start */
        wwLib.goTo(this.settings.publicData.afterNotSignInPageId);
        /* wwEditor:end */
    },
};
