# qiankun 微前端框架详解

## 一、基本原理

qiankun 是一个基于 single-spa 的微前端实现库，主要特点：

1. **基于 single-spa**
   - 实现了应用的加载、解析、执行
   - 提供了生命周期管理

2. **HTML Entry**
   - 通过 HTML 入口加载子应用
   - 相比 JS Entry 更加灵活和自然

3. **沙箱机制**
   - 实现了 JS 沙箱，隔离 JavaScript 作用域
   - 实现了样式沙箱，隔离 CSS 作用域

## 二、使用方法

### 1. 主应用配置
```typescript
// main.ts
import { registerMicroApps, start } from 'qiankun';

// 注册子应用
registerMicroApps([
  {
    name: 'app1', // 子应用名称
    entry: '//localhost:8081', // 子应用入口
    container: '#container', // 子应用挂载点
    activeRule: '/app1', // 激活规则
    props: { // 传递给子应用的数据
      data: {
        publicPath: '//localhost:8081'
      }
    }
  },
  {
    name: 'app2',
    entry: '//localhost:8082',
    container: '#container',
    activeRule: '/app2'
  }
]);

// 启动 qiankun
start({
  prefetch: true, // 是否开启预加载
  sandbox: {
    strictStyleIsolation: true, // 严格的样式隔离
    experimentalStyleIsolation: true // 实验性的样式隔离
  }
});
```

### 2. 子应用配置

#### React 子应用
```typescript
// index.ts
import './public-path';

let root: Root | null = null;

/**
 * 子应用生命周期 - 挂载前
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 子应用生命周期 - 挂载
 */
export async function mount(props: any) {
  root = ReactDOM.createRoot(
    props.container ? props.container.querySelector('#root') : document.getElementById('root')
  );
  
  root.render(
    <App />
  );
}

/**
 * 子应用生命周期 - 卸载
 */
export async function unmount(props: any) {
  root?.unmount();
  root = null;
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}
```

#### public-path.ts
```typescript
if (window.__POWERED_BY_QIANKUN__) {
  // @ts-ignore
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

#### webpack 配置
```javascript
const { name } = require('./package');

module.exports = {
  output: {
    library: `${name}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${name}`,
    publicPath: 'auto',
  },
};
```

## 三、常用 API

### 1. 主应用 API
```typescript
// 注册子应用
registerMicroApps(apps, lifeCycles?);

// 启动 qiankun
start(opts?);

// 手动加载子应用
loadMicroApp(app, configuration?);

// 手动预加载子应用
prefetchApps(apps);

// 设置主应用启动之前的处理函数
setDefaultMountApp(appLink);

// 全局状态管理
initGlobalState(state);
```

### 2. 子应用生命周期
```typescript
// 子应用初始化
export async function bootstrap() {}

// 子应用挂载
export async function mount(props) {}

// 子应用卸载
export async function unmount(props) {}

// 可选，子应用更新
export async function update(props) {}
```

## 四、常见问题及解决方案

### 1. 路由无限循环问题
```typescript
// 主应用路由配置
const router = createBrowserRouter([
  {
    path: '/*', // 使用通配符
    element: <Layout />,
    children: [
      {
        path: 'app1/*', // 子应用路由
        element: <MicroApp />
      }
    ]
  }
]);

// 子应用路由配置
const router = createBrowserRouter([
  {
    basename: '/app1', // 设置基础路径
    routes: [
      {
        path: '/*',
        element: <App />
      }
    ]
  }
]);
```

### 2. 样式污染问题
```typescript
// 主应用配置
start({
  sandbox: {
    strictStyleIsolation: true, // 开启严格样式隔离
    experimentalStyleIsolation: true // 开启实验性样式隔离
  }
});

// 子应用样式处理
// 1. 使用 CSS Modules
import styles from './index.module.less';

// 2. 使用 CSS in JS
import styled from 'styled-components';

// 3. 使用命名空间
.app1 {
  .title {
    color: red;
  }
}
```

### 3. 通信问题
```typescript
// 1. 主应用初始化全局状态
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({
  user: 'qiankun'
});

actions.onGlobalStateChange((state, prev) => {
  console.log('主应用: 变更前', prev);
  console.log('主应用: 变更后', state);
});

// 2. 子应用使用全局状态
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    console.log('子应用: 变更前', prev);
    console.log('子应用: 变更后', state);
  });
  
  props.setGlobalState({
    user: 'changed'
  });
}
```

## 五、最佳实践

### 1. 子应用入口配置
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>子应用</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### 2. 环境变量配置
```typescript
// .env
REACT_APP_QIANKUN=true

// 子应用判断
if (window.__POWERED_BY_QIANKUN__) {
  // qiankun 环境
} else {
  // 独立运行环境
}
```

### 3. 构建配置优化
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: false, // 不做代码分割
    runtimeChunk: false // 不抽离运行时代码
  }
};
```

## 六、常见面试题

### 1. qiankun 的优势是什么？
答：
1. **技术栈无关**
   - 主应用和子应用可以使用不同的技术栈
   - 支持 React、Vue、Angular 等框架

2. **沙箱隔离**
   - JS 沙箱，确保全局变量不冲突
   - CSS 沙箱，确保样式不互相影响

3. **预加载**
   - 支持子应用预加载
   - 提高应用切换性能

4. **简单易用**
   - API 简单清晰
   - 配置灵活

### 2. qiankun 是如何实现 JS 沙箱的？
答：
1. **快照沙箱（snapshotSandbox）**
   - 适用于单实例场景
   - 记录 window 对象快照
   - 激活时恢复环境

2. **代理沙箱（proxySandbox）**
   - 适用于多实例场景
   - 使用 Proxy 代理 window 对象
   - 实现完全隔离

3. **Legacy 沙箱（legacySandbox）**
   - 兼容性方案
   - 结合快照和代理特性

### 3. qiankun 的生命周期是什么？
答：
1. **bootstrap**
   - 子应用首次加载时调用
   - 只会调用一次

2. **mount**
   - 子应用挂载时调用
   - 可能调用多次

3. **unmount**
   - 子应用卸载时调用
   - 清理资源

4. **update（可选）**
   - 子应用更新时调用
   - 处理更新逻辑

### 4. qiankun 如何实现应用间通信？
答：
1. **Actions 通信**
```typescript
// 主应用
const actions = initGlobalState(state);
actions.onGlobalStateChange(callback);

// 子应用
export function mount(props) {
  props.onGlobalStateChange(callback);
  props.setGlobalState(state);
}
```

2. **Props 传递**
```typescript
// 主应用
registerMicroApps([
  {
    name: 'app1',
    props: { data: 'value' }
  }
]);

// 子应用
export function mount(props) {
  console.log(props.data);
}
```

3. **自定义事件**
```typescript
// 主应用
window.addEventListener('event', callback);

// 子应用
window.dispatchEvent(new CustomEvent('event', { detail: data }));
```

### 5. 如何优化 qiankun 的性能？
答：
1. **预加载策略**
```typescript
start({
  prefetch: 'all', // 预加载所有子应用
  // 或者指定预加载应用
  prefetch: ['app1', 'app2']
});
```

2. **资源加载优化**
```javascript
// webpack 配置
module.exports = {
  optimization: {
    splitChunks: false,
    minimizer: [new TerserPlugin()]
  }
};
```

3. **缓存策略**
```typescript
start({
  sandbox: {
    loose: true // 使用宽松的沙箱模式
  }
});
```
