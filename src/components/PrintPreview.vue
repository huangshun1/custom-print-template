<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width + 'mm'"
    :close-on-click-modal="false"
    @close="hideModal"
    style="padding: 0"
  >
    <template #header>
      <div class="preview-header">
        <span class="header-title">{{ title }}</span>
        <el-button type="primary" :icon="Document" @click="toPdf">PDF</el-button>
      </div>
    </template>
    <el-spin :loading="spinning" style="min-height: 100px">
      <div id="preview_content_design"></div>
    </el-spin>
    <template #footer>
      <div class="preview-footer">
        <el-button @click="hideModal">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { Document } from "@element-plus/icons-vue";
import { hiprint, defaultElementTypeProvider } from "vue-plugin-hiprint";

const $ = window.$;

export default {
  name: "PrintPreview",
  props: {
    // 模板 JSON
    template: {
      type: Object,
      default: null,
    },
    // 打印数据
    data: {
      type: Object,
      default: () => ({}),
    },
    // 对话框宽度（mm）
    width: {
      type: Number,
      default: 210,
    },
    // 对话框标题
    title: {
      type: String,
      default: "预览",
    },
    // 是否自动显示
    autoShow: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "print", "export-pdf", "show"],
  setup(props, { emit, expose }) {
    const visible = ref(false);
    const spinning = ref(true);
    const currentWidth = ref(props.width);
    const hiprintTemplate = ref({});
    const currentData = ref(props.data);
    const currentTemplate = ref(null);
    let hiprintInitialized = false;

    const hideModal = () => {
      visible.value = false;
      emit("close");
    };

    const initHiprint = () => {
      if (!hiprintInitialized) {
        hiprint.init({
          providers: [new defaultElementTypeProvider()],
        });
        hiprintInitialized = true;
      }
    };

    const createTemplateFromJson = (templateJson) => {
      if (!templateJson) return null;

      initHiprint();

      const template = new hiprint.PrintTemplate({
        template: templateJson,
        dataMode: 1,
        history: true,
        willOutOfBounds: true,
        qtDesigner: true,
      });

      return template;
    };

    const renderPreview = (template, data) => {
      if (!template) {
        console.warn("模板实例为空，无法渲染预览");
        return;
      }

      spinning.value = true;

      setTimeout(() => {
        try {
          // 检查是否是有效的 hiprint 模板实例
          if (typeof template.getHtml !== 'function') {
            console.error("传入的不是有效的 hiprint 模板实例");
            return;
          }

          const htmlContent = template.getHtml(data);

          // 清空容器再设置内容
          $("#preview_content_design").empty();
          $("#preview_content_design").html(htmlContent);
        } catch (error) {
          console.error("渲染预览失败:", error);
        } finally {
          spinning.value = false;
        }
      }, 100);
    };

    const show = (template, data, w) => {
      visible.value = true;
      currentData.value = data || props.data;

      if (template && typeof template.getHtml === 'function') {
        // 如果传入的是 hiprint 模板实例
        currentTemplate.value = template;
        currentWidth.value =
          template.editingPanel?.width || w || props.width;
      } else if (template && typeof template === 'object') {
        // 如果传入的是模板 JSON，创建 hiprint 实例
        const newTemplate = createTemplateFromJson(template);
        currentTemplate.value = newTemplate;
        currentWidth.value =
          template.panels?.[0]?.width || w || props.width;
      } else if (props.template) {
        // 使用 props 中的模板
        const newTemplate = createTemplateFromJson(props.template);
        currentTemplate.value = newTemplate;
        currentWidth.value =
          props.template.panels?.[0]?.width || w || props.width;
      } else {
        currentWidth.value = w || props.width;
      }

      renderPreview(currentTemplate.value, currentData.value);
      emit("show", currentTemplate.value, currentData.value);
    };

    const updateData = (data) => {
      currentData.value = data;
      renderPreview(currentTemplate.value, currentData.value);
    };

    const toPdf = () => {
      if (hiprintTemplate.value && Object.keys(hiprintTemplate.value).length > 0) {
        hiprintTemplate.value.toPdf(currentData.value, props.title);
      } else if (currentTemplate.value) {
        currentTemplate.value.toPdf(currentData.value, props.title);
        emit("export-pdf", props.title, currentTemplate.value, currentData.value);
      }
    };

    // 监听 props 变化
    watch(
      () => props.template,
      (newTemplate) => {
        if (newTemplate) {
          const template = createTemplateFromJson(newTemplate);
          currentTemplate.value = template;
          currentWidth.value =
            newTemplate.panels?.[0]?.width || props.width;

          if (props.autoShow) {
            show(null, props.data);
          } else {
            renderPreview(template, currentData.value);
          }
        }
      },
      { immediate: true }
    );

    watch(
      () => props.data,
      (newData) => {
        currentData.value = newData;
        renderPreview(currentTemplate.value, currentData.value);
      },
      { deep: true }
    );

    watch(
      () => props.width,
      (newWidth) => {
        currentWidth.value = newWidth;
      }
    );

    // 暴露方法给父组件
    expose({
      visible,
      show,
      updateData,
      close: hideModal,
    });

    // 支持 v-model
    watch(visible, (newVal) => {
      emit("update:visible", newVal);
    });

    return {
      visible,
      spinning,
      width: currentWidth,
      hideModal,
      show,
      updateData,
      toPdf,
      Document,
    };
  },
};
</script>

<style scoped>
.preview-header {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 10px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-right: auto;
}

.preview-footer {
  padding: 10px 20px;
}
</style>