<template>
  <div class="smart-upload-modal-wrapper" v-if="visible">
    <div class="modal-overlay" :class="{ 'modal-overlay--active': visible }" @click.self="$emit('close')">
      <div class="modal modal--smart-upload">
        <div class="modal__header">
          <h3 class="modal__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            智能上传
          </h3>
          <button class="modal__close" @click.stop="$emit('close')">&times;</button>
        </div>
        
        <div class="modal__body">
          <!-- 上传区域 -->
          <div class="upload-zone" @click="triggerUpload">
            <div class="upload-zone__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div class="upload-zone__text">点击上传文件或将文件拖拽到此处</div>
            <div class="upload-zone__hint">支持 mp3、mp4、flv、xls、xlsx、ppt、pptx、doc、docx、pdf</div>
            <input 
              type="file" 
              ref="fileInputRef" 
              class="upload-zone__input" 
              multiple
              @change="handleFileChange"
            >
          </div>
          
          <!-- 文件列表 -->
          <div class="file-list" v-if="fileList.length > 0">
            <div class="file-list__header">
              <span class="file-list__title">已上传 {{ fileList.length }} 个文件</span>
              <button class="file-list__clear" @click="clearFileList">清空</button>
            </div>
            <div class="file-list__content">
              <div 
                v-for="(file, index) in fileList" 
                :key="index"
                class="file-chip"
              >
                <div class="file-chip__icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <span class="file-chip__name">{{ truncateFileName(file.name) }}</span>
                <button class="file-chip__remove" @click="removeFile(index)">&times;</button>
              </div>
            </div>
          </div>
          
          <!-- 空状态提示 -->
          <div class="empty-hint" v-else>
            <p>请上传课件文件，支持批量上传</p>
            <p>上传完成后点击「开始分析」进行智能识别</p>
          </div>
        </div>
        
        <div class="modal__footer">
          <button class="button button--secondary" @click.stop="$emit('back')">返回</button>
          <button 
            class="button button--primary button--smart"
            :disabled="fileList.length === 0"
            @click="handleStartAnalyze"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            开始分析 ({{ fileList.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'back', 'startAnalyze'])

const fileInputRef = ref(null)
const fileList = ref([])

// 触发文件选择
const triggerUpload = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    // 检查是否已存在
    if (!fileList.value.some(f => f.name === file.name && f.size === file.size)) {
      fileList.value.push(file)
    }
  })
  // 清空 input 以允许重复选择相同文件
  event.target.value = ''
}

// 移除文件
const removeFile = (index) => {
  fileList.value.splice(index, 1)
}

// 清空文件列表
const clearFileList = () => {
  fileList.value = []
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 截断文件名
const truncateFileName = (name) => {
  if (name.length > 12) {
    const ext = name.split('.').pop()
    const baseName = name.substring(0, name.length - ext.length - 1)
    return baseName.substring(0, 6) + '...' + '.' + ext
  }
  return name
}

// 开始分析
const handleStartAnalyze = () => {
  if (fileList.value.length === 0) return
  
  // 传递文件列表给父组件
  emit('startAnalyze', fileList.value)
  emit('close')
  
  // 重置状态
  fileList.value = []
}
</script>

<style scoped>
.modal--smart-upload {
  width: 600px;
  max-width: 90vw;
}

.modal__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.modal__title svg {
  color: #a51c30;
}

.upload-zone {
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-zone:hover {
  border-color: #a51c30;
  background: #fff1f3;
}

.upload-zone__icon {
  color: #999999;
  margin-bottom: 16px;
}

.upload-zone:hover .upload-zone__icon {
  color: #a51c30;
}

.upload-zone__text {
  font-size: 14px;
  color: #333333;
  margin-bottom: 8px;
}

.upload-zone__hint {
  font-size: 12px;
  color: #999999;
}

.upload-zone__input {
  display: none;
}

.file-list {
  margin-top: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.file-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.file-list__title {
  font-size: 13px;
  font-weight: 500;
  color: #666666;
}

.file-list__clear {
  background: none;
  border: none;
  color: #a51c30;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.file-list__clear:hover {
  background: #fff1f3;
}

.file-list__content {
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 160px;
  overflow-y: auto;
}

.file-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 6px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 12px;
  color: #333333;
  transition: all 0.2s;
  max-width: 140px;
}

.file-chip:hover {
  background: #fff1f3;
  border-color: #a51c30;
}

.file-chip__icon {
  color: #999999;
  flex-shrink: 0;
}

.file-chip:hover .file-chip__icon {
  color: #a51c30;
}

.file-chip__name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-chip__remove {
  background: none;
  border: none;
  font-size: 14px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: 2px;
  transition: color 0.2s;
}

.file-chip__remove:hover {
  color: #ff4d4f;
}

.empty-hint {
  margin-top: 20px;
  text-align: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.empty-hint p {
  margin: 0;
  font-size: 13px;
  color: #666666;
  line-height: 1.8;
}

.button--smart {
  display: flex;
  align-items: center;
  gap: 6px;
}

.button--smart svg {
  fill: currentColor;
}
</style>