import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/OpenClawwww/', // 配置GitHub Pages子路径
  plugins: [vue()],
  // 保留你原有其他配置
})
