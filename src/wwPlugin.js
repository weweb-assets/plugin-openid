/* wwEditor:start */
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
import './components/Redirections/SettingsEdit.vue';
import './components/Redirections/SettingsSummary.vue';
/* wwEditor:end */
import { UserManager } from 'oidc-client';

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
                popup_redirect_uri: loginRedirectTo,
                post_logout_redirect_uri: logoutRedirectTo,
                popup_post_logout_redirect_uri: logoutRedirectTo,
                scope: scope || 'openid',
                response_type: responseType || 'id_token',
                loadUserInfo: true,
                automaticSilentRenew: true,
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
        return await this.fetchUser();
    },
    async loginWithRedirect() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        return await this.client.signinRedirect();
    },
    async logoutWithPopup() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        await this.client.signoutPopup();

        wwLib.wwVariable.updateValue(`${this.id}-user`, null);
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);
    },
    async logoutWithRedirect() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        return await this.client.signoutRedirect();
    },
};
