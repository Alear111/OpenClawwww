<template>
  <Teleport to="body">
    <div 
      class="smart-result-modal-overlay" 
      :class="{ 'smart-result-modal-overlay--active': visible }"
      @click.self="$emit('close')"
    >
      <div class="smart-result-modal">
        <div class="smart-result-modal__header">
          <h3 class="smart-result-modal__title">智能分析结果</h3>
          <button class="smart-result-modal__close" @click.stop="$emit('close')">&times;</button>
        </div>
        
        <div class="smart-result-modal__body">
          <!-- Part 1: Uploaded Files -->
          <div class="result-section result-section--files">
            <div class="result-section__header">
              <span class="result-section__title">上传课件</span>
            </div>
            <div class="result-section__content">
              <div 
                v-for="(file, index) in fileList" 
                :key="index"
                class="file-card"
                :class="{ 
                  'file-card--active': currentFileIndex === index,
                  'file-card--completed': file.status === 'completed'
                }"
                @click="switchFile(index)"
              >
                <div class="file-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <div class="file-card__info">
                  <div class="file-card__name">{{ truncateFileName(file.name) }}</div>
                  <div class="file-card__size">{{ formatFileSize(file.size) }}</div>
                </div>
                <div class="file-card__status" :class="'file-card__status--' + (file.status || 'pending')">
                  <template v-if="file.status === 'completed'">✓</template>
                  <template v-else-if="file.status === 'analyzing'">...</template>
                  <template v-else>○</template>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Part 2: Resource Form -->
          <div class="result-section result-section--form">
            <div class="result-section__header">
              <span class="result-section__title">资源信息</span>
            </div>
            <div class="result-section__content result-section__content--scroll">
              <!-- Basic Settings -->
              <div class="form-section">
                <h4 class="form-section__title">基础设置</h4>
                <div class="form-group">
                  <label class="form-label form-label--required">资源名称</label>
                  <input 
                    type="text" 
                    class="input input--full" 
                    v-model="formData.resourceName"
                    placeholder="请输入资源名称" 
                    maxlength="200"
                  >
                  <span class="form-hint">{{ formData.resourceName.length }}/200</span>
                </div>
                <div class="form-group">
                  <label class="form-label">讲师</label>
                  <input 
                    type="text" 
                    class="input input--full" 
                    v-model="formData.lecturer"
                    placeholder="请输入讲师"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">院外讲师</label>
                  <input 
                    type="text" 
                    class="input input--full" 
                    v-model="formData.externalLecturer"
                    placeholder="请输入院外讲师"
                  >
                </div>
                <div class="form-group">
                  <label class="form-label">简介</label>
                  <textarea 
                    class="input input--textarea" 
                    v-model="formData.intro"
                    placeholder="请输入简介" 
                    maxlength="500"
                  ></textarea>
                  <span class="form-hint">{{ formData.intro.length }}/500</span>
                </div>
                <div class="form-group">
                  <label class="form-label">封面</label>
                  <div class="cover-upload" @click="triggerCoverUpload">
                    <div class="cover-upload__preview" v-if="formData.coverUrl">
                      <img :src="formData.coverUrl" alt="封面">
                      <button class="cover-upload__remove" @click.stop="formData.coverUrl = ''">×</button>
                    </div>
                    <div class="cover-upload__placeholder" v-else>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>点击上传封面</span>
                    </div>
                    <input type="file" ref="coverInputRef" style="display:none" accept="image/*" @change="handleCoverUpload">
                  </div>
                </div>
              </div>

              <!-- Tag Info -->
              <div class="form-section">
                <h4 class="form-section__title">标签信息</h4>
                <div class="tag-dimension">
                  <div class="tag-dimension__header">
                    <span class="tag-dimension__label">科室</span>
                    <button class="tag-dimension__add-btn" @click="addTag('department', $event)">+</button>
                  </div>
                  <div class="tag-dimension__content">
                    <span 
                      v-for="tag in formData.tags.department" 
                      :key="tag"
                      class="tag tag--core"
                    >
                      {{ tag }}
                      <button class="tag__delete" @click="removeTag('department', tag)">×</button>
                    </span>
                    <span v-if="formData.tags.department.length === 0" class="tag tag--placeholder">点击上方+添加标签</span>
                  </div>
                </div>
                
                <div class="tag-dimension">
                  <div class="tag-dimension__header">
                    <span class="tag-dimension__label">病种</span>
                    <button class="tag-dimension__add-btn" @click="addTag('disease', $event)">+</button>
                  </div>
                  <div class="tag-dimension__content">
                    <span 
                      v-for="tag in formData.tags.disease" 
                      :key="tag"
                      class="tag tag--core"
                    >
                      {{ tag }}
                      <button class="tag__delete" @click="removeTag('disease', tag)">×</button>
                    </span>
                    <span v-if="formData.tags.disease.length === 0" class="tag tag--placeholder">点击上方+添加标签</span>
                  </div>
                </div>
                
                <div class="tag-dimension">
                  <div class="tag-dimension__header">
                    <span class="tag-dimension__label">学员类型</span>
                    <button class="tag-dimension__add-btn" @click="addTag('learnerType', $event)">+</button>
                  </div>
                  <div class="tag-dimension__content">
                    <span 
                      v-for="tag in formData.tags.learnerType" 
                      :key="tag"
                      class="tag tag--core"
                    >
                      {{ tag }}
                      <button class="tag__delete" @click="removeTag('learnerType', tag)">×</button>
                    </span>
                    <span v-if="formData.tags.learnerType.length === 0" class="tag tag--placeholder">点击上方+添加标签</span>
                  </div>
                </div>
                
                <div class="tag-dimension">
                  <div class="tag-dimension__header">
                    <span class="tag-dimension__label">课程主题</span>
                    <button class="tag-dimension__add-btn" @click="addTag('topic', $event)">+</button>
                  </div>
                  <div class="tag-dimension__content">
                    <span 
                      v-for="tag in formData.tags.topic" 
                      :key="tag"
                      class="tag tag--core"
                    >
                      {{ tag }}
                      <button class="tag__delete" @click="removeTag('topic', tag)">×</button>
                    </span>
                    <span v-if="formData.tags.topic.length === 0" class="tag tag--placeholder">点击上方+添加标签</span>
                  </div>
                </div>
                
                <div class="tag-dimension">
                  <div class="tag-dimension__header">
                    <span class="tag-dimension__label">知识点</span>
                    <button class="tag-dimension__add-btn" @click="addTag('knowledge', $event)">+</button>
                  </div>
                  <div class="tag-dimension__content">
                    <span 
                      v-for="tag in formData.tags.knowledge" 
                      :key="tag"
                      class="tag tag--core"
                    >
                      {{ tag }}
                      <button class="tag__delete" @click="removeTag('knowledge', tag)">×</button>
                    </span>
                    <span v-if="formData.tags.knowledge.length === 0" class="tag tag--placeholder">点击上方+添加标签</span>
                  </div>
                </div>
              </div>
              
              <!-- Completion Condition -->
              <div class="form-section">
                <h4 class="form-section__title">完成条件</h4>
                <div class="form-group form-group--inline">
                  <label class="form-label">观看至</label>
                  <div class="input-with-unit">
                    <input type="number" class="input input--small" v-model="formData.completionRate">
                    <span class="input-unit">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Part 3: Analysis Results (Streaming + Steps) -->
          <div class="result-section result-section--analysis">
            <div class="result-section__header">
              <span class="result-section__title">分析结果</span>
            </div>
            <div class="result-section__content result-section__content--scroll">
              <!-- Streaming Output -->
              <div v-if="isStreaming" class="streaming-output">
                <div class="streaming-output__header">
                  <span class="streaming-output__title">正在分析...</span>
                  <span class="streaming-output__progress">{{ streamingProgress }}%</span>
                </div>
                <div class="streaming-output__content" ref="streamingContentRef">
                  <div v-for="(line, index) in streamingLines" :key="index" class="streaming-output__line">
                    {{ line }}
                  </div>
                  <span v-if="isStreaming" class="streaming-output__cursor">|</span>
                </div>
              </div>
              
              <!-- Step Confirmation (after streaming) -->
              <div v-if="!isStreaming && streamingComplete" class="confirm-sections">
                <!-- Step 1: Basic Info -->
                <div class="confirm-step" :class="{ 
                  'confirm-step--active': currentStep === 1, 
                  'confirm-step--done': currentStep > 1 
                }">
                  <div class="confirm-step__header" @click="currentStep === 1 && toggleStep(1)">
                    <div class="confirm-step__title">
                      <span class="confirm-step__num">{{ currentStep > 1 ? '✓' : '1' }}</span>
                      <span>基础信息</span>
                    </div>
                    <span v-if="currentStep === 1" class="confirm-step__arrow">▼</span>
                  </div>
                  <div v-show="currentStep === 1" class="confirm-step__body">
                    <div class="form-group">
                      <label class="form-label">资源名称</label>
                      <input type="text" class="input input--full" v-model="tempFormData.resourceName" placeholder="请输入资源名称">
                    </div>
                    <div class="form-group">
                      <label class="form-label">讲师</label>
                      <input type="text" class="input input--full" v-model="tempFormData.lecturer" placeholder="请输入讲师">
                    </div>
                    <div class="form-group">
                      <label class="form-label">院外讲师</label>
                      <input type="text" class="input input--full" v-model="tempFormData.externalLecturer" placeholder="请输入院外讲师">
                    </div>
                    <div class="form-group">
                      <label class="form-label">简介</label>
                      <textarea class="input input--textarea" v-model="tempFormData.intro" placeholder="请输入简介"></textarea>
                    </div>
                    <button class="button button--primary button--sm" @click="confirmStep(1)">确认基础信息</button>
                  </div>
                </div>
                
                <!-- Step 2: Cover Selection -->
                <div class="confirm-step" :class="{ 
                  'confirm-step--active': currentStep === 2, 
                  'confirm-step--done': currentStep > 2,
                  'confirm-step--disabled': currentStep < 2
                }">
                  <div class="confirm-step__header" @click="currentStep === 2 && toggleStep(2)">
                    <div class="confirm-step__title">
                      <span class="confirm-step__num">{{ currentStep > 2 ? '✓' : '2' }}</span>
                      <span>封面选择</span>
                    </div>
                    <span v-if="currentStep === 2" class="confirm-step__arrow">▼</span>
                  </div>
                  <div v-show="currentStep === 2" class="confirm-step__body">
                    <div class="cover-preview">
                      <div class="cover-preview__img">
                        <span>📷</span>
                        <span>自动提取视频封面</span>
                      </div>
                    </div>
                    <button class="button button--primary button--sm" @click="confirmStep(2)">确认封面</button>
                  </div>
                </div>
                
                <!-- Step 3: Tag Info -->
                <div class="confirm-step" :class="{ 
                  'confirm-step--active': currentStep === 3, 
                  'confirm-step--done': allStepsConfirmed,
                  'confirm-step--disabled': currentStep < 3
                }">
                  <div class="confirm-step__header" @click="currentStep === 3 && toggleStep(3)">
                    <div class="confirm-step__title">
                      <span class="confirm-step__num">{{ allStepsConfirmed ? '✓' : '3' }}</span>
                      <span>标签信息</span>
                    </div>
                    <span v-if="currentStep === 3" class="confirm-step__arrow">▼</span>
                  </div>
                  <div v-show="currentStep === 3" class="confirm-step__body">
                    <div class="confirm-tags">
                      <div class="confirm-tags__group">
                        <span class="confirm-tags__label">科室</span>
                        <div class="confirm-tags__items">
                          <span v-for="tag in (tempFormData.tags.department || [])" :key="tag" class="tag tag--core">{{ tag }}</span>
                          <span v-if="!tempFormData.tags.department || tempFormData.tags.department.length === 0" class="tag tag--placeholder">暂无</span>
                        </div>
                      </div>
                      <div class="confirm-tags__group">
                        <span class="confirm-tags__label">病种</span>
                        <div class="confirm-tags__items">
                          <span v-for="tag in (tempFormData.tags.disease || [])" :key="tag" class="tag tag--core">{{ tag }}</span>
                          <span v-if="!tempFormData.tags.disease || tempFormData.tags.disease.length === 0" class="tag tag--placeholder">暂无</span>
                        </div>
                      </div>
                      <div class="confirm-tags__group">
                        <span class="confirm-tags__label">学员</span>
                        <div class="confirm-tags__items">
                          <span v-for="tag in (tempFormData.tags.learnerType || [])" :key="tag" class="tag tag--core">{{ tag }}</span>
                          <span v-if="!tempFormData.tags.learnerType || tempFormData.tags.learnerType.length === 0" class="tag tag--placeholder">暂无</span>
                        </div>
                      </div>
                      <div class="confirm-tags__group">
                        <span class="confirm-tags__label">主题</span>
                        <div class="confirm-tags__items">
                          <span v-for="tag in (tempFormData.tags.topic || [])" :key="tag" class="tag tag--core">{{ tag }}</span>
                          <span v-if="!tempFormData.tags.topic || tempFormData.tags.topic.length === 0" class="tag tag--placeholder">暂无</span>
                        </div>
                      </div>
                      <div class="confirm-tags__group">
                        <span class="confirm-tags__label">知识点</span>
                        <div class="confirm-tags__items">
                          <span v-for="tag in (tempFormData.tags.knowledge || [])" :key="tag" class="tag tag--core">{{ tag }}</span>
                          <span v-if="!tempFormData.tags.knowledge || tempFormData.tags.knowledge.length === 0" class="tag tag--placeholder">暂无</span>
                        </div>
                      </div>
                    </div>
                    <button class="button button--primary button--sm" @click="confirmStep(3)">确认标签</button>
                  </div>
                </div>
                
                <!-- All Confirmed Tip -->
                <div v-if="allStepsConfirmed" class="all-confirmed-tip">
                  ✓ 已确认全部信息，点击"确认添加"将同步到资源信息
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="smart-result-modal__footer">
          <button class="button button--secondary" @click.stop="$emit('close')">取消</button>
          <button class="button button--primary" @click="handleSubmit">确认添加</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  fileList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'submit'])

// Current selected file index
const currentFileIndex = ref(0)

// Streaming state
const streamingLines = ref([])
const streamingProgress = ref(0)
const isStreaming = ref(false)
const streamingComplete = ref(false)
const streamingContentRef = ref(null)
const coverInputRef = ref(null)
const hasShownStreaming = ref(false)

// Current step
const currentStep = ref(1)
const step1Confirmed = ref(false)
const step2Confirmed = ref(false)
const step3Confirmed = ref(false)

const allStepsConfirmed = computed(() => step1Confirmed.value && step2Confirmed.value && step3Confirmed.value)

// Temp form data for editing
const tempFormData = reactive({
  resourceName: '',
  lecturer: '',
  intro: '',
  tags: {
    department: [],
    disease: [],
    learnerType: [],
    topic: [],
    knowledge: []
  }
})

// Form data (Part 2 - synced from Part 3 after confirmation)
const formData = reactive({
  resourceName: '',
  lecturer: '',
  externalLecturer: '',
  coverUrl: '',
  intro: '',
  completionRate: 80,
  tags: {
    department: [],
    disease: [],
    learnerType: [],
    topic: [],
    knowledge: []
  }
})

// Per-file analysis results storage
// Each file has its own analysis result, keyed by file index
const fileResults = reactive({})

// Get or create analysis result for current file
const getCurrentFileResult = () => {
  const idx = currentFileIndex.value
  if (!fileResults[idx]) {
    fileResults[idx] = {
      resourceName: '',
      lecturer: '',
      externalLecturer: '',
      coverUrl: '',
      intro: '',
      completionRate: 80,
      tags: {
        department: [],
        disease: [],
        learnerType: [],
        topic: [],
        knowledge: []
      },
      // Track which steps have been confirmed for this file
      step1Confirmed: false,
      step2Confirmed: false,
      step3Confirmed: false,
      // Track if streaming has been shown for this file
      hasShownStreaming: false,
      // Track if this file's analysis is complete
      analysisComplete: false
    }
  }
  return fileResults[idx]
}

// Switch file
const switchFile = (index) => {
  const previousIndex = currentFileIndex.value
  currentFileIndex.value = index
  
  const file = props.fileList ? props.fileList[index] : null
  const fileResult = getCurrentFileResult()
  
  // If switching to a different file, reset step states
  if (previousIndex !== index) {
    currentStep.value = 1
  }
  
  // Update current step states from fileResult
  step1Confirmed.value = fileResult.step1Confirmed
  step2Confirmed.value = fileResult.step2Confirmed
  step3Confirmed.value = fileResult.step3Confirmed
  
  // Only trigger streaming when:
  // 1. File exists and status is 'completed' (analysis done)
  // 2. This file hasn't shown streaming yet
  if (file && file.status === 'completed' && !fileResult.hasShownStreaming) {
    startStreaming()
  } else if (fileResult.hasShownStreaming) {
    // Already shown streaming for this file, show results
    streamingComplete.value = true
    isStreaming.value = false
  } else {
    // File not yet completed (still analyzing), show waiting state
    streamingComplete.value = false
    isStreaming.value = false
  }
}

// Toggle step
const toggleStep = (step) => {
  // Allow collapsing
}

// Confirm step
const confirmStep = (step) => {
  const fileResult = getCurrentFileResult()
  
  if (step === 1) {
    // Save step 1 data to tempFormData and fileResult
    fileResult.resourceName = tempFormData.resourceName
    fileResult.lecturer = tempFormData.lecturer
    fileResult.externalLecturer = tempFormData.externalLecturer
    fileResult.intro = tempFormData.intro
    fileResult.step1Confirmed = true
    step1Confirmed.value = true
    currentStep.value = 2
  } else if (step === 2) {
    // Save step 2 data (cover)
    fileResult.coverUrl = formData.coverUrl
    fileResult.step2Confirmed = true
    step2Confirmed.value = true
    currentStep.value = 3
  } else if (step === 3) {
    // Save step 3 data (tags)
    fileResult.tags = { ...tempFormData.tags }
    fileResult.completionRate = formData.completionRate
    fileResult.step3Confirmed = true
    step3Confirmed.value = true
    
    // Sync ALL confirmed data to Part 2 (formData) for final submission
    syncToPart2()
  }
}

// Sync confirmed info to Part 2
const syncToPart2 = () => {
  formData.resourceName = tempFormData.resourceName
  formData.lecturer = tempFormData.lecturer
  formData.intro = tempFormData.intro
  formData.tags.department = [...tempFormData.tags.department]
  formData.tags.disease = [...tempFormData.tags.disease]
  formData.tags.learnerType = [...tempFormData.tags.learnerType]
  formData.tags.topic = [...tempFormData.tags.topic]
  formData.tags.knowledge = [...tempFormData.tags.knowledge]
}

// Streaming simulation
let streamingTimer = null

const startStreaming = () => {
  if (isStreaming.value) return
  
  isStreaming.value = true
  streamingComplete.value = false
  streamingLines.value = []
  streamingProgress.value = 0
  
  const lines = [
    '正在提取视频关键帧...',
    '识别到讲师：张医生',
    '正在分析音频内容...',
    '识别到课程主题：医院感染防控',
    '正在提取字幕文本...',
    '识别到知识点：定义、病因、预防措施',
    '正在分析视频画面...',
    '识别到操作场景：临床操作教学',
    '分析完成！'
  ]
  
  let lineIndex = 0
  let charIndex = 0
  let currentLine = ''
  
  streamingTimer = setInterval(() => {
    if (lineIndex < lines.length) {
      if (charIndex < lines[lineIndex].length) {
        currentLine += lines[lineIndex][charIndex]
        streamingLines.value[streamingLines.value.length - 1] = currentLine
        charIndex++
        streamingProgress.value = Math.round(((lineIndex * 10 + charIndex) / (lines.length * 10)) * 100)
      } else {
        streamingLines.value[streamingLines.value.length - 1] = currentLine
        lineIndex++
        charIndex = 0
        currentLine = ''
        if (lineIndex < lines.length) {
          streamingLines.value.push('')
        }
      }
    } else {
      stopStreaming()
      streamingComplete.value = true
      hasShownStreaming.value = true
      initTempFormData()
      currentStep.value = 1
      step1Confirmed.value = false
      step2Confirmed.value = false
      step3Confirmed.value = false
    }
  }, 50)
}

const stopStreaming = () => {
  if (streamingTimer) {
    clearInterval(streamingTimer)
    streamingTimer = null
  }
  isStreaming.value = false
  streamingProgress.value = 100
}

// Init temp form data
const initTempFormData = () => {
  tempFormData.resourceName = formData.resourceName
  tempFormData.lecturer = formData.lecturer
  tempFormData.intro = formData.intro
  tempFormData.tags.department = [...formData.tags.department]
  tempFormData.tags.disease = [...formData.tags.disease]
  tempFormData.tags.learnerType = [...formData.tags.learnerType]
  tempFormData.tags.topic = [...formData.tags.topic]
  tempFormData.tags.knowledge = [...formData.tags.knowledge]
}

// Available tags
const availableTags = {
  department: ['呼吸内科', '心血管内科', '消化内科', '神经内科', '内分泌科', '肾内科', '血液科', '风湿免疫科', '感染科', '重症医学科', '急诊科', '外科', '骨科', '心胸外科', '神经外科', '泌尿外科', '妇产科', '儿科', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '麻醉科', '放射科', '超声科', '病理科', '检验科', '药剂科', '护理部'],
  disease: ['呼吸机相关肺炎', '医院获得性肺炎', '败血症', '深静脉血栓', '压力性损伤', '导管相关血流感染', '手术部位感染', '尿路感染', '多重耐药菌感染', '糖尿病', '高血压', '冠心病', '脑卒中', '慢性阻塞性肺疾病', '肺炎', '哮喘', '肺结核', '肝炎', '肝硬化', '胃炎', '胃溃疡', '肠炎', '肾炎', '肾功能不全', '贫血', '白血病', '淋巴瘤', '肿瘤'],
  learnerType: ['住院医师', '主治医师', '副主任医师', '主任医师', '规培生', '实习生', '进修生', '护理人员', '技师', '药师', '医学生', '研究生'],
  topic: ['医院感染防控', '手卫生', '职业防护', '医疗废物管理', '消毒灭菌技术', '呼吸支持技术', '心肺复苏', '气道管理', '静脉治疗', '伤口护理', '疼痛管理', '营养支持', '心理护理', '康复护理', '急救技能', '生命体征监测', '心电图判读', '影像诊断', '实验室检查', '药物治疗', '外科手术', '麻醉技术', '重症监护', '病例分析', '医患沟通', '医疗法规', '医学伦理', '科研方法'],
  knowledge: ['定义', '病因', '病理生理', '临床表现', '诊断标准', '鉴别诊断', '实验室检查', '影像学检查', '治疗原则', '药物治疗', '手术治疗', '康复治疗', '预防措施', '护理要点', '健康宣教', '并发症', '预后评估', '随访管理', '急救处理', '操作规范', '适应症', '禁忌症', '注意事项', '不良反应']
}

let currentSelector = null

// Add tag
const addTag = (dimension, event) => {
  if (currentSelector) {
    currentSelector.remove()
    currentSelector = null
  }
  
  const selectedTags = formData.tags[dimension]
  const unselectedTags = availableTags[dimension].filter(tag => !selectedTags.includes(tag))
  
  if (unselectedTags.length === 0) {
    return
  }
  
  const selector = document.createElement('div')
  selector.className = 'tag-selector'
  selector.innerHTML = unselectedTags.map(tag => `
    <div class="tag-selector__item" data-tag="${tag}">${tag}</div>
  `).join('')
  
  const tagDimension = event.target.closest('.tag-dimension')
  const contentEl = tagDimension.querySelector('.tag-dimension__content')
  contentEl.style.position = 'relative'
  contentEl.appendChild(selector)
  
  currentSelector = selector
  
  selector.querySelectorAll('.tag-selector__item').forEach(item => {
    item.addEventListener('click', (e) => {
      const tagName = e.target.dataset.tag
      if (!formData.tags[dimension].includes(tagName)) {
        formData.tags[dimension].push(tagName)
      }
      selector.remove()
      currentSelector = null
    })
  })
  
  const closeSelector = (e) => {
    if (!selector.contains(e.target) && !e.target.classList.contains('tag-dimension__add-btn')) {
      selector.remove()
      currentSelector = null
      document.removeEventListener('click', closeSelector)
    }
  }
  setTimeout(() => document.addEventListener('click', closeSelector), 0)
}

// Remove tag
const removeTag = (dimension, tag) => {
  const index = formData.tags[dimension].indexOf(tag)
  if (index > -1) {
    formData.tags[dimension].splice(index, 1)
  }
}

// Format file name
const truncateFileName = (name) => {
  if (!name) return ''
  if (name.length > 15) {
    const ext = name.split('.').pop()
    const baseName = name.substring(0, name.length - ext.length - 1)
    return baseName.substring(0, 10) + '...' + '.' + ext
  }
  return name
}

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Submit
const handleSubmit = () => {
  if (allStepsConfirmed.value) {
    syncToPart2()
  }
  emit('submit', { ...formData })
  emit('close')
}

// Auto-start streaming when modal opens
watch(() => props.visible, (val) => {
  if (val) {
    // When modal opens, try to start streaming for first completed file
    setTimeout(() => {
      const list = props.fileList
      if (list && list.length > 0) {
        // Find first completed file
        const firstCompletedIndex = list.findIndex(f => f.status === 'completed')
        if (firstCompletedIndex !== -1) {
          switchFile(firstCompletedIndex)
        } else {
          // No completed file found, just show first file
          switchFile(0)
        }
      }
    }, 300)
  }
})

// Watch current step to populate tempFormData
watch(currentStep, (step) => {
  if (step === 1) {
    const fileResult = getCurrentFileResult()
    tempFormData.resourceName = fileResult.resourceName || ''
    tempFormData.lecturer = fileResult.lecturer || ''
    tempFormData.externalLecturer = fileResult.externalLecturer || ''
    tempFormData.intro = fileResult.intro || ''
  }
})

// Watch close and reset state
watch(() => props.visible, (val) => {
  if (!val) {
    currentFileIndex.value = 0
    stopStreaming()
    streamingLines.value = []
    streamingProgress.value = 0
    streamingComplete.value = false
    currentStep.value = 1
    step1Confirmed.value = false
    step2Confirmed.value = false
    step3Confirmed.value = false
  }
})
</script>

<style scoped>
.smart-result-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.smart-result-modal-overlay--active {
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  pointer-events: auto;
}

.smart-result-modal {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 1000px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.smart-result-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #a51c30 0%, #c9435a 100%);
  border-radius: 12px 12px 0 0;
}

.smart-result-modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.smart-result-modal__close {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.smart-result-modal__close:hover {
  opacity: 1;
}

.smart-result-modal__body {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.smart-result-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 0 0 12px 12px;
}

/* Buttons */
.button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.button--primary {
  background: linear-gradient(135deg, #a51c30 0%, #c9435a 100%);
  color: #ffffff;
  border-color: #a51c30;
}

.button--primary:hover {
  background: linear-gradient(135deg, #8a1828 0%, #a53848 100%);
}

.button--secondary {
  background: #ffffff;
  color: #666;
  border-color: #d9d9d9;
}

.button--secondary:hover {
  border-color: #a51c30;
  color: #a51c30;
}

.button--sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* Sections */
.result-section {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
}

.result-section:last-child {
  border-right: none;
}

.result-section__header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.result-section__title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.result-section__content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.result-section__content--scroll {
  overflow-y: auto;
}

/* Part 1: Files */
.result-section--files {
  width: 180px;
  flex-shrink: 0;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-card:last-child {
  margin-bottom: 0;
}

.file-card:hover {
  border-color: #e0e0e0;
}

.file-card--active {
  border-color: #a51c30;
  background: #fff5f5;
}

.file-card--completed .file-card__status {
  color: #52c41a;
}

.file-card__icon {
  color: #999;
  flex-shrink: 0;
}

.file-card__info {
  flex: 1;
  min-width: 0;
}

.file-card__name {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-card__size {
  font-size: 11px;
  color: #999;
}

.file-card__status {
  font-size: 14px;
  color: #999;
  flex-shrink: 0;
}

.file-card__status--completed {
  color: #52c41a;
}

.file-card__status--analyzing {
  color: #a51c30;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Part 2: Form */
.result-section--form {
  flex: 1;
  min-width: 0;
}

.form-group {
  margin-bottom: 12px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group--inline {
  display: flex;
  align-items: center;
}

.form-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.form-label--required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 2px;
}

.form-hint {
  display: block;
  font-size: 11px;
  color: #999;
  text-align: right;
  margin-top: 2px;
}

.form-section {
  margin-bottom: 20px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section__title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tag-dimension {
  margin-bottom: 12px;
}

.tag-dimension:last-child {
  margin-bottom: 0;
}

.tag-dimension__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.tag-dimension__label {
  font-size: 12px;
  color: #666;
}

.tag-dimension__add-btn {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #666;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.tag-dimension__add-btn:hover {
  border-color: #a51c30;
  color: #a51c30;
}

.tag-dimension__content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
}

.tag--core {
  background: #fff5f5;
  color: #a51c30;
  border: 1px solid #ffcccc;
}

.tag--placeholder {
  background: #f5f5f5;
  color: #999;
  border: 1px dashed #d9d9d9;
}

.tag__delete {
  background: none;
  border: none;
  color: inherit;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.tag__delete:hover {
  opacity: 1;
}

/* Tag Selector */
.tag-selector {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 6px;
  max-height: 200px;
  overflow-y: auto;
  min-width: 200px;
}

.tag-selector__item {
  padding: 6px 10px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.tag-selector__item:hover {
  background: #f5f5f5;
}

/* Input */
.input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #a51c30;
}

.input--full {
  width: 100%;
}

.input--small {
  width: 80px;
  padding: 4px 8px;
}

.input--textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.input-unit {
  margin-left: 4px;
  font-size: 13px;
  color: #666;
}

/* Part 3: Analysis */
.result-section--analysis {
  width: 280px;
  flex-shrink: 0;
}

/* Streaming Output */
.streaming-output {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.streaming-output__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.streaming-output__title {
  font-size: 12px;
  color: #666;
}

.streaming-output__progress {
  font-size: 12px;
  color: #a51c30;
  font-weight: 600;
}

.streaming-output__content {
  font-size: 12px;
  color: #333;
  line-height: 1.8;
  max-height: 120px;
  overflow-y: auto;
}

.streaming-output__line {
  white-space: pre-wrap;
}

.streaming-output__cursor {
  animation: blink 1s infinite;
  color: #a51c30;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Step Confirmation */
.confirm-sections {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-step {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.confirm-step--active {
  border-color: #a51c30;
}

.confirm-step--done {
  border-color: #52c41a;
}

.confirm-step--disabled {
  opacity: 0.5;
}

.confirm-step__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.confirm-step__header:hover {
  background: #fafafa;
}

.confirm-step__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.confirm-step__num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.confirm-step--done .confirm-step__num {
  background: #52c41a;
  color: #fff;
}

.confirm-step__arrow {
  font-size: 10px;
  color: #999;
  transition: transform 0.2s;
}

.confirm-step__body {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.confirm-step__body .form-group {
  margin-bottom: 10px;
}

.confirm-step__body .button {
  margin-top: 8px;
  width: 100%;
}

/* Cover Preview */
.cover-preview {
  margin-bottom: 8px;
}

.cover-preview__img {
  height: 80px;
  background: #f5f5f5;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

/* Tags Confirmation */
.confirm-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-tags__group {
  display: flex;
  align-items: flex-start;
}

.confirm-tags__label {
  width: 50px;
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
  padding-top: 3px;
}

.confirm-tags__items {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* All Confirmed Tip */
.all-confirmed-tip {
  padding: 10px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  font-size: 12px;
  color: #52c41a;
  text-align: center;
}

/* Cover Upload */
.cover-upload {
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
}

.cover-upload__preview {
  width: 100%;
  height: 100px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.cover-upload__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-upload__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.cover-upload__remove:hover {
  background: rgba(0, 0, 0, 0.7);
}

.cover-upload__placeholder {
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #999;
  font-size: 12px;
  transition: all 0.2s;
}

.cover-upload__placeholder:hover {
  border-color: #a51c30;
  color: #a51c30;
}

.cover-upload__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
