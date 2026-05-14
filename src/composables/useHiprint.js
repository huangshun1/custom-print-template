/**
 * Hiprint 组合式函数
 */
import { ref, onMounted } from 'vue'

export function useHiprint() {
  const isInitialized = ref(false)
  const hiprintTemplate = ref(null)

  /**
   * 初始化 hiprint
   * @param {Object} options - 配置选项
   */
  const initHiprint = async (options = {}) => {
    const { hiprint, defaultElementTypeProvider } = await import('vue-plugin-hiprint')

    hiprint.init({
      providers: [new defaultElementTypeProvider()],
    })

    isInitialized.value = true
  }

  /**
   * 创建打印模板
   * @param {Object} config - 模板配置
   * @returns {Object} 模板实例
   */
  const createTemplate = (config = {}) => {
    const { hiprint } = window

    const defaultConfig = {
      template: {},
      dataMode: 1,
      history: true,
      willOutOfBounds: true,
      qtDesigner: true,
      ...config,
    }

    hiprintTemplate.value = new hiprint.PrintTemplate(defaultConfig)
    return hiprintTemplate.value
  }

  /**
   * 设置纸张尺寸
   * @param {Object} template - 模板实例
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  const setPaper = (template, width, height) => {
    template?.setPaper(width, height)
  }

  /**
   * 清空模板
   * @param {Object} template - 模板实例
   */
  const clearTemplate = (template) => {
    template?.clear()
  }

  /**
   * 获取模板JSON
   * @param {Object} template - 模板实例
   * @returns {Object} 模板JSON
   */
  const getTemplateJson = (template) => {
    return template?.getJson() || {}
  }

  /**
   * 加载模板JSON
   * @param {Object} template - 模板实例
   * @param {Object} json - 模板JSON
   */
  const loadTemplateJson = (template, json) => {
    if (!template || !json) return

    const { hiprint } = window
    hiprintTemplate.value = new hiprint.PrintTemplate({
      template: json,
      ...template.options,
    })

    return hiprintTemplate.value
  }

  return {
    isInitialized,
    hiprintTemplate,
    initHiprint,
    createTemplate,
    setPaper,
    clearTemplate,
    getTemplateJson,
    loadTemplateJson,
  }
}
