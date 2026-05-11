<template>
  <aside class="directory-panel">
    <div class="directory-panel__header">
      <input 
        type="text" 
        class="input input--search" 
        placeholder="请输目录名称" 
        v-model="searchQuery"
      />
      <button class="button button--primary button--sm" @click="$emit('add-directory')">+ 新增目录</button>
    </div>
    <div class="directory-panel__content">
      <Tree :data="filteredData" @select="handleSelect" />
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tree from './Tree.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'add-directory'])

const searchQuery = ref('')

const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  return filterTree(props.data, searchQuery.value)
})

function filterTree(items, query) {
  const result = []
  items.forEach(item => {
    if (item.name.includes(query)) {
      result.push(item)
    } else if (item.children && item.children.length > 0) {
      const filteredChildren = filterTree(item.children, query)
      if (filteredChildren.length > 0) {
        result.push({ ...item, children: filteredChildren })
      }
    }
  })
  return result
}

function handleSelect(item) {
  emit('select', item)
}
</script>

<style scoped>
.directory-panel { 
  width: var(--directory-panel-width); 
  min-width: var(--directory-panel-width);
  background-color: var(--color-bg-white); 
  border-right: 1px solid var(--color-border); 
  display: flex; 
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.directory-panel__header { 
  padding: var(--spacing-md); 
  display: flex; 
  gap: var(--spacing-sm); 
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
}

.directory-panel__content { 
  flex: 1; 
  overflow-y: auto; 
  padding: var(--spacing-sm) 0;
}
</style>
