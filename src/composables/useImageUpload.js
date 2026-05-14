/**
 * 图片上传处理组合式函数
 */
import { ElMessage } from 'element-plus'

export function useImageUpload(options = {}) {
  const {
    maxSize = 2, // MB
    allowTypes = ['image/png', 'image/jpg', 'image/jpeg'],
    onSuccess,
    onError,
  } = options

  /**
   * 创建文件选择器并处理图片选择
   * @param {Object} target - hiprint 目标对象
   * @returns {void}
   */
  const handleImageChoose = (target) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = allowTypes.join(',')

    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      if (!validateFile(file)) {
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          target.refresh(event.target.result, { real: true })
          onSuccess?.(event.target.result, file)
        } catch (error) {
          ElMessage.error(`图片加载失败: ${error.message}`)
          onError?.(error)
        }
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }

  /**
   * 验证文件
   * @param {File} file - 文件对象
   * @returns {boolean} 是否通过验证
   */
  const validateFile = (file) => {
    // 验证文件类型
    if (!allowTypes.includes(file.type)) {
      ElMessage.warning(`仅支持 ${allowTypes.map((t) => t.split('/')[1].toUpperCase()).join(' / ')} 格式图片！`)
      return false
    }

    // 验证文件大小
    const maxBytes = maxSize * 1024 * 1024
    if (file.size > maxBytes) {
      ElMessage.warning(`图片大小不能超过 ${maxSize}MB！`)
      return false
    }

    return true
  }

  /**
   * 读取文件为DataURL
   * @param {File} file - 文件对象
   * @returns {Promise<string>} DataURL
   */
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * 读取文件为文本
   * @param {File} file - 文件对象
   * @returns {Promise<string>} 文件内容
   */
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }

  return {
    handleImageChoose,
    validateFile,
    readFileAsDataURL,
    readFileAsText,
  }
}
