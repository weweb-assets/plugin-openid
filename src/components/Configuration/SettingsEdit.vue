<template>
    <wwEditorFormRow required label="Discover URL">
        <wwEditorInputRow
            type="query"
            placeholder="https://accounts.google.com"
            :model-value="settings.publicData.discoverUrl"
            @update:modelValue="changeDicoverUrl"
        />
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    methods: {
        changeDiscoverUrl(dicoverUrl) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: { ...this.settings.publicData, dicoverUrl },
            });
            this.$nextTick(this.loadInstance);
        },
        loadInstance() {
            this.plugin.load(this.settings.publicData.discoverUrl);
        },
    },
};
</script>
