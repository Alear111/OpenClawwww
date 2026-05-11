<template>
  <li 
    class="tree__item" 
    :class="{ 
      'tree__item--expanded': expanded,
      'tree__item--selected': selected
    }"
  >
    <div class="tree__node" @click="handleClick">
      <!-- 展开/折叠箭头 -->
      <span class="tree__toggle" v-if="hasChildren">{{ expanded ? '▼' : '▶' }}</span>
      <span class="tree__toggle" v-else></span>
      
      <!-- 文件夹图标 - 所有目录都用 -->
      <span class="tree__icon">📁</span>
      
      <!-- 文字 -->
      <span class="tree__text">{{ item.name }}</span>
      
      <!-- 更多操作按钮 -->
      <button class="tree__more" @click.stop>⋯</button>
    </div>
    
    <!-- 子节点 -->
    <ul class="tree__children" v-if="hasChildren && expanded">
      <TreeItem 
        v-for="child in item.children" 
        :key="child.id" 
        :item="child"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: Object,
  selectedId: Number
})

const emit = defineEmits(['select'])

// 默认展开有子节点的项
const expanded = ref(props.item.children && props.item.children.length > 0)

const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const selected = computed(() => props.selectedId === props.item.id)

const handleClick = (e) => {
  // 如果点击的是更多按钮，不处理
  if (e.target.classList.contains('tree__more')) return
  
  // 选中当前项
  emit('select', props.item.id)
  
  // 如果有子节点，切换展开/折叠
  if (hasChildren.value) {
    expanded.value = !expanded.value
  }
}
</script>
