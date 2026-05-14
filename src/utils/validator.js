/**
 * JSON验证工具
 */

/**
 * 验证模板JSON格式
 * @param {Object} json - 待验证的JSON对象
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateTemplateJson(json) {
  if (!json || typeof json !== 'object') {
    return { valid: false, message: 'JSON格式错误：必须是一个对象' }
  }

  if (!json.panels || !Array.isArray(json.panels)) {
    return { valid: false, message: 'JSON格式不正确，必须包含 panels 数组' }
  }

  if (json.panels.length === 0) {
    return { valid: false, message: 'panels 数组不能为空' }
  }

  const firstPanel = json.panels[0]

  if (!firstPanel.width || !firstPanel.height) {
    return { valid: false, message: '面板必须包含 width 和 height 属性' }
  }

  return { valid: true, message: '验证通过' }
}

/**
 * 格式化JSON
 * @param {Object} json - JSON对象
 * @param {boolean} beautify - 是否美化输出
 * @returns {string} 格式化后的JSON字符串
 */
export function formatJson(json, beautify = true) {
  return JSON.stringify(json, null, beautify ? 2 : 0)
}

/**
 * 解析JSON字符串
 * @param {string} str - JSON字符串
 * @returns {Object} { valid: boolean, data: Object|null, message: string }
 */
export function parseJsonString(str) {
  try {
    const data = JSON.parse(str)
    return { valid: true, data, message: '解析成功' }
  } catch (error) {
    return { valid: false, data: null, message: `JSON格式错误：${error.message}` }
  }
}
