<template>
  <Teleport to="body">
    <transition name="drawer-fade">
      <div v-if="visible" class="drawer-overlay" @click.self="closeDrawer">
        <transition name="drawer-slide">
          <div v-if="visible" class="drawer">
            <!-- 头部 -->
            <div class="drawer-header">
              <h3 class="drawer-title">未分析课件</h3>
              <button class="drawer-close" @click="closeDrawer">×</button>
            </div>

            <!-- 列表 -->
            <div class="drawer-list">
              <div v-if="list.length === 0" class="drawer-empty">
                <p>暂无未分析课件</p>
              </div>
              <div
                v-for="item in listWithStatus"
                :key="item.id"
                class="drawer-item"
              >
                <input
                  type="checkbox"
                  class="drawer-checkbox"
                  :checked="selectedIds.includes(item.id)"
                  :disabled="item.status !== 'pending'"
                  @change="toggleSelect(item.id)"
                />
                <div class="item-cover"></div>
                <div class="item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-author">{{ item.author || '-' }}</div>
                  <!-- 进度条 -->
                  <div v-if="item.status === 'analyzing'" class="progress-bar">
                    <div class="progress-bar__fill" :style="{ width: item.progress + '%' }"></div>
                  </div>
                </div>
                <button
                  v-if="item.status === 'pending'"
                  class="analyze-btn"
                  @click="analyzeOne(item.id)"
                >
                  智能分析
                </button>
                <button
                  v-else-if="item.status === 'analyzing'"
                  class="analyze-btn analyze-btn--loading"
                  disabled
                >
                  分析中 {{ item.progress }}%
                </button>
                <button
                  v-else
                  class="analyze-btn analyze-btn--completed"
                  @click="viewResult(item.id)"
                >
                  查看结果
                </button>
              </div>
            </div>

            <!-- 底部 -->
            <div class="drawer-footer">
              <label class="select-all">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isPartialSelected"
                  @change="toggleSelectAll"
                />
                <span>全选</span>
              </label>
              <button
                class="batch-btn"
                :class="{ 'batch-btn--active': selectedIds.length > 0 }"
                :disabled="selectedIds.length === 0 || isBatchAnalyzing"
                @click="batchAnalyze"
              >
                {{ isBatchAnalyzing ? '分析中...' : '批量智能分析' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { showToast } from '../utils/toast.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'analyze', 'batch-analyze', 'view-result'])

// 每个item的状态
const itemStatusMap = ref({})

// 选中的ID列表
const selectedIds = ref([])
// 是否正在批量分析
const isBatchAnalyzing = ref(false)

// 带状态的列表
const listWithStatus = computed(() => {
  return props.list.map(item => ({
    ...item,
    status: itemStatusMap.value[item.id] || 'pending',
    progress: itemStatusMap.value[item.id + '_progress'] || 0
  }))
})

// 待分析的课件数量
const pendingCount = computed(() => {
  return listWithStatus.value.filter(item => item.status === 'pending').length
})

// 是否全选（只算待分析的）
const isAllSelected = computed(() => {
  const pendingItems = listWithStatus.value.filter(item => item.status === 'pending')
  return pendingItems.length > 0 && selectedIds.value.length === pendingItems.length
})

// 是否部分选中
const isPartialSelected = computed(() => {
  const pendingItems = listWithStatus.value.filter(item => item.status === 'pending')
  return selectedIds.value.length > 0 && selectedIds.value.length < pendingItems.length
})

// 关闭抽屉
const closeDrawer = () => {
  emit('update:visible', false)
}

// 切换单个选择
const toggleSelect = (id) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// 切换全选
const toggleSelectAll = () => {
  const pendingItems = listWithStatus.value.filter(item => item.status === 'pending')
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = pendingItems.map(item => item.id)
  }
}

// 模拟进度更新
const simulateProgress = (id) => {
  let progress = 0
  const timer = setInterval(() => {
    progress += Math.random() * 15 + 5
    if (progress >= 100) {
      progress = 100
      clearInterval(timer)
      itemStatusMap.value[id] = 'completed'
      // 从选中列表移除
      const index = selectedIds.value.indexOf(id)
      if (index > -1) {
        selectedIds.value.splice(index, 1)
      }
      showToast('分析完成')
    }
    itemStatusMap.value[id + '_progress'] = Math.min(100, Math.round(progress))
  }, 300)
}

// 单个分析
const analyzeOne = (id) => {
  itemStatusMap.value[id] = 'analyzing'
  itemStatusMap.value[id + '_progress'] = 0
  emit('analyze', id)
  simulateProgress(id)
}

// 批量分析
const batchAnalyze = async () => {
  if (selectedIds.value.length === 0) return
  isBatchAnalyzing.value = true
  const idsToAnalyze = [...selectedIds.value]
  selectedIds.value = []
  
  emit('batch-analyze', idsToAnalyze)
  
  // 批量启动分析
  idsToAnalyze.forEach(id => {
    itemStatusMap.value[id] = 'analyzing'
    itemStatusMap.value[id + '_progress'] = 0
    simulateProgress(id)
  })
  
  isBatchAnalyzing.value = false
}

// 查看结果
const viewResult = (id) => {
  emit('view-result', id)
}

// 监听列表变化，清理已移除的状态
watch(() => props.list, (newList) => {
  const listIds = newList.map(item => item.id)
  // 清理不存在的状态
  Object.keys(itemStatusMap.value).forEach(key => {
    const id = key.replace('_progress', '')
    if (!listIds.includes(id)) {
      delete itemStatusMap.value[key]
    }
  })
  // 清理选中的ID
  selectedIds.value = selectedIds.value.filter(id => listIds.includes(id))
}, { deep: true })

// 抽屉打开时重置状态
watch(() => props.visible, (visible) => {
  if (visible) {
    selectedIds.value = []
    isBatchAnalyzing.value = false
  }
})
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 480px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* 头部 */
.drawer-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.drawer-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.drawer-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.drawer-close:hover {
  background: #f5f5f5;
  color: #666;
}

/* 列表 */
.drawer-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.drawer-empty {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.drawer-item:hover {
  background: #f8f9fa;
}

.drawer-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #a51c30;
}

.drawer-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.item-cover {
  width: 80px;
  height: 60px;
  background-color: #e8e8e8;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.item-cover::after {
  content: "▶";
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  background: rgba(0,0,0,0.4);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-author {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

/* 进度条 */
.progress-bar {
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.analyze-btn {
  padding: 6px 12px;
  border: 1px solid #a51c30;
  background: white;
  color: #a51c30;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  white-space: nowrap;
}

.analyze-btn:hover:not(:disabled) {
  background: #a51c30;
  color: white;
}

.analyze-btn--loading {
  border-color: #999;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}

.analyze-btn--completed {
  border-color: #a51c30;
  background: #fff1f0;
  color: #a51c30;
}

.analyze-btn--completed:hover {
  background: #a51c30;
  color: white;
}

/* 底部 */
.drawer-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: #fafafa;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.select-all input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #a51c30;
}

.batch-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: #e8e8e8;
  color: #999;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: not-allowed;
  transition: all 0.2s;
  margin-left: 16px;
}

.batch-btn--active {
  background: #a51c30;
  color: white;
  cursor: pointer;
}

.batch-btn--active:hover {
  background: #c62828;
}

.batch-btn:disabled {
  background: #e8e8e8;
  color: #999;
  cursor: not-allowed;
}

/* 动画 */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
