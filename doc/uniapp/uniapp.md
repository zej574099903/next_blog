# uni-app 开发指南与面试题

## 1. uni-app 简介

### 1.1 什么是 uni-app？

uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

### 1.2 主要特点

1. **跨平台**
   - 一套代码，多端发布
   - 支持 iOS、Android、H5、以及各种小程序平台
   - 统一的语法规范

2. **开发规范**
   - 基于 Vue 语法
   - 遵循 W3C 标准
   - 支持 ES6+ 语法

3. **性能优化**
   - 优化的运行机制
   - 高效的编译器
   - 体积小、速度快

## 2. 常见面试题

### 2.1 基础概念

**Q1: uni-app 和其他跨平台框架（如 React Native、Flutter）的区别是什么？**

A: 主要区别如下：
1. 技术栈：uni-app 基于 Vue，更适合 Vue 开发者
2. 跨平台能力：uni-app 支持更多平台，尤其是各类小程序
3. 性能：RN 和 Flutter 性能较好，但开发门槛高
4. 生态：uni-app 的插件市场丰富，中文社区活跃
5. 学习成本：uni-app 对前端开发者更友好

**Q2: uni-app 的生命周期有哪些？**

A: uni-app 生命周期分为应用生命周期和页面生命周期：

1. 应用生命周期：
```javascript
// App.vue
export default {
  onLaunch() {
    // 应用初始化
  },
  onShow() {
    // 应用显示
  },
  onHide() {
    // 应用隐藏
  },
  onError(err) {
    // 应用报错
  }
}
```

2. 页面生命周期：
```javascript
export default {
  onLoad() {
    // 页面加载
  },
  onShow() {
    // 页面显示
  },
  onReady() {
    // 页面初次渲染完成
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面卸载
  }
}
```

### 2.2 技术实现

**Q3: uni-app 如何实现页面通信？**

A: uni-app 提供多种页面通信方式：

1. **全局状态管理**：
```javascript
// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
```

2. **事件总线**：
```javascript
// 使用 uni.$emit 和 uni.$on
// 页面A
uni.$emit('updateData', { data: 'hello' })

// 页面B
uni.$on('updateData', (data) => {
  console.log(data)
})
```

3. **页面跳转传参**：
```javascript
// 页面A
uni.navigateTo({
  url: '/pages/detail/detail?id=1'
})

// 页面B
onLoad(options) {
  console.log(options.id)
}
```

**Q4: uni-app 如何处理跨端兼容性问题？**

A: 主要通过以下方式：

1. **条件编译**：
```javascript
// #ifdef APP-PLUS
// 仅在 App 平台生效
// #endif

// #ifdef H5
// 仅在 H5 平台生效
// #endif

// #ifdef MP-WEIXIN
// 仅在微信小程序平台生效
// #endif
```

2. **平台判断**：
```javascript
if (uni.getSystemInfoSync().platform === 'android') {
  // Android 平台
} else if (uni.getSystemInfoSync().platform === 'ios') {
  // iOS 平台
}
```

### 2.3 性能优化

**Q5: 如何优化 uni-app 应用性能？**

A: 主要优化方向：

1. **代码优化**：
```javascript
// 使用按需加载
const detail = () => import('@/pages/detail/detail')

// 避免大量数据同时渲染
export default {
  data() {
    return {
      displayList: [],
      allList: []
    }
  },
  methods: {
    loadMore() {
      const chunk = this.allList.slice(this.displayList.length, this.displayList.length + 10)
      this.displayList.push(...chunk)
    }
  }
}
```

2. **资源优化**：
- 图片懒加载
- 使用 webP 格式
- CDN 加速

3. **缓存优化**：
```javascript
// 数据缓存
uni.setStorage({
  key: 'userData',
  data: userData
})

// 页面缓存
onLoad() {
  const cache = uni.getStorageSync('pageCache')
  if (cache) {
    this.data = cache
  } else {
    this.fetchData()
  }
}
```

### 2.4 项目实践

**Q6: uni-app 项目的目录结构是怎样的？**

A: 标准目录结构：
```
├── pages                 // 页面文件夹  
├── components           // 组件文件夹
├── static              // 静态资源
├── store               // Vuex 状态管理
├── utils               // 工具函数
├── App.vue             // 应用配置
├── main.js             // 入口文件
├── manifest.json       // 配置文件
└── pages.json          // 页面配置
```

**Q7: 如何处理 uni-app 中的网络请求？**

A: 推荐的做法：

1. **封装请求工具**：
```javascript
// utils/request.js
export const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'content-type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
```

2. **使用拦截器**：
```javascript
const httpInterceptor = {
  request(options) {
    // 请求拦截
    options.header = {
      ...options.header,
      token: uni.getStorageSync('token')
    }
    return options
  },
  response(response) {
    // 响应拦截
    return response
  }
}

uni.addInterceptor('request', httpInterceptor)
```

## 3. 开发技巧

### 3.1 常用组件封装

1. **自定义导航栏**：
```vue
<!-- components/custom-nav.vue -->
<template>
  <view class="custom-nav">
    <view class="nav-content" :style="{ top: statusBarHeight + 'px' }">
      <view class="back" @tap="goBack" v-if="showBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    showBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      statusBarHeight: 0
    }
  },
  created() {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>
```

2. **列表下拉刷新**：
```vue
<template>
  <scroll-view
    class="scroll-list"
    scroll-y
    @scrolltolower="loadMore"
    refresher-enabled
    :refresher-triggered="isRefreshing"
    @refresherrefresh="onRefresh"
  >
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      page: 1,
      isRefreshing: false
    }
  },
  methods: {
    async loadMore() {
      const newData = await this.fetchData(this.page++)
      this.list.push(...newData)
    },
    async onRefresh() {
      this.isRefreshing = true
      this.page = 1
      this.list = await this.fetchData(1)
      this.isRefreshing = false
    }
  }
}
</script>
```

### 3.2 常见问题解决

1. **样式兼容**：
```scss
/* 样式兼容处理 */
.container {
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  
  /* #ifdef MP-WEIXIN */
  height: calc(100vh - 88rpx);
  /* #endif */
}
```

2. **权限处理**：
```javascript
// utils/permission.js
export const checkPermission = (permissionID) => {
  // #ifdef APP-PLUS
  const result = uni.requireNativePlugin('requireNativePlugin')
  return result.checkPermission(permissionID)
  // #endif
  
  // #ifdef MP-WEIXIN
  return new Promise((resolve) => {
    uni.authorize({
      scope: permissionID,
      success: () => resolve(true),
      fail: () => resolve(false)
    })
  })
  // #endif
}
```

## 4. 发布与部署

1. **打包配置**：
```json
// manifest.json
{
  "name": "应用名称",
  "appid": "",
  "description": "",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    }
  }
}
```

2. **环境配置**：
```javascript
// config/index.js
export default {
  development: {
    baseUrl: 'http://dev-api.example.com'
  },
  production: {
    baseUrl: 'https://api.example.com'
  }
}[process.env.NODE_ENV]
```

## 5. 最佳实践

1. **代码规范**：
- 使用 ESLint 和 Prettier
- 遵循 Vue 风格指南
- 合理的组件拆分

2. **性能优化**：
- 合理使用生命周期
- 避免频繁更新数据
- 使用虚拟列表处理大数据

3. **调试技巧**：
- 使用 console.log
- 真机调试
- 性能监控
