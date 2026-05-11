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
</template>

<script setup>
</script>

<style scoped>
.header { 
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  height: var(--header-height); 
  padding: 0 var(--spacing-lg); 
  background-color: var(--color-bg-white); 
  border-bottom: 1px solid var(--color-border);
}

.header__left { 
  display: flex; 
  align-items: center; 
  gap: var(--spacing-md);
}

.header__title { 
  font-size: var(--font-size-lg); 
  font-weight: 500; 
  color: var(--color-text-primary); 
}

.header__menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 16px;
  height: 16px;
}

.header__menu-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-text-primary);
}

.header__right { 
  display: flex; 
  align-items: center; 
  gap: var(--spacing-sm); 
}

.header__avatar { 
  width: 28px; 
  height: 28px; 
  border-radius: 50%; 
  background-color: var(--color-brand-primary); 
}

.header__username { 
  font-size: var(--font-size-sm); 
  color: var(--color-text-primary); 
}

.breadcrumb { 
  display: flex; 
  align-items: center; 
  font-size: var(--font-size-sm); 
}

.breadcrumb__link { color: var(--color-text-secondary); }
.breadcrumb__link:hover { color: var(--color-brand-primary); text-decoration: none; }
.breadcrumb__separator { margin: 0 var(--spacing-xs); color: var(--color-text-light); }
.breadcrumb__current { color: var(--color-text-primary); }
</style>
