export default {
    features: {
        auth: true,
    },
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    return !!settings.publicData.domain && !!settings.publicData.clientId;
                },
            },
        ],
    },
    actions: [
        {
            name: 'Login with Popup',
            code: 'loginWithPopup',
            isAsync: true,
        },
        {
            name: 'Login with Redirect',
            code: 'loginWithRedirect',
            isAsync: true,
        },
        {
            name: 'Logout with Popup',
            code: 'logoutWithPopup',
            isAsync: true,
        },
        {
            name: 'Logout with Redirect',
            code: 'logoutWithRedirect',
            isAsync: true,
        },
        {
            name: 'Fetch User',
            code: 'fetchUser',
            isAsync: true,
        },
    ],
};
