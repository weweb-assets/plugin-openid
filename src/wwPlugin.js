/* wwEditor:start */
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
/* wwEditor:end */
import { UserManager } from 'oidc-client';

export default {
    client: null,
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async onLoad(settings) {
        await this.load(
            settings.publicData.url,
            settings.publicData.clientId,
            settings.publicData.afterNotSignInPageId
        );
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        OpenID API
    \================================================================================================*/
    async load(url, clientId, afterNotSignInPageId) {
        try {
            if (!url || !clientId || !afterNotSignInPageId) return;
            const websiteId = wwLib.wwWebsiteData.getInfo().id;
            const redirectTo = wwLib.manager
                ? `${window.location.origin}/${websiteId}/${afterNotSignInPageId}`
                : `${window.location.origin}${wwLib.wwPageHelper.getPagePath(afterNotSignInPageId)}`;

            const client = new UserManager({
                authority: url,
                client_id: clientId,
                redirect_uri: redirectTo,
            });
            this.client = client;
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
        return await this.client.getUser();
    },
    async login() {
        return await this.client.signinRedirect();
    },
    async logout() {
        return await this.client.signoutRedirect();
    },
};
