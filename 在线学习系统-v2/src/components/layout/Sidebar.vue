<template>
  <nav class="sidebar">
    <ul class="sidebar__menu">
      <li class="sidebar__item">
        <button class="sidebar__link">
          <span class="sidebar__icon">👥</span>
          <span class="sidebar__text">人员管理</span>
          <span class="sidebar__arrow">▼</span>
        </button>
      </li>
      <li class="sidebar__item" :class="{ 'sidebar__item--expanded': expandedSet.has('learn') }">
        <button class="sidebar__link sidebar__link--has-children" @click="toggle('learn')">
          <span class="sidebar__icon">📚</span>
          <span class="sidebar__text">学习管理</span>
          <span class="sidebar__arrow">▼</span>
        </button>
        <ul class="sidebar__submenu">
          <li class="sidebar__subitem"><a href="#" class="sidebar__sublink">课程管理</a></li>
          <li class="sidebar__subitem"><a href="#" class="sidebar__sublink">审批管理</a></li>
          <li class="sidebar__subitem">
            <router-link to="/resource" class="sidebar__sublink" :class="{ 'sidebar__sublink--active': $route.path === '/resource' }">资源管理</router-link>
          </li>
        </ul>
      </li>
      <li class="sidebar__item" :class="{ 'sidebar__item--expanded': expandedSet.has('system') }">
        <button class="sidebar__link sidebar__link--has-children" @click="toggle('system')">
          <span class="sidebar__icon">⚙️</span>
          <span class="sidebar__text">系统管理</span>
          <span class="sidebar__arrow">▼</span>
        </button>
        <ul class="sidebar__submenu">
          <li class="sidebar__subitem">
            <router-link to="/usage-statistics" class="sidebar__sublink" :class="{ 'sidebar__sublink--active': $route.path === '/usage-statistics' }">用量统计</router-link>
          </li>
        </ul>
      </li>
      <li class="sidebar__item">
        <button class="sidebar__link"><span class="sidebar__icon">🔧</span><span class="sidebar__text">系统工具</span><span class="sidebar__arrow">▼</span></button>
      </li>
      <li class="sidebar__item">
        <button class="sidebar__link"><span class="sidebar__icon">📝</span><span class="sidebar__text">考试管理</span><span class="sidebar__arrow">▼</span></button>
      </li>
      <li class="sidebar__item">
        <button class="sidebar__link"><span class="sidebar__icon">📊</span><span class="sidebar__text">统计分析</span><span class="sidebar__arrow">▼</span></button>
      </li>
    </ul>
    <!-- 侧边栏底部区域 - 课程列表入口 -->
    <footer class="sidebar__footer">
      <router-link to="/course-list" class="sidebar__footer-btn" :class="{ 'sidebar__footer-btn--active': $route.path === '/course-list' }">
        <span class="sidebar__footer-icon">📱</span>
        <span class="sidebar__footer-text">课程列表入口</span>
      </router-link>
    </footer>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const expandedSet = ref(new Set(['learn']))

const toggle = (key) => {
  if (expandedSet.value.has(key)) {
    expandedSet.value.delete(key)
  } else {
    expandedSet.value.add(key)
  }
  // 触发响应式更新
  expandedSet.value = new Set(expandedSet.value)
}
</script>
