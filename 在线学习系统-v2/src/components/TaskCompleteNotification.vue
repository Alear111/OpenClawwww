<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div v-if="visible" class="notification-bar" @click="$emit('click')">
        <div class="notification-bar__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="8 12 11 15 16 9"></polyline>
          </svg>
        </div>
        <div class="notification-bar__content">
          <span class="notification-bar__title">{{ title }}</span>
          <span class="notification-bar__desc">{{ desc }}</span>
        </div>
        <div class="notification-bar__action">
          <span>查看详情</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <button class="notification-bar__close" @click.stop="$emit('close')">&times;</button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '智能分析已完成'
  },
  desc: {
    type: String,
    default: '点击查看分析结果'
  }
})

defineEmits(['click', 'close'])
</script>

<style scoped>
.notification-bar {
  position: fixed;
  top: 80px;
  right: 24px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9998;
  cursor: pointer;
  min-width: 340px;
  max-width: 400px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.notification-bar:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  border-color: #52c41a;
}

.notification-bar__icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f6ffed;
  color: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-bar__content {
  flex: 1;
  min-width: 0;
}

.notification-bar__title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: block;
}

.notification-bar__desc {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 2px;
}

.notification-bar__action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #52c41a;
  flex-shrink: 0;
}

.notification-bar__close {
  background: none;
  border: none;
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
  flex-shrink: 0;
}

.notification-bar__close:hover {
  color: #999;
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
