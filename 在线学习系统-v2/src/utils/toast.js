/**
 * Toast 提示工具
 * 
 * 来源引用：
 * - requirement: feature_scope[1], feature_scope[4] (来自节点2)
 * - solution: S003, S005 (来自节点3)
 * - spec: toast (来自规范提取)
 */

/**
 * 显示 Toast 提示
 * @param {string} message - 提示消息
 * @param {number} duration - 显示时长（毫秒），默认2000ms
 */
export function showToast(message, duration = 2000) {
  // 检查是否已存在toast容器
  let container = document.getElementById('toast-container')
  
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `
    document.body.appendChild(container)
  }
  
  // 创建toast元素
  const toast = document.createElement('div')
  toast.className = 'toast-message'
  toast.textContent = message
  toast.style.cssText = `
    padding: 12px 20px;
    background-color: #333333;
    color: #ffffff;
    border-radius: 4px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: toast-fade-in 0.3s ease;
    white-space: nowrap;
  `
  
  // 添加动画样式
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style')
    style.id = 'toast-style'
    style.textContent = `
      @keyframes toast-fade-in {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes toast-fade-out {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
    `
    document.head.appendChild(style)
  }
  
  container.appendChild(toast)
  
  // 自动移除
  setTimeout(() => {
    toast.style.animation = 'toast-fade-out 0.3s ease forwards'
    setTimeout(() => {
      toast.remove()
      // 如果容器为空，移除容器
      if (container.children.length === 0) {
        container.remove()
      }
    }, 300)
  }, duration)
}

export default {
  showToast
}
