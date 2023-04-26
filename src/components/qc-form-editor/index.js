import install from '../../libs/install.js';
import Component from './component.vue';
import { ElForm, ElFormItem } from 'element-plus';

export default (app) => {
    install(app, Component);
    install(app, ElForm);
    install(app, ElFormItem);
};
