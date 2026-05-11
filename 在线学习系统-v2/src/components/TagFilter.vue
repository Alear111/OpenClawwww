<template>
  <div class="filter-group" :class="{ 'filter-group--open': isOpen }">
    <div class="filter-group__select-wrapper">
      <div class="filter-group__trigger" @click="toggleDropdown">
        <span class="filter-group__label">{{ label }}</span>
        <span v-if="selectedItems.length > 0">({{ selectedItems.length }})</span>
      </div>
      <div class="filter-group__dropdown" v-show="isOpen">
        <div 
          v-for="opt in options" 
          :key="opt" 
          class="filter-group__option"
          :class="{ 'filter-group__option--selected': isSelected(opt) }"
          @click="toggleItem(opt)"
        >
          <span class="filter-group__option-checkbox">
            <span v-if="isSelected(opt)">✓</span>
          </span>
          {{ opt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  label: String,
  options: Array,
  modelValue: Array
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedItems = computed(() => props.modelValue || [])

const isSelected = (item) => {
  return selectedItems.value.includes(item)
}

const toggleItem = (item) => {
  const newValue = [...selectedItems.value]
  const index = newValue.indexOf(item)
  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(item)
  }
  emit('update:modelValue', newValue)
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 点击外部关闭下拉
const handleClickOutside = (e) => {
  if (!e.target.closest('.filter-group')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
