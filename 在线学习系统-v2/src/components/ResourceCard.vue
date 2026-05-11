<template>
  <div class="card" @click="$emit('click')">
    <!-- 缩略图 -->
    <div class="card__thumbnail">
      <!-- 类型标签 - 右上角 -->
      <span class="card__tag">{{ resource.type }}</span>
    </div>
    
    <!-- 内容区域 -->
    <div class="card__content">
      <!-- 标题 -->
      <div class="card__title" :title="resource.title">{{ resource.title }}</div>
      
      <!-- 标签摘要区域 - 横向可滚动 -->
      <div 
        class="card__tags-wrapper" 
        ref="tagsWrapper" 
        @mousedown="startDrag" 
        @click.stop
        v-if="allTags.length > 0"
      >
        <div class="card__tags">
          <span 
            v-for="(tagItem, index) in allTags" 
            :key="index"
            :class="['card__tag-item', `card__tag-item--${tagItem.type}`]"
            :title="tagItem.name"
            @click.stop
          >{{ tagItem.name }}</span>
        </div>
      </div>
      <span v-else class="card__tags-empty">暂无标签</span>
    </div>
    
    <!-- 底部：人名 + 操作按钮 -->
    <div class="card__footer">
      <span class="card__author">{{ resource.author }}</span>
      <div class="card__actions">
        <!-- 编辑按钮 - SVG图标 -->
        <button class="card__action-btn card__action-btn--edit" @click.stop title="编辑">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <!-- 删除按钮 - SVG图标 -->
        <button class="card__action-btn card__action-btn--delete" @click.stop title="删除">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  resource: Object
})

const emit = defineEmits(['click'])

const tagsWrapper = ref(null)

// 收集所有维度的标签（保留类型信息）
const allTags = computed(() => {
  const result = []
  const tagDimensions = ['department', 'disease', 'learnerType', 'topic', 'knowledge']
  
  if (props.resource.tags) {
    tagDimensions.forEach(dim => {
      if (props.resource.tags[dim] && props.resource.tags[dim].length > 0) {
        props.resource.tags[dim].forEach(tagName => {
          result.push({ name: tagName, type: dim })
        })
      }
    })
  }
  
  return result
})

// 拖拽滚动
let isDown = false
let startX = 0
let scrollLeft = 0

const startDrag = (e) => {
  if (!tagsWrapper.value) return
  isDown = true
  tagsWrapper.value.style.cursor = 'grabbing'
  startX = e.pageX - tagsWrapper.value.getBoundingClientRect().left
  scrollLeft = tagsWrapper.value.scrollLeft
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e) => {
  if (!isDown || !tagsWrapper.value) return
  e.preventDefault()
  const x = e.pageX - tagsWrapper.value.getBoundingClientRect().left
  const walk = (x - startX) * 2
  tagsWrapper.value.scrollLeft = scrollLeft - walk
}

const handleMouseUp = () => {
  isDown = false
  if (tagsWrapper.value) {
    tagsWrapper.value.style.cursor = 'grab'
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
</script>
