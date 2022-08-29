<template>
    <wwEditorInputRow
        label="URL"
        required
        type="query"
        placeholder="https://accounts.google.com"
        :model-value="settings.publicData.url"
        @update:modelValue="changeUrl"
    />
    <wwEditorInputRow
        label="Client ID"
        required
        type="query"
        placeholder="**********"
        :model-value="settings.publicData.clientId"
        @update:modelValue="changeClientId"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    methods: {
        changeUrl(url) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, url },
            });
            this.$nextTick(this.loadInstance);
        },
        changeClientId(clientId) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, clientId },
            });
            this.$nextTick(this.loadInstance);
        },
        loadInstance() {
            this.plugin.load(
                this.settings.publicData.url,
                this.settings.publicData.clientId,
                this.settings.publicData.afterNotSignInPageId
            );
        },
    },
};
</script>
