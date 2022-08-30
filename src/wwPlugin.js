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
        await this.load(settings.publicData.url, settings.publicData.clientId);
        await this.fetchUser();
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        OpenID API
    \================================================================================================*/
    async load(url, clientId) {
        try {
            if (!url || !clientId) return;
            this.client = new UserManager({ authority: url, client_id: clientId });
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

        const websiteId = wwLib.wwWebsiteData.getInfo().id;
        const redirectTo = wwLib.manager
            ? `${window.location.origin}/${websiteId}/${this.settings.publicData.afterSignInPageId}`
            : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterSignInPageId)}`;

        await this.client.signinPopup({ redirect_uri: redirectTo });
        return await this.fetchUser();
    },
    async loginWithRedirect() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        const websiteId = wwLib.wwWebsiteData.getInfo().id;
        const redirectTo = wwLib.manager
            ? `${window.location.origin}/${websiteId}/${this.settings.publicData.afterSignInPageId}`
            : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(this.settings.publicData.afterSignInPageId)}`;

        return await this.client.signinRedirect({ redirect_uri: redirectTo });
    },
    async logoutWithPopup() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        const websiteId = wwLib.wwWebsiteData.getInfo().id;
        const redirectTo = wwLib.manager
            ? `${window.location.origin}/${websiteId}/${this.settings.publicData.afterNotSignInPageId}`
            : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(
                  this.settings.publicData.afterNotSignInPageId
              )}`;

        await this.client.signoutPopup({ redirect_uri: redirectTo });
        wwLib.wwVariable.updateValue(`${this.id}-user`, null);
        wwLib.wwVariable.updateValue(`${this.id}-isAuthenticated`, false);
    },
    async logoutWithRedirect() {
        if (!this.client) throw new Error('Invalid OpenID Auth configuration.');

        const websiteId = wwLib.wwWebsiteData.getInfo().id;
        const redirectTo = wwLib.manager
            ? `${window.location.origin}/${websiteId}/${this.settings.publicData.afterNotSignInPageId}`
            : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(
                  this.settings.publicData.afterNotSignInPageId
              )}`;

        return await this.client.signoutRedirect({ redirect_uri: redirectTo });
    },
};
