<template>
    <div class="flex items-center body-2 mb-2">
        <wwEditorIcon name="link" class="mr-2" />
        <div class="text-ellipsis">{{ settings.publicData.domain }}</div>
    </div>
    <div class="flex items-center body-2 mb-2">
        <wwEditorIcon name="key" class="mr-2" />
        <div class="text-ellipsis">{{ settings.publicData.clientId }}</div>
    </div>
    <div class="flex items-center body-2 mb-2">
        <wwEditorIcon name="key" class="mr-2" />
        <div class="text-ellipsis">{{ (settings.privateData.clientSecret || '').replace(/./g, '*') }}</div>
    </div>
    <div class="flex items-center mb-2 body-2">
        <wwEditorIcon name="user" class="mr-2" />
        <div class="text-ellipsis">{{ settings.publicData.scope || 'openid' }}</div>
    </div>
    <div class="flex items-center mb-2 body-2">
        <wwEditorIcon name="data" class="mr-2" />
        <div class="text-ellipsis">{{ settings.publicData.responseType || 'id_token' }}</div>
    </div>
    <div class="flex items-center body-2">
        <wwEditorIcon name="toggle" class="mr-2" />
        <div class="text-ellipsis">
            Automatic refresh: <b>{{ settings.publicData.disableAutoRefresh ? 'Disabled' : 'Enabled' }}</b>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        settings: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
