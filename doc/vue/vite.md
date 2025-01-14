# Vite 完全指南

## 1. Vite 简介

Vite 是一个现代化的前端构建工具，它主要有两个特点：
- 开发环境下基于 ESM 的开发服务器
- 生产环境下基于 Rollup 的构建

### 主要特点：
1. 快速的冷启动
2. 即时的模块热更新
3. 真正的按需加载
4. 开箱即用的功能
5. 优化的构建

## 2. 打包优化方案

### 2.1 拆包策略（Split Chunks）

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库打包在一起
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 UI 框架单独打包
          'element-plus': ['element-plus'],
          // 将工具库打包在一起
          'utils': ['lodash', 'axios', 'dayjs'],
        }
      }
    }
  }
})
```

### 2.2 不打包策略（External）

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    }
  }
})

// index.html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/element-plus"></script>
```

### 2.3 缓存策略

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // 启用持久化缓存
    cache: true,
    // 设置缓存目录
    cacheDir: 'node_modules/.vite',
    rollupOptions: {
      output: {
        // 使用 contenthash
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: '[ext]/[name].[hash].[ext]'
      }
    }
  }
})
```

### 2.4 压缩优化

```javascript
// vite.config.js
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  build: {
    // 启用 terser 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true
      }
    },
    // 启用 gzip 压缩
    plugins: [
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    ]
  }
})
```

## 3. 性能优化实践

### 3.1 路由懒加载

```javascript
// router/index.js
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue')
  }
]
```

### 3.2 组件按需导入

```javascript
// main.js
import { createApp } from 'vue'
import {
  ElButton,
  ElSelect
} from 'element-plus'

const app = createApp(App)
app.use(ElButton)
app.use(ElSelect)
```

### 3.3 图片资源优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 小于 4kb 的图片会被转为 base64
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/.test(assetInfo.name)) {
            extType = 'img'
          }
          return `static/${extType}/[name]-[hash][extname]`
        }
      }
    }
  }
})
```

## 4. 常见面试题

### Q1: Vite 和 Webpack 的区别是什么？

**答案：**
1. **开发环境差异**
   - Vite: 基于 ESM 的开发服务器，按需编译
   - Webpack: 需要先打包再启动开发服务器

2. **构建工具差异**
   - Vite: 生产环境使用 Rollup
   - Webpack: 开发和生产环境都使用 Webpack

3. **性能差异**
   - Vite: 开发环境启动快，热更新快
   - Webpack: 随着项目增大，构建速度变慢

### Q2: Vite 为什么启动这么快？

**答案：**
1. 利用浏览器原生 ESM 能力，无需打包
2. 首次启动时不需要编译所有文件
3. 按需编译，只编译当前页面所需文件
4. 模块热更新基于 ESM，只需要精确定位变更模块

### Q3: Vite 的预构建是什么？

**答案：**
1. **目的**：
   - 将非 ESM 模块转换为 ESM
   - 将多个内部模块合并，减少请求
   
2. **时机**：
   - 开发服务器首次启动时
   - 依赖项变化时
   
3. **配置示例**：
```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es', 'vue'],
    exclude: ['your-package']
  }
})
```

### Q4: Vite 的 HMR 原理是什么？

**答案：**
1. **基本流程**：
   - 创建 WebSocket 连接
   - 监听文件变化
   - 向浏览器发送更新信息
   - 浏览器接收更新并刷新模块

2. **优势**：
   - 精确定位更新模块
   - 无需重新打包
   - 保持应用状态

### Q5: Vite 生产环境为什么选择 Rollup？

**答案：**
1. Rollup 更适合打包库和框架
2. 基于 ESM 的打包，体积更小
3. 更简单的配置和更好的性能
4. Tree-shaking 更彻底

### Q6: 如何优化 Vite 的构建速度？

**答案：**
1. **开发环境**：
   - 使用预构建
   - 配置别名
   - 使用缓存

2. **生产环境**：
   ```javascript
   export default defineConfig({
     build: {
       target: 'es2015',
       minify: 'terser',
       cssCodeSplit: true,
       rollupOptions: {
         output: {
           manualChunks: {
             // 分包配置
           }
         }
       }
     }
   })
   ```

### Q7: Vite 插件机制是怎样的？

**答案：**
1. **插件钩子**：
   - config: 修改配置
   - transformIndexHtml: 转换 HTML
   - resolveId: 解析模块路径
   - load: 加载模块
   - transform: 转换模块内容

2. **示例**：
```javascript
// vite-plugin-example.js
export default function myPlugin() {
  return {
    name: 'my-plugin',
    configureServer(server) {
      // 配置开发服务器
    },
    transform(code, id) {
      // 转换代码
      return code
    }
  }
}
```

## 5. 优化效果对比

| 优化项 | 优化前 | 优化后 | 提升 |
|--------|--------|--------|------|
| 首次构建时间 | 60s | 30s | 50% |
| 热更新时间 | 3s | 0.5s | 83% |
| 打包体积 | 10MB | 4MB | 60% |
| 首屏加载时间 | 3s | 1.5s | 50% |

## 6. 最佳实践建议

1. **开发环境**：
   - 使用 `optimizeDeps.include` 预构建频繁使用的依赖
   - 配置 `alias` 简化导入路径
   - 使用 `esbuild` 进行 TypeScript 转译

2. **生产环境**：
   - 合理配置 `manualChunks` 进行代码分割
   - 使用 CDN 加载第三方库
   - 开启 gzip/brotli 压缩
   - 使用 `dynamic import` 实现按需加载