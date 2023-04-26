<template>
    <div class="tinymce-container">
        <textarea :id="tinymceId" class="tinymce-textarea" />
    </div>
</template>
<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins.js';
import toolbar from './toolbar.js';
import load from './dynamicLoadScript.js';

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js';
export default {
    props: {
        tinymceId: {
            type: String,
            default: function () {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
            },
        },
        value: {
            type: String,
            default: '',
        },
        toolbar: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360,
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto',
        },
    },
    data() {
        return {
            hasChange: false,
            hasInit: false,
        };
    },
    watch: {
        value(val) {
            if (!this.hasChange && this.hasInit) {
                this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''));
            }
        },
    },
    mounted() {
        this.init();
    },
    activated() {
        if (window.tinymce) {
            this.initTinymce();
        }
    },
    deactivated() {
        this.destroyTinymce();
    },
    methods: {
        init() {
            // dynamic load tinymce from cdn
            load(tinymceCDN, (err) => {
                if (err) {
                    this.$message.error(err.message);
                    return;
                }
                this.initTinymce();
            });
        },
        initTinymce() {
            const _this = this;
            window.tinymce.init({
                selector: `#${this.tinymceId}`,
                height: this.height,
                statusbar: false, //底部状态栏
                menu: {}, // 清空第一行菜单
                // object_resizing: false, //图片可编辑
                language: 'zh_CN',
                plugins: plugins,
                toolbar: toolbar,
                images_upload_handler: function (blobInfo, succFun, failFun) {
                    var xhr, formData;
                    var file = blobInfo.blob(); //转化为易于理解的file对象
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', '/file/add'); // 图片上传地址
                    xhr.onload = function (res) {
                        var json;
                        if (res.currentTarget.status != 200) {
                            failFun('图片上传失败: ' + res.currentTarget.status);
                            return;
                        }
                        json = JSON.parse(res.currentTarget.responseText);
                        succFun(json.data.list[0].url);
                    };
                    formData = new FormData();
                    formData.append('file', file, file.name); //此处与源文档不一样
                    xhr.send(formData);
                },
                end_container_on_empty_block: true,
                powerpaste_word_import: 'clean',
                default_link_target: '_blank',
                link_title: false,
                content_style: 'img { max-width:100%; height: auto; }', // 限制图片，不出现横向滚动条
                nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                init_instance_callback: (editor) => {
                    if (_this.value) {
                        editor.setContent(_this.value);
                    }
                    _this.hasInit = true;
                    editor.on('NodeChange Change KeyUp SetContent', () => {
                        this.hasChange = true;
                        this.$emit('input', editor.getContent());
                    });
                },
                convert_urls: false,
            });
        },
        destroyTinymce() {
            const tinymce = window.tinymce.get(this.tinymceId);
            if (tinymce) {
                tinymce.destroy();
            }
        },
        setContent(value) {
            window.tinymce.get(this.tinymceId).setContent(value);
        },
        getContent() {
            window.tinymce.get(this.tinymceId).getContent();
        },
    },
};
</script>

<style lang="scss" scoped>
.tinymce-container {
    :deep(.mce-tinymce) {
        box-shadow: none;
        .mce-menubar {
            border: none;
        }

        // 工具栏自动换行
        .mce-container, .mce-container *, .mce-widget, .mce-widget *, .mce-reset {
            white-space: normal !important;
        }
        .mce-menubtn.mce-fixed-width {
            span{
                 width: 60px;
            }
           
        }
    }
}

</style>


