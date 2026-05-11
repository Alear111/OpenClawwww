<template>
  <ul class="tree">
    <TreeItem 
      v-for="item in data" 
      :key="item.id" 
      :item="item" 
      @select="$emit('select', $event)"
    />
  </ul>
</template>

<script setup>
import TreeItem from './TreeItem.vue'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select'])
</script>

<style scoped>
.tree { font-size: var(--font-size-sm); }
</style>
