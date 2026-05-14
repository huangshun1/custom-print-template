/**
 * Custom Print Template 主入口文件
 */

// 组件
import PrintDesigner from './components/PrintDesigner.vue'
import PrintPreview from './components/PrintPreview.vue'
import JsonView from './components/JsonView.vue'

// 导出组件
export { PrintDesigner, PrintPreview, JsonView }

// 导出工具函数
export { validateTemplateJson, formatJson, parseJsonString } from './utils/validator'

// 导出常量
export { PAPER_TYPES, DEFAULT_PAPER } from './constants/paperTypes'
export { FONT_LIST } from './constants/fontList'

// 导出 composables
export { useHiprint } from './composables/useHiprint'
export { useImageUpload } from './composables/useImageUpload'

// 安装函数
function install(app) {
  app.component('PrintDesigner', PrintDesigner)
  app.component('PrintPreview', PrintPreview)
  app.component('JsonView', JsonView)
}

// 默认导出
export default {
  install,
  PrintDesigner,
  PrintPreview,
  JsonView,
}
