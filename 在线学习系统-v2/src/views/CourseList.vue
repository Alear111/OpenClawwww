<template>
  <main class="main-content">
    <div class="course-list-page">
    <!-- 手机预览框外壳 -->
    <div class="phone-preview">
      <div class="phone-preview__screen">
        <!-- iPhone状态栏 -->
        <div class="phone-status-bar">
          <span class="phone-status-bar__time">9:41</span>
          <div class="phone-status-bar__icons">
            <!-- 信号图标 -->
            <svg class="phone-status-bar__icon" viewBox="0 0 24 24" fill="#ffffff">
              <rect x="2" y="16" width="4" height="6" rx="1"/>
              <rect x="8" y="12" width="4" height="10" rx="1"/>
              <rect x="14" y="8" width="4" height="14" rx="1"/>
              <rect x="20" y="4" width="4" height="18" rx="1"/>
            </svg>
            <!-- WiFi图标 -->
            <svg class="phone-status-bar__icon" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              <path d="M12 14c.83 0 1.5.67 1.5 1.5S12.83 17 12 17s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
              <path d="M12 13c-1.93 0-3.68.78-4.95 2.05l1.41 1.41c1.02-1.02 2.51-1.67 4.04-1.67 1.53 0 2.99.65 4.01 1.65l1.44-1.44C15.65 13.76 13.93 13 12 13z"/>
            </svg>
            <!-- 电量图标 -->
            <svg class="phone-status-bar__icon" viewBox="0 0 24 24" fill="#ffffff">
              <rect x="2" y="7" width="18" height="10" rx="2" stroke="#ffffff" stroke-width="2" fill="none"/>
              <rect x="20" y="10" width="3" height="4" rx="1" fill="#ffffff"/>
              <rect x="4" y="9" width="12" height="6" rx="1" fill="#ffffff"/>
            </svg>
          </div>
        </div>

        <!-- 页面标题栏 - 固定不滚动 -->
        <div class="course-list-content__header">
          <h1 class="course-list-content__title">课程列表</h1>
        </div>

        <!-- 搜索栏 + 筛选按钮并排 - 固定不滚动 -->
        <div class="course-search-bar">
          <div class="course-search-bar__input-wrapper">
            <svg class="course-search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              class="course-search-bar__input" 
              placeholder="搜索课程名称"
              v-model="searchKeyword"
              @input="handleSearch"
            />
          </div>
          <button 
            class="course-search-bar__filter-btn" 
            :class="{ 'course-search-bar__filter-btn--active': filterExpanded }" 
            @click="toggleFilter"
            title="筛选"
          >
            <svg class="course-search-bar__filter-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 4h18l-6 9v7l-4 2V13L3 4z"/>
            </svg>
          </button>
        </div>

        <!-- 课程列表内容区域（仅此区域可滚动） -->
        <div class="course-list-content">
          <!-- 课程卡片网格 -->
          <div class="course-card-grid" v-if="filteredCourses.length > 0">
            <div 
              v-for="course in filteredCourses" 
              :key="course.id" 
              class="course-card"
            >
              <!-- 封面图占位 -->
              <div class="course-card__cover-placeholder" :style="{ background: course.coverGradient }">
                {{ course.coverEmoji }}
              </div>
              <div class="course-card__body">
                <h3 class="course-card__title">{{ course.title }}</h3>
                <div 
                  class="course-card__tags"
                  @mousedown="startTagDrag($event)"
                >
                  <span class="course-tag course-tag--pink">{{ course.tags.department }}</span>
                  <span class="course-tag course-tag--blue">{{ course.tags.learnerType }}</span>
                  <span class="course-tag course-tag--green">{{ course.tags.topic }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div class="course-list-empty" v-else>
            <span class="course-list-empty__icon">📚</span>
            <span class="course-list-empty__text">暂无符合条件的课程</span>
          </div>
        </div>

        <!-- 筛选蒙版覆盖层 -->
        <Transition name="filter-overlay">
          <div class="filter-overlay" v-if="filterExpanded" @click.self="closeFilter">
            <div class="filter-overlay__panel" @click.stop>
              <!-- 科室维度 -->
              <div class="filter-section__row">
                <span class="filter-section__label">科室</span>
                <div class="filter-section__tags">
                  <span 
                    v-for="tag in filterOptions.department" 
                    :key="tag"
                    class="filter-tag"
                    :class="tempSelectedFilters.department.includes(tag) ? 'filter-tag--active' : 'filter-tag--default'"
                    @click="toggleFilterTag('department', tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 病种维度 -->
              <div class="filter-section__row">
                <span class="filter-section__label">病种</span>
                <div class="filter-section__tags">
                  <span 
                    v-for="tag in filterOptions.disease" 
                    :key="tag"
                    class="filter-tag"
                    :class="tempSelectedFilters.disease.includes(tag) ? 'filter-tag--active' : 'filter-tag--default'"
                    @click="toggleFilterTag('disease', tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 学员类型维度 -->
              <div class="filter-section__row">
                <span class="filter-section__label">学员类型</span>
                <div class="filter-section__tags">
                  <span 
                    v-for="tag in filterOptions.learnerType" 
                    :key="tag"
                    class="filter-tag"
                    :class="tempSelectedFilters.learnerType.includes(tag) ? 'filter-tag--active' : 'filter-tag--default'"
                    @click="toggleFilterTag('learnerType', tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 主题维度 -->
              <div class="filter-section__row">
                <span class="filter-section__label">主题</span>
                <div class="filter-section__tags">
                  <span 
                    v-for="tag in filterOptions.topic" 
                    :key="tag"
                    class="filter-tag"
                    :class="tempSelectedFilters.topic.includes(tag) ? 'filter-tag--active' : 'filter-tag--default'"
                    @click="toggleFilterTag('topic', tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 知识点维度 -->
              <div class="filter-section__row">
                <span class="filter-section__label">知识点</span>
                <div class="filter-section__tags">
                  <span 
                    v-for="tag in filterOptions.knowledge" 
                    :key="tag"
                    class="filter-tag"
                    :class="tempSelectedFilters.knowledge.includes(tag) ? 'filter-tag--active' : 'filter-tag--default'"
                    @click="toggleFilterTag('knowledge', tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="filter-section__actions">
                <button class="filter-section__btn filter-section__btn--reset" @click="resetFilters">重置</button>
                <button class="filter-section__btn filter-section__btn--confirm" @click="confirmFilters">确定</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- iPhone Home指示条 -->
      <div class="phone-home-indicator">
        <div class="phone-home-indicator__bar"></div>
      </div>
    </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockCourses, filterOptions } from '../data/courseListData.js'

// 搜索关键词
const searchKeyword = ref('')

// 筛选区展开状态
const filterExpanded = ref(false)

// 临时选中的筛选标签（确认后才生效）
const tempSelectedFilters = ref({
  department: [],
  disease: [],
  learnerType: [],
  topic: [],
  knowledge: []
})

// 已确认的筛选标签
const selectedFilters = ref({
  department: [],
  disease: [],
  learnerType: [],
  topic: [],
  knowledge: []
})

// 过滤后的课程
const filteredCourses = computed(() => {
  let result = mockCourses

  // 按关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(course => 
      course.title.toLowerCase().includes(keyword)
    )
  }

  // 按筛选条件过滤
  Object.keys(selectedFilters.value).forEach(key => {
    if (selectedFilters.value[key].length > 0) {
      result = result.filter(course => 
        selectedFilters.value[key].includes(course.tags[key])
      )
    }
  })

  return result
})

// 切换筛选区展开/收起
const toggleFilter = () => {
  filterExpanded.value = !filterExpanded.value
  // 展开时复制当前选中状态到临时状态
  if (filterExpanded.value) {
    tempSelectedFilters.value = JSON.parse(JSON.stringify(selectedFilters.value))
  }
}

// 关闭筛选蒙版
const closeFilter = () => {
  filterExpanded.value = false
}

// 切换筛选标签
const toggleFilterTag = (dimension, tag) => {
  const index = tempSelectedFilters.value[dimension].indexOf(tag)
  if (index > -1) {
    tempSelectedFilters.value[dimension].splice(index, 1)
  } else {
    tempSelectedFilters.value[dimension].push(tag)
  }
}

// 重置筛选
const resetFilters = () => {
  tempSelectedFilters.value = {
    department: [],
    disease: [],
    learnerType: [],
    topic: [],
    knowledge: []
  }
}

// 确认筛选
const confirmFilters = () => {
  selectedFilters.value = JSON.parse(JSON.stringify(tempSelectedFilters.value))
  filterExpanded.value = false
}

// 搜索处理
const handleSearch = () => {
  // 搜索是实时过滤的，这里不需要额外处理
}

// 课程卡片标签拖拽滚动（复用ResourceCard.vue逻辑）
const startTagDrag = (e) => {
  const el = e.currentTarget
  el.style.cursor = 'grabbing'
  const startX = e.pageX - el.getBoundingClientRect().left
  const scrollLeft = el.scrollLeft

  const handleMouseMove = (moveEvent) => {
    moveEvent.preventDefault()
    const x = moveEvent.pageX - el.getBoundingClientRect().left
    const walk = (x - startX) * 2
    el.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    el.style.cursor = 'grab'
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
</style>
