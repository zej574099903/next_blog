# Canvas 水印实现指南

## 1. 基础水印实现

### 1.1 水印工具类

```typescript
// utils/watermark.ts
export class Watermark {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private observer: MutationObserver | null = null

  constructor(private options: WatermarkOptions = {}) {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not supported')
    this.ctx = ctx
    this.init()
  }

  private get defaultOptions(): WatermarkOptions {
    return {
      text: '内部文件，请勿外传',
      fontSize: 16,
      fontFamily: 'Arial',
      textColor: 'rgba(0, 0, 0, 0.1)',
      rotate: -30,
      gapX: 100,
      gapY: 100,
      zIndex: 1000,
      width: 300,
      height: 200,
      observe: true
    }
  }

  init() {
    const options = { ...this.defaultOptions, ...this.options }
    const {
      text,
      fontSize,
      fontFamily,
      textColor,
      rotate,
      width,
      height
    } = options

    // 设置画布尺寸
    this.canvas.width = width
    this.canvas.height = height

    // 设置文字样式
    this.ctx.font = `${fontSize}px ${fontFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    // 旋转画布
    this.ctx.translate(width / 2, height / 2)
    this.ctx.rotate((rotate * Math.PI) / 180)
    this.ctx.translate(-width / 2, -height / 2)

    // 绘制文字
    this.ctx.fillText(text, width / 2, height / 2)
  }

  /**
   * 将水印应用到目标元素
   */
  apply(target: HTMLElement = document.body) {
    const { gapX, gapY, zIndex, observe } = { ...this.defaultOptions, ...this.options }

    // 创建水印容器
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background-repeat: repeat;
      z-index: ${zIndex};
    `

    // 设置背景图片
    container.style.backgroundImage = `url(${this.canvas.toDataURL('image/png')})`
    container.style.backgroundPosition = `${gapX}px ${gapY}px`

    // 添加到目标元素
    target.appendChild(container)

    // 添加防篡改监听
    if (observe) {
      this.observe(container)
    }

    return container
  }

  /**
   * 监听水印元素变化
   */
  private observe(container: HTMLElement) {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          const target = mutation.target as HTMLElement
          if (target === container) {
            // 恢复水印样式
            this.restoreWatermark(container)
          }
        }
      })
    })

    this.observer.observe(container, {
      attributes: true,
      childList: true,
      subtree: true
    })
  }

  /**
   * 恢复水印样式
   */
  private restoreWatermark(container: HTMLElement) {
    const { gapX, gapY, zIndex } = { ...this.defaultOptions, ...this.options }
    
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroundRepeat: 'repeat',
      zIndex: String(zIndex),
      backgroundImage: `url(${this.canvas.toDataURL('image/png')})`,
      backgroundPosition: `${gapX}px ${gapY}px`
    })
  }

  /**
   * 销毁水印
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

interface WatermarkOptions {
  text?: string
  fontSize?: number
  fontFamily?: string
  textColor?: string
  rotate?: number
  gapX?: number
  gapY?: number
  zIndex?: number
  width?: number
  height?: number
  observe?: boolean
}
```

### 1.2 Vue3 组件封装

```vue
<!-- components/Watermark.vue -->
<template>
  <div ref="containerRef">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Watermark } from '@/utils/watermark'

interface Props {
  text?: string
  fontSize?: number
  fontFamily?: string
  textColor?: string
  rotate?: number
  gapX?: number
  gapY?: number
  zIndex?: number
  width?: number
  height?: number
  observe?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '内部文件，请勿外传',
  fontSize: 16,
  fontFamily: 'Arial',
  textColor: 'rgba(0, 0, 0, 0.1)',
  rotate: -30,
  gapX: 100,
  gapY: 100,
  zIndex: 1000,
  width: 300,
  height: 200,
  observe: true
})

const containerRef = ref<HTMLElement>()
let watermark: Watermark | null = null

onMounted(() => {
  if (containerRef.value) {
    watermark = new Watermark(props)
    watermark.apply(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (watermark) {
    watermark.destroy()
    watermark = null
  }
})
</script>
```

## 2. 高级功能实现

### 2.1 动态水印

```typescript
// utils/dynamic-watermark.ts
export class DynamicWatermark extends Watermark {
  private animationFrame: number | null = null

  /**
   * 创建动态水印
   */
  applyDynamic(target: HTMLElement = document.body) {
    const container = this.apply(target)
    this.startAnimation(container)
    return container
  }

  /**
   * 开始动画
   */
  private startAnimation(container: HTMLElement) {
    let offset = 0
    const animate = () => {
      offset = (offset + 1) % 100
      container.style.backgroundPosition = `${offset}px ${offset}px`
      this.animationFrame = requestAnimationFrame(animate)
    }
    
    this.animationFrame = requestAnimationFrame(animate)
  }

  /**
   * 停止动画
   */
  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  destroy() {
    super.destroy()
    this.stopAnimation()
  }
}
```

### 2.2 图片水印

```typescript
// utils/image-watermark.ts
export class ImageWatermark extends Watermark {
  /**
   * 为图片添加水印
   */
  async applyToImage(
    imageUrl: string,
    options: { downloadName?: string } = {}
  ): Promise<string> {
    // 加载原始图片
    const image = await this.loadImage(imageUrl)
    
    // 创建新画布
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not supported')
    
    // 绘制原始图片
    ctx.drawImage(image, 0, 0)
    
    // 绘制水印
    const pattern = ctx.createPattern(this.canvas, 'repeat')
    if (pattern) {
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    // 返回结果
    if (options.downloadName) {
      this.downloadImage(canvas, options.downloadName)
    }
    
    return canvas.toDataURL('image/png')
  }

  /**
   * 加载图片
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  /**
   * 下载图片
   */
  private downloadImage(canvas: HTMLCanvasElement, filename: string) {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }
}
```

## 3. 使用示例

### 3.1 基础水印

```vue
<template>
  <watermark text="公司机密文件">
    <div class="content">
      <!-- 页面内容 -->
    </div>
  </watermark>
</template>

<script setup>
import Watermark from '@/components/Watermark.vue'
</script>
```

### 3.2 动态水印

```typescript
const dynamicWatermark = new DynamicWatermark({
  text: '机密文件',
  rotate: -30
})

// 应用动态水印
dynamicWatermark.applyDynamic()

// 停止动画
dynamicWatermark.stopAnimation()

// 销毁水印
dynamicWatermark.destroy()
```

### 3.3 图片水印

```typescript
const imageWatermark = new ImageWatermark({
  text: '版权所有',
  fontSize: 20,
  textColor: 'rgba(255, 255, 255, 0.3)'
})

// 为图片添加水印
const watermarkedImage = await imageWatermark.applyToImage(
  'path/to/image.jpg',
  { downloadName: 'watermarked.png' }
)
```

## 4. 安全性增强

### 4.1 防篡改机制

```typescript
// utils/secure-watermark.ts
export class SecureWatermark extends Watermark {
  private securityKey: string

  constructor(options: WatermarkOptions & { securityKey?: string }) {
    super(options)
    this.securityKey = options.securityKey || this.generateKey()
  }

  /**
   * 生成安全密钥
   */
  private generateKey(): string {
    return Math.random().toString(36).substring(2)
  }

  /**
   * 验证水印完整性
   */
  private verifyIntegrity(container: HTMLElement): boolean {
    const currentHash = this.calculateHash(container)
    const storedHash = container.getAttribute('data-watermark-hash')
    return currentHash === storedHash
  }

  /**
   * 计算水印哈希值
   */
  private calculateHash(container: HTMLElement): string {
    const content = container.style.cssText + this.securityKey
    return btoa(content)
  }

  apply(target: HTMLElement = document.body) {
    const container = super.apply(target)
    
    // 添加安全标记
    const hash = this.calculateHash(container)
    container.setAttribute('data-watermark-hash', hash)
    
    // 增强监听
    this.observe(container)
    
    return container
  }

  private observe(container: HTMLElement) {
    super.observe(container)
    
    // 添加额外的安全检查
    setInterval(() => {
      if (!this.verifyIntegrity(container)) {
        this.restoreWatermark(container)
      }
    }, 1000)
  }
}
```

## 5. 性能优化

1. **Canvas 优化**：
   - 使用 `requestAnimationFrame` 代替 `setInterval`
   - 适当调整画布大小
   - 使用离屏渲染

2. **内存管理**：
   - 及时清理不需要的资源
   - 避免内存泄漏
   - 使用 `WeakMap` 存储引用

3. **渲染优化**：
   - 使用 CSS transform
   - 避免频繁重绘
   - 使用 GPU 加速

## 6. 最佳实践

1. **安全性考虑**：
   - 使用加密水印
   - 实现防篡改机制
   - 定期验证完整性

2. **性能考虑**：
   - 合理设置更新频率
   - 优化渲染性能
   - 减少 DOM 操作

3. **用户体验**：
   - 合理的水印透明度
   - 避免影响页面交互
   - 提供配置选项
