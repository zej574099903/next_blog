# Pinia 完全指南

## 1. 什么是 Pinia？

Pinia 是 Vue 的存储库，它允许跨组件/页面共享状态。它具有以下特点：

- 完整的 TypeScript 支持
- 足够轻量，压缩后的体积只有1.6kb
- 去除 mutations，只有 state、getters、actions
- actions 支持同步和异步
- Vue2 和 Vue3 都支持
- 支持 Vue DevTools
- 可扩展的插件系统

## 2. 使用场景

1. **全局状态管理**：
   - 用户信息管理
   - 购物车数据
   - 主题配置
   - 多语言配置

2. **组件间通信**：
   - 非父子组件通信
   - 跨页面数据共享
   - 多组件状态同步

## 3. 基础使用

### 安装和配置
```javascript
// 安装
npm install pinia

// main.js
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

### 创建 Store
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // state
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),
  
  // getters
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用this访问其他getter
    doubleCountPlusOne() {
      return this.doubleCount + 1
    }
  },
  
  // actions
  actions: {
    increment() {
      this.count++
    },
    async fetchData() {
      const data = await api.get('...')
      this.count = data.count
    }
  }
})
```

### 在组件中使用
```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// 解构时保持响应性
const { count, name } = storeToRefs(store)

// 直接调用 action
const handleClick = () => {
  store.increment()
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Name: {{ name }}</p>
    <button @click="handleClick">Increment</button>
  </div>
</template>
```

## 4. 进阶用法

### 1. 订阅状态变化
```javascript
const unsubscribe = store.$subscribe((mutation, state) => {
  // 每次状态变更时触发
  console.log('mutation:', mutation.type, mutation.storeId)
  console.log('new state:', state)
})

// 停止订阅
unsubscribe()
```

### 2. 插件开发
```javascript
export function myPiniaPlugin(context) {
  const { store } = context
  
  store.$subscribe((mutation) => {
    // 持久化存储
    localStorage.setItem('store', JSON.stringify(store.$state))
  })
  
  // 从localStorage恢复状态
  const savedState = JSON.parse(localStorage.getItem('store'))
  if (savedState) {
    store.$patch(savedState)
  }
}

// 使用插件
const pinia = createPinia()
pinia.use(myPiniaPlugin)
```

### 3. 组合式 Store
```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  return { count, doubleCount, increment }
})
```

## 5. 常见面试题

### 1. Pinia 和 Vuex 的区别？

1. **更简单的 API**：
   - 移除了 mutations
   - 只有 state、getters、actions
   - 支持组合式 API 风格的写法

2. **更好的 TypeScript 支持**：
   - 无需创建自定义复杂类型
   - 自动类型推导

3. **更轻量**：
   - 体积更小
   - 没有冗余的代码

4. **不需要嵌套模块**：
   - 扁平化的代码组织方式
   - 可以直接导入使用

### 2. Pinia 中如何实现模块化？

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    age: 0
  })
})

// stores/cart.js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  })
})

// 使用
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const userStore = useUserStore()
const cartStore = useCartStore()
```

### 3. Pinia 如何实现持久化存储？

```javascript
// 方式1：使用插件
export function persistencePlugin({ store }) {
  // 从localStorage恢复状态
  const savedState = JSON.parse(localStorage.getItem(store.$id))
  if (savedState) {
    store.$patch(savedState)
  }
  
  // 订阅变化
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
}

// 方式2：使用现成的插件
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState())
```

### 4. 如何在 Pinia 中处理异步操作？

```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const user = await api.login(credentials)
        this.user = user
        return user
      } catch (e) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 5. Pinia 中的 storeToRefs 是什么？为什么需要它？

`storeToRefs` 是用来保持解构后的响应性：
- 直接解构 store 会失去响应性
- `storeToRefs` 可以保持解构属性的响应性
- 只会为 state 和 getters 创建 refs

```javascript
// 失去响应性
const { count } = store

// 保持响应性
const { count } = storeToRefs(store)
```

### 6. 如何在 Pinia 中实现状态重置？

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),
  
  actions: {
    // 重置单个状态
    resetCount() {
      this.count = 0
    },
    
    // 重置所有状态
    resetAll() {
      this.$reset()
    }
  }
})
```

### 7. Pinia 如何实现多个 store 之间的交互？

```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null
  })
})

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  actions: {
    async checkout() {
      const userStore = useUserStore()
      if (!userStore.userId) {
        throw new Error('User not logged in')
      }
      // 处理结账逻辑
    }
  }
})