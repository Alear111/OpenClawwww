<template>
  <div class="unanalyzed-badge" @click="$emit('click')">
    <span class="badge-text">未分析课件 {{ count }}个</span>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  }
})

defineEmits(['click'])
</script>

<style scoped>
.unanalyzed-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 13px;
  color: #667eea;
  backdrop-filter: blur(4px);
}

.unanalyzed-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.8);
}

.unanalyzed-badge:active {
  transform: translateY(0);
}

.badge-text {
  white-space: nowrap;
}
</style>
