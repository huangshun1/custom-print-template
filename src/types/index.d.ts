/**
 * 打印模板类型定义
 */

// 纸张类型
export interface PaperType {
  width: number
  height: number
}

// 纸张类型配置
export interface PaperTypes {
  [key: string]: PaperType
}

// 字体配置
export interface FontItem {
  title: string
  value: string
}

// 拖拽组件配置
export interface DragItem {
  tid: string
  label: string
  icon?: string
}

// 模板面板配置
export interface TemplatePanel {
  width: number
  height: number
  // ... 其他属性
}

// 模板JSON结构
export interface TemplateJson {
  panels: TemplatePanel[]
  // ... 其他属性
}

// 打印数据
export interface PrintData {
  [key: string]: any
}

// 组件 Props 类型
export interface PrintDesignerProps {
  template?: TemplateJson | null
  paperTypes?: PaperTypes
  fontList?: FontItem[]
  dragItems?: DragItem[]
  scaleStep?: number
  scaleMin?: number
  scaleMax?: number
  imageMaxSize?: number
  imageTypes?: string[]
  showJsonEditor?: boolean
  showImport?: boolean
  showPreview?: boolean
  showSave?: boolean
  showClear?: boolean
  defaultPaper?: string
  autoSave?: boolean
  autoSaveDelay?: number
  grid?: boolean
  history?: boolean
  willOutOfBounds?: boolean
  settingContainer?: string
  designContainer?: string
}

export interface PrintPreviewProps {
  template?: TemplateJson | null
  data?: PrintData
  width?: number
  title?: string
  autoShow?: boolean
  visible?: boolean
}

export interface JsonEditorProps {
  template?: any
  defaultTidMode?: boolean
  defaultBeautify?: boolean
  title?: string
}

// 组件 Events 类型
export interface PrintDesignerEmits {
  (e: 'save', json: TemplateJson, template: any): void
  (e: 'preview', template: any): void
  (e: 'paper-change', paper: PaperType & { type: string }): void
  (e: 'scale-change', scale: number): void
  (e: 'template-change', json: TemplateJson | null): void
  (e: 'error', error: Error): void
  (e: 'init', template: any): void
}

export interface PrintPreviewEmits {
  (e: 'close'): void
  (e: 'print', template: any, data: PrintData): void
  (e: 'export-pdf', filename: string, template: any, data: PrintData): void
  (e: 'show', template: any, data: PrintData): void
}

export interface JsonEditorEmits {
  (e: 'save', json: TemplateJson): void
  (e: 'error', message: string): void
  (e: 'show', template: any): void
  (e: 'hide'): void
}

// 组件实例类型（通过 defineExpose 暴露的方法）
export interface PrintDesignerInstance {
  template: any
  getTemplateJson: () => TemplateJson
  loadTemplateFromJson: (json: TemplateJson) => void
  setPaper: (type: string, value: PaperType) => void
  clearTemplate: () => void
  changeScale: (big: boolean) => void
  triggerAutoSave: () => void
}

export interface PrintPreviewInstance {
  visible: boolean
  show: (template?: any, data?: PrintData) => void
  close: () => void
  updateData: (data: PrintData) => void
}

export interface JsonEditorInstance {
  visible: boolean
  show: () => void
  hide: () => void
  setJson: (json: TemplateJson) => void
  getJson: () => TemplateJson | null
  updateJson: () => void
}
