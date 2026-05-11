<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div v-if="visible" class="task-indicator" @click="handleClick">
        <div class="task-indicator__left">
          <div class="task-indicator__circle" :class="getStatusClass()">
            <!-- 等待状态 -->
            <svg v-if="status === 'pending'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <!-- 进行中状态 -->
            <svg v-else-if="status === 'running'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <!-- 完成状态 -->
            <svg v-else-if="status === 'completed'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="8 12 11 15 16 9"></polyline>
            </svg>
            <!-- 失败状态 -->
            <svg v-else-if="status === 'failed'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
        
        <div class="task-indicator__content">
          <div class="task-indicator__header">
            <span class="task-indicator__title">智能分析</span>
            <div class="task-indicator__count-box">
              <span class="task-indicator__count-label">已完成</span>
              <span class="task-indicator__count">{{ completedCount }}/{{ totalCount }}</span>
            </div>
          </div>
          
          <div class="task-indicator__current" v-if="status === 'running' && currentFileName">
            <span class="task-indicator__current-label">正在分析:</span>
            <span class="task-indicator__current-name">{{ truncateFileName(currentFileName) }}</span>
          </div>
          
          <div class="task-indicator__progress-area">
            <!-- 总体进度 -->
            <div class="task-indicator__progress-row">
              <span class="task-indicator__progress-label">总进度</span>
              <div class="task-indicator__progress-bar">
                <div class="task-indicator__progress-fill task-indicator__progress-fill--total" :style="{ width: progress + '%' }"></div>
              </div>
              <span class="task-indicator__progress-value">{{ progress }}%</span>
            </div>
            
            <!-- 当前文件进度 -->
            <div class="task-indicator__progress-row" v-if="status === 'running'">
              <span class="task-indicator__progress-label">当前</span>
              <div class="task-indicator__progress-bar">
                <div class="task-indicator__progress-fill task-indicator__progress-fill--current" :style="{ width: currentFileProgress + '%' }"></div>
              </div>
              <span class="task-indicator__progress-value">{{ currentFileProgress }}%</span>
            </div>
          </div>
        </div>
        
        <div class="task-indicator__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </Transition>
    

  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  status: {
    type: String,
    default: 'pending', // pending | running | completed | failed
    validator: (value) => ['pending', 'running', 'completed', 'failed'].includes(value)
  },
  progress: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: '智能分析任务'
  },
  totalCount: {
    type: Number,
    default: 0
  },
  completedCount: {
    type: Number,
    default: 0
  },
  currentFileName: {
    type: String,
    default: ''
  },
  currentFileProgress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click', 'cancel'])

const getStatusClass = () => {
  return {
    'task-indicator__circle--pending': props.status === 'pending',
    'task-indicator__circle--running': props.status === 'running',
    'task-indicator__circle--completed': props.status === 'completed',
    'task-indicator__circle--failed': props.status === 'failed'
  }
}

const truncateFileName = (name) => {
  if (!name) return ''
  if (name.length > 10) {
    return name.substring(0, 8) + '...'
  }
  return name
}

const handleClick = () => {
  // 点击后打开智能分析结果弹窗（由ResourceManagement处理）
  emit('click')
}
</script>

<style scoped>
.task-indicator {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  z-index: 9999;
  cursor: pointer;
  min-width: 340px;
  max-width: 380px;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  display: flex;
}

.task-indicator:hover {
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.18);
  border-color: #e8d4d6;
}

.task-indicator__left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 14px;
  background: linear-gradient(160deg, #fff7f7 0%, #fff 100%);
  border-right: 1px solid #f5f0f0;
  min-width: 64px;
}

.task-indicator__circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-indicator__circle--pending {
  background: #f5f5f5;
  color: #999;
}

.task-indicator__circle--running {
  background: #fff;
  color: #a51c30;
  box-shadow: 0 2px 8px rgba(165, 28, 48, 0.15);
}

.task-indicator__circle--completed {
  background: #f6ffed;
  color: #52c41a;
}

.task-indicator__circle--failed {
  background: #fff2f0;
  color: #ff4d4f;
}

.task-indicator__content {
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-indicator__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-indicator__title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.task-indicator__count-box {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff7f7;
  padding: 3px 10px 3px 8px;
  border-radius: 12px;
}

.task-indicator__count-label {
  font-size: 11px;
  color: #999;
}

.task-indicator__count {
  font-size: 12px;
  font-weight: 600;
  color: #a51c30;
}

.task-indicator__current {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.task-indicator__current-label {
  color: #999;
}

.task-indicator__current-name {
  color: #666;
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-indicator__progress-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-indicator__progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-indicator__progress-label {
  font-size: 11px;
  color: #999;
  width: 28px;
  flex-shrink: 0;
}

.task-indicator__progress-bar {
  flex: 1;
  height: 5px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.task-indicator__progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.task-indicator__progress-fill--total {
  background: linear-gradient(90deg, #a51c30, #c41e3a);
}

.task-indicator__progress-fill--current {
  background: linear-gradient(90deg, #fa8c16, #ffc53d);
}

.task-indicator__progress-value {
  font-size: 11px;
  color: #999;
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

.task-indicator__arrow {
  display: flex;
  align-items: center;
  padding-right: 12px;
  color: #ddd;
  transition: color 0.2s;
}

.task-indicator:hover .task-indicator__arrow {
  color: #a51c30;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>