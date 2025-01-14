# Vue3 Hooks (Composition API) 完全指南

## 1. 什么是 Composition API

Composition API 是 Vue3 中新增的一种组织组件逻辑的方式，它允许我们使用函数的方式编写组件逻辑，提供了更好的代码复用性和类型推导。

## 2. 核心 Hooks

### 2.1 响应式 Hooks

#### ref 和 reactive

```javascript
import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)
console.log(count.value) // 0

// reactive 用于对象
const state = reactive({
  count: 0,
  name: 'Vue'
})
console.log(state.count) // 0
```

#### computed

```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// 可写的计算属性
const doubleCountWritable = computed({
  get: () => count.value * 2,
  set: (val) => {
    count.value = val / 2
  }
})
```

### 2.2 生命周期 Hooks

```javascript
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      console.log('Before Mount')
    })
    
    onMounted(() => {
      console.log('Mounted')
    })
    
    onBeforeUpdate(() => {
      console.log('Before Update')
    })
    
    onUpdated(() => {
      console.log('Updated')
    })
    
    onBeforeUnmount(() => {
      console.log('Before Unmount')
    })
    
    onUnmounted(() => {
      console.log('Unmounted')
    })
  }
}
```

### 2.3 监听 Hooks

```javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)

// watch
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// watchEffect
watchEffect(() => {
  console.log(`Count is: ${count.value}`)
})

// 多个来源的 watch
const name = ref('Vue')
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log(`Count: ${oldCount} -> ${newCount}`)
  console.log(`Name: ${oldName} -> ${newName}`)
})
```

## 3. 自定义 Hooks

### 3.1 基本示例

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement
  }
}

// 使用自定义 Hook
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, doubleCount, increment, decrement } = useCounter(10)
    
    return {
      count,
      doubleCount,
      increment,
      decrement
    }
  }
}
```

### 3.2 异步数据 Hook

```javascript
// useAsync.js
import { ref } from 'vue'

export function useAsync(asyncFunction) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function execute(...args) {
    loading.value = true
    error.value = null
    
    try {
      data.value = await asyncFunction(...args)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    error,
    loading,
    execute
  }
}

// 使用示例
import { useAsync } from './useAsync'

export default {
  setup() {
    const { data, error, loading, execute } = useAsync(async () => {
      const response = await fetch('https://api.example.com/data')
      return response.json()
    })
    
    // 执行异步操作
    execute()
    
    return {
      data,
      error,
      loading
    }
  }
}
```

## 4. 常见面试题

### 4.1 为什么要使用 Composition API？

1. **更好的代码组织**：
   - 相关的逻辑可以放在一起
   - 不再需要在不同的选项之间切换
   - 提高了代码的可维护性

2. **更好的逻辑复用**：
   - 可以轻松地将逻辑提取到独立的函数中
   - 避免了 mixins 的缺点（命名冲突、来源不清晰）

3. **更好的类型推导**：
   - TypeScript 支持更好
   - IDE 提示更准确

### 4.2 ref 和 reactive 的区别？

1. **使用场景**：
   - ref 主要用于基本类型数据
   - reactive 用于对象类型数据

2. **访问方式**：
   - ref 需要通过 .value 访问
   - reactive 直接访问属性

3. **解构行为**：
   - ref 可以解构保持响应性
   - reactive 解构会失去响应性

```javascript
// ref 示例
const count = ref(0)
const { value } = count // 保持响应性

// reactive 示例
const state = reactive({ count: 0 })
const { count } = state // 失去响应性
```

### 4.3 watch 和 watchEffect 的区别？

1. **执行时机**：
   - watch 懒执行，只有在依赖变化时才执行
   - watchEffect 立即执行，并自动追踪依赖

2. **依赖追踪**：
   - watch 需要明确指定要监听的数据
   - watchEffect 自动追踪内部依赖

3. **回调参数**：
   - watch 可以访问新值和旧值
   - watchEffect 无法访问变化前的值

### 4.4 setup 函数的特点？

1. **执行时机**：
   - 在 beforeCreate 之前执行
   - 此时组件实例尚未创建

2. **参数**：
   - props：组件的属性
   - context：上下文对象（attrs, slots, emit）

3. **注意事项**：
   - 不能使用 this
   - 返回的对象中的属性可以在模板中使用

### 4.5 如何在 setup 中访问生命周期？

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      // mounted
    })
    
    onUpdated(() => {
      // updated
    })
    
    onUnmounted(() => {
      // unmounted
    })
  }
}
```

### 4.6 如何处理响应式数据的类型问题？

```typescript
import { ref, Ref } from 'vue'

interface User {
  name: string
  age: number
}

// 明确指定类型
const user: Ref<User> = ref({
  name: 'Vue',
  age: 3
})

// 使用泛型
function useUser<T>() {
  return ref<T>({} as T)
}
```

### 4.7 如何解决 reactive 解构失去响应性的问题？

有几种方法可以解决 reactive 对象解构后失去响应性的问题：

1. **使用 toRefs**：
```javascript
import { reactive, toRefs } from 'vue'

const state = reactive({
  name: 'Vue',
  count: 0
})

// 使用 toRefs 保持响应性
const { name, count } = toRefs(state)

// 现在 name.value 和 count.value 都是响应式的
console.log(name.value) // 'Vue'
count.value++ // 会触发更新
```

2. **使用 toRef 处理单个属性**：
```javascript
import { reactive, toRef } from 'vue'

const state = reactive({
  name: 'Vue',
  count: 0
})

// 使用 toRef 处理单个属性
const count = toRef(state, 'count')

// count.value 是响应式的
count.value++ // 会触发更新
```

3. **使用计算属性**：
```javascript
import { reactive, computed } from 'vue'

const state = reactive({
  name: 'Vue',
  count: 0
})

// 使用计算属性获取值
const count = computed({
  get: () => state.count,
  set: (val) => state.count = val
})

// count.value 是响应式的
count.value++ // 会触发更新
```

4. **使用 storeToRefs（针对 Pinia 状态管理）**：
```javascript
import { storeToRefs } from 'pinia'
import { useUserStore } from './stores/user'

export default {
  setup() {
    const store = useUserStore()
    
    // 使用 storeToRefs 解构 store
    const { name, age } = storeToRefs(store)
    
    // name.value 和 age.value 保持响应性
    return {
      name,
      age
    }
  }
}
```

### 最佳实践示例：

```javascript
import { reactive, toRefs } from 'vue'

// 1. 创建组合式函数
function useUserState() {
  const state = reactive({
    name: 'Vue',
    age: 3,
    version: '3.0'
  })
  
  // 返回时转换为 refs
  return {
    ...toRefs(state),
    // 方法不需要 toRefs
    updateName(newName) {
      state.name = newName
    }
  }
}

// 2. 在组件中使用
export default {
  setup() {
    const { name, age, version, updateName } = useUserState()
    
    // 所有属性都保持响应性
    return {
      name,
      age,
      version,
      updateName
    }
  }
}
```

### 注意事项：

1. **toRefs 的性能考虑**：
```javascript
// 如果对象很大，但只需要几个属性，使用 toRef 更好
const state = reactive({ /* 大对象 */ })
const name = toRef(state, 'name')
const age = toRef(state, 'age')
```

2. **深层解构**：
```javascript
const state = reactive({
  user: {
    name: 'Vue',
    settings: {
      theme: 'dark'
    }
  }
})

// 深层解构需要多次 toRefs
const { user } = toRefs(state)
const { settings } = toRefs(user.value)
const { theme } = toRefs(settings.value)
```

3. **数组的处理**：
```javascript
const state = reactive({
  list: ['a', 'b', 'c']
})

// 数组元素不能直接使用 toRefs
// 需要将数组转换为对象
const { list } = toRefs(state)
// 或者使用计算属性处理数组元素
const firstItem = computed({
  get: () => state.list[0],
  set: (value) => state.list[0] = value
})
```

这些方法可以根据具体场景选择使用，通常 `toRefs` 是最常用的解决方案，但在某些特定场景下，其他方法可能更适合。

## 5. 最佳实践

1. **合理拆分逻辑**：
```javascript
// 将相关逻辑封装成独立的 hook
function useUserData() {
  const user = ref(null)
  const loading = ref(false)
  
  async function fetchUser(id) {
    loading.value = true
    user.value = await api.getUser(id)
    loading.value = false
  }
  
  return {
    user,
    loading,
    fetchUser
  }
}
```

2. **保持响应性**：
```javascript
// 使用 toRefs 保持解构的响应性
import { reactive, toRefs } from 'vue'

function useFeature() {
  const state = reactive({
    foo: 1,
    bar: 2
  })
  
  return toRefs(state)
}
```

3. **合理使用生命周期**：
```javascript
function useSubscription() {
  onMounted(() => {
    // 订阅
    subscribe()
  })
  
  onUnmounted(() => {
    // 清理
    unsubscribe()
  })
}
```

Composition API 是 Vue3 中非常重要的特性，它提供了更灵活的代码组织方式和更好的代码复用能力。掌握这些概念和用法对于 Vue3 开发至关重要。