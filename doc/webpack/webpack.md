# Webpack 完全指南

## 1. Webpack 简介

Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。它的主要目的是将 JavaScript 文件打包在一起，打包后的文件用于在浏览器中使用。

### 1.1 主要功能

1. 模块打包
2. 代码转换
3. 文件优化
4. 开发服务器
5. 热模块替换（HMR）

## 2. 应用场景

1. **单页应用（SPA）打包**
2. **多页应用打包**
3. **库/组件打包**
4. **静态资源打包**
5. **服务端渲染（SSR）打包**

## 3. 基础配置

### 3.1 基本配置文件 (webpack.config.js)

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 入口文件
  entry: './src/index.js',
  
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true // 清理 dist 文件夹
  },
  
  // 模式：development 或 production
  mode: 'development',
  
  // 模块规则
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  
  // 开发服务器配置
  devServer: {
    static: './dist',
    hot: true,
    port: 3000
  }
};
```

### 3.2 常用 Loader

```javascript
module: {
  rules: [
    // Babel loader
    {
      test: /\.js$/,
      use: 'babel-loader'
    },
    // CSS loader
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    // SASS loader
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    },
    // File loader
    {
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        {
          loader: 'file-loader',
        },
      ],
    }
  ]
}
```

### 3.3 常用插件

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    // 生成 HTML 文件
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 提取 CSS 到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    // 清理输出目录
    new CleanWebpackPlugin(),
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimizer: [
      // JS 压缩
      new TerserPlugin()
    ]
  }
}
```

### 3.4 css-loader 和 style-loader 的区别

css-loader 和 style-loader 是两个功能不同但互补的 loader：

1. **css-loader 的作用**：
   - 解析 CSS 文件，处理 CSS 中的依赖关系（@import 和 url() 等）
   - 将 CSS 转换为 CommonJS 模块
   - 输出的是 JavaScript 模块，包含 CSS 字符串
   
2. **style-loader 的作用**：
   - 将 css-loader 解析后的内容，通过 JavaScript 动态创建 style 标签
   - 将 CSS 插入到 DOM 中
   - 处理样式的热更新

### 为什么需要同时使用两者？

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // 从右向左执行
      }
    ]
  }
}
```

执行流程：
1. css-loader 将 CSS 文件转换为 JavaScript 模块
2. style-loader 将转换后的 CSS 注入到 HTML 页面中

示例说明：

```css
/* styles.css */
.example {
  color: red;
}
```

```javascript
// 经过 css-loader 处理后的结果（简化示意）
export default {
  toString: () => ".example { color: red; }"
}

// 经过 style-loader 处理后（简化示意）
const style = document.createElement('style');
style.textContent = ".example { color: red; }";
document.head.appendChild(style);
```

### 使用场景

1. **开发环境**：
   ```javascript
   {
     test: /\.css$/,
     use: ['style-loader', 'css-loader'] // 开发环境使用 style-loader
   }
   ```

2. **生产环境**：
   ```javascript
   {
     test: /\.css$/,
     use: [
       MiniCssExtractPlugin.loader, // 生产环境使用提取 CSS 插件
       'css-loader'
     ]
   }
   ```

### 为什么生产环境不使用 style-loader？

1. **性能考虑**：
   - style-loader 将 CSS 通过 JavaScript 动态注入，会增加 JavaScript 包的大小
   - 需要等 JavaScript 执行完才能看到样式，可能造成闪屏

2. **缓存优化**：
   - 使用 MiniCssExtractPlugin 可以将 CSS 提取到单独的文件
   - 便于浏览器缓存
   - CSS 和 JavaScript 文件并行下载

## 4. Webpack 实现原理

### 4.1 核心概念

1. **Entry**：入口文件，webpack 开始构建的起点
2. **Output**：输出配置，webpack 打包后的文件输出位置
3. **Loader**：模块转换器，将非 JavaScript 文件转换为 webpack 可以处理的模块
4. **Plugin**：插件系统，扩展 webpack 的功能
5. **Module**：模块，webpack 中一切皆模块

### 4.2 打包流程

1. **初始化参数**：从配置文件和命令行参数中读取配置
2. **开始编译**：初始化 Compiler 对象，加载所有配置的插件
3. **确定入口**：根据配置中的 entry 找出所有入口文件
4. **编译模块**：从入口文件出发，调用所有配置的 Loader 对模块进行转换
5. **完成模块编译**：得到每个模块被翻译后的最终内容以及它们之间的依赖关系
6. **输出资源**：根据依赖关系，组装成一个个包含多个模块的 Chunk
7. **输出完成**：根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## 5. 性能优化方案

### 5.1 构建性能优化

1. **缩小文件搜索范围**
```javascript
module.exports = {
  resolve: {
    // 指定扩展名
    extensions: ['.js', '.jsx'],
    // 指定模块搜索目录
    modules: ['node_modules'],
    // 别名
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

2. **利用缓存**
```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }]
    }]
  }
}
```

3. **多进程/多实例构建**
```javascript
const thread = require('thread-loader');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
}
```

### 5.2 打包优化

1. **代码分割**
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

2. **Tree Shaking**
```javascript
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true
  }
}
```

3. **懒加载**
```javascript
// 路由懒加载示例
const Home = () => import(/* webpackChunkName: "home" */ './Home');
```

## 6. 常见面试题

### 6.1 Loader 和 Plugin 的区别？

- **Loader**：
  - 是一个转换器，将 A 文件转换为 B 文件
  - 单一职责，只负责文件转换
  - 执行顺序从右到左

- **Plugin**：
  - 是一个扩展器，丰富 webpack 功能
  - 可以处理多个任务
  - 在整个编译周期都起作用

### 6.2 webpack 的热更新原理？

1. webpack-dev-server 启动本地服务
2. 浏览器与服务器建立 WebSocket 连接
3. webpack 监听文件变化
4. 文件变化后，webpack 重新编译
5. 编译完成后，通过 WebSocket 通知浏览器
6. 浏览器获取新模块的 hash，通过 JSONP 请求获取新模块
7. HotModuleReplacement.runtime 对模块进行热更新

### 6.3 如何优化 webpack 的构建速度？

1. 使用 DllPlugin 提取第三方库
2. 使用 cache-loader 缓存
3. 使用 thread-loader 多进程打包
4. 合理使用 sourceMap
5. 优化 loader 配置
6. 合理使用 resolve.extensions
7. 使用 webpack-bundle-analyzer 分析打包结果

### 6.4 如何配置多页面应用？

```javascript
module.exports = {
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/page1.html',
      filename: 'page1.html',
      chunks: ['page1']
    }),
    new HtmlWebpackPlugin({
      template: './src/page2.html',
      filename: 'page2.html',
      chunks: ['page2']
    })
  ]
}
```

### 6.5 如何实现 tree shaking？

1. 使用 ES6 模块语法（import/export）
2. 在 package.json 中设置 "sideEffects": false
3. 使用 production mode 或手动配置
```javascript
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true
  }
}
```

## 7. 开发技巧

### 7.1 Source Map 配置

```javascript
module.exports = {
  devtool: process.env.NODE_ENV === 'production'
    ? 'source-map'
    : 'eval-cheap-module-source-map'
}
```

### 7.2 环境变量配置

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
```

### 7.3 开发服务器配置

```javascript
module.exports = {
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
```

Webpack 是现代前端开发中不可或缺的工具，掌握其配置和优化方案对于提高开发效率和应用性能至关重要。通过合理的配置和优化，可以显著提升开发体验和应用性能。

## 8. Tree Shaking 深入解析

### 8.1 什么是 Tree Shaking

Tree Shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES6 模块系统的静态结构特性，例如 import 和 export。

### 8.2 工作原理

1. **静态分析**：
   - 基于 ES6 的模块系统
   - 分析模块之间的依赖关系
   - 识别未被使用的代码

2. **标记过程**：
   - 收集所有导出
   - 标记用到的导出
   - 删除未使用的导出

### 8.3 配置示例

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // 生产模式默认开启
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true,    // 压缩输出
    concatenateModules: true // 模块合并
  }
}
```

### 8.4 使用条件

1. **使用 ES6 模块语法**：
```javascript
// ✅ 正确的写法
export const add = (a, b) => a + b;
import { add } from './math';

// ❌ 错误的写法（CommonJS）
module.exports = { add: (a, b) => a + b };
const { add } = require('./math');
```

2. **package.json 配置**：
```json
{
  "sideEffects": false // 标记包是否有副作用
  // 或者指定有副作用的文件
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

### 8.5 实际示例

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// index.js
import { add } from './math';
console.log(add(1, 2));

// 打包后，subtract 函数会被移除
```

### 8.6 常见问题

1. **副作用处理**：
```javascript
// 有副作用的代码
import './polyfills'; // 这个导入有副作用，不能被 tree-shake
```

2. **动态导入处理**：
```javascript
// 动态导入可能影响 tree shaking
const module = await import('./module');
```

## 9. Source Map 详解

### 9.1 什么是 Source Map

Source Map 是一个信息文件，里面储存着代码转换前后的对应位置信息。它记录了转换后的代码的每一个位置，所对应的转换前的位置。

### 9.2 工作原理

1. **生成映射**：
   - 记录原始源代码位置
   - 记录转换后代码位置
   - 创建源代码到编译代码的映射

2. **调试过程**：
   - 浏览器加载 Source Map
   - 解析映射信息
   - 在开发工具中显示原始源代码

### 9.3 配置类型

```javascript
module.exports = {
  devtool: 'source-map' // 多种可选值
}
```

常用配置说明：

1. **开发环境推荐**：
```javascript
// 快速，具有行映射
devtool: 'eval-cheap-module-source-map'
```

2. **生产环境推荐**：
```javascript
// 生成独立的 source map 文件
devtool: 'source-map'
```

3. **不同选项对比**：

| devtool                      | 构建速度 | 重建速度 | 生产环境 | 质量         |
|-----------------------------|----------|----------|-----------|--------------|
| (none)                      | 最快     | 最快     | ✅        | 打包后代码   |
| eval                        | 快       | 最快     | ❌        | 生成后代码   |
| source-map                  | 最慢     | 最慢     | ✅        | 原始源代码   |
| eval-source-map             | 最慢     | 快       | ❌        | 原始源代码   |
| eval-cheap-source-map       | 快       | 快       | ❌        | 转换后代码   |
| eval-cheap-module-source-map| 中等     | 快       | ❌        | 原始源代码   |

### 9.4 实际应用

1. **开发环境配置**：
```javascript
// webpack.dev.js
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  // 其他配置...
}
```

2. **生产环境配置**：
```javascript
// webpack.prod.js
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  // 其他配置...
}
```

### 9.5 安全考虑

1. **生产环境注意事项**：
```javascript
// 不要在生产环境暴露源代码
module.exports = {
  devtool: process.env.NODE_ENV === 'production'
    ? 'hidden-source-map'  // 或 false
    : 'eval-cheap-module-source-map'
}
```

2. **源码保护**：
- 使用 `hidden-source-map` 生成 Source Map 但不暴露
- 将 Source Map 文件上传到错误追踪服务

### 9.6 最佳实践

1. **环境区分**：
```javascript
const config = {
  // 基础配置
  devtool: false,
};

if (process.env.NODE_ENV === 'development') {
  // 开发环境
  config.devtool = 'eval-cheap-module-source-map';
} else if (process.env.NODE_ENV === 'production') {
  // 生产环境
  config.devtool = 'hidden-source-map';
}
```

2. **错误追踪**：
```javascript
// 配合错误追踪服务
new webpack.SourceMapDevToolPlugin({
  filename: '[file].map',
  append: '\n//# sourceMappingURL=https://error-tracking.com/[url]'
})
```

{{ ... }}
