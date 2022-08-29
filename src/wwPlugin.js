/* wwEditor:start */
import './components/Configuration/SettingsEdit.vue';
import './components/Configuration/SettingsSummary.vue';
/* wwEditor:end */
import { Issuer } from 'openid-client';

export default {
    issuer: null,
    client: null,
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    async onLoad(settings) {
        /* wwFront:start */
        await this.load(settings.publicData.discoverUrl);
        /* wwFront:end */
        /* wwEditor:start */
        await this.load(settings.publicData.discoverUrl);
        /* wwEditor:end */
    },
    /*=============================================m_ÔÔ_m=============================================\
        Auth API
    \================================================================================================*/
    /*=============================================m_ÔÔ_m=============================================\
        OpenID API
    \================================================================================================*/
    async load(discoverUrl) {
        try {
            if (!discoverUrl) return;
            this.issuer = await Issuer.discover(discoverUrl);
            if (!this.issuer) throw new Error('Invalid OpenID Auth configuration.');
            console.log('Discovered issuer %s %O', this.issuer.issuer, this.issuer.metadata);
            this.client = new this.issuer.Client({});
            if (!this.client) throw new Error('Invalid OpenID Auth configuration.');
        } catch (err) {
            this.issuer = null;
            this.client = null;
            wwLib.wwLog.error(err);
            /* wwEditor:start */
            wwLib.wwNotification.open({ text: 'Invalid OpenID Auth configuration.', color: 'red' });
            /* wwEditor:end */
        }
    },
};
