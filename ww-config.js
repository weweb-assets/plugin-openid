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
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
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
        {
            name: 'Update Tokens',
            code: 'updateTokens',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Actions/UpdateTokens.vue'),
            /* wwEditor:end */
        },
    ],
};
