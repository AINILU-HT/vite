<template>
    <div class="qc-form-editor">
        <el-form-item :prop="prop" :label="name">
            <tinymce @input="change" :value="value" :height="height" />
        </el-form-item>
    </div>
</template>

<script>
import Tinymce from './tinymce/tinymceContainer.vue';

export default {
    name: 'qc-form-editor',
    props: {
        name: {
            type: String,
        },
        prop: {
            type: String,
        },
        value: {
            type: String,
        },
        height: {
            type: Number,
            default: 450
        }
    },
    components: {
        Tinymce,
    },
    data() {
        return {};
    },
    methods: {
        change(e) {
            this.$emit('set', e);
        },
    },
};
</script>
