<!--
 * @Description: 打印模板设计器组件
 * @Author: Your Name
 * @Date: 2024-05-12
-->
<template>
  <div>
    <el-space style="margin-bottom: 10px" wrap>
      <el-button-group>
        <el-button
          v-for="(value, type) in paperTypes"
          :key="type"
          :type="curPaperType === type ? 'primary' : ''"
          @click="setPaper(type, value)"
        >
          {{ type }}
        </el-button>
      </el-button-group>

      <el-button :icon="ZoomOut" @click="changeScale(false)" />
      <el-input-number
        v-model="scaleValue"
        :min="scaleMin"
        :max="scaleMax"
        :step="0.1"
        disabled
        style="width: 120px"
        :formatter="(val) => `${(val * 100).toFixed(0)}%`"
      />
      <el-button :icon="ZoomIn" @click="changeScale(true)" />

      <el-button type="primary" :icon="View" @click="preView">预览</el-button>
      <el-button type="success" :icon="DocumentCopy" @click="saveTemplate">保存</el-button>
      <el-button type="info" :icon="Upload" @click="showImportJsonDialog">
        导入 JSON
      </el-button>

      <json-view :template="template" @save="handleJsonSave" />

      <el-popconfirm
        title="是否确认清空?"
        confirm-button-type="danger"
        confirm-button-text="确定清空"
        @confirm="clearPaper"
      >
        <template #reference>
          <el-button type="danger" :icon="Delete">清空</el-button>
        </template>
      </el-popconfirm>
    </el-space>

    <!-- 导入 JSON 对话框 -->
    <el-dialog
      v-model="importJsonDialogVisible"
      title="导入设计 JSON"
      width="600px"
    >
      <el-tabs v-model="importTab">
        <el-tab-pane label="粘贴 JSON" name="paste">
          <el-input
            v-model="importJsonText"
            type="textarea"
            :rows="15"
            placeholder='请粘贴模板 JSON，例如：{"panels": [{"width": 210, "height": 297, ...}]}'
          />
        </el-tab-pane>
        <el-tab-pane label="上传文件" name="upload">
          <el-upload
            drag
            accept=".json"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽 JSON 文件到此处，或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 JSON 文件
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="importJsonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="importTemplateFromJson">确定导入</el-button>
      </template>
    </el-dialog>

    <el-row :gutter="8">
      <el-col :span="4">
        <el-card style="height: calc(100vh - 120px); overflow: auto">
          <div class="rect-printElement-types hiprintEpContainer"  style="padding: 20px">
            <div class="drag_item_title">拖拽组件列表</div>

            <el-row :gutter="8">
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.text">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/wenben.png"
                    /></span>
                    <p>文本</p>
                  </a>
                </div>
              </el-col>
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.image">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/tupian.png"
                    /></span>
                    <p>图片</p>
                  </a>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="8">
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.longText">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/changwen.png"
                    /></span>
                    <p>长文</p>
                  </a>
                </div>
              </el-col>
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.emptyTable">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/biaoge.png"
                    /></span>
                    <p>表格</p>
                  </a>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="8">
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.html">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/html.png"
                    /></span>
                    <p>html</p>
                  </a>
                </div>
              </el-col>
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.customText">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/zidingyi.png"
                    /></span>
                    <p>自定义</p>
                  </a>
                </div>
              </el-col>
            </el-row>

            <div class="drag_item_title">辅助</div>
            <el-row :gutter="8">
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.hline">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/hengxian.png"
                    /></span>
                    <p>横线</p>
                  </a>
                </div>
              </el-col>
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.vline">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/shuxian.png"
                    /></span>
                    <p>竖线</p>
                  </a>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="8">
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.rect">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/juxing.png"
                    /></span>
                    <p>矩形</p>
                  </a>
                </div>
              </el-col>
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.oval">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/tuoyuan.png"
                    /></span>
                    <p>椭圆</p>
                  </a>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="8">
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.barcode">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/tiaoxingma.png"
                    /></span>
                    <p>条形码</p>
                  </a>
                </div>
              </el-col>
              <el-col :span="12" class="drag_item_box">
                <div>
                  <a class="ep-draggable-item" tid="defaultModule.qrcode">
                    <span class="ep-icon-wrapper"
                      ><img class="ep-icon-svg" src="@/assets/icons/erweima.png"
                    /></span>
                    <p>二维码</p>
                  </a>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :span="15">
        <el-card
          class="card-design"
          style="height: calc(100vh - 120px); overflow: auto"
        >
          <div id="hiprint-printTemplate" class="hiprint-printTemplate" style="padding: 20px"></div>
        </el-card>
      </el-col>

      <el-col :span="5">
        <el-card style="height: calc(100vh - 120px); overflow: auto">
          <div class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <print-preview ref="preViewRef" />
  </div>
</template>

<script>
export default {
  name: "PrintDesigner",
};
</script>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import {
  ZoomIn,
  ZoomOut,
  View,
  DocumentCopy,
  Delete,
  Upload,
  UploadFilled,
} from "@element-plus/icons-vue";
import { hiprint, defaultElementTypeProvider } from "vue-plugin-hiprint";
import printData from "./print-data.js";
import printPreview from "./PrintPreview.vue";
import jsonView from "./JsonView.vue";
// 使用 vue-plugin-hiprint 内置的 jQuery 实例（已通过 window.$ 全局挂载）
const $ = window.$;

const preViewRef = ref(null);
const template = ref(null);
const curPaper = ref({
  type: "A4",
  width: 210,
  height: 296.6,
});
const paperTypes = {
  A3: { width: 420, height: 296.6 },
  A4: { width: 210, height: 296.6 },
};
const scaleValue = ref(1);
const scaleMax = 5;
const scaleMin = 0.5;

// 导入 JSON 相关
const importJsonDialogVisible = ref(false);
const importTab = ref("paste");
const importJsonText = ref("");

const curPaperType = computed(() => {
  for (const key in paperTypes) {
    const item = paperTypes[key];
    if (
      item.width === curPaper.value.width &&
      item.height === curPaper.value.height
    ) {
      return key;
    }
  }
  return "other";
});

let hiprintTemplate;

onMounted(() => {
  init();
});

const init = () => {
  hiprint.init({
    providers: [new defaultElementTypeProvider()],
  });

  hiprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));
  $("#hiprint-printTemplate").empty();

  // 纯空白模板初始化（无 panel.js）
  template.value = hiprintTemplate = new hiprint.PrintTemplate({
    template: {},
    onImageChooseClick: (target) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpg,image/jpeg";

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowTypes.includes(file.type)) {
          ElMessage.warning("仅支持 PNG / JPG / JPEG 格式图片！");
          return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          ElMessage.warning("图片大小不能超过 2MB！");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          target.refresh(event.target.result, { real: true });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    },
    fontList: [
      { title: "微软雅黑", value: "Microsoft YaHei" },
      { title: "黑体", value: "STHeitiSC-Light" },
      { title: "思源黑体", value: "SourceHanSansCN-Normal" },
      { title: "宋体", value: "SimSun" },
      { title: "华为楷体", value: "STKaiti" },
      { title: "cursive", value: "cursive" },
    ],
    dataMode: 1,
    history: true,
    willOutOfBounds: true,
    qtDesigner: true,
    settingContainer: "#PrintElementOptionSetting",
  });

  hiprintTemplate.design("#hiprint-printTemplate", { grid: true });
  console.log("hiprintTemplate", hiprintTemplate);
  scaleValue.value = hiprintTemplate.editingPanel.scale || 1;
};

const setPaper = (type, value) => {
  try {
    curPaper.value = { type, ...value };
    hiprintTemplate.setPaper(value.width, value.height);
  } catch (error) {
    ElMessage.error(`操作失败: ${error}`);
  }
};

const changeScale = (big) => {
  scaleValue.value = big
    ? Math.min(scaleValue.value + 0.1, scaleMax)
    : Math.max(scaleValue.value - 0.1, scaleMin);

  hiprintTemplate?.zoom(scaleValue.value);
};

const preView = () => {
  console.log("preView", hiprintTemplate, printData);
  preViewRef.value.show(hiprintTemplate, printData);
};


const clearPaper = () => {
  try {
    hiprintTemplate.clear();
    setTimeout(() => {
      template.value = hiprintTemplate;
    }, 100);
  } catch (error) {
    ElMessage.error(`操作失败: ${error}`);
  }
};

const saveTemplate = () => {
  setTimeout(() => {
    template.value = hiprintTemplate;
    const json = hiprintTemplate.getJson();
    console.log('保存模板:', json);
    console.log('保存模板 panels:', json?.panels);
    ElMessage.success('保存成功！')
  }, 100);
};

// 显示导入 JSON 对话框
const showImportJsonDialog = () => {
  importJsonText.value = "";
  importJsonDialogVisible.value = true;
};

// 处理文件上传
const handleFileChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    importJsonText.value = e.target.result;
    ElMessage.success("文件读取成功，请点击确定导入");
  };
  reader.onerror = () => {
    ElMessage.error("文件读取失败");
  };
  reader.readAsText(file.raw);
};

// 从 JSON 导入模板
const importTemplateFromJson = () => {
  try {
    if (!importJsonText.value.trim()) {
      ElMessage.warning("请输入或上传 JSON 数据");
      return;
    }

    const templateJson = JSON.parse(importJsonText.value);

    // 验证 JSON 格式
    if (!templateJson || !templateJson.panels || !Array.isArray(templateJson.panels)) {
      ElMessage.error("JSON 格式不正确，必须包含 panels 数组");
      return;
    }

    // 清空当前设计器
    $("#hiprint-printTemplate").empty();
    // 创建新的模板实例
    hiprintTemplate = new hiprint.PrintTemplate({
      template: templateJson,
      onImageChooseClick: (target) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpg,image/jpeg";

        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const allowTypes = ["image/png", "image/jpg", "image/jpeg"];
          if (!allowTypes.includes(file.type)) {
            ElMessage.warning("仅支持 PNG / JPG / JPEG 格式图片！");
            return;
          }

          const maxSize = 2 * 1024 * 1024;
          if (file.size > maxSize) {
            ElMessage.warning("图片大小不能超过 2MB！");
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            target.refresh(event.target.result, { real: true });
          };
          reader.readAsDataURL(file);
        };

        input.click();
      },
      fontList: [
        { title: "微软雅黑", value: "Microsoft YaHei" },
        { title: "黑体", value: "STHeitiSC-Light" },
        { title: "思源黑体", value: "SourceHanSansCN-Normal" },
        { title: "宋体", value: "SimSun" },
        { title: "华为楷体", value: "STKaiti" },
        { title: "cursive", value: "cursive" },
      ],
      dataMode: 1,
      history: true,
      willOutOfBounds: true,
      qtDesigner: true,
      settingContainer: "#PrintElementOptionSetting",
    });

    // 渲染设计器
    hiprintTemplate.design("#hiprint-printTemplate", { grid: true });
    scaleValue.value = hiprintTemplate.editingPanel.scale || 1;

    // 更新当前纸张信息
    if (templateJson.panels[0]) {
      curPaper.value = {
        type: "导入模板",
        width: templateJson.panels[0].width,
        height: templateJson.panels[0].height,
      };
    }

    template.value = hiprintTemplate;
    importJsonDialogVisible.value = false;
    ElMessage.success("模板导入成功！");

  } catch (error) {
    console.error("导入失败:", error);
    ElMessage.error(`导入失败：${error.message || "JSON 格式错误"}`);
  }
};

// 处理从 JSON 查看组件保存编辑
const handleJsonSave = (templateJson) => {
  try {
    // 清空当前设计器
    $("#hiprint-printTemplate").empty();
debugger

    // 创建新的模板实例
    hiprintTemplate = new hiprint.PrintTemplate({
      template: templateJson,
      onImageChooseClick: (target) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpg,image/jpeg";

        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const allowTypes = ["image/png", "image/jpg", "image/jpeg"];
          if (!allowTypes.includes(file.type)) {
            ElMessage.warning("仅支持 PNG / JPG / JPEG 格式图片！");
            return;
          }

          const maxSize = 2 * 1024 * 1024;
          if (file.size > maxSize) {
            ElMessage.warning("图片大小不能超过 2MB！");
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            target.refresh(event.target.result, { real: true });
          };
          reader.readAsDataURL(file);
        };

        input.click();
      },
      fontList: [
        { title: "微软雅黑", value: "Microsoft YaHei" },
        { title: "黑体", value: "STHeitiSC-Light" },
        { title: "思源黑体", value: "SourceHanSansCN-Normal" },
        { title: "宋体", value: "SimSun" },
        { title: "华为楷体", value: "STKaiti" },
        { title: "cursive", value: "cursive" },
      ],
      dataMode: 1,
      history: true,
      willOutOfBounds: true,
      qtDesigner: true,
      settingContainer: "#PrintElementOptionSetting",
    });

    // 渲染设计器
    hiprintTemplate.design("#hiprint-printTemplate", { grid: true });
    scaleValue.value = hiprintTemplate.editingPanel.scale || 1;

    // 更新当前纸张信息
    if (templateJson.panels[0]) {
      curPaper.value = {
        type: "编辑模板",
        width: templateJson.panels[0].width,
        height: templateJson.panels[0].height,
      };
    }
console.log("handleJsonSave - hiprintTemplate:", hiprintTemplate);
    template.value = hiprintTemplate;
    ElMessage.success("模板更新成功！");
  } catch (error) {
    console.error("更新失败:", error);
    ElMessage.error(`更新失败：${error.message || "未知错误"}`);
  }
};

</script>

<style>
/* 重写全局 hiprint 样式 */
.hiprint-headerLine,
.hiprint-footerLine {
  border-color: red !important;
}

.hiprint-headerLine:hover,
.hiprint-footerLine:hover {
  border-top: 3px dashed red !important;
}

.hiprint-headerLine:hover:before {
  content: "页眉线";
  left: calc(50% - 18px);
  position: relative;
  background: #ffff;
  top: -12px;
  color: red;
  font-size: 12px;
}

.hiprint-footerLine:hover:before {
  content: "页脚线";
  left: calc(50% - 18px);
  position: relative;
  color: red;
  background: #ffff;
  top: -12px;
  font-size: 12px;
}
</style>

<style scoped>
.drag_item_box {
  height: 70px;
  margin-bottom: 8px;
}
.drag_item_box > div {
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.drag_item_box a {
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.drag_item_box .ep-icon-wrapper {
  margin-bottom: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.drag_item_box .ep-icon-svg {
  width: 24px;
  height: 24px;
}
.drag_item_box p {
  margin: 4px 0 0 0;
  font-size: 12px;
}
.drag_item_title {
  font-size: 14px;
  padding: 8px 0;
  font-weight: bold;
  color: #333;
}

:deep(.hiprint-printElement-image-content img) {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23eee' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3E图片%3C/text%3E%3C/svg%3E");
}
:deep(.toplineOfPosition),
:deep(.bottomlineOfPosition) {
  border-top: 1px dashed purple;
}
:deep(.leftlineOfPosition),
:deep(.rightlineOfPosition) {
  border-left: 1px dashed purple;
}

:deep(.hiprint-option-item-label),
:deep(.hiprint-option-item-field) {
  font-size: 14px;
}
</style>
