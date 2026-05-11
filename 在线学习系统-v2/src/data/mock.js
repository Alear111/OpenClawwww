/**
 * 模拟数据
 */

// 可选标签数据
export const availableTags = {
  department: ['呼吸内科', '心血管内科', '消化内科', '神经内科', '内分泌科', '肾内科', '血液科', '风湿免疫科', '感染科', '重症医学科', '急诊科', '外科', '骨科', '心胸外科', '神经外科', '泌尿外科', '妇产科', '儿科', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '麻醉科', '放射科', '超声科', '病理科', '检验科', '药剂科', '护理部'],
  disease: ['呼吸机相关肺炎', '医院获得性肺炎', '败血症', '深静脉血栓', '压力性损伤', '导管相关血流感染', '手术部位感染', '尿路感染', '多重耐药菌感染', '糖尿病', '高血压', '冠心病', '脑卒中', '慢性阻塞性肺疾病', '肺炎', '哮喘', '肺结核', '肝炎', '肝硬化', '胃炎', '胃溃疡', '肠炎', '肾炎', '肾功能不全', '贫血', '白血病', '淋巴瘤', '肿瘤'],
  learnerType: ['住院医师', '主治医师', '副主任医师', '主任医师', '规培生', '实习生', '进修生', '护理人员', '技师', '药师', '医学生', '研究生'],
  topic: ['医院感染防控', '手卫生', '职业防护', '医疗废物管理', '消毒灭菌技术', '呼吸支持技术', '心肺复苏', '气道管理', '静脉治疗', '伤口护理', '疼痛管理', '营养支持', '心理护理', '康复护理', '急救技能', '生命体征监测', '心电图判读', '影像诊断', '实验室检查', '药物治疗', '外科手术', '麻醉技术', '重症监护', '病例分析', '医患沟通', '医疗法规', '医学伦理', '科研方法'],
  knowledge: ['定义', '病因', '病理生理', '临床表现', '诊断标准', '鉴别诊断', '实验室检查', '影像学检查', '治疗原则', '药物治疗', '手术治疗', '康复治疗', '预防措施', '护理要点', '健康宣教', '并发症', '预后评估', '随访管理', '急救处理', '操作规范', '适应症', '禁忌症', '注意事项', '不良反应']
}

// 目录数据
export const directoryData = [
  { id: 1, name: '研究生', children: [] },
  { id: 2, name: '三基培训', children: [] },
  { id: 3, name: '师资培训', children: [] },
  { id: 4, name: '住院医师', children: [
    { id: 41, name: '医院感染与控制', selected: true },
    { id: 42, name: '全科医学概论' },
    { id: 43, name: '医学心理课程' },
    { id: 44, name: '公共科目' },
    { id: 45, name: '2026年结业住院医师考前辅导' }
  ]},
  { id: 5, name: '学习视频', children: [] },
  { id: 6, name: '默认分类', children: [] },
  { id: 7, name: '直播录像', children: [] },
  { id: 8, name: '实习生', children: [] },
  { id: 9, name: '天天科普', children: [] },
  { id: 10, name: '口腔全科基地教学操作视频', children: [] },
  { id: 11, name: '博士后', children: [] },
  { id: 12, name: '本科生', children: [{ id: 121, name: '内科基地住院医师临床小讲课' }] }
]

// 资源数据
export const resourceData = [
  { 
    id: 10, 
    title: '呼吸机相关肺炎防控新进', 
    type: '视频',
    author: '刘明',
    tags: {
      department: ['呼吸内科'],
      disease: ['呼吸机相关肺炎', '医院获得性肺炎', '多重耐药菌感染'],
      learnerType: ['住院医师', '规培生'],
      topic: ['医院感染防控', '呼吸支持技术'],
      knowledge: ['定义', '危险因素识别', '预防措施', '护理要点']
    }
  },
  { 
    id: 9, 
    title: '插管相关血流感染（CLABSI）的预防', 
    type: '视频',
    author: '张丽',
    tags: {
      department: ['重症医学科', '急诊科'],
      disease: ['导管相关血流感染', '败血症'],
      learnerType: ['住院医师', '护理人员'],
      topic: ['医院感染防控', '静脉治疗'],
      knowledge: ['定义', '危险因素识别', '预防措施', '操作规范']
    }
  },
  { 
    id: 8, 
    title: '多重耐药菌防控的组合干预措施', 
    type: '视频',
    author: '王华',
    tags: {
      department: ['感染科', '呼吸内科'],
      disease: ['多重耐药菌感染', '医院获得性肺炎'],
      learnerType: ['主治医师', '住院医师', '规培生'],
      topic: ['医院感染防控', '药物治疗'],
      knowledge: ['定义', '病因', '预防措施', '注意事项']
    }
  },
  { 
    id: 7, 
    title: '《手术部位感染的预防与控制》', 
    type: '视频',
    author: '李强',
    tags: {
      department: ['外科', '手术室'],
      disease: ['手术部位感染'],
      learnerType: ['住院医师', '主治医师'],
      topic: ['医院感染防控', '外科手术'],
      knowledge: ['定义', '病因', '预防措施', '治疗原则']
    }
  },
  { 
    id: 6, 
    title: '环境污染与医院感染相关研究进展', 
    type: '视频',
    author: '陈静',
    tags: {
      department: ['感染科', '放射科'],
      disease: ['医院获得性肺炎', '败血症'],
      learnerType: ['副主任医师', '主治医师'],
      topic: ['医院感染防控', '科研方法'],
      knowledge: ['病因', '病理生理', '预防措施', '实验室检查']
    }
  },
  { 
    id: 5, 
    title: '医院内胃肠道感染的流行及防控策略', 
    type: '视频',
    author: '赵军',
    tags: {
      department: ['消化内科', '感染科'],
      disease: ['胃炎', '肠炎'],
      learnerType: ['住院医师', '实习生'],
      topic: ['医院感染防控', '病例分析'],
      knowledge: ['定义', '临床表现', '诊断标准', '治疗原则']
    }
  },
  { 
    id: 4, 
    title: '医疗机构如何科学应对奥密克', 
    type: '视频',
    author: '孙伟',
    tags: {
      department: ['呼吸内科', '急诊科'],
      disease: ['肺炎', '哮喘'],
      learnerType: ['主任医师', '副主任医师', '主治医师'],
      topic: ['医院感染防控', '急救技能'],
      knowledge: ['定义', '临床表现', '治疗原则', '注意事项']
    }
  },
  { 
    id: 3, 
    title: '手卫生和个人防护用品的正确', 
    type: '视频',
    author: '周敏',
    tags: {
      department: ['全科医学'],
      disease: ['医院获得性肺炎', '压力性损伤'],
      learnerType: ['实习生', '护理人员', '规培生'],
      topic: ['手卫生', '职业防护'],
      knowledge: ['定义', '注意事项', '操作规范', '健康宣教']
    }
  },
  { 
    id: 2, 
    title: '临床微生物标本采集和送检', 
    type: '视频',
    author: '吴静',
    tags: {
      department: ['检验科', '重症医学科'],
      disease: ['败血症', '尿路感染'],
      learnerType: ['住院医师', '技师'],
      topic: ['实验室检查', '医院感染防控'],
      knowledge: ['实验室检查', '操作规范', '注意事项', '适应症']
    }
  },
  { 
    id: 1, 
    title: '我国医院感染防控理念、新方法、新要', 
    type: '视频',
    author: '郑强',
    tags: {
      department: ['感染科', '医务科'],
      disease: ['医院获得性肺炎', '多重耐药菌感染'],
      learnerType: ['主任医师', '副主任医师', '主治医师'],
      topic: ['医院感染防控', '医疗法规'],
      knowledge: ['定义', '预防措施', '治疗原则', '注意事项']
    }
  }
]

// 详情数据
export const mockDetailData = {
  '呼吸机相关肺炎防控新进': {
    fileName: '呼吸机相关肺炎防控新进.mp4',
    directory: '医院感染与控制',
    fileSize: '18.5MB',
    duration: '15分32秒',
    teacher: '刘明',
    intro: '介绍呼吸机相关肺炎的防控措施和最新进展'
  },
  '插管相关血流感染（CLABSI）的预防': {
    fileName: '插管相关血流感染预防.mp4',
    directory: '医院感染与控制',
    fileSize: '22.1MB',
    duration: '18分45秒',
    teacher: '刘明',
    intro: '讲解导管相关血流感染的预防策略'
  },
  '原发性醛固酮增多症': {
    fileName: '原发性醛固酮增多症.mp4',
    directory: '内科基地住院医师临床小讲课',
    fileSize: '20.93MB',
    duration: '23分11秒',
    teacher: '张晶',
    intro: '无内容'
  }
}

// AI分析数据
export const mockAnalysisData = {
  basicSettings: {
    resourceName: { value: '《呼吸机相关肺炎的预防与控制》', editable: true },
    lecturer: { value: '张明', editable: true },
    externalLecturer: { value: '', editable: true },
    intro: { value: '本课程讲解呼吸机相关肺炎的定义、风险因素、预防措施和护理要点。', editable: true }
  },
  coverSuggestions: [
    { id: 1, url: '', name: '封面1', placeholder: true },
    { id: 2, url: '', name: '封面2', placeholder: true },
    { id: 3, url: '', name: '封面3', placeholder: true },
    { id: 4, url: '', name: '封面4', placeholder: true },
    { id: 5, url: '', name: '封面5', placeholder: true }
  ],
  tags: {
    department: {
      core: { name: '呼吸内科', confidence: 95, basis: '视频内容涉及呼吸机操作、肺炎诊断与治疗，符合呼吸内科专业范畴' },
      related: [{ name: '重症医学科', confidence: 78, basis: '呼吸机相关肺炎常发生于ICU患者，涉及重症监护相关知识' }],
      excluded: [{ name: '心内科', basis: '未涉及心血管系统相关内容' }]
    },
    disease: {
      core: { name: '呼吸机相关肺炎', confidence: 98, basis: '课程标题明确提及"呼吸机相关肺炎"，内容主体围绕该疾病展开' },
      related: [{ name: '医院获得性肺炎', confidence: 85, basis: 'VAP属于医院获得性肺炎的一种特殊类型' }],
      excluded: [{ name: '社区获得性肺炎', basis: '课程内容专注于医院内感染，非社区感染' }]
    },
    learnerType: {
      core: { name: '住院医师', confidence: 90, basis: '课程深度适合住院医师规范化培训要求' },
      related: [{ name: '护理人员', confidence: 72, basis: '课程包含护理要点章节，适合护理人员学习' }],
      excluded: [{ name: '实习生', basis: '内容深度超出实习生基础培训范围' }]
    },
    courseTopic: {
      core: { name: '医院感染防控', confidence: 92, basis: '课程核心内容为医院内感染的预防与控制措施' },
      related: [{ name: '呼吸支持技术', confidence: 68, basis: '涉及呼吸机使用相关技术要点' }],
      excluded: [{ name: '外科手术', basis: '不涉及外科手术相关内容' }]
    },
    knowledgePoints: {
      items: [
        { name: '呼吸机相关肺炎定义', basis: '课程开篇明确定义概念' },
        { name: '危险因素识别', basis: '详细讲解VAP的危险因素评估' },
        { name: '预防措施', basis: '课程核心章节，详细讲解预防策略' },
        { name: '护理要点', basis: '专设护理要点章节' }
      ],
      excluded: [{ name: '药物治疗方案', basis: '未涉及具体药物使用' }]
    }
  }
}

// 流式输出阶段配置
export const analysisStages = [
  { id: 'basic', title: '基础设置分析', icon: '📝', duration: 1500 },
  { id: 'cover', title: '封面选择建议', icon: '🖼️', duration: 1000 },
  { id: 'tags', title: '标签智能分析', icon: '🏷️', duration: 2000 }
]

// 生成流式输出文本
export function generateStreamingText(stageId) {
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

// 随机中文人名
const authorNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '陈二', '许丽莉', '刘明', '黄华', '林芳', '杨光']

export function getRandomAuthor() {
  return authorNames[Math.floor(Math.random() * authorNames.length)]
}
