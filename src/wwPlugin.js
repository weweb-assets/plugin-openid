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
            settings.publicData.afterSignInPageId,
            settings.publicData.afterNotSignInPageId
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
    async load(domain, clientId, scope, responseType, afterSignInPageId, afterNotSignInPageId) {
        try {
            if (!domain || !clientId) return;
            const websiteId = wwLib.wwWebsiteData.getInfo().id;

            const loginRedirectTo = wwLib.manager
                ? `${window.location.origin}/${websiteId}/${afterSignInPageId}`
                : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(afterSignInPageId)}`;
            const logoutRedirectTo = wwLib.manager
                ? `${window.location.origin}/${websiteId}/${afterNotSignInPageId}`
                : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(afterNotSignInPageId)}`;

            this.client = new UserManager({
                authority: domain,
                client_id: clientId,
                redirect_uri: loginRedirectTo,
                post_logout_redirect_uri: logoutRedirectTo,
                scope: scope || 'openid',
                response_type: responseType || 'id_token',
                loadUserInfo: true,
                automaticSilentRenew: true,
                userStore: new WebStorageStateStore({
                    store: {
                        getItem: key => {
                            const cookie = Cookies.get(key);
                            if (cookie) return cookie;

                            if (!cookie) {
                                const cookieAccessToken = Cookies.get(key + '.access_token');
                                if (!cookieAccessToken) return null;

                                const cookieIdToken = Cookies.get(key + '.id_token');
                                const cookieRefreshToken = Cookies.get(key + '.refresh_token');
                                const cookieUserData = Cookies.get(key + '.user_data');

                                return JSON.stringify({
                                    access_token: cookieAccessToken === 'null' ? null : cookieAccessToken,
                                    id_token: cookieIdToken === 'null' ? null : cookieIdToken,
                                    refresh_token: cookieRefreshToken === 'null' ? null : cookieRefreshToken,
                                    ...JSON.parse(cookieUserData),
                                });
                            }

                            return null;
                        },
                        setItem: (key, value) => {
                            if (value.length < 4096) {
                                Cookies.set(key, value, { secure: true, path: '/' });
                            } else {
                                const { access_token, id_token, refresh_token, ...rest } = JSON.parse(value);
                                Cookies.set(key + '.access_token', access_token || null, { secure: true, path: '/' });
                                Cookies.set(key + '.id_token', id_token || null, { secure: true, path: '/' });
                                Cookies.set(key + '.refresh_token', refresh_token || null, { secure: true, path: '/' });
                                Cookies.set(key + '.user_data', JSON.stringify(rest), { secure: true, path: '/' });
                            }
                        },
                        removeItem: key => {
                            Cookies.remove(key);
                            Cookies.remove(key + '.access_token');
                            Cookies.remove(key + '.id_token');
                            Cookies.remove(key + '.refresh_token');
                            Cookies.remove(key + '.user_data');
                        },
                    },
                }),
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
