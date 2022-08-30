export default {
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEdit.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    return !!settings.publicData.url && !!settings.publicData.clientId;
                },
            },
            {
                label: 'Define redirections (URLs)',
                icon: 'open-out',
                edit: () => import('./src/components/Redirections/SettingsEdit.vue'),
                summary: () => import('./src/components/Redirections/SettingsSummary.vue'),
                getIsValid(settings) {
                    const { afterSignInPageId, afterNotSignInPageId } = settings.publicData;
                    return !!afterSignInPageId && !!afterNotSignInPageId;
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
            code: 'loginWithPopup',
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
