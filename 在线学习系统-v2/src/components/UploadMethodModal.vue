<template>
  <Teleport to="body">
    <div 
      class="upload-method-modal-overlay" 
      :class="{ 'upload-method-modal-overlay--active': visible }"
      @click.self="$emit('close')"
    >
      <div class="upload-method-modal">
        <div class="upload-method-modal__header">
          <h3 class="upload-method-modal__title">选择上传方式</h3>
          <button class="upload-method-modal__close" @click="$emit('close')">&times;</button>
        </div>
        <div class="upload-method-modal__body">
          <div class="upload-method-options">
            <!-- 普通上传 -->
            <div 
              class="upload-method-option"
              @click="handleSelect('normal')"
            >
              <div class="upload-method-option__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
              <div class="upload-method-option__info">
                <h4 class="upload-method-option__title">普通上传</h4>
                <p class="upload-method-option__desc">直接上传文件，填写基础信息</p>
              </div>
            </div>

            <!-- 智能上传 -->
            <div 
              class="upload-method-option upload-method-option--smart"
              @click="handleSelect('smart')"
            >
              <div class="upload-method-option__icon upload-method-option__icon--smart">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div class="upload-method-option__info">
                <h4 class="upload-method-option__title">智能上传</h4>
                <p class="upload-method-option__desc">AI自动识别资源信息和标签</p>
              </div>
              <div class="upload-method-option__badge">推荐</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'select'])

const handleSelect = (type) => {
  emit('select', type)
  emit('close')
}
</script>

<style scoped>
.upload-method-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.upload-method-modal-overlay--active {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  pointer-events: auto;
}

.upload-method-modal {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 480px;
  max-width: 90vw;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.upload-method-modal-overlay--active .upload-method-modal {
  transform: scale(1);
}

.upload-method-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.upload-method-modal__title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.upload-method-modal__close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.upload-method-modal__close:hover {
  color: #666666;
}

.upload-method-modal__body {
  padding: 24px;
}

.upload-method-options {
  display: flex;
  gap: 16px;
}

.upload-method-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #ffffff;
}

.upload-method-option:hover {
  border-color: #a51c30;
  background: #fff1f3;
}

.upload-method-option--smart {
  border-color: #a51c30;
  background: #fff1f3;
}

.upload-method-option--smart:hover {
  background: #ffe6e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(165, 28, 48, 0.15);
}

.upload-method-option__icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  margin-bottom: 16px;
  color: #666666;
  transition: all 0.3s ease;
}

.upload-method-option:hover .upload-method-option__icon {
  background: #a51c30;
  color: #ffffff;
}

.upload-method-option__icon--smart {
  background: #a51c30;
  color: #ffffff;
}

.upload-method-option__info {
  text-align: center;
}

.upload-method-option__title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
}

.upload-method-option__desc {
  font-size: 13px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
}

.upload-method-option__badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #a51c30;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 10px;
}
</style>