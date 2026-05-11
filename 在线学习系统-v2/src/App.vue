<template>
  <header class="header">
    <div class="header__left">
      <span class="header__title">复旦大学附属中山医院</span>
      <div class="header__menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav class="breadcrumb">
        <a href="#" class="breadcrumb__link">首页</a>
        <span class="breadcrumb__separator">/</span>
        <a href="#" class="breadcrumb__link">学习管理</a>
        <span class="breadcrumb__separator">/</span>
        <span class="breadcrumb__current">资源管理</span>
      </nav>
    </div>
    <div class="header__right">
      <div class="header__avatar"></div>
      <span class="header__username">ol_manager</span>
    </div>
  </header>

  <div class="layout">
    <Sidebar />
    <router-view />
  </div>
</template>

<script setup>
import Sidebar from './components/layout/Sidebar.vue'
</script>
