<template>
  <main class="main-content">
    <!-- 用量汇总区域 - 4个数据卡片 -->
    <div class="usage-statistics__card">
      <div class="usage-statistics__header">
        <h2 class="usage-statistics__title">用量汇总</h2>
        <!-- 周期选择器放在标题行右侧 -->
        <div class="usage-statistics__period-select">
          <select class="input input--select" v-model="selectedYear">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}年</option>
          </select>
          <select class="input input--select" v-model="selectedMonth">
            <option v-for="month in monthOptions" :key="month" :value="month">{{ month }}月</option>
          </select>
          <button class="button button--primary" @click="handleSearch">搜索</button>
          <button class="button button--secondary" @click="handleReset">重置</button>
        </div>
      </div>

      <!-- 4个数据卡片 -->
      <div class="usage-statistics__cards">
        <!-- 总积分卡片 -->
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">总积分</div>
            <div class="stat-card__value">{{ summaryData.totalPoints.toLocaleString() }} <span class="stat-card__unit">分</span></div>
          </div>
        </div>

        <!-- 已用积分卡片 -->
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--used">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor"/>
              <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.6"/>
              <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.6"/>
              <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">已用积分</div>
            <div class="stat-card__value">{{ summaryData.consumedPoints.toLocaleString() }} <span class="stat-card__unit">分</span></div>
            <div class="stat-card__sub">
              <span class="stat-card__trend stat-card__trend--up">↑</span>
              <span>本月{{ summaryData.monthConsumed.toLocaleString() }}分</span>
            </div>
          </div>
        </div>

        <!-- 剩余积分卡片 -->
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--remaining">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">剩余积分</div>
            <div class="stat-card__value">{{ summaryData.remainingPoints.toLocaleString() }} <span class="stat-card__unit">分</span></div>
          </div>
        </div>

        <!-- 今日消耗卡片 -->
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--today">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-card__content">
            <div class="stat-card__label">今日消耗</div>
            <div class="stat-card__value">{{ summaryData.todayConsumed.toLocaleString() }} <span class="stat-card__unit">分</span></div>
            <div class="stat-card__sub">
              <span class="stat-card__trend stat-card__trend--up">↑</span>
              <span>环比+{{ summaryData.dayOverDayRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 积分使用进度 - 独立区域 -->
    <div class="usage-statistics__card">
      <div class="usage-statistics__header">
        <h2 class="usage-statistics__title">积分使用进度</h2>
      </div>
      <div class="quota-section">
        <div class="quota-bar">
          <div class="quota-bar__track">
            <div class="quota-bar__fill" :style="{ width: consumptionRate + '%' }"></div>
          </div>
          <div class="quota-bar__percentage">已使用{{ consumptionRate }}%</div>
        </div>
        <div class="quota-bar__labels">
          <span>已用{{ summaryData.consumedPoints.toLocaleString() }}分</span>
          <span>剩余{{ summaryData.remainingPoints.toLocaleString() }}分</span>
        </div>
      </div>
    </div>

    <!-- 数据看板区域 -->
    <div class="usage-statistics__card usage-statistics__card--dashboard">
      <!-- AI功能消耗排行 -->
      <div class="dashboard-panel dashboard-panel--ranking">
        <h3 class="dashboard-panel__title">AI功能消耗排行</h3>
        <div class="ranking-list">
          <div
            class="ranking-item"
            v-for="(item, index) in rankingData"
            :key="item.id"
          >
            <div class="ranking-item__row">
              <div class="ranking-item__info">
                <span class="ranking-item__icon" :class="getRankingIconClass(index)">
                  <component :is="getRankingIcon(index)" />
                </span>
                <span class="ranking-item__name">{{ item.name }}</span>
              </div>
              <div class="ranking-item__stats">
                <span class="ranking-item__points">{{ item.points.toLocaleString() }}</span>
                <span class="ranking-item__calls">{{ item.calls }}次调用</span>
              </div>
            </div>
            <div class="ranking-item__progress">
              <div
                class="ranking-item__progress-bar"
                :style="{ width: (item.points / rankingData[0].points * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 近30天消耗趋势 -->
      <div class="dashboard-panel dashboard-panel--chart">
        <h3 class="dashboard-panel__title">近30天消耗趋势</h3>
        <div class="trend-chart">
          <svg :viewBox="chartViewBox" class="trend-chart__svg">
            <!-- 网格线 -->
            <g class="trend-chart__grid">
              <line
                v-for="n in 5"
                :key="'grid-' + n"
                :x1="chartPadding.left"
                :y1="getChartY(n - 1)"
                :x2="chartWidth - chartPadding.right"
                :y2="getChartY(n - 1)"
                class="trend-chart__grid-line"
              />
            </g>
            <!-- Y轴标签 -->
            <g class="trend-chart__y-axis">
              <text
                v-for="n in 5"
                :key="'y-' + n"
                :x="chartPadding.left - 8"
                :y="getChartY(n - 1) + 4"
                class="trend-chart__axis-label"
              >
                {{ Math.round((chartMax / 4) * (4 - (n - 1))) }}
              </text>
            </g>
            <!-- X轴标签 -->
            <g class="trend-chart__x-axis">
              <text
                v-for="(label, index) in chartXLabels"
                :key="'x-' + index"
                :x="getChartX(index)"
                :y="chartHeight - 4"
                class="trend-chart__axis-label"
              >
                {{ label }}
              </text>
            </g>
            <!-- 填充区域 -->
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#a51c30" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#a51c30" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <path
              :d="chartAreaPath"
              fill="url(#areaGradient)"
              class="trend-chart__area"
            />
            <!-- 折线 -->
            <path
              :d="chartLinePath"
              fill="none"
              class="trend-chart__line"
            />
            <!-- 数据点 -->
            <g class="trend-chart__dots">
              <circle
                v-for="(point, index) in chartPoints"
                :key="'dot-' + index"
                :cx="point.x"
                :cy="point.y"
                r="4"
                class="trend-chart__dot"
                @mouseenter="showTooltip(index, $event)"
                @mouseleave="hideTooltip"
              />
            </g>
            <!-- Tooltip -->
            <g v-if="tooltipVisible" class="trend-chart__tooltip">
              <rect
                :x="tooltipX - 40"
                :y="tooltipY - 28"
                width="80"
                height="24"
                rx="4"
                class="trend-chart__tooltip-bg"
              />
              <text
                :x="tooltipX"
                :y="tooltipY - 12"
                class="trend-chart__tooltip-text"
              >
                {{ tooltipValue }}分
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 用量明细列表区域 -->
    <div class="usage-statistics__card usage-statistics__card--list">
      <div class="usage-statistics__header usage-statistics__header--bordered">
        <h2 class="usage-statistics__title">用量明细</h2>
      </div>
      <!-- 表格区域 -->
      <div class="usage-statistics__table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th class="data-table__th--time">时间</th>
              <th class="data-table__th--user">用户</th>
              <th class="data-table__th--function">AI功能</th>
              <th class="data-table__th--resource">关联资源</th>
              <th class="data-table__th--points">消耗积分</th>
              <th class="data-table__th--status">状态</th>
              <th class="data-table__th--action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedData.length === 0">
              <td colspan="7" class="data-table__empty">暂无数据</td>
            </tr>
            <tr
              v-for="item in paginatedData"
              :key="item.id"
              :class="{ 'data-table__row--failed': item.status === 'failed' }"
            >
              <td class="data-table__time">{{ item.time }}</td>
              <td class="data-table__user">{{ item.user }}</td>
              <td class="data-table__function">
                <span class="function-tag" :class="'function-tag--' + item.functionType">
                  {{ item.aiFunction }}
                </span>
              </td>
              <td class="data-table__resource">{{ item.resource }}</td>
              <td class="data-table__points">
                <span :class="{ 'data-table__points--highlight': item.points >= 100 }">
                  {{ item.points.toLocaleString() }}
                </span>
              </td>
              <td class="data-table__status">
                <span
                  class="status-badge"
                  :class="{
                    'status-badge--success': item.status === 'success',
                    'status-badge--failed': item.status === 'failed'
                  }"
                >
                  {{ item.status === 'success' ? '成功' : '失败' }}
                </span>
              </td>
              <td class="data-table__action">
                <a href="#" class="data-table__link" @click.prevent="viewDetail(item)">查看详情</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <div class="pagination__info">
          共{{ tableData.length }}条记录
        </div>
        <div class="pagination__controls">
          <button
            class="pagination__btn pagination__btn--prev"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >&lt;</button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination__btn"
            :class="{ 'pagination__btn--active': page === currentPage }"
            @click="currentPage = page"
          >{{ page }}</button>
          <button
            class="pagination__btn pagination__btn--next"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >&gt;</button>
        </div>
      </div>
    </div>

    <!-- 侧拉抽屉 - 消耗明细详情 -->
    <Teleport to="body">
      <div v-if="drawerVisible" class="drawer-overlay" @click="closeDrawer"></div>
      <div class="drawer-panel" :class="{ 'drawer-panel--open': drawerVisible }">
        <div class="drawer-header">
          <h3 class="drawer-title">消耗明细</h3>
          <button class="drawer-close" @click="closeDrawer" aria-label="关闭">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="drawer-content" v-if="selectedTask">
          <div class="drawer-info">
            <div class="drawer-info__task">{{ selectedTask.resource }}</div>
            <div class="drawer-info__meta">
              <span>{{ selectedTask.user }}</span>
              <span>{{ selectedTask.aiFunction }}</span>
              <span>{{ selectedTask.time }}</span>
            </div>
          </div>
          <div class="drawer-list">
            <div class="drawer-list__title">积分消耗明细</div>
            <div
              class="drawer-item"
              v-for="(detail, index) in selectedTask.detailItems"
              :key="index"
            >
              <div class="drawer-item__header">
                <span class="drawer-item__name">{{ detail.name }}</span>
                <span class="drawer-item__points">{{ detail.points.toLocaleString() }} 积分</span>
              </div>
              <div class="drawer-item__desc">{{ detail.desc }}</div>
              <div class="drawer-item__progress">
                <div
                  class="drawer-item__progress-bar"
                  :style="{ width: getProgressPercent(detail.points) + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="drawer-footer">
            <span class="drawer-footer__label">消耗总计</span>
            <span class="drawer-footer__value">{{ selectedTask.points.toLocaleString() }} 积分</span>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, h } from 'vue'

// 抽屉状态
const drawerVisible = ref(false)
const selectedTask = ref(null)

// 年月选择
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

const selectedYear = ref(currentYear)
const selectedMonth = ref(new Date().getMonth() + 1)

// 用量汇总数据 - 4个指标卡片
const summaryData = ref({
  totalPoints: 50000,
  consumedPoints: 32860,
  remainingPoints: 17140,
  monthConsumed: 8750,
  todayConsumed: 420,
  dayOverDayRate: 12.5
})

// 计算消耗百分比
const consumptionRate = computed(() => {
  if (summaryData.value.totalPoints === 0) return 0
  return Math.round((summaryData.value.consumedPoints / summaryData.value.totalPoints) * 100)
})

// AI功能消耗排行数据
const rankingData = ref([
  { id: 1, name: '智能分析', points: 15680, calls: 324, type: 'analysis' },
  { id: 2, name: '智能标签', points: 8420, calls: 512, type: 'tag' },
  { id: 3, name: '封面生成', points: 4360, calls: 186, type: 'image' },
  { id: 4, name: '课程推荐', points: 2400, calls: 320, type: 'book' },
  { id: 5, name: '内容摘要', points: 1200, calls: 98, type: 'text' },
  { id: 6, name: '智能问答', points: 800, calls: 64, type: 'chat' }
])

// 排行图标组件
const rankingIcons = [
  // 智能分析 - 图表图标
  {
    render() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
        h('rect', { x: 3, y: 3, width: 6, height: 6, rx: 1, fill: 'currentColor' }),
        h('rect', { x: 15, y: 3, width: 6, height: 6, rx: 1, fill: 'currentColor' }),
        h('rect', { x: 3, y: 15, width: 6, height: 6, rx: 1, fill: 'currentColor' }),
        h('rect', { x: 15, y: 15, width: 6, height: 6, rx: 1, fill: 'currentColor' })
      ])
    }
  },
  // 智能标签 - 标签图标
  {
    render() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
        h('path', { d: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
        h('circle', { cx: 7, cy: 7, r: 1.5, fill: 'currentColor' })
      ])
    }
  },
  // 封面生成 - 图片图标
  {
    render() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
        h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 2, stroke: 'currentColor', 'stroke-width': 2 }),
        h('circle', { cx: 8.5, cy: 8.5, r: 1.5, fill: 'currentColor' }),
        h('path', { d: 'M21 15l-5-5L5 21', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
      ])
    }
  },
  // 课程推荐 - 书本图标
  {
    render() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
        h('path', { d: 'M4 19.5A2.5 2.5 0 016.5 17H20', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }),
        h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z', stroke: 'currentColor', 'stroke-width': 2 })
      ])
    }
  },
  // 内容摘要 - 文本图标
  {
    render() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
        h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', stroke: 'currentColor', 'stroke-width': 2 }),
        h('path', { d: 'M14 2v6h6M16 13H8M16 17H8M10 9H8', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' })
      ])
    }
  },
  // 智能问答 - 聊天气泡图标
  {
    render() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
        h('path', { d: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z', stroke: 'currentColor', 'stroke-width': 2 })
      ])
    }
  }
]

function getRankingIcon(index) {
  return rankingIcons[index] || rankingIcons[0]
}

function getRankingIconClass(index) {
  const classes = ['ranking-item__icon--analysis', 'ranking-item__icon--tag', 'ranking-item__icon--image', 'ranking-item__icon--book', 'ranking-item__icon--text', 'ranking-item__icon--chat']
  return classes[index] || classes[0]
}

// 近30天消耗趋势图
const chartData = ref([
  180, 220, 150, 280, 320, 250, 190, 210, 290, 350,
  280, 310, 240, 200, 270, 330, 290, 260, 300, 340,
  280, 250, 310, 360, 320, 290, 380, 340, 400, 420
])

const chartMax = 500
const chartWidth = 560
const chartHeight = 300
const chartPadding = { top: 20, right: 20, bottom: 30, left: 50 }

const chartViewBox = computed(() => `0 0 ${chartWidth} ${chartHeight}`)

const chartPoints = computed(() => {
  const points = []
  const data = chartData.value
  const chartAreaWidth = chartWidth - chartPadding.left - chartPadding.right
  const chartAreaHeight = chartHeight - chartPadding.top - chartPadding.bottom

  for (let i = 0; i < data.length; i++) {
    const x = chartPadding.left + (i / (data.length - 1)) * chartAreaWidth
    const y = chartPadding.top + chartAreaHeight - (data[i] / chartMax) * chartAreaHeight
    points.push({ x, y })
  }
  return points
})

const chartLinePath = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  return path
})

const chartAreaPath = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return ''
  const bottomY = chartHeight - chartPadding.bottom
  let path = `M ${points[0].x} ${bottomY}`
  path += ` L ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  path += ` L ${points[points.length - 1].x} ${bottomY} Z`
  return path
})

const chartXLabels = computed(() => {
  const labels = []
  const data = chartData.value
  const labelCount = 6
  for (let i = 0; i < labelCount; i++) {
    const index = Math.round((i / (labelCount - 1)) * (data.length - 1))
    const day = index + 1
    labels.push(`${day}日`)
  }
  return labels
})

function getChartX(index) {
  const chartAreaWidth = chartWidth - chartPadding.left - chartPadding.right
  return chartPadding.left + (index / (chartXLabels.value.length - 1)) * chartAreaWidth
}

function getChartY(index) {
  const chartAreaHeight = chartHeight - chartPadding.top - chartPadding.bottom
  return chartPadding.top + (index / 4) * chartAreaHeight
}

// Tooltip
const tooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)
const tooltipValue = ref('')

function showTooltip(index, event) {
  const point = chartPoints.value[index]
  tooltipX.value = point.x
  tooltipY.value = point.y
  tooltipValue.value = chartData.value[index]
  tooltipVisible.value = true
}

function hideTooltip() {
  tooltipVisible.value = false
}

// 用量明细表格数据 - 6列
const tableData = ref([
  {
    id: 1,
    time: '2026-04-30 09:32:15',
    user: '刘明',
    aiFunction: '智能分析',
    functionType: 'analysis',
    resource: '呼吸机相关肺炎防控新进展',
    points: 52,
    status: 'success',
    detailItems: [
      { name: '语音识别分析', points: 18, desc: '对视频音频进行ASR转写' },
      { name: '关键帧提取', points: 14, desc: '智能提取视频关键画面' },
      { name: '内容理解', points: 12, desc: '基于NLP的深度内容分析' },
      { name: '标签匹配', points: 8, desc: '与已有标签体系进行匹配' }
    ]
  },
  {
    id: 2,
    time: '2026-04-30 09:15:08',
    user: '张丽',
    aiFunction: '智能标签',
    functionType: 'tag',
    resource: '插管相关血流感染的预防',
    points: 18,
    status: 'success',
    detailItems: [
      { name: '批量语音识别', points: 8, desc: '多视频批量ASR转写' },
      { name: '标签自动生成', points: 6, desc: 'AI智能标签生成' },
      { name: '标签权重计算', points: 4, desc: '标签重要性排序计算' }
    ]
  },
  {
    id: 3,
    time: '2026-04-29 11:42:09',
    user: '吴静',
    aiFunction: '封面生成',
    functionType: 'image',
    resource: '临床微生物标本采集和送检',
    points: 22,
    status: 'failed',
    detailItems: [
      { name: '精彩画面检测', points: 8, desc: 'AI识别最具代表性画面' },
      { name: '封面图生成', points: 8, desc: '智能合成高质量封面' },
      { name: '多尺寸适配', points: 6, desc: '自动生成多规格封面尺寸' }
    ]
  },
  {
    id: 4,
    time: '2026-04-29 10:28:33',
    user: '王强',
    aiFunction: '课程推荐',
    functionType: 'book',
    resource: '手术部位感染预防与控制指南',
    points: 35,
    status: 'success',
    detailItems: [
      { name: '学员画像分析', points: 12, desc: '学员学习历史与能力评估' },
      { name: '课程知识图谱', points: 10, desc: '课程内容知识体系构建' },
      { name: '路径规划算法', points: 8, desc: '个性化学习路径生成' },
      { name: '效果预测模型', points: 5, desc: '学习效果预测分析' }
    ]
  },
  {
    id: 5,
    time: '2026-04-29 09:15:42',
    user: '李华',
    aiFunction: '智能分析',
    functionType: 'analysis',
    resource: '多重耐药菌防控措施',
    points: 48,
    status: 'success',
    detailItems: [
      { name: '语音识别分析', points: 16, desc: '对视频音频进行ASR转写' },
      { name: '关键帧提取', points: 12, desc: '智能提取视频关键画面' },
      { name: '内容理解', points: 12, desc: '基于NLP的深度内容分析' },
      { name: '标签匹配', points: 8, desc: '与已有标签体系进行匹配' }
    ]
  },
  {
    id: 6,
    time: '2026-04-28 16:45:21',
    user: '刘明',
    aiFunction: '内容摘要',
    functionType: 'text',
    resource: '医疗废物管理规范',
    points: 15,
    status: 'success',
    detailItems: [
      { name: '关键段落提取', points: 8, desc: '智能提取核心内容段落' },
      { name: '摘要生成', points: 7, desc: 'AI自动生成内容摘要' }
    ]
  },
  {
    id: 7,
    time: '2026-04-28 14:32:18',
    user: '张丽',
    aiFunction: '智能问答',
    functionType: 'chat',
    resource: '急诊急救技能培训系列',
    points: 28,
    status: 'success',
    detailItems: [
      { name: '知识点提取', points: 10, desc: '从课件中提取关键知识点' },
      { name: '问答对生成', points: 12, desc: 'AI自动生成问答对' },
      { name: '答案解析生成', points: 6, desc: '详细答案解析内容生成' }
    ]
  },
  {
    id: 8,
    time: '2026-04-28 11:20:05',
    user: '吴静',
    aiFunction: '封面生成',
    functionType: 'image',
    resource: '职业防护指南',
    points: 20,
    status: 'success',
    detailItems: [
      { name: '精彩画面检测', points: 8, desc: 'AI识别最具代表性画面' },
      { name: '封面图生成', points: 8, desc: '智能合成高质量封面' },
      { name: '多尺寸适配', points: 4, desc: '自动生成多规格封面尺寸' }
    ]
  },
  {
    id: 9,
    time: '2026-04-27 15:48:33',
    user: '王强',
    aiFunction: '智能分析',
    functionType: 'analysis',
    resource: '消毒灭菌技术规范',
    points: 56,
    status: 'success',
    detailItems: [
      { name: '语音识别分析', points: 18, desc: '对视频音频进行ASR转写' },
      { name: '关键帧提取', points: 14, desc: '智能提取视频关键画面' },
      { name: '内容理解', points: 14, desc: '基于NLP的深度内容分析' },
      { name: '标签匹配', points: 10, desc: '与已有标签体系进行匹配' }
    ]
  },
  {
    id: 10,
    time: '2026-04-27 13:25:17',
    user: '李华',
    aiFunction: '智能标签',
    functionType: 'tag',
    resource: '心肺复苏术培训',
    points: 22,
    status: 'failed',
    detailItems: [
      { name: '批量语音识别', points: 10, desc: '多视频批量ASR转写' },
      { name: '标签自动生成', points: 8, desc: 'AI智能标签生成' },
      { name: '标签权重计算', points: 4, desc: '标签重要性排序计算' }
    ]
  },
  {
    id: 11,
    time: '2026-04-26 10:15:44',
    user: '刘明',
    aiFunction: '课程推荐',
    functionType: 'book',
    resource: '住院医师规范化培训',
    points: 38,
    status: 'success',
    detailItems: [
      { name: '学员画像分析', points: 12, desc: '学员学习历史与能力评估' },
      { name: '课程知识图谱', points: 10, desc: '课程内容知识体系构建' },
      { name: '路径规划算法', points: 10, desc: '个性化学习路径生成' },
      { name: '效果预测模型', points: 6, desc: '学习效果预测分析' }
    ]
  },
  {
    id: 12,
    time: '2026-04-26 09:30:22',
    user: '张丽',
    aiFunction: '智能分析',
    functionType: 'analysis',
    resource: '院感监控数据分析',
    points: 45,
    status: 'success',
    detailItems: [
      { name: '语音识别分析', points: 15, desc: '对视频音频进行ASR转写' },
      { name: '关键帧提取', points: 12, desc: '智能提取视频关键画面' },
      { name: '内容理解', points: 10, desc: '基于NLP的深度内容分析' },
      { name: '标签匹配', points: 8, desc: '与已有标签体系进行匹配' }
    ]
  },
  {
    id: 13,
    time: '2026-04-25 16:28:51',
    user: '吴静',
    aiFunction: '内容摘要',
    functionType: 'text',
    resource: '医疗质量管理',
    points: 18,
    status: 'success',
    detailItems: [
      { name: '关键段落提取', points: 8, desc: '智能提取核心内容段落' },
      { name: '摘要生成', points: 6, desc: 'AI自动生成内容摘要' },
      { name: '格式优化', points: 4, desc: '摘要格式规范化处理' }
    ]
  },
  {
    id: 14,
    time: '2026-04-25 14:12:36',
    user: '王强',
    aiFunction: '智能问答',
    functionType: 'chat',
    resource: '临床路径培训课程',
    points: 32,
    status: 'success',
    detailItems: [
      { name: '知识点提取', points: 10, desc: '从课件中提取关键知识点' },
      { name: '问答对生成', points: 14, desc: 'AI自动生成问答对' },
      { name: '答案解析生成', points: 8, desc: '详细答案解析内容生成' }
    ]
  },
  {
    id: 15,
    time: '2026-04-25 11:45:29',
    user: '李华',
    aiFunction: '封面生成',
    functionType: 'image',
    resource: '护理操作规范视频',
    points: 24,
    status: 'success',
    detailItems: [
      { name: '精彩画面检测', points: 10, desc: 'AI识别最具代表性画面' },
      { name: '封面图生成', points: 8, desc: '智能合成高质量封面' },
      { name: '多尺寸适配', points: 6, desc: '自动生成多规格封面尺寸' }
    ]
  }
])

// 分页逻辑
const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(tableData.value.length / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 搜索
function handleSearch() {
  currentPage.value = 1
  generateMockData()
}

// 重置
function handleReset() {
  selectedYear.value = currentYear
  selectedMonth.value = new Date().getMonth() + 1
  currentPage.value = 1
  generateMockData()
}

// 生成模拟数据
function generateMockData() {
  const basePoints = selectedYear.value * 100 + selectedMonth.value * 10
  summaryData.value = {
    totalPoints: 50000,
    consumedPoints: Math.floor(basePoints * 0.6) + 30000,
    remainingPoints: 50000 - (Math.floor(basePoints * 0.6) + 30000),
    monthConsumed: Math.floor(basePoints * 0.15) + 8000,
    todayConsumed: Math.floor(Math.random() * 500) + 300,
    dayOverDayRate: (Math.random() * 30 + 5).toFixed(1)
  }
}

// 查看详情
function viewDetail(item) {
  selectedTask.value = item
  drawerVisible.value = true
}

// 关闭抽屉
function closeDrawer() {
  drawerVisible.value = false
}

// 计算单个明细项占总消耗的百分比
function getProgressPercent(itemPoints) {
  if (!selectedTask.value) return 0
  return Math.round((itemPoints / selectedTask.value.points) * 100)
}
</script>

<style scoped>
/* 用量统计页面：整体可滚动，隐藏滚动条 */
.main-content {
  overflow-y: auto !important;
  padding: var(--spacing-md) !important;
  gap: var(--spacing-md) !important;
  scrollbar-width: none !important;
}
.main-content::-webkit-scrollbar {
  display: none !important;
}
</style>
