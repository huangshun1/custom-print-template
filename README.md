# Custom Print Template

基于 Vue 3 的可视化打印模板设计器组件。

## 特性

- 🎨 可视化打印模板设计器
- 📋 支持多种打印元素（文本、图片、长文、表格、HTML、自定义、线条、形状、条形码、二维码）
- 📄 支持多种纸张尺寸（A3、A4、A5、Letter 等）
- 👁️ 实时预览功能
- 💾 模板保存/加载（JSON格式）
- 🔍 JSON格式直接编辑
- 🔧 高度可配置
- 📦 TypeScript 支持
- 🌍 支持自定义字体和纸张类型

## 安装

```bash
npm install custom-print-template
# 或
pnpm add custom-print-template
# 或
yarn add custom-print-template
```

## 快速开始

### 方式一：全局注册

```javascript
import { createApp } from 'vue'
import CustomPrintTemplate from 'custom-print-template'
import 'custom-print-template/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(CustomPrintTemplate)
app.mount('#app')
```

### 方式二：按需引入

```vue
<template>
  <PrintDesigner
    :default-paper="'A4'"
    @save="handleSave"
    @preview="handlePreview"
  />
</template>

<script setup>
import { ref } from 'vue'
import { PrintDesigner } from 'custom-print-template'
import 'custom-print-template/style.css'

const handleSave = (json, template) => {
  console.log('模板已保存:', json)
  // 保存到后端
}

const handlePreview = (template) => {
  console.log('预览模板:', template)
  // 打开预览
}
</script>
```

## 组件使用

### PrintDesigner（打印模板设计器）

```vue
<template>
  <PrintDesigner
    :template="currentTemplate"
    :default-paper="'A4'"
    :show-json-editor="true"
    :show-import="true"
    :show-preview="true"
    :show-save="true"
    :show-clear="true"
    :auto-save="true"
    :auto-save-delay="2000"
    @save="handleSave"
    @preview="handlePreview"
    @error="handleError"
  >
    <template #custom-buttons>
      <el-button @click="customAction">自定义按钮</el-button>
    </template>
  </PrintDesigner>
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| template | Object | null | 初始模板数据 |
| paperTypes | Object | { A4, A3, A5, Letter } | 自定义纸张类型 |
| fontList | Array | 默认字体列表 | 自定义字体列表 |
| dragItems | Array | 默认拖拽组件列表 | 自定义拖拽组件列表 |
| scaleStep | Number | 0.1 | 缩放步长 |
| scaleMin | Number | 0.5 | 最小缩放比例 |
| scaleMax | Number | 5 | 最大缩放比例 |
| imageMaxSize | Number | 2 | 图片最大尺寸(MB) |
| imageTypes | Array | ['image/png', 'image/jpg', 'image/jpeg'] | 允许的图片类型 |
| showJsonEditor | Boolean | true | 是否显示JSON编辑按钮 |
| showImport | Boolean | true | 是否显示导入按钮 |
| showPreview | Boolean | true | 是否显示预览按钮 |
| showSave | Boolean | true | 是否显示保存按钮 |
| showClear | Boolean | true | 是否显示清空按钮 |
| defaultPaper | String | 'A4' | 默认纸张类型 |
| autoSave | Boolean | false | 是否自动保存 |
| autoSaveDelay | Number | 2000 | 自动保存延迟(毫秒) |
| grid | Boolean | true | 是否显示网格 |
| history | Boolean | true | 是否启用历史记录 |
| willOutOfBounds | Boolean | true | 是否允许超出边界 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| save | (json, template) | 模板保存事件 |
| preview | (template) | 模板预览事件 |
| paper-change | (paper) | 纸张变化事件 |
| scale-change | (scale) | 缩放变化事件 |
| template-change | (json) | 模板内容变化事件 |
| error | (error) | 错误事件 |
| init | (template) | 初始化完成事件 |

#### Slots

| 插槽 | 说明 |
|------|------|
| custom-buttons | 自定义按钮插槽 |
| sidebar | 自定义侧边栏插槽 |

### PrintPreview（打印预览）

```vue
<template>
  <PrintPreview
    ref="previewRef"
    :template="template"
    :data="printData"
    :title="'发票预览'"
    @close="handleClose"
    @export-pdf="handleExportPdf"
  />

  <el-button @click="showPreview">显示预览</el-button>
</template>

<script setup>
import { ref } from 'vue'
import { PrintPreview } from 'custom-print-template'

const previewRef = ref(null)
const template = ref(/* 模板对象 */)
const printData = ref({
  name: '测试数据',
  // ... 其他数据
})

const showPreview = () => {
  previewRef.value.show(template.value, printData.value)
}

const handleClose = () => {
  console.log('预览关闭')
}

const handleExportPdf = (filename) => {
  console.log('导出PDF:', filename)
}
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| template | Object | required | 模板对象 |
| data | Object | {} | 打印数据 |
| width | Number | 210 | 预览宽度 |
| title | String | '预览' | 标题 |
| autoShow | Boolean | false | 是否自动显示 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| close | () | 关闭预览 |
| print | (template, data) | 打印 |
| export-pdf | (filename, template, data) | 导出PDF |
| show | (template, data) | 显示预览 |

### JsonEditor（JSON编辑器）

```vue
<template>
  <JsonEditor
    ref="jsonEditorRef"
    :template="template"
    :default-tid-mode="false"
    :default-beautify="true"
    @save="handleSave"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { JsonEditor } from 'custom-print-template'

const jsonEditorRef = ref(null)
const template = ref(/* 模板对象 */)

const handleSave = (json) => {
  console.log('保存JSON:', json)
}

const handleError = (message) => {
  console.error('JSON错误:', message)
}
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| template | Object | null | 当前模板 |
| defaultTidMode | Boolean | false | 默认tid模式 |
| defaultBeautify | Boolean | true | 默认美化输出 |
| title | String | 'JSON' | 对话框标题 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| save | (json) | 保存JSON |
| error | (message) | 错误事件 |
| show | (template) | 显示编辑器 |
| hide | () | 隐藏编辑器 |

## 工具函数

### 验证模板JSON

```javascript
import { validateTemplateJson } from 'custom-print-template'

const result = validateTemplateJson(json)
if (result.valid) {
  console.log('验证通过')
} else {
  console.error('验证失败:', result.message)
}
```

### 格式化JSON

```javascript
import { formatJson } from 'custom-print-template'

const formatted = formatJson(json, true) // 美化输出
const compressed = formatJson(json, false) // 压缩输出
```

### 解析JSON字符串

```javascript
import { parseJsonString } from 'custom-print-template'

const result = parseJsonString(jsonString)
if (result.valid) {
  console.log('解析成功:', result.data)
} else {
  console.error('解析失败:', result.message)
}
```

## 组合式函数

### useHiprint

```javascript
import { useHiprint } from 'custom-print-template'

const { hiprintTemplate, initHiprint, createTemplate } = useHiprint()

// 初始化
await initHiprint()

// 创建模板
const template = createTemplate({
  template: {},
  onImageChooseClick: handleImageClick,
  // ... 其他配置
})
```

### useImageUpload

```javascript
import { useImageUpload } from 'custom-print-template'

const { handleImageChoose } = useImageUpload({
  maxSize: 5, // MB
  allowTypes: ['image/png', 'image/jpg', 'image/jpeg'],
  onSuccess: (dataUrl, file) => {
    console.log('图片上传成功:', file.name)
  },
  onError: (error) => {
    console.error('图片上传失败:', error)
  }
})

// 使用
handleImageChoose(target)
```

## 自定义配置

### 自定义纸张类型

```javascript
const customPaperTypes = {
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
  Custom: { width: 150, height: 100 },
  Receipt: { width: 80, height: 200 },
}

<PrintDesigner :paper-types="customPaperTypes" />
```

### 自定义字体列表

```javascript
const customFontList = [
  { title: '微软雅黑', value: 'Microsoft YaHei' },
  { title: '宋体', value: 'SimSun' },
  { title: 'Arial', value: 'Arial' },
  { title: 'Times New Roman', value: 'Times New Roman' },
]

<PrintDesigner :font-list="customFontList" />
```

## 样式定制

导入样式文件：

```javascript
import 'custom-print-template/style.css'
```

可以通过 CSS 变量自定义样式：

```css
:root {
  --cpt-primary-color: #409eff;
  --cpt-border-color: #dcdfe6;
  --cpt-bg-color: #f5f5f5;
}
```

## 类型支持

TypeScript 用户可以使用完整的类型定义：

```typescript
import type {
  PrintDesignerProps,
  PrintPreviewProps,
  JsonEditorProps,
  TemplateJson,
  PrintData
} from 'custom-print-template'

const template: TemplateJson = {
  panels: [
    {
      width: 210,
      height: 297,
    }
  ]
}

const data: PrintData = {
  name: '测试',
  // ...
}
```

## 注意事项

1. **Element Plus 依赖**：本组件依赖 Element Plus，请确保已安装
2. **jQuery 依赖**：vue-plugin-hiprint 需要 jQuery，已内置在依赖中
3. **浏览器兼容性**：支持现代浏览器（Chrome、Firefox、Safari、Edge）
4. **图片上传**：默认限制 2MB，可自定义限制和类型

## 许可证

MIT License
