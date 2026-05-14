<!--
 * @Description: JSON编辑组件
 * @Author: Your Name
 * @Date: 2024-05-12
-->
<template>
  <div class="cpt-json-editor">
    <el-button type="primary" :icon="Document" @click="show">查看/编辑模板JSON</el-button>

    <el-dialog
      v-model="visible"
      title="JSON"
      :close-on-click-modal="false"
      width="50vw"
      class="cpt-json-dialog"
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
          v-model="jsonText"
          type="textarea"
          :rows="20"
          placeholder="在此编辑JSON"
          :class="{ 'json-error': !isValidJson && jsonText.trim() !== '' }"
        />
      </el-scrollbar>

      <div v-if="!isValidJson && jsonText.trim() !== ''" class="error-message">
        JSON 格式错误，请检查后重试
      </div>

      <template #footer>
        <el-button @click="hide">取消</el-button>
        <el-button
          type="primary"
          :icon="Check"
          @click="handleSave"
          :disabled="!isValidJson"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'JsonEditor',
}
</script>

<script setup>
import { ref, computed } from 'vue'
import { Check, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { validateTemplateJson, parseJsonString, formatJson } from '../utils/validator'

// Props
const props = defineProps({
  template: {
    type: Object,
    default: null,
  },
  defaultTidMode: {
    type: Boolean,
    default: false,
  },
  defaultBeautify: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'JSON',
  },
})

// Emits
const emit = defineEmits(['save', 'error', 'show', 'hide'])

// 状态
const visible = ref(false)
const jsonText = ref('')
const tidMode = ref(props.defaultTidMode)
const beautify = ref(props.defaultBeautify)
const errorMessage = ref('')

// 计算属性
const isValidJson = computed(() => {
  if (!jsonText.value || jsonText.value.trim() === '') return false
  try {
    JSON.parse(jsonText.value)
    return true
  } catch (e) {
    return false
  }
})

// 显示对话框
const show = () => {
  visible.value = true
  updateJson()
  emit('show', props.template)
}

// 隐藏对话框
const hide = () => {
  visible.value = false
  errorMessage.value = ''
  emit('hide')
}

// 更新JSON内容
const updateJson = () => {
  if (!props.template) return

  try {
    const json = tidMode.value ? props.template.getJsonTid() : props.template.getJson()
    jsonText.value = formatJson(json, beautify.value)
    errorMessage.value = ''
  } catch (error) {
    console.error('获取JSON失败:', error)
    errorMessage.value = error.message
  }
}

// 模式变化
const onModeChange = () => {
  updateJson()
}

// 保存
const handleSave = () => {
  if (!isValidJson.value) {
    ElMessage.error('JSON 格式错误，请检查后重试')
    return
  }

  const parseResult = parseJsonString(jsonText.value)
  if (!parseResult.valid) {
    ElMessage.error(parseResult.message)
    emit('error', parseResult.message)
    return
  }

  const validationResult = validateTemplateJson(parseResult.data)
  if (!validationResult.valid) {
    ElMessage.error(validationResult.message)
    emit('error', validationResult.message)
    return
  }

  emit('save', parseResult.data)
  hide()
  ElMessage.success('保存成功！')
}

// 设置JSON内容（从外部调用）
const setJson = (json) => {
  jsonText.value = formatJson(json, beautify.value)
}

// 获取JSON内容
const getJson = () => {
  if (!isValidJson.value) return null
  return JSON.parse(jsonText.value)
}

// 暴露方法
defineExpose({
  visible,
  show,
  hide,
  setJson,
  getJson,
  updateJson,
})
</script>

<style scoped>
.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 8px;
}

:deep(.json-error .el-textarea__inner) {
  border-color: #f56c6c;
}

:deep(.cpt-json-dialog .el-dialog__body) {
  padding: 10px 20px;
}
</style>
