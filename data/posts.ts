import { Post, Category, Tag } from '../types';

export const categories: Category[] = [
  {
    id: 'javascript',
    name: 'JavaScript深入系列',
    description: '探索JavaScript核心概念和高级特性',
    slug: 'javascript',
    coverImage: '/images/categories/javascript.svg'
  },
  {
    id: 'vue',
    name: 'Vue生态系统',
    description: 'Vue3全家桶实践与原理解析',
    slug: 'vue',
    coverImage: '/images/categories/vue.svg'
  },
  {
    id: 'react',
    name: 'React技术栈',
    description: 'React核心概念与实战指南',
    slug: 'react',
    coverImage: '/images/categories/react.svg'
  },
  {
    id: 'engineering',
    name: '前端工程化',
    description: '现代前端工程化最佳实践',
    slug: 'engineering',
    coverImage: '/images/categories/engineering.svg'
  }
];

export const tags: Tag[] = [
  { id: 'javascript', name: 'JavaScript', slug: 'javascript' },
  { id: 'typescript', name: 'TypeScript', slug: 'typescript' },
  { id: 'vue', name: 'Vue', slug: 'vue' },
  { id: 'react', name: 'React', slug: 'react' },
  { id: 'webpack', name: 'Webpack', slug: 'webpack' },
  { id: 'vite', name: 'Vite', slug: 'vite' },
  { id: 'performance', name: '性能优化', slug: 'performance' },
  { id: 'testing', name: '自动化测试', slug: 'testing' }
];

export const posts: Post[] = [
  {
    id: 'js-prototype',
    title: '深入理解JavaScript原型链',
    description: '从底层机制理解JavaScript的原型继承，掌握原型链的运行机制，解决继承相关的疑难问题。',
    category: 'javascript',
    tags: ['javascript'],
    date: '2024-01-14',
    author: '周恩军',
    content: `# 深入理解JavaScript原型链

## 什么是原型链？

原型链是JavaScript实现继承的主要方式。每个对象都有一个原型对象，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。这种关系常被称为原型链。

## 原型链的工作原理

1. 当你访问一个对象的属性时，JavaScript 引擎首先在对象自身的属性中查找。
2. 如果找不到，就会继续在对象的原型中查找。
3. 如果还是找不到，就会继续在原型的原型中查找，直到找到该属性或到达原型链的末尾。

\`\`\`javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log(\`Hello, I'm \${this.name}\`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const myDog = new Dog('Max', 'Golden Retriever');
myDog.sayHello(); // 输出: Hello, I'm Max
\`\`\`

## 实际应用场景

1. 继承复用
2. 方法扩展
3. 框架开发
`,
    readingTime: 15,
    slug: 'understanding-javascript-prototype',
    coverImage: '/images/posts/js-prototype.svg'
  },
  {
    id: 'vue3-composition',
    title: 'Vue3 Composition API最佳实践',
    description: '详解Vue3 Composition API的使用技巧，以及在实际项目中的应用场景和注意事项。',
    category: 'vue',
    tags: ['vue', 'typescript'],
    date: '2024-01-13',
    author: '周恩军',
    content: `# Vue3 Composition API最佳实践

## 为什么要使用Composition API？

Composition API是Vue3中最重要的特性之一，它提供了一种更灵活的方式来组织组件的逻辑。相比于Options API，它具有以下优势：

1. 更好的代码组织
2. 更好的类型推导
3. 更好的逻辑复用

## 基础示例

\`\`\`typescript
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const double = computed(() => count.value * 2);

    function increment() {
      count.value++;
    }

    onMounted(() => {
      console.log('Component mounted!');
    });

    return {
      count,
      double,
      increment
    };
  }
};
\`\`\`

## 最佳实践

1. 使用组合式函数
2. 响应式数据管理
3. 生命周期钩子
4. 类型安全
`,
    readingTime: 20,
    slug: 'vue3-composition-api-best-practices',
    coverImage: '/images/posts/vue3-composition.svg'
  }
];
