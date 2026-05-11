import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import ResourceManagement from './views/ResourceManagement.vue'
import UsageStatistics from './views/UsageStatistics.vue'
import CourseList from './views/CourseList.vue'

// 导入样式
import './styles/variables.css'
import './styles/main.css'
import './styles/components/button.css'
import './styles/components/input.css'
import './styles/components/sidebar.css'
import './styles/components/tree.css'
import './styles/components/card.css'
import './styles/components/pagination.css'
import './styles/components/modal.css'
import './styles/pages/resource-management.css'
import './styles/pages/usage-statistics.css'
import './styles/pages/course-list.css'

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/resource' },
    { path: '/resource', component: ResourceManagement },
    { path: '/usage-statistics', component: UsageStatistics },
    { path: '/course-list', component: CourseList }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
