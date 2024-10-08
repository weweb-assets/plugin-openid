<template>
    <wwEditorInputRow
        label="Domain"
        required
        type="query"
        placeholder="https://..."
        :model-value="settings.publicData.domain"
        @update:modelValue="changeDomain"
    />
    <wwEditorInputRow
        label="Client ID"
        required
        type="query"
        placeholder="**********"
        :model-value="settings.publicData.clientId"
        @update:modelValue="changeClientId"
    />
    <wwEditorFormRow required label="Client Secret">
        <wwEditorInputText
            type="text"
            placeholder="**********"
            :model-value="settings.privateData.clientSecret"
            :style="{ '-webkit-text-security': isKeyVisible ? 'none' : 'disc' }"
            @update:modelValue="changeClientSecret"
        />
    </wwEditorFormRow>
    <div class="flex items-center mb-2">
        <wwEditorInputSwitch v-model="isKeyVisible" />
        <span class="ml-2 body-2">Show client secret</span>
    </div>
    <wwEditorInputRow
        label="Scope"
        required
        type="query"
        placeholder="openid"
        :model-value="settings.publicData.scope"
        @update:modelValue="changeScope"
    />
    <wwEditorInputRow
        label="Response type"
        required
        type="query"
        placeholder="id_token"
        :model-value="settings.publicData.responseType"
        @update:modelValue="changeResponseType"
    />
    <wwEditorInputRow
        label="Disable automatic refresh token"
        type="onoff"
        :model-value="settings.publicData.disableAutoRefresh"
        @update:modelValue="changeDisableAutoRefresh"
    />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            isKeyVisible: false,
        };
    },
    methods: {
        changeDomain(domain) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, domain },
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
        changeClientSecret(clientSecret) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, clientSecret },
            });
            this.$nextTick(this.loadInstance);
        },
        changeScope(scope) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, scope },
            });
            this.$nextTick(this.loadInstance);
        },
        changeResponseType(responseType) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, responseType },
            });
            this.$nextTick(this.loadInstance);
        },
        changeDisableAutoRefresh(disableAutoRefresh) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, disableAutoRefresh },
            });
            this.$nextTick(this.loadInstance);
        },
        loadInstance() {
            this.plugin.load(
                this.settings.publicData.domain,
                this.settings.publicData.clientId,
                this.settings.publicData.scope,
                this.settings.publicData.responseType,
                this.settings.publicData.disableAutoRefresh,
                this.settings.publicData.afterSignInPageId,
                this.settings.publicData.afterNotSignInPageId
            );
        },
    },
};
</script>
