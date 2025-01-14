# Vue3 自定义 Hooks 实现

## 1. useTimeoutFn（延时执行函数）

```typescript
import { ref } from 'vue'

/**
 * 延时执行函数
 * @param fn 要执行的函数
 * @param delay 延时时间（毫秒）
 */
export function useTimeoutFn(fn: () => void, delay: number) {
  const isPending = ref(false)
  let timer: number | null = null

  const clear = () => {
    if (timer) {
      window.clearTimeout(timer)
      timer = null
    }
  }

  const start = () => {
    clear()
    isPending.value = true
    timer = window.setTimeout(() => {
      fn()
      isPending.value = false
      timer = null
    }, delay)
  }

  const stop = () => {
    isPending.value = false
    clear()
  }

  return {
    isPending,
    start,
    stop
  }
}

// 使用示例：
const { isPending, start, stop } = useTimeoutFn(() => {
  console.log('延时执行')
}, 1000)
```

## 2. useI18n（国际化）

```typescript
import { ref, reactive } from 'vue'

interface I18nMessages {
  [key: string]: {
    [key: string]: string
  }
}

export function useI18n(messages: I18nMessages) {
  const locale = ref('zh-CN')
  const i18nMessages = reactive(messages)

  const t = (key: string) => {
    const keys = key.split('.')
    let result = i18nMessages[locale.value]
    
    for (const k of keys) {
      if (result) {
        result = result[k]
      }
    }
    
    return result || key
  }

  const setLocale = (newLocale: string) => {
    if (i18nMessages[newLocale]) {
      locale.value = newLocale
    }
  }

  return {
    locale,
    t,
    setLocale
  }
}

// 使用示例：
const messages = {
  'zh-CN': {
    hello: '你好',
    welcome: '欢迎'
  },
  'en-US': {
    hello: 'Hello',
    welcome: 'Welcome'
  }
}

const { t, setLocale } = useI18n(messages)
console.log(t('hello')) // 输出：你好
setLocale('en-US')
console.log(t('hello')) // 输出：Hello
```

## 3. useMessage（消息提示）

```typescript
import { ref } from 'vue'

interface MessageOptions {
  duration?: number
  type?: 'info' | 'success' | 'warning' | 'error'
}

export function useMessage() {
  const visible = ref(false)
  const message = ref('')
  const type = ref<MessageOptions['type']>('info')
  let timer: number | null = null

  const show = (text: string, options: MessageOptions = {}) => {
    if (timer) clearTimeout(timer)
    
    message.value = text
    type.value = options.type || 'info'
    visible.value = true
    
    timer = window.setTimeout(() => {
      hide()
    }, options.duration || 3000)
  }

  const hide = () => {
    visible.value = false
    message.value = ''
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  return {
    visible,
    message,
    type,
    show,
    hide
  }
}

// 使用示例：
const { show } = useMessage()
show('操作成功', { type: 'success', duration: 2000 })
```

## 4. useDebounceFn（防抖函数）

```typescript
import { ref } from 'vue'

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let timer: number | null = null
  const isPending = ref(false)

  const run = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    isPending.value = true
    
    timer = window.setTimeout(() => {
      fn(...args)
      isPending.value = false
      timer = null
    }, delay)
  }

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
      isPending.value = false
    }
  }

  return {
    run,
    cancel,
    isPending
  }
}

// 使用示例：
const { run, cancel } = useDebounceFn((value: string) => {
  console.log('搜索:', value)
}, 500)
```

## 5. useThrottleFn（节流函数）

```typescript
import { ref } from 'vue'

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let lastTime = 0
  let timer: number | null = null
  const isPending = ref(false)

  const run = (...args: Parameters<T>) => {
    const currentTime = Date.now()
    
    if (currentTime - lastTime > delay) {
      fn(...args)
      lastTime = currentTime
      isPending.value = false
    } else {
      if (timer) clearTimeout(timer)
      isPending.value = true
      
      timer = window.setTimeout(() => {
        fn(...args)
        lastTime = Date.now()
        isPending.value = false
        timer = null
      }, delay)
    }
  }

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
      isPending.value = false
    }
  }

  return {
    run,
    cancel,
    isPending
  }
}

// 使用示例：
const { run } = useThrottleFn((e: MouseEvent) => {
  console.log('滚动位置:', e.pageY)
}, 200)
```

## 6. usePage（分页）

```typescript
import { ref, computed } from 'vue'

interface PageOptions {
  total: number
  pageSize?: number
  currentPage?: number
}

export function usePage(options: PageOptions) {
  const pageSize = ref(options.pageSize || 10)
  const currentPage = ref(options.currentPage || 1)
  const total = ref(options.total)

  // 总页数
  const totalPages = computed(() => 
    Math.ceil(total.value / pageSize.value)
  )

  // 是否有上一页
  const hasPrev = computed(() => 
    currentPage.value > 1
  )

  // 是否有下一页
  const hasNext = computed(() => 
    currentPage.value < totalPages.value
  )

  // 页码数组
  const pageNumbers = computed(() => {
    const pages = []
    const maxPages = 7 // 最多显示的页码数
    const half = Math.floor(maxPages / 2)
    
    let start = currentPage.value - half
    let end = currentPage.value + half
    
    if (start < 1) {
      start = 1
      end = Math.min(maxPages, totalPages.value)
    }
    
    if (end > totalPages.value) {
      end = totalPages.value
      start = Math.max(1, end - maxPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })

  // 跳转到指定页
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // 上一页
  const prevPage = () => {
    if (hasPrev.value) {
      currentPage.value--
    }
  }

  // 下一页
  const nextPage = () => {
    if (hasNext.value) {
      currentPage.value++
    }
  }

  return {
    pageSize,
    currentPage,
    total,
    totalPages,
    hasPrev,
    hasNext,
    pageNumbers,
    goToPage,
    prevPage,
    nextPage
  }
}

// 使用示例：
const {
  currentPage,
  pageSize,
  pageNumbers,
  hasPrev,
  hasNext,
  prevPage,
  nextPage
} = usePage({
  total: 100,
  pageSize: 10,
  currentPage: 1
})
```

每个 Hook 都提供了以下功能：

1. `useTimeoutFn`: 提供延时执行功能，可以控制开始、停止和查看状态
2. `useI18n`: 实现简单的国际化功能，支持语言切换和文本翻译
3. `useMessage`: 实现消息提示功能，支持不同类型的消息和自定义显示时间
4. `useDebounceFn`: 实现防抖功能，适用于搜索输入、窗口调整等场景
5. `useThrottleFn`: 实现节流功能，适用于滚动事件、频繁点击等场景
6. `usePage`: 实现分页功能，提供完整的分页逻辑和页码计算

这些 Hooks 都遵循 Vue3 的组合式 API 设计理念，可以方便地在组件中复用。每个 Hook 都提供了 TypeScript 类型支持，使用时会有完整的类型提示。