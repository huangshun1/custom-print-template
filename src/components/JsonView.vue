<!--
 * @Description: JSON预览组件 (Element Plus 版)
-->
<template>
  <div>
    <el-button type="primary" :icon="Document" @click="show">查看/编辑模板JSON</el-button>
    <el-dialog
      v-model="visible"
      title="JSON"
      :close-on-click-modal="false"
      width="50vw"
    >
      <el-space style="margin-bottom: 16px">
        <el-switch
          v-model="tidMode"
          active-text="tid模式"
          inactive-text="默认"
          @change="onModeChange"
        />
        <el-switch
          v-model="beautify"
          active-text="美化"
          inactive-text="压缩"
          @change="onModeChange"
        />
      </el-space>
      <el-scrollbar max-height="50vh">
        <el-input
          v-model="jsonOut"
          type="textarea"
          :rows="20"
          placeholder="在此编辑JSON"
          :class="{ 'json-error': !isValidJson && jsonOut.trim() !== '' }"
        />
      </el-scrollbar>
      <div v-if="!isValidJson && jsonOut.trim() !== ''" class="error-message">
        JSON 格式错误，请检查后重试
      </div>
      <template #footer>
        <el-button @click="hideModal">取消</el-button>
        <el-button type="primary" :icon="Check" @click="handleSave" :disabled="!isValidJson">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { Check } from "@element-plus/icons-vue";

export default {
  name: "JsonView",
  props: {
    template: {
      type: Object,
      default: null,
    },
  },
  emits: ["save"],
  setup(props, { emit }) {
    const visible = ref(false);
    const jsonOut = ref("");
    const tidMode = ref(false);
    const beautify = ref(true);
    const errorMessage = ref("");

    const isValidJson = computed(() => {
      if (!jsonOut.value || jsonOut.value.trim() === "") return false;
      try {
        JSON.parse(jsonOut.value);
        return true;
      } catch (e) {
        return false;
      }
    });

    const hideModal = () => {
      visible.value = false;
      errorMessage.value = "";
    };

    const show = () => {
      visible.value = true;
      updateJson();
    };

    const updateJson = () => {
      if (!props.template) return;
      const json = tidMode.value
        ? props.template.getJsonTid()
        : props.template.getJson();
      const spaces = beautify.value ? 2 : 0;
      jsonOut.value = JSON.stringify(json, null, spaces);
      errorMessage.value = "";
    };

    const onModeChange = () => {
      updateJson();
    };

    const handleSave = () => {
      try {
        const parsedJson = JSON.parse(jsonOut.value);

        if (!parsedJson || !parsedJson.panels || !Array.isArray(parsedJson.panels)) {
          errorMessage.value = "JSON 格式不正确，必须包含 panels 数组";
          return false;
        }

        if (parsedJson.panels.length === 0) {
          errorMessage.value = "panels 数组不能为空";
          return false;
        }

        emit("save", parsedJson);
        hideModal();
        return true;
      } catch (e) {
        errorMessage.value = `JSON 格式错误: ${e.message}`;
        return false;
      }
    };

    return {
      visible,
      jsonOut,
      tidMode,
      beautify,
      isValidJson,
      errorMessage,
      Check,
      hideModal,
      show,
      onModeChange,
      handleSave,
    };
  },
};
</script>

<style scoped>
.json-error :deep(.el-textarea__inner) {
  border-color: #f56c6c;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 8px;
}
</style>
