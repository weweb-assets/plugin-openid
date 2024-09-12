<template>
    <wwEditorInputRow
        label="ID Token"
        type="query"
        :model-value="idToken"
        bindable
        placeholder="Enter an id token"
        @update:modelValue="setIdToken"
    />
    <wwEditorInputRow
        label="Access Token"
        type="query"
        :model-value="accessToken"
        bindable
        placeholder="Enter an access token"
        @update:modelValue="setAccessToken"
    />
    <wwEditorInputRow
        label="Refresh Token"
        type="query"
        :model-value="refreshToken"
        bindable
        placeholder="Enter a refresh token"
        @update:modelValue="setRefreshToken"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, required: true },
    },
    emits: ['update:args'],
    computed: {
        idToken() {
            return this.args.idToken;
        },
        accessToken() {
            return this.args.accessToken;
        },
        refreshToken() {
            return this.args.refreshToken;
        },
    },
    methods: {
        setIdToken(idToken) {
            this.$emit('update:args', { ...this.args, idToken });
        },
        setAccessToken(accessToken) {
            this.$emit('update:args', { ...this.args, accessToken });
        },
        setRefreshToken(refreshToken) {
            this.$emit('update:args', { ...this.args, refreshToken });
        },
    },
};
</script>
