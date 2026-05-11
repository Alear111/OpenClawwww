<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="modal-overlay modal-overlay--active"
      @click.self="handleOverlayClick"
    >
      <div class="modal" :class="modalClass" :style="{ width: width }">
        <div class="modal__header">
          <h3 class="modal__title">{{ title }}</h3>
          <button class="modal__close" @click="close">&times;</button>
        </div>
        <div class="modal__body">
          <slot></slot>
        </div>
        <div class="modal__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '560px'
  },
  type: {
    type: String,
    default: 'upload'
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalClass = computed(() => {
  if (props.type === 'detail') return 'modal--detail'
  if (props.type === 'smart') return 'modal--upload modal--upload-smart'
  return 'modal--upload'
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

function handleEsc(e) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
/* 弹窗遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay--active {
  display: flex;
}

/* 弹窗容器 */
.modal {
  background-color: var(--color-bg-white);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal--upload {
  width: 560px;
}

.modal--detail {
  width: 800px;
}

.modal--upload-smart {
  width: 980px;
  display: flex;
  flex-direction: row;
}

.modal--upload-smart .modal__body {
  display: flex;
  padding: 0;
  overflow: hidden;
  flex: 1;
}

/* 弹窗头部 */
.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal__title {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.modal__close {
  font-size: 24px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__close:hover {
  color: var(--color-text-primary);
}

/* 弹窗内容区 */
.modal__body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

/* 弹窗底部 */
.modal__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

/* 上传表单面板 */
.upload-form-panel {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 70vh;
}

/* 表单区域 */
.form-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section__title {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

/* 表单组 */
.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group--inline {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.form-label--required::before {
  content: '*';
  color: var(--color-brand-primary);
  margin-right: 4px;
}

.form-hint {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  text-align: right;
  margin-top: 4px;
}

.form-hint--inline {
  margin-top: 8px;
  text-align: left;
}

/* 输入框全宽 */
.input--full {
  width: 100%;
}

.input--small {
  width: 80px;
}

.input--textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  padding: 8px var(--spacing-sm);
  line-height: 1.5;
}

/* 带单位的输入框 */
.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-unit {
  color: var(--color-text-secondary);
}

/* 封面上传区域 */
.upload-area {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--color-border);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: var(--color-brand-primary);
}

.upload-area__icon {
  font-size: 32px;
  color: var(--color-text-light);
}

/* 详情弹窗 */
.detail-notice {
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-notice__icon {
  font-size: 16px;
}

.detail-notice__text {
  font-size: var(--font-size-sm);
  color: #ad6800;
}

/* 详情表格 */
.detail-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.detail-table tr {
  border-bottom: 1px solid var(--color-border);
}

.detail-table tr:last-child {
  border-bottom: none;
}

.detail-table td {
  padding: 12px 8px;
  vertical-align: middle;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.detail-table__label {
  width: 110px;
  min-width: 110px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.detail-table__value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  min-width: 0;
}

/* 详情弹窗标签信息行 */
.detail-table__tag-row {
  border-top: 2px solid var(--color-border);
}

.detail-table__tag-row td {
  vertical-align: middle;
}

.detail-table__tag-row .detail-table__label {
  width: 110px;
  vertical-align: top;
  padding-top: 12px;
}

.detail-table__tags-cell {
  padding: 12px 8px;
  overflow: visible;
}

/* 标签容器 */
.detail-tags-wrapper {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  cursor: grab;
  scrollbar-width: none;
}

.detail-tags-wrapper:active {
  cursor: grabbing;
}

.detail-tags-empty {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

/* 详情弹窗单个标签组 */
.detail-tag-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.detail-tag-group__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.detail-tag-group__separator {
  color: var(--color-border);
  font-size: var(--font-size-sm);
}
</style>
