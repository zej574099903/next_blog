# DataV 大屏开发指南

## 1. DataV 简介

DataV 是阿里云推出的数据可视化工具，用于创建专业的可视化应用。本文将介绍如何使用 DataV 开发响应式大屏项目。

## 2. 响应式布局实现

### 2.1 基础布局方案

```javascript
// utils/scale.js
export default {
  data() {
    return {
      scale: {
        width: '1920',
        height: '1080',
        option: {
          autoScale: true,
          delay: 500
        }
      }
    }
  },
  mounted() {
    this.setScale()
    window.addEventListener('resize', this.debounce(this.setScale, 100))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setScale)
  },
  methods: {
    setScale() {
      const clientWidth = document.documentElement.clientWidth
      const clientHeight = document.documentElement.clientHeight
      const widthScale = clientWidth / this.scale.width
      const heightScale = clientHeight / this.scale.height
      const scale = Math.min(widthScale, heightScale)
      
      this.$refs.screen.style.transform = `scale(${scale})`
    },
    debounce(fn, delay) {
      let timer = null
      return function() {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(this, arguments)
        }, delay)
      }
    }
  }
}
```

### 2.2 组件布局示例

```vue
<!-- components/DataScreen.vue -->
<template>
  <div class="data-screen" ref="screen">
    <div class="header">
      <div class="title">数据可视化大屏</div>
      <div class="time">{{ currentTime }}</div>
    </div>
    <div class="content">
      <div class="left-panel">
        <chart-card title="销售趋势">
          <line-chart :data="salesData" />
        </chart-card>
        <chart-card title="区域分布">
          <map-chart :data="regionData" />
        </chart-card>
      </div>
      <div class="center-panel">
        <number-scroll :numbers="totalNumbers" />
        <real-time-monitor :data="monitorData" />
      </div>
      <div class="right-panel">
        <chart-card title="客户画像">
          <pie-chart :data="customerData" />
        </chart-card>
        <chart-card title="业务指标">
          <bar-chart :data="businessData" />
        </chart-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import useScale from '@/utils/scale'

export default {
  name: 'DataScreen',
  setup() {
    const currentTime = ref('')
    const timer = ref(null)

    const updateTime = () => {
      currentTime.value = new Date().toLocaleString()
    }

    onMounted(() => {
      updateTime()
      timer.value = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timer.value) {
        clearInterval(timer.value)
      }
    })

    return {
      currentTime
    }
  }
}
</script>

<style lang="scss" scoped>
.data-screen {
  width: 1920px;
  height: 1080px;
  transform-origin: left top;
  position: fixed;
  background: #0f1325;
  color: #fff;
  
  .header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    background: rgba(0, 0, 0, 0.2);
    
    .title {
      font-size: 32px;
      font-weight: bold;
    }
    
    .time {
      font-size: 24px;
    }
  }
  
  .content {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    height: calc(100% - 80px);
    
    .left-panel,
    .right-panel {
      width: 460px;
    }
    
    .center-panel {
      width: 920px;
      margin: 0 20px;
    }
  }
}
</style>
```

## 3. 图表组件封装

### 3.1 基础图表封装

```vue
<!-- components/charts/BaseChart.vue -->
<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'BaseChart',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref(null)
    let chart = null

    const initChart = () => {
      if (chart) {
        chart.dispose()
      }
      chart = echarts.init(chartRef.value)
      chart.setOption(props.options)
    }

    const handleResize = () => {
      chart && chart.resize()
    }

    watch(
      () => props.options,
      () => {
        initChart()
      },
      { deep: true }
    )

    onMounted(() => {
      initChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      if (chart) {
        chart.dispose()
        chart = null
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      chartRef
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
```

### 3.2 数字滚动组件

```vue
<!-- components/NumberScroll.vue -->
<template>
  <div class="number-scroll">
    <div
      class="number-item"
      v-for="(number, index) in numberArray"
      :key="index"
    >
      <span
        class="number-span"
        :style="{ transform: `translateY(${-number * 10}%)` }"
      >
        <span v-for="n in 10" :key="n">{{ n - 1 }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberScroll',
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  computed: {
    numberArray() {
      return String(this.value).split('')
    }
  }
}
</script>

<style lang="scss" scoped>
.number-scroll {
  display: flex;
  
  .number-item {
    width: 40px;
    height: 60px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    margin: 0 2px;
    border-radius: 4px;
    
    .number-span {
      display: flex;
      flex-direction: column;
      transition: transform 1s ease-in-out;
      
      span {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 36px;
        font-weight: bold;
      }
    }
  }
}
</style>
```

## 4. 数据更新与动画

### 4.1 WebSocket 实时数据更新

```javascript
// utils/websocket.js
export default class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url
    this.options = options
    this.ws = null
    this.timer = null
    this.isConnected = false
    this.reconnectCount = 0
    this.maxReconnectCount = options.maxReconnectCount || 5
    this.reconnectTime = options.reconnectTime || 5000
  }

  connect() {
    if (this.isConnected) return
    
    this.ws = new WebSocket(this.url)
    
    this.ws.onopen = () => {
      this.isConnected = true
      this.reconnectCount = 0
      if (this.options.onOpen) {
        this.options.onOpen()
      }
    }
    
    this.ws.onmessage = (event) => {
      if (this.options.onMessage) {
        this.options.onMessage(JSON.parse(event.data))
      }
    }
    
    this.ws.onclose = () => {
      this.isConnected = false
      this.reconnect()
    }
    
    this.ws.onerror = (error) => {
      if (this.options.onError) {
        this.options.onError(error)
      }
    }
  }

  reconnect() {
    if (this.reconnectCount >= this.maxReconnectCount) return
    
    this.timer = setTimeout(() => {
      this.reconnectCount++
      this.connect()
    }, this.reconnectTime)
  }

  send(data) {
    if (this.isConnected) {
      this.ws.send(JSON.stringify(data))
    }
  }

  close() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.ws) {
      this.ws.close()
    }
  }
}
```

### 4.2 动画效果实现

```javascript
// utils/animation.js
export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now()
  
  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const value = start + (end - start) * progress
    callback(value)
    
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  
  requestAnimationFrame(update)
}
```

## 5. 性能优化

### 5.1 图表性能优化

1. **按需加载 ECharts 图表组件**：
```javascript
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  LineChart,
  BarChart,
  CanvasRenderer
])
```

2. **使用防抖和节流**：
```javascript
export const debounce = (fn, delay) => {
  let timer = null
  return function() {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

export const throttle = (fn, delay) => {
  let last = 0
  return function() {
    const now = Date.now()
    if (now - last > delay) {
      fn.apply(this, arguments)
      last = now
    }
  }
}
```

### 5.2 资源加载优化

1. **图片懒加载**：
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img)
    }
  })
})

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img)
})
```

2. **预加载关键资源**：
```html
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">
```

## 6. 最佳实践建议

1. **布局设计**：
   - 采用栅格系统
   - 使用相对单位（vw、vh）
   - 设置最小宽度和高度

2. **数据处理**：
   - 采用分页或虚拟滚动
   - 数据缓存
   - 增量更新

3. **动画效果**：
   - 使用 CSS3 动画
   - 避免重绘和回流
   - 使用 transform 和 opacity

4. **响应式适配**：
   - 媒体查询
   - 动态计算缩放比例
   - 断点设置

5. **性能优化**：
   - 组件懒加载
   - 图片优化
   - 缓存策略
