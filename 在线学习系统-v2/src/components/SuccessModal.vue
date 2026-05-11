<template>
  <!-- 
    来源引用规范：
    region: 来自节点1的 layout_structure_tree
    solution: 来自节点3的 solutions
    spec: 来自规范提取的 design-spec.json
  -->
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="success-modal-overlay"
      @click.self="handleCancel"
    >
      <!-- 
        region: success_modal (上传成功弹窗，来自节点1)
        solution: S001, S002, S003, S004 (来自节点3方案)
        spec: modal (来自规范提取)
      -->
      <div class="success-modal">
        <!-- 成功图标区域 -->
        <!-- region: area_2 (成功图标区域，来自节点1) -->
        <!-- solution: S002 (成功反馈展示，来自节点3) -->
        <!-- spec: icon.success (来自规范提取) -->
        <div class="success-modal__icon">
          <svg viewBox="0 0 48 48" width="48" height="48">
            <circle cx="24" cy="24" r="22" fill="#52c41a" opacity="0.1"/>
            <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-4 30l-8-8 2.828-2.828L20 28.344l13.172-13.172L36 18 20 34z" fill="#52c41a"/>
          </svg>
        </div>
        
        <!-- 成功提示文案 -->
        <!-- region: area_3 (消息区域，来自节点1) -->
        <!-- solution: S002 (成功反馈展示，来自节点3) -->
        <div class="success-modal__message">上传成功</div>
        
        <!-- 按钮区域 -->
        <!-- region: area_4 (按钮区域，来自节点1) -->
        <!-- solution: S003, S004 (快速创建课程入口 + 取消关闭入口，来自节点3) -->
        <div class="success-modal__actions">
          <!-- 快速创建课程按钮 (主按钮) -->
          <!-- solution: S003 (快速创建课程入口，来自节点3) -->
          <!-- spec: button.primary (来自规范提取) -->
          <button class="success-modal__btn--primary" @click="handleCreateCourse">
            快速创建课程
          </button>
          
          <!-- 取消按钮 (纯文字) -->
          <!-- solution: S004 (取消关闭入口，来自节点3) -->
          <!-- spec: button.text (来自规范提取) -->
          <button class="success-modal__btn--text" @click="handleCancel">
            取消
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
/**
 * SuccessModal.vue - 上传成功弹窗组件
 * 
 * 来源引用：
 * - region: success_modal (来自节点1)
 * - requirement: feature_scope[0-3] (来自节点2)
 * - solution: S001-S004 (来自节点3)
 * - spec: modal, button, icon (来自规范提取)
 */
import { watch, onMounted, onUnmounted } from 'vue'
import { showToast } from '../utils/toast'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'close', 'create-course'])

// 关闭弹窗
const close = () => {
  emit('update:visible', false)
  emit('close')
}

// 点击快速创建课程
const handleCreateCourse = () => {
  // requirement: feature_scope[1] (快速创建课程入口)
  // solution: S003 (点击后显示toast提示)
  showToast('创建成功')
  close()
}

// 点击取消
const handleCancel = () => {
  // requirement: feature_scope[2] (取消关闭入口)
  // solution: S004 (点击后关闭弹窗)
  close()
}

// ESC键关闭
const handleEsc = (e) => {
  if (e.key === 'Escape' && props.visible) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})

// 显示时禁止背景滚动
watch(() => props.visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* 
 * 样式来源：
 * - spec: modal (来自规范提取)
 * - spec: button (来自规范提取)
 * - spec: icon.success (来自规范提取)
 */

/* 遮罩层 - solution: S001 */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 弹窗容器 */
.success-modal {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px 40px;
  width: 360px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 成功图标 - solution: S002, spec: icon.success */
.success-modal__icon {
  margin-bottom: 16px;
}

.success-modal__icon svg {
  display: inline-block;
}

/* 成功提示文案 - solution: S002 */
.success-modal__message {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 24px;
}

/* 按钮区域 - solution: S003, S004 */
.success-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 主按钮 - solution: S003, spec: button.primary */
.success-modal__btn--primary {
  width: 100%;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #a51c30;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.success-modal__btn--primary:hover {
  background-color: #8a1728;
}

/* 纯文字按钮 - solution: S004, spec: button.text */
.success-modal__btn--text {
  padding: 8px 16px;
  font-size: 14px;
  color: #666666;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.success-modal__btn--text:hover {
  color: #a51c30;
}
</style>
