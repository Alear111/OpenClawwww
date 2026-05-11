<template>
  <Teleport to="body">
    <div v-if="visible" class="smart-panel-overlay">
      <div class="smart-panel" ref="panelRef">
        <!-- 浮窗头部 -->
        <div class="smart-panel__header">
          <span class="smart-panel__title">🤖 智能识别</span>
          <div class="smart-panel__actions">
            <button class="smart-panel__btn" @click="$emit('collapse')" title="收起">−</button>
            <button class="smart-panel__btn" @click="$emit('close')" title="关闭">×</button>
          </div>
        </div>
        <!-- 浮窗内容区 -->
        <div class="smart-panel__body" ref="panelBody">
          <div class="smart-panel__content" ref="contentArea">
            <!-- 欢迎提示 -->
            <div v-if="!isAnalyzing && stages.length === 0" class="smart-panel__welcome">
              <p>👆 点击"智能识别"按钮开始分析</p>
              <p class="smart-panel__hint">AI将自动识别资源信息并提取标签</p>
            </div>
            <!-- 分析阶段 -->
            <div 
              v-for="(stage, index) in stages" 
              :key="stage.id" 
              class="smart-stage"
              :class="{ 'smart-stage--confirmed': stage.confirmed }"
            >
              <div class="smart-stage__header">
                <span class="smart-stage__icon">{{ stage.icon }}</span>
                <span class="smart-stage__title">{{ stage.title }}</span>
                <span class="smart-stage__status" :class="getStatusClass(stage)">
                  {{ getStatusText(stage) }}
                </span>
              </div>
              <div class="smart-stage__content" :ref="el => stageContentRefs[stage.id] = el"></div>
              
              <!-- 封面选择器 -->
              <div v-if="stage.id === 'cover' && stage.status === 'waiting' && !stage.confirmed" class="smart-covers">
                <div 
                  v-for="(cover, cIndex) in coverSuggestions" 
                  :key="cIndex"
                  class="smart-cover-item"
                  :class="{ 'smart-cover-item--selected': cover.selected }"
                  @click="selectCover(cIndex)"
                >
                  <div class="smart-cover-item__placeholder">{{ cover.name }}</div>
                  <div class="smart-cover-item__overlay">点击选择</div>
                </div>
              </div>
              
              <!-- 阶段操作按钮 -->
              <div v-if="stage.status === 'waiting' && !stage.confirmed" class="smart-stage__actions">
                <button 
                  class="button button--sm"
                  :class="stage.confirmed ? 'button--secondary' : 'button--primary'"
                  :disabled="stage.confirmed"
                  @click="confirmStage(index)"
                >
                  {{ stage.confirmed ? '已确认' : '确认' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  visible: Boolean,
  isAnalyzing: Boolean
})

const emit = defineEmits(['close', 'collapse', 'confirm', 'update:formData'])

// DOM引用
const panelRef = ref(null)
const panelBody = ref(null)
const contentArea = ref(null)
const stageContentRefs = {}

// 封面建议
const coverSuggestions = ref([
  { id: 1, name: '封面1', selected: true },
  { id: 2, name: '封面2', selected: false },
  { id: 3, name: '封面3', selected: false },
  { id: 4, name: '封面4', selected: false },
  { id: 5, name: '封面5', selected: false }
])

// 分析阶段数据
const stages = ref([])

// 打字机定时器
let typingTimers = []

// 分析阶段配置
const analysisStages = [
  { id: 'basic', title: '基础设置分析', icon: '📝', duration: 1500 },
  { id: 'cover', title: '封面选择建议', icon: '🖼️', duration: 1000 },
  { id: 'tags', title: '标签智能分析', icon: '🏷️', duration: 2000 }
]

// 生成流式输出文本（与原版完全一致）
const generateStreamingText = (stageId) => {
  switch (stageId) {
    case 'basic':
      return `正在分析文件内容...

✓ 资源类型：视频课程
✓ 资源名称：《呼吸机相关肺炎的预防与控制》
✓ 讲师：张明
✓ 院外讲师：暂未识别
✓ 简介：本课程讲解呼吸机相关肺炎的定义、风险因素、预防措施和护理要点。

基础设置已填充完成！`

    case 'cover':
      return `正在分析视频画面...

✓ 检测到5个关键画面帧
✓ 推荐以下封面选择方案

请从以下建议中选择或上传自定义封面`

    case 'tags':
      return `正在进行标签智能分析...

🏥 科室标签
   • 核心标签：呼吸内科 (95% 置信度)
     依据：视频内容涉及呼吸机操作、肺炎诊断与治疗
   • 关联标签：重症医学科
     依据：呼吸机相关肺炎常发生于ICU患者
   ✗ 排除标签：心内科
     依据：未涉及心血管系统相关内容

🦠 病种标签
   • 核心标签：呼吸机相关肺炎 (98% 置信度)
     依据：课程标题明确提及，内容主体围绕该疾病展开
   • 关联标签：医院获得性肺炎
     依据：VAP属于医院获得性肺炎的特殊类型
   ✗ 排除标签：社区获得性肺炎
     依据：课程内容专注于医院内感染

👨‍⚕️ 学员类型
   • 核心标签：住院医师 (90% 置信度)
     依据：课程深度适合住院医师规范化培训要求
   • 关联标签：护理人员
     依据：课程包含护理要点章节
   ✗ 排除标签：实习生
     依据：内容深度超出实习生基础培训范围

📚 课程主题
   • 核心标签：医院感染防控 (92% 置信度)
     依据：课程核心内容为医院内感染的预防与控制
   • 关联标签：呼吸支持技术
     依据：涉及呼吸机使用相关技术要点
   ✗ 排除标签：外科手术
     依据：不涉及外科手术相关内容

📌 知识点
   • 呼吸机相关肺炎定义
     依据：课程开篇明确定义概念
   • 危险因素识别
     依据：详细讲解VAP的危险因素评估
   • 预防措施
     依据：课程核心章节
   • 护理要点
     依据：专设护理要点章节
   ✗ 排除：药物治疗方案
     依据：未涉及具体药物使用

标签分析已完成！`
    
    default:
      return ''
  }
}

// 更新面板位置（与原版一致，使用DOM操作）
const updatePanelPosition = () => {
  nextTick(() => {
    // 延迟一帧确保DOM完全渲染
    requestAnimationFrame(() => {
      const uploadModal = document.querySelector('.modal--upload')
      if (uploadModal && panelRef.value) {
        const modalRect = uploadModal.getBoundingClientRect()
        const panel = panelRef.value
        
        console.log('面板定位 - 上传弹窗尺寸:', modalRect.width, 'x', modalRect.height)
        console.log('面板定位 - 上传弹窗位置:', modalRect.left, modalRect.top, modalRect.right, modalRect.bottom)
        
        // 与原版完全一致的位置计算
        panel.style.left = `${modalRect.right + 20}px`
        panel.style.top = `${modalRect.top}px`
        panel.style.height = `${modalRect.height}px`
        panel.style.right = 'auto'
        panel.style.transform = 'none'
        
        console.log('面板定位 - 面板位置:', panel.style.left, panel.style.top)
        console.log('面板定位 - 面板高度:', panel.style.height)
      } else {
        console.log('面板定位失败 - uploadModal:', uploadModal, 'panelRef:', panelRef.value)
      }
    })
  })
}

// 监听visible变化，更新位置
watch(() => props.visible, (newVal) => {
  if (newVal) {
    updatePanelPosition()
    // 再次延迟更新，确保位置正确
    setTimeout(() => updatePanelPosition(), 100)
  }
})

// 开始分析
const startAnalysis = () => {
  stages.value = []
  // 清除之前的定时器
  typingTimers.forEach(timer => clearTimeout(timer))
  typingTimers = []
  
  runStage(0)
}

// 打字机效果
const typewriterEffect = (element, text, callback) => {
  let index = 0
  const speed = 15 // 每字符间隔毫秒（与原版一致）
  
  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index)
      index++
      
      // 滚动到内容区域底部
      if (panelBody.value) {
        panelBody.value.scrollTop = panelBody.value.scrollHeight
      }
      
      const timer = setTimeout(type, speed)
      typingTimers.push(timer)
    } else {
      if (callback) callback()
    }
  }
  
  type()
}

// 执行单个阶段（与原版一致）
const runStage = (stageIndex) => {
  if (stageIndex >= analysisStages.length) {
    // 所有阶段完成
    emit('update:formData', {
      resourceName: '《呼吸机相关肺炎的预防与控制》',
      lecturer: '张明',
      intro: '本课程讲解呼吸机相关肺炎的定义、风险因素、预防措施和护理要点。',
      tags: {
        department: ['呼吸内科', '重症医学科'],
        disease: ['呼吸机相关肺炎', '医院获得性肺炎'],
        learnerType: ['住院医师', '护理人员'],
        topic: ['医院感染防控', '呼吸支持技术'],
        knowledge: ['呼吸机相关肺炎定义', '危险因素识别', '预防措施', '护理要点']
      }
    })
    return
  }

  const stageConfig = analysisStages[stageIndex]
  const newStage = {
    id: stageConfig.id,
    title: stageConfig.title,
    icon: stageConfig.icon,
    status: 'analyzing',
    confirmed: false
  }
  
  stages.value.push(newStage)
  
  // 等待DOM更新
  nextTick(() => {
    const contentEl = stageContentRefs[stageConfig.id]
    if (!contentEl) return
    
    const fullText = generateStreamingText(stageConfig.id)
    
    typewriterEffect(contentEl, fullText, () => {
      // 完成打字效果后
      stages.value[stageIndex].status = 'waiting'
      
      // 如果是基础设置阶段，替换为带编辑按钮的内容（与原版一致）
      if (stageConfig.id === 'basic') {
        setTimeout(() => {
          renderBasicEditableContent(contentEl)
        }, 200)
      }
    })
  })
}

// 渲染基础设置的可编辑内容（与原版一致）
const renderBasicEditableContent = (contentEl) => {
  const editableFields = [
    { field: 'resourceName', label: '✓ 资源名称：', value: '《呼吸机相关肺炎的预防与控制》' },
    { field: 'lecturer', label: '✓ 讲师：', value: '张明' },
    { field: 'externalLecturer', label: '✓ 院外讲师：', value: '暂未识别' },
    { field: 'intro', label: '✓ 简介：', value: '本课程讲解呼吸机相关肺炎的定义、风险因素、预防措施和护理要点。' }
  ]
  
  contentEl.innerHTML = ''
  
  const introText = document.createElement('span')
  introText.className = 'smart-basic-intro'
  introText.textContent = '正在分析文件内容...\n\n✓ 资源类型：视频课程\n'
  contentEl.appendChild(introText)

  editableFields.forEach((field, index) => {
    const item = document.createElement('span')
    item.className = 'smart-basic-item'
    if (field.field === 'intro') {
      item.classList.add('smart-basic-item--full')
    }

    const value = document.createElement('span')
    value.className = 'smart-basic-value'
    value.dataset.field = field.field
    value.textContent = `${field.label}${field.value}`

    const editBtn = document.createElement('button')
    editBtn.className = 'smart-basic-edit'
    editBtn.dataset.field = field.field
    editBtn.title = '编辑'
    editBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`

    item.appendChild(value)
    item.appendChild(editBtn)
    contentEl.appendChild(item)

    if (index < editableFields.length - 1) {
      const br = document.createElement('br')
      contentEl.appendChild(br)
    }
  })

  const outroText = document.createElement('span')
  outroText.className = 'smart-basic-outro'
  outroText.textContent = '\n\n基础设置已填充完成！'
  contentEl.appendChild(outroText)
  
  // 绑定编辑按钮事件（与原版一致，在DOM创建完成后绑定）
  contentEl.querySelectorAll('.smart-basic-edit').forEach(btn => {
    btn.addEventListener('click', (e) => editBasicSetting(e.currentTarget))
  })
}

// 编辑基础设置（与原版一致）
const editBasicSetting = (btn) => {
  console.log('编辑按钮被点击', btn)
  const field = btn.dataset.field
  console.log('字段:', field)
  const valueSpan = btn.parentElement.querySelector('.smart-basic-value')
  console.log('valueSpan:', valueSpan)
  const currentText = valueSpan.textContent
  console.log('当前文本:', currentText)
  
  // 提取实际值（去掉前面的"✓ XXX："部分）
  const colonIndex = currentText.indexOf('：')
  let prefix = ''
  let currentValue = currentText
  
  if (colonIndex !== -1) {
    prefix = currentText.substring(0, colonIndex + 1)
    currentValue = currentText.substring(colonIndex + 1).trim()
  }
  
  // 隐藏编辑按钮
  btn.style.display = 'none'
  
  // 设置文本为可编辑
  valueSpan.contentEditable = true
  valueSpan.classList.add('smart-basic-value--editing')
  valueSpan.textContent = prefix + currentValue
  
  // 选中文本的可编辑部分
  const range = document.createRange()
  const selection = window.getSelection()
  
  // 将光标移动到文本末尾
  range.selectNodeContents(valueSpan)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
  
  // 按Enter键确认
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      confirmEdit()
    }
  }
  
  // 按Esc键取消
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      cancelEdit()
    }
  }
  
  // 失去焦点确认
  const handleBlur = () => {
    confirmEdit()
  }
  
  // 确认编辑
  const confirmEdit = () => {
    const newText = valueSpan.textContent.trim()
    
    // 恢复显示
    valueSpan.contentEditable = false
    valueSpan.classList.remove('smart-basic-value--editing')
    valueSpan.textContent = newText
    btn.style.display = ''
    
    // 移除事件监听
    valueSpan.removeEventListener('keydown', handleEnter)
    valueSpan.removeEventListener('keydown', handleEsc)
    valueSpan.removeEventListener('blur', handleBlur)
  }
  
  // 取消编辑
  const cancelEdit = () => {
    // 恢复显示
    valueSpan.contentEditable = false
    valueSpan.classList.remove('smart-basic-value--editing')
    valueSpan.textContent = currentText
    btn.style.display = ''
    
    // 移除事件监听
    valueSpan.removeEventListener('keydown', handleEnter)
    valueSpan.removeEventListener('keydown', handleEsc)
    valueSpan.removeEventListener('blur', handleBlur)
  }
  
  // 添加事件监听
  valueSpan.addEventListener('keydown', handleEnter)
  valueSpan.addEventListener('keydown', handleEsc)
  valueSpan.addEventListener('blur', handleBlur)
  
  // 聚焦
  valueSpan.focus()
}

// 选择封面
const selectCover = (index) => {
  coverSuggestions.value.forEach((cover, i) => {
    cover.selected = i === index
  })
}

// 确认阶段
const confirmStage = (index) => {
  stages.value[index].confirmed = true
  stages.value[index].status = 'complete'
  
  // 根据阶段填充表单
  if (stages.value[index].id === 'basic') {
    emit('update:formData', {
      resourceName: '《呼吸机相关肺炎的预防与控制》',
      lecturer: '张明',
      intro: '本课程讲解呼吸机相关肺炎的定义、风险因素、预防措施和护理要点。'
    })
  }
  
  // 继续下一阶段
  setTimeout(() => {
    runStage(index + 1)
  }, 500)
}

// 获取状态样式
const getStatusClass = (stage) => {
  if (stage.confirmed) return 'smart-stage__status--complete'
  if (stage.status === 'analyzing') return ''
  return 'smart-stage__status--waiting'
}

// 获取状态文本
const getStatusText = (stage) => {
  if (stage.confirmed) return '已确认'
  if (stage.status === 'analyzing') return '分析中...'
  return '等待确认'
}

// 暴露方法给父组件
defineExpose({ startAnalysis })

// 重置
watch(() => props.visible, (val) => {
  if (!val) {
    stages.value = []
    typingTimers.forEach(timer => clearTimeout(timer))
    typingTimers = []
  }
})
</script>

<style scoped>
/* 封面选择器 */
.smart-covers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 0 12px;
}

.smart-cover-item {
  width: 60px;
  height: 45px;
  border-radius: 4px;
  border: 2px solid #e0e0e0;
  background: #f5f5f5;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.smart-cover-item:hover {
  border-color: #c41230;
}

.smart-cover-item--selected {
  border-color: #c41230;
  box-shadow: 0 0 0 2px rgba(196, 18, 48, 0.2);
}

.smart-cover-item__placeholder {
  color: #999;
  font-size: 12px;
}

.smart-cover-item__overlay {
  position: absolute;
  inset: 0;
  background: rgba(196, 18, 48, 0.8);
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.smart-cover-item:hover .smart-cover-item__overlay {
  opacity: 1;
}

.smart-cover-item--selected .smart-cover-item__overlay {
  opacity: 1;
  background: rgba(196, 18, 48, 0.9);
}

/* 基础设置可编辑项 */
:deep(.smart-basic-item) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.smart-basic-value) {
  color: #333;
}

:deep(.smart-basic-edit) {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.smart-basic-edit:hover) {
  color: #c41230;
}
</style>
