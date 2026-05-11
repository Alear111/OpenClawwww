// 课程列表 mock 数据和筛选配置

export const filterOptions = {
  department: ['呼吸内科', '感染科', '外科', '心内科', '神经内科', '药剂科', '麻醉科', '重症医学科'],
  disease: ['呼吸机相关肺炎', '手术部位感染', '脑卒中', '多重耐药菌感染'],
  learnerType: ['住院医师', '规培生', '主治医师', '副主任医师'],
  topic: ['医院感染防控', '手卫生', '外科手术', '合理用药', '手术安全'],
  knowledge: ['操作规范', '药物治疗', '超声影像', '生命支持']
}

export const mockCourses = [
  {
    id: 1,
    title: '呼吸机相关肺炎防控',
    coverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    coverEmoji: '🫁',
    tags: { department: '呼吸内科', disease: '呼吸机相关肺炎', learnerType: '住院医师', topic: '医院感染防控', knowledge: '操作规范' }
  },
  {
    id: 2,
    title: '手卫生与职业防护培训',
    coverGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    coverEmoji: '🧴',
    tags: { department: '感染科', disease: '手术部位感染', learnerType: '规培生', topic: '手卫生', knowledge: '操作规范' }
  },
  {
    id: 3,
    title: '手术部位感染预防',
    coverGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    coverEmoji: '🏥',
    tags: { department: '外科', disease: '手术部位感染', learnerType: '主治医师', topic: '外科手术', knowledge: '药物治疗' }
  },
  {
    id: 4,
    title: '多重耐药菌防控策略',
    coverGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    coverEmoji: '🦠',
    tags: { department: '重症医学科', disease: '多重耐药菌感染', learnerType: '住院医师', topic: '医院感染防控', knowledge: '药物治疗' }
  },
  {
    id: 5,
    title: '心脏超声诊断基础',
    coverGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    coverEmoji: '❤️',
    tags: { department: '心内科', disease: '脑卒中', learnerType: '住院医师', topic: '外科手术', knowledge: '超声影像' }
  },
  {
    id: 6,
    title: '腹腔镜手术技巧',
    coverGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    coverEmoji: '🔬',
    tags: { department: '外科', disease: '手术部位感染', learnerType: '主治医师', topic: '外科手术', knowledge: '操作规范' }
  },
  {
    id: 7,
    title: '急性脑卒中救治流程',
    coverGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    coverEmoji: '🧠',
    tags: { department: '神经内科', disease: '脑卒中', learnerType: '规培生', topic: '手术安全', knowledge: '生命支持' }
  },
  {
    id: 8,
    title: '抗菌药物合理使用',
    coverGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    coverEmoji: '💊',
    tags: { department: '药剂科', disease: '多重耐药菌感染', learnerType: '副主任医师', topic: '合理用药', knowledge: '药物选择' }
  },
  {
    id: 9,
    title: 'ECMO技术与管理',
    coverGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    coverEmoji: '💉',
    tags: { department: '重症医学科', disease: '呼吸机相关肺炎', learnerType: '副主任医师', topic: '医院感染防控', knowledge: '生命支持' }
  },
  {
    id: 10,
    title: '围术期安全管理',
    coverGradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    coverEmoji: '🛡️',
    tags: { department: '麻醉科', disease: '手术部位感染', learnerType: '主治医师', topic: '手术安全', knowledge: '操作规范' }
  },
  {
    id: 11,
    title: '呼吸衰竭机械通气',
    coverGradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    coverEmoji: '🫁',
    tags: { department: '呼吸内科', disease: '呼吸机相关肺炎', learnerType: '规培生', topic: '医院感染防控', knowledge: '生命支持' }
  },
  {
    id: 12,
    title: '感染性休克救治指南',
    coverGradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    coverEmoji: '🩺',
    tags: { department: '感染科', disease: '多重耐药菌感染', learnerType: '主治医师', topic: '合理用药', knowledge: '药物治疗' }
  },
  {
    id: 13,
    title: '血管超声入门',
    coverGradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    coverEmoji: '📡',
    tags: { department: '心内科', disease: '脑卒中', learnerType: '住院医师', topic: '外科手术', knowledge: '超声影像' }
  },
  {
    id: 14,
    title: '颅脑外伤急救流程',
    coverGradient: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
    coverEmoji: '🧠',
    tags: { department: '神经内科', disease: '脑卒中', learnerType: '副主任医师', topic: '手术安全', knowledge: '操作规范' }
  },
  {
    id: 15,
    title: '消毒供应中心管理',
    coverGradient: 'linear-gradient(135deg, #feada6 0%, #f5efef 100%)',
    coverEmoji: '🧴',
    tags: { department: '感染科', disease: '手术部位感染', learnerType: '规培生', topic: '手卫生', knowledge: '操作规范' }
  },
  {
    id: 16,
    title: '麻醉药物相互作用',
    coverGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    coverEmoji: '💉',
    tags: { department: '麻醉科', disease: '多重耐药菌感染', learnerType: '主治医师', topic: '合理用药', knowledge: '药物治疗' }
  },
  {
    id: 17,
    title: '脓毒症集束化治疗',
    coverGradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    coverEmoji: '🦠',
    tags: { department: '重症医学科', disease: '呼吸机相关肺炎', learnerType: '副主任医师', topic: '医院感染防控', knowledge: '药物治疗' }
  },
  {
    id: 18,
    title: '胸腔闭式引流术',
    coverGradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    coverEmoji: '🏥',
    tags: { department: '外科', disease: '手术部位感染', learnerType: '住院医师', topic: '外科手术', knowledge: '操作规范' }
  },
  {
    id: 19,
    title: '心力衰竭超声评估',
    coverGradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    coverEmoji: '❤️',
    tags: { department: '心内科', disease: '脑卒中', learnerType: '主治医师', topic: '外科手术', knowledge: '超声影像' }
  },
  {
    id: 20,
    title: '抗菌药物PK/PD指导',
    coverGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    coverEmoji: '💊',
    tags: { department: '药剂科', disease: '多重耐药菌感染', learnerType: '规培生', topic: '合理用药', knowledge: '药物治疗' }
  }
]
