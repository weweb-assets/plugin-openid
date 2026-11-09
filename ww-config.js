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
            /* wwEditor:start */
            copilot: {
                description: 'Opens a popup window to authenticate the user via OpenID',
                returns: 'object',
                schema: {}
            },
            /* wwEditor:end */
        },
        {
            name: 'Login with Redirect',
            code: 'loginWithRedirect',
            isAsync: true,
            /* wwEditor:start */
            copilot: {
                description: 'Redirects the user to the OpenID authentication page',
                returns: 'void',
                schema: {}
            },
            /* wwEditor:end */
        },
        {
            name: 'Logout with Popup',
            code: 'logoutWithPopup',
            isAsync: true,
            /* wwEditor:start */
            copilot: {
                description: 'Opens a popup window to log out the current user',
                returns: 'void',
                schema: {}
            },
            /* wwEditor:end */
        },
        {
            name: 'Logout with Redirect',
            code: 'logoutWithRedirect',
            isAsync: true,
            /* wwEditor:start */
            copilot: {
                description: 'Redirects the user to the logout page',
                returns: 'void',
                schema: {}
            },
            /* wwEditor:end */
        },
        {
            name: 'Fetch User',
            code: 'fetchUser',
            isAsync: true,
            /* wwEditor:start */
            copilot: {
                description: 'Retrieves the current authenticated user information',
                returns: 'object',
                schema: {}
            },
            /* wwEditor:end */
        },
        {
            name: 'Update Tokens',
            code: 'updateTokens',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Actions/UpdateTokens.vue'),
            copilot: {
                description: 'Updates the OpenID authentication tokens',
                returns: 'void',
                schema: {
                    idToken: {
                        type: 'string',
                        description: 'The ID token to update',
                        bindable: true
                    },
                    accessToken: {
                        type: 'string',
                        description: 'The access token to update',
                        bindable: true
                    },
                    refreshToken: {
                        type: 'string',
                        description: 'The refresh token to update',
                        bindable: true
                    }
                }
            },
            /* wwEditor:end */
        },
    ],
};