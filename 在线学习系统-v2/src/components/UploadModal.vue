<template>
  <div class="upload-modal-wrapper" v-if="visible">
    <div class="modal-overlay" :class="{ 'modal-overlay--active': visible }" @click.self="$emit('close')">
    <div class="modal modal--upload">
      <div class="modal__header">
        <h3 class="modal__title">添加资源</h3>
        <button class="modal__close" @click.stop="$emit('close')">&times;</button>
      </div>
      <div class="modal__body">
        <!-- 基础设置板块 -->
        <div class="form-section">
          <h4 class="form-section__title">基础设置</h4>
          <!-- 文件上传 -->
          <div class="form-group">
            <label class="form-label form-label--required">文件</label>
            <div class="file-upload-row">
              <button class="button button--primary button--sm" :disabled="uploadBtnDisabled" @click="triggerUpload">{{ uploadBtnText }}</button>
              <span class="file-status" v-if="fileStatus" :class="{ 'file-status--error': fileError }">
                <span class="file-status__icon">{{ fileError ? '❌' : '✓' }}</span>
                {{ fileStatus }}
              </span>
            </div>
            <span class="form-hint form-hint--inline">支持格式：mp3、mp4、flv、xls、xlsx、ppt、pptx、doc、docx、pdf</span>
          </div>
          <!-- 资源名称 -->
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
          <!-- 讲师 -->
          <div class="form-group">
            <label class="form-label">讲师</label>
            <input 
              type="text" 
              class="input input--full" 
              v-model="formData.lecturer"
              placeholder="请输入讲师"
            >
          </div>
          <!-- 院外讲师 -->
          <div class="form-group">
            <label class="form-label">院外讲师</label>
            <input 
              type="text" 
              class="input input--full" 
              v-model="formData.externalLecturer"
              placeholder="请输入院外讲师"
            >
          </div>
          <!-- 封面上传 -->
          <div class="form-group">
            <label class="form-label">封面</label>
            <div class="upload-area" @click="triggerCoverUpload">
              <div class="upload-area__icon">+</div>
            </div>
          </div>
          <!-- 简介 -->
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
        </div>
        
        <!-- 标签信息板块（5个维度） -->
        <div class="form-section">
          <h4 class="form-section__title">标签信息</h4>
          <!-- 科室标签 -->
          <div class="tag-dimension">
            <div class="tag-dimension__header">
              <label class="tag-dimension__label">🏥 科室标签</label>
              <button class="tag-dimension__add-btn" @click="addTag('department', $event)" title="添加标签">+</button>
            </div>
            <div class="tag-dimension__content">
              <template v-if="formData.tags.department.length > 0">
                <span class="tag tag--core" v-for="tag in formData.tags.department" :key="tag">
                  {{ tag }}
                  <button class="tag__delete" @click.stop="removeTag('department', tag)">×</button>
                </span>
              </template>
              <span v-else class="tag tag--placeholder">暂无标签，请使用智能识别</span>
            </div>
          </div>
          <!-- 病种标签 -->
          <div class="tag-dimension">
            <div class="tag-dimension__header">
              <label class="tag-dimension__label">🦠 病种标签</label>
              <button class="tag-dimension__add-btn" @click="addTag('disease', $event)" title="添加标签">+</button>
            </div>
            <div class="tag-dimension__content">
              <template v-if="formData.tags.disease.length > 0">
                <span class="tag tag--core" v-for="tag in formData.tags.disease" :key="tag">
                  {{ tag }}
                  <button class="tag__delete" @click.stop="removeTag('disease', tag)">×</button>
                </span>
              </template>
              <span v-else class="tag tag--placeholder">暂无标签，请使用智能识别</span>
            </div>
          </div>
          <!-- 学员类型 -->
          <div class="tag-dimension">
            <div class="tag-dimension__header">
              <label class="tag-dimension__label">👨‍⚕️ 学员类型</label>
              <button class="tag-dimension__add-btn" @click="addTag('learnerType', $event)" title="添加标签">+</button>
            </div>
            <div class="tag-dimension__content">
              <template v-if="formData.tags.learnerType.length > 0">
                <span class="tag tag--core" v-for="tag in formData.tags.learnerType" :key="tag">
                  {{ tag }}
                  <button class="tag__delete" @click.stop="removeTag('learnerType', tag)">×</button>
                </span>
              </template>
              <span v-else class="tag tag--placeholder">暂无标签，请使用智能识别</span>
            </div>
          </div>
          <!-- 课程主题 -->
          <div class="tag-dimension">
            <div class="tag-dimension__header">
              <label class="tag-dimension__label">📚 课程主题</label>
              <button class="tag-dimension__add-btn" @click="addTag('topic', $event)" title="添加标签">+</button>
            </div>
            <div class="tag-dimension__content">
              <template v-if="formData.tags.topic.length > 0">
                <span class="tag tag--core" v-for="tag in formData.tags.topic" :key="tag">
                  {{ tag }}
                  <button class="tag__delete" @click.stop="removeTag('topic', tag)">×</button>
                </span>
              </template>
              <span v-else class="tag tag--placeholder">暂无标签，请使用智能识别</span>
            </div>
          </div>
          <!-- 知识点 -->
          <div class="tag-dimension">
            <div class="tag-dimension__header">
              <label class="tag-dimension__label">📌 知识点</label>
              <button class="tag-dimension__add-btn" @click="addTag('knowledge', $event)" title="添加标签">+</button>
            </div>
            <div class="tag-dimension__content">
              <template v-if="formData.tags.knowledge.length > 0">
                <span class="tag tag--core" v-for="tag in formData.tags.knowledge" :key="tag">
                  {{ tag }}
                  <button class="tag__delete" @click.stop="removeTag('knowledge', tag)">×</button>
                </span>
              </template>
              <span v-else class="tag tag--placeholder">暂无标签，请使用智能识别</span>
            </div>
          </div>
        </div>
        
        <!-- 完成条件板块 -->
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
      <div class="modal__footer">
        <button class="button button--secondary" @click.stop="$emit('back')">返回</button>
        <button class="button button--primary" @click="handleSubmit">确定</button>
      </div>
    </div>
  </div>
  
  <!-- 上传成功弹窗 -->
  <!-- region: success_modal (来自节点1) -->
  <!-- solution: S001-S004 (来自节点3) -->
  <SuccessModal 
    v-model:visible="showSuccessModal"
    @close="handleSuccessModalClose"
  />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import SuccessModal from './SuccessModal.vue'
import { showToast } from '../utils/toast'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'back'])

// 成功弹窗状态
const showSuccessModal = ref(false)

// 表单数据
const formData = reactive({
  resourceName: '',
  lecturer: '',
  externalLecturer: '',
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

// 文件上传状态
const fileStatus = ref('')
const fileError = ref(false)
const uploadBtnText = ref('点击上传')
const uploadBtnDisabled = ref(false)

// 模拟上传（与原版一致）
const triggerUpload = () => {
  // 模拟上传进度
  uploadBtnText.value = '上传中...'
  uploadBtnDisabled.value = true

  setTimeout(() => {
    uploadBtnText.value = '呼吸机相关肺炎防控.mp4'
    uploadBtnDisabled.value = false
    fileStatus.value = '上传成功'
    fileError.value = false
  }, 1000)
}

// 封面上传
const triggerCoverUpload = () => {
  console.log('上传封面...')
}

// 可选标签数据（与原版一致）
const availableTags = {
  department: ['呼吸内科', '心血管内科', '消化内科', '神经内科', '内分泌科', '肾内科', '血液科', '风湿免疫科', '感染科', '重症医学科', '急诊科', '外科', '骨科', '心胸外科', '神经外科', '泌尿外科', '妇产科', '儿科', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '麻醉科', '放射科', '超声科', '病理科', '检验科', '药剂科', '护理部'],
  disease: ['呼吸机相关肺炎', '医院获得性肺炎', '败血症', '深静脉血栓', '压力性损伤', '导管相关血流感染', '手术部位感染', '尿路感染', '多重耐药菌感染', '糖尿病', '高血压', '冠心病', '脑卒中', '慢性阻塞性肺疾病', '肺炎', '哮喘', '肺结核', '肝炎', '肝硬化', '胃炎', '胃溃疡', '肠炎', '肾炎', '肾功能不全', '贫血', '白血病', '淋巴瘤', '肿瘤'],
  learnerType: ['住院医师', '主治医师', '副主任医师', '主任医师', '规培生', '实习生', '进修生', '护理人员', '技师', '药师', '医学生', '研究生'],
  topic: ['医院感染防控', '手卫生', '职业防护', '医疗废物管理', '消毒灭菌技术', '呼吸支持技术', '心肺复苏', '气道管理', '静脉治疗', '伤口护理', '疼痛管理', '营养支持', '心理护理', '康复护理', '急救技能', '生命体征监测', '心电图判读', '影像诊断', '实验室检查', '药物治疗', '外科手术', '麻醉技术', '重症监护', '病例分析', '医患沟通', '医疗法规', '医学伦理', '科研方法'],
  knowledge: ['定义', '病因', '病理生理', '临床表现', '诊断标准', '鉴别诊断', '实验室检查', '影像学检查', '治疗原则', '药物治疗', '手术治疗', '康复治疗', '预防措施', '护理要点', '健康宣教', '并发症', '预后评估', '随访管理', '急救处理', '操作规范', '适应症', '禁忌症', '注意事项', '不良反应']
}

// 标签选择器状态
let currentSelector = null // 当前显示的选择器DOM元素

// 添加标签 - 弹出选择器（与原版一致的DOM操作方式）
const addTag = (dimension, event) => {
  // 移除已有的选择器
  if (currentSelector) {
    currentSelector.remove()
    currentSelector = null
  }
  
  // 获取已选择的标签
  const selectedTags = formData.tags[dimension]
  
  // 获取可选标签（排除已选择的）
  const unselectedTags = availableTags[dimension].filter(tag => !selectedTags.includes(tag))
  
  if (unselectedTags.length === 0) {
    alert('暂无可添加的标签')
    return
  }
  
  // 创建选择器（与原版一致）
  const selector = document.createElement('div')
  selector.className = 'tag-selector'
  selector.innerHTML = unselectedTags.map(tag => `
    <div class="tag-selector__item" data-tag="${tag}">${tag}</div>
  `).join('')
  
  // 定位到维度内容区域下方（与原版一致）
  const tagDimension = event.target.closest('.tag-dimension')
  const contentEl = tagDimension.querySelector('.tag-dimension__content')
  contentEl.style.position = 'relative'
  contentEl.appendChild(selector)
  
  currentSelector = selector
  
  // 点击选择器项
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
  
  // 点击其他地方关闭选择器（与原版一致）
  const closeSelector = (e) => {
    if (!selector.contains(e.target) && !e.target.classList.contains('tag-dimension__add-btn')) {
      selector.remove()
      currentSelector = null
      document.removeEventListener('click', closeSelector)
    }
  }
  setTimeout(() => document.addEventListener('click', closeSelector), 0)
}

// 删除标签
const removeTag = (dimension, tag) => {
  const index = formData.tags[dimension].indexOf(tag)
  if (index > -1) {
    formData.tags[dimension].splice(index, 1)
  }
}

/**
 * 校验基础信息是否全部填写
 * requirement: feature_scope[4] (上传前基础信息校验)
 * solution: S005 (校验+toast提示)
 */
const validateBasicInfo = () => {
  // 检查必填字段：文件和资源名称
  const errors = []
  
  // 检查文件是否上传
  if (!fileStatus.value || fileError.value) {
    errors.push('请上传文件')
  }
  
  // 检查资源名称
  if (!formData.resourceName.trim()) {
    errors.push('请填写资源名称')
  }
  
  return errors
}

// 提交
const handleSubmit = () => {
  // requirement: feature_scope[4] (上传前基础信息校验)
  // solution: S005 (校验+toast提示)
  const errors = validateBasicInfo()
  
  if (errors.length > 0) {
    // 校验失败，显示toast提示
    showToast('请填写全部信息后再上传')
    return
  }
  
  // 校验成功，模拟提交
  console.log('提交表单:', formData)
  
  // 关闭上传弹窗，显示成功弹窗
  emit('close')
  showSuccessModal.value = true
}

// 关闭成功弹窗
const handleSuccessModalClose = () => {
  showSuccessModal.value = false
}

// 重置表单
watch(() => props.visible, (val) => {
  if (!val) {
    // 关闭时重置
    fileStatus.value = ''
    fileError.value = false
    uploadBtnText.value = '点击上传'
    uploadBtnDisabled.value = false
    // 重置表单数据
    formData.resourceName = ''
    formData.lecturer = ''
    formData.externalLecturer = ''
    formData.intro = ''
    formData.completionRate = 80
    formData.tags = {
      department: [],
      disease: [],
      learnerType: [],
      topic: [],
      knowledge: []
    }
  }
})
</script>
