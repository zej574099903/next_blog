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

export const posts: Post[]  = [
  {
    id: 'js-call-bind-apply',
    title: '深入理解 JavaScript 中的 call、bind、apply',
    description: '详细探讨 JavaScript 中 call、bind、apply 的原理、区别和实际应用场景，以及如何手动实现这些方法。',
    category: 'javascript',
    tags: ['javascript'],
    date: '2024-01-14',
    author: '周恩军',
    content: `# 深入理解 JavaScript 中的 call、bind、apply

## 基本概念

call、bind 和 apply 是 JavaScript 中用于改变函数执行上下文（this 指向）的三个重要方法。它们都定义在 Function.prototype 上，因此所有的函数都可以调用这些方法。

### 语法对比

\`\`\`javascript
function.call(thisArg, arg1, arg2, ...)
function.apply(thisArg, [argsArray])
function.bind(thisArg, arg1, arg2, ...)
\`\`\`

主要区别：
- call：立即执行函数，参数逐个传递
- apply：立即执行函数，参数以数组形式传递
- bind：返回新函数，不立即执行，参数逐个传递

## 深入理解

### 1. call 方法

call 方法可以指定函数运行时的 this 指向，并立即执行函数：

\`\`\`javascript
const person = {
  name: 'John',
  greet() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
};

function greetWithAge(age) {
  console.log(\`Hello, I'm \${this.name} and I'm \${age} years old\`);
}

// 基本使用
greetWithAge.call(person, 25); // 输出: Hello, I'm John and I'm 25 years old

// 实现继承
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  Animal.call(this, name); // 调用父类构造函数
  this.breed = breed;
}

const dog = new Dog('Max', 'Golden Retriever');
console.log(dog.name); // 输出: Max
\`\`\`

### 2. apply 方法

apply 方法与 call 类似，但接受数组形式的参数：

\`\`\`javascript
// 基本使用
greetWithAge.apply(person, [25]); // 输出: Hello, I'm John and I'm 25 years old

// 实用场景：找数组最大值
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);
// 等同于 Math.max(...numbers)
console.log(max); // 输出: 7

// 合并数组
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
Array.prototype.push.apply(array1, array2);
console.log(array1); // 输出: [1, 2, 3, 4, 5, 6]
\`\`\`

### 3. bind 方法

bind 方法创建一个新函数，其 this 值被永久绑定到指定值：

\`\`\`javascript
const boundGreet = greetWithAge.bind(person, 25);
boundGreet(); // 输出: Hello, I'm John and I'm 25 years old

// 偏函数应用
function multiply(a, b) {
  return a * b;
}

const multiplyByTwo = multiply.bind(null, 2);
console.log(multiplyByTwo(4)); // 输出: 8
\`\`\`

## 手动实现这些方法

### 1. 实现 call

\`\`\`javascript
Function.prototype.myCall = function(context, ...args) {
  // 处理 null 或 undefined 的情况
  context = context || window;
  
  // 为了避免属性名冲突，使用 Symbol
  const fn = Symbol('fn');
  
  // 将函数设为对象的属性
  context[fn] = this;
  
  // 执行函数
  const result = context[fn](...args);
  
  // 删除临时属性
  delete context[fn];
  
  return result;
};

// 测试
function test(age) {
  console.log(\`\${this.name} is \${age} years old\`);
}

const person = { name: 'John' };
test.myCall(person, 25); // 输出: John is 25 years old
\`\`\`

### 2. 实现 apply

\`\`\`javascript
Function.prototype.myApply = function(context, args = []) {
  context = context || window;
  const fn = Symbol('fn');
  
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  
  return result;
};

// 测试
test.myApply(person, [25]); // 输出: John is 25 years old
\`\`\`

### 3. 实现 bind

\`\`\`javascript
Function.prototype.myBind = function(context, ...args1) {
  const originalFn = this;
  
  return function(...args2) {
    return originalFn.apply(context, [...args1, ...args2]);
  };
};

// 测试
const boundTest = test.myBind(person);
boundTest(25); // 输出: John is 25 years old
\`\`\`

## 实际应用场景

### 1. 事件处理器中保持 this 指向

\`\`\`javascript
class Counter {
  constructor() {
    this.count = 0;
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
    console.log(this.count);
  }

  setup() {
    document.getElementById('button').addEventListener('click', this.increment);
  }
}
\`\`\`

### 2. 借用数组方法

\`\`\`javascript
function sum() {
  // 将类数组对象转换为数组
  const args = Array.prototype.slice.call(arguments);
  return args.reduce((sum, num) => sum + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 输出: 10
\`\`\`

### 3. 函数柯里化

\`\`\`javascript
function multiply(a, b, c) {
  return a * b * c;
}

const multiplyByTwo = multiply.bind(null, 2);
const multiplyByTwoAndThree = multiplyByTwo.bind(null, 3);

console.log(multiplyByTwoAndThree(4)); // 输出: 24 (2 * 3 * 4)
\`\`\`

## 性能考虑

1. **call vs apply**：当参数数量确定时，优先使用 call，因为它的性能略优于 apply。

2. **bind 的性能开销**：bind 会创建一个新函数，因此有一定的性能开销。如果在循环或高频调用中使用，考虑将绑定后的函数缓存起来。

\`\`\`javascript
// 不推荐
elements.forEach(element => {
  element.addEventListener('click', handler.bind(this));
});

// 推荐
const boundHandler = handler.bind(this);
elements.forEach(element => {
  element.addEventListener('click', boundHandler);
});
\`\`\`

## 最佳实践

1. **明确使用场景**：
   - 需要明确指定 this 指向时使用 call/apply
   - 需要固定 this 指向或创建偏函数时使用 bind
   - 处理参数数组时使用 apply

2. **注意性能影响**：
   - 避免在性能关键代码中过度使用 bind
   - 适当缓存 bind 后的函数

3. **使用现代语法替代**：
   - 使用扩展运算符替代 apply：\`Math.max(...numbers)\`
   - 使用箭头函数替代 bind：保持 this 指向

## 总结

call、bind 和 apply 是 JavaScript 中非常重要的方法，它们提供了灵活控制函数执行上下文的能力。通过深入理解这些方法的工作原理，我们可以：

1. 更好地控制函数的执行上下文
2. 实现更灵活的函数式编程
3. 编写更简洁、可维护的代码

在实际开发中，建议根据具体场景选择合适的方法，并注意性能影响。同时，也要与时俱进，适当使用现代 JavaScript 特性来替代这些传统方法。

## 参考资料

1. Gang of Four Design Patterns
2. JavaScript Design Patterns by Addy Osmani
3. Head First Design Patterns
4. Clean Code by Robert C. Martin

`,
    readingTime: 15,
    slug: 'understanding-javascript-call-bind-apply',
    coverImage: '/images/posts/js-call-bind-apply.svg'
  },
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

## 原型链的核心概念

### 1. __proto__ 和 prototype

在JavaScript中，每个对象都有一个内部属性 [[Prototype]]（在大多数浏览器中可以通过 __proto__ 访问）。同时，每个函数都有一个 prototype 属性。理解这两个概念的区别和联系是掌握原型链的关键：

\`\`\`javascript
function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');

console.log(alice.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true
\`\`\`

### 2. constructor 属性

每个原型对象都有一个 constructor 属性，指向构造函数：

\`\`\`javascript
console.log(Person.prototype.constructor === Person); // true
console.log(alice.constructor === Person); // true
\`\`\`

## 原型链的工作原理

当你访问一个对象的属性时，JavaScript引擎会：

1. 首先在对象自身的属性中查找
2. 如果找不到，就会继续在对象的原型（__proto__）中查找
3. 如果还是找不到，就会继续在原型的原型中查找
4. 这个过程会一直持续到找到属性或到达原型链的末尾（null）

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

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// 在Dog原型上添加方法
Dog.prototype.bark = function() {
  console.log('Woof! Woof!');
};

const max = new Dog('Max', 'Golden Retriever');
max.sayHello(); // 输出: Hello, I'm Max
max.bark(); // 输出: Woof! Woof!
\`\`\`

## 实际应用场景

### 1. 继承和方法复用

原型链最常见的应用是实现继承和方法复用：

\`\`\`javascript
// 基础工具类
function Utils() {}
Utils.prototype.formatDate = function(date) {
  return date.toLocaleDateString();
};

// 特定业务类继承工具类
function BusinessService() {}
BusinessService.prototype = Object.create(Utils.prototype);
BusinessService.prototype.constructor = BusinessService;

const service = new BusinessService();
console.log(service.formatDate(new Date())); // 可以使用Utils的方法
\`\`\`

### 2. 原型链污染防护

在处理用户输入或JSON数据时，需要注意原型链污染的安全问题：

\`\`\`javascript
// 不安全的实现
const user = {};
const userInput = JSON.parse('{"__proto__": {"isAdmin": true}}');
Object.assign(user, userInput);

// 安全的实现
const safeUser = {};
const sanitizedInput = JSON.parse('{"__proto__": {"isAdmin": true}}');
Object.keys(sanitizedInput).forEach(key => {
  if (key !== '__proto__') {
    safeUser[key] = sanitizedInput[key];
  }
});
\`\`\`

### 3. Mixin模式实现

通过原型链可以实现多重继承的Mixin模式：

\`\`\`javascript
const SerializableMixin = {
  serialize() {
    return JSON.stringify(this);
  }
};

const ValidatableMixin = {
  validate() {
    return this.required.every(prop => this[prop]);
  }
};

function User(data) {
  this.name = data.name;
  this.email = data.email;
  this.required = ['name', 'email'];
}

// 将Mixin方法混入到User.prototype
Object.assign(User.prototype, SerializableMixin, ValidatableMixin);

const user = new User({ name: 'John', email: 'john@example.com' });
console.log(user.validate()); // true
console.log(user.serialize()); // {"name":"John","email":"john@example.com"}
\`\`\`

## 性能考虑

原型链虽然强大，但在实际使用中需要注意以下几点：

1. **原型链的长度**：原型链越长，属性查找的时间就越长。建议保持原型链相对扁平。

2. **属性屏蔽**：对象自身的属性会屏蔽原型链上的同名属性，这可能导致意外的行为。

\`\`\`javascript
function Parent() {}
Parent.prototype.value = 'parent';

function Child() {}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.value = 'child';

const instance = new Child();
console.log(instance.value); // 'child'，而不是'parent'
\`\`\`

3. **方法定义位置**：频繁访问的方法最好直接定义在构造函数中，而不是原型上。

## 现代JavaScript中的原型链

ES6+引入了一些新特性，使得处理原型链更加方便：

### 1. Class语法

\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log(\`Hello, I'm \${this.name}\`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    console.log('Woof! Woof!');
  }
}
\`\`\`

### 2. Object.create()的高级用法

\`\`\`javascript
const proto = {
  calculateArea() {
    return this.width * this.height;
  }
};

const rectangle = Object.create(proto, {
  width: {
    value: 5,
    writable: true,
    enumerable: true
  },
  height: {
    value: 3,
    writable: true,
    enumerable: true
  }
});

console.log(rectangle.calculateArea()); // 15
\`\`\`

## 调试技巧

在开发中调试原型链相关问题时，可以使用以下方法：

\`\`\`javascript
// 1. 检查原型链
function inspectPrototypeChain(obj) {
  let current = obj;
  const chain = [];
  
  while (current) {
    chain.push(current);
    current = Object.getPrototypeOf(current);
  }
  
  return chain;
}

// 2. 检查属性来源
function findPropertyOwner(obj, prop) {
  let current = obj;
  
  while (current) {
    if (current.hasOwnProperty(prop)) {
      return current;
    }
    current = Object.getPrototypeOf(current);
  }
  
  return null;
}
\`\`\`

## 最佳实践

1. **使用 Object.create() 而不是直接赋值**：
   - 推荐：\`Child.prototype = Object.create(Parent.prototype);\`
   - 不推荐：\`Child.prototype = Parent.prototype;\`

2. **总是设置构造函数**：
   \`\`\`javascript
   Child.prototype = Object.create(Parent.prototype);
   Child.prototype.constructor = Child;
   \`\`\`

3. **使用 Class 语法来简化继承**：
   当不需要特别的原型链操作时，优先使用 class 语法。

4. **避免直接操作 __proto__**：
   使用 Object.getPrototypeOf() 和 Object.setPrototypeOf() 来操作原型。

## 总结

JavaScript的原型链是一个强大而灵活的特性，它不仅是实现继承的基础机制，还为代码复用和对象行为扩展提供了强大的工具。通过深入理解原型链的工作原理，我们可以：

1. 更好地控制函数的执行上下文
2. 实现更灵活的函数式编程
3. 编写更简洁、可维护的代码

在实际开发中，建议：
1. 优先使用现代的Class语法
2. 理解并小心使用原型链的动态性
3. 注意性能和安全性问题
4. 保持原型链的简洁性

掌握原型链不仅有助于我们理解JavaScript的运行机制，也能帮助我们更好地理解和使用各种JavaScript框架和库的源码。`,
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
  },
  {
    id: 'javascript-design-patterns',
    title: '深入理解 JavaScript 设计模式：提高代码质量的必备指南',
    description: '探索 JavaScript 中最常用的设计模式，包括单例模式、观察者模式、工厂模式等，通过实际示例深入理解每种模式的应用场景和实现方式。',
    date: '2025-01-14',
    category: 'javascript',
    author: 'CodeGeek',
    tags: ['JavaScript', '设计模式', '代码质量', '最佳实践'],
    content: `
# 深入理解 JavaScript 设计模式：提高代码质量的必备指南

设计模式是软件开发中解决常见问题的成熟方案。在 JavaScript 中，理解和运用设计模式可以帮助我们写出更加优雅、可维护的代码。本文将深入探讨几种最常用的 JavaScript 设计模式，并通过实际示例来理解它们的应用场景和实现方式。

## 1. 单例模式（Singleton Pattern）

单例模式确保一个类只有一个实例，并提供一个全局访问点。这在需要统一管理状态或资源的场景中特别有用。

### 实现方式

\`\`\`javascript
class Singleton {
  private static instance: Singleton;
  private constructor() {
    // 私有构造函数，防止外部直接实例化
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  // 实例方法
  public someMethod() {
    return 'Singleton Method';
  }
}

// 使用示例
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
\`\`\`

### 实际应用场景

1. 全局状态管理（如 Redux store）
2. 数据库连接池
3. 配置管理
4. 日志记录器

## 2. 观察者模式（Observer Pattern）

观察者模式定义了对象之间的一对多依赖关系。当一个对象状态改变时，所有依赖于它的对象都会得到通知并自动更新。

### 实现方式

\`\`\`javascript
class Subject {
  private observers: Observer[] = [];

  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public update(data: any): void {
    console.log(\`\${this.name} received update with data: \${data}\`);
  }
}

// 使用示例
const subject = new Subject();
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.notify('Hello Observers!');
\`\`\`

### 实际应用场景

1. 事件处理系统
2. 用户界面更新
3. 消息推送系统
4. 数据绑定

## 3. 工厂模式（Factory Pattern）

工厂模式提供了创建对象的接口，让子类决定实例化哪个类。这使得对象的创建更加灵活和可扩展。

### 实现方式

\`\`\`javascript
interface Product {
  operation(): string;
}

class ConcreteProductA implements Product {
  operation(): string {
    return 'Product A';
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return 'Product B';
  }
}

class Factory {
  createProduct(type: string): Product {
    switch (type) {
      case 'A':
        return new ConcreteProductA();
      case 'B':
        return new ConcreteProductB();
      default:
        throw new Error('Invalid product type');
    }
  }
}

// 使用示例
const factory = new Factory();
const productA = factory.createProduct('A');
console.log(productA.operation()); // 'Product A'
\`\`\`

### 实际应用场景

1. UI 组件创建
2. 数据模型实例化
3. 插件系统
4. API 适配器

## 4. 策略模式（Strategy Pattern）

策略模式定义了一系列算法，并使它们可以互相替换。这种模式让算法的变化独立于使用算法的客户端。

### 实现方式

\`\`\`javascript
interface Strategy {
  execute(data: number[]): number;
}

class AverageStrategy implements Strategy {
  execute(data: number[]): number {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
  }
}

class MaxStrategy implements Strategy {
  execute(data: number[]): number {
    return Math.max(...data);
  }
}

class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  executeStrategy(data: number[]): number {
    return this.strategy.execute(data);
  }
}

// 使用示例
const numbers = [1, 2, 3, 4, 5];
const context = new Context(new AverageStrategy());
console.log(context.executeStrategy(numbers)); // 3

context.setStrategy(new MaxStrategy());
console.log(context.executeStrategy(numbers)); // 5
\`\`\`

### 实际应用场景

1. 表单验证
2. 支付方式选择
3. 排序算法选择
4. 价格计算策略

## 5. 装饰器模式（Decorator Pattern）

装饰器模式允许向现有对象添加新的功能，同时不改变其结构。这是一种比继承更加灵活的扩展对象功能的方式。

### 实现方式

\`\`\`javascript
interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  operation(): string {
    return 'ConcreteComponent';
  }
}

class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  operation(): string {
    return this.component.operation();
  }
}

class ConcreteDecoratorA extends Decorator {
  operation(): string {
    return \`DecoratorA(\${super.operation()})\`;
  }
}

class ConcreteDecoratorB extends Decorator {
  operation(): string {
    return \`DecoratorB(\${super.operation()})\`;
  }
}

// 使用示例
const simple = new ConcreteComponent();
const decoratorA = new ConcreteDecoratorA(simple);
const decoratorB = new ConcreteDecoratorB(decoratorA);

console.log(decoratorB.operation());
// 输出: DecoratorB(DecoratorA(ConcreteComponent))
\`\`\`

### 实际应用场景

1. 日志记录
2. 性能监控
3. 数据验证
4. 缓存实现

## 总结

设计模式是解决软件开发中常见问题的成熟方案。在 JavaScript 中，恰当地使用设计模式可以帮助我们写出更加优雅、可维护的代码。

选择合适的设计模式时，需要考虑：

- 问题的具体场景
- 代码的可维护性需求
- 团队的开发经验
- 项目的扩展需求

最后，记住设计模式不是银弹，过度使用反而会增加代码的复杂度。在实际开发中，应该根据具体情况选择最适合的模式。

## 参考资料

1. Gang of Four Design Patterns
2. JavaScript Design Patterns by Addy Osmani
3. Head First Design Patterns
4. Clean Code by Robert C. Martin

`,
    readingTime: 15,
    slug: 'understanding-javascript-design-patterns'
  },
  {
    id: 'javascript-for-in-for-of',
    title: '深入理解 JavaScript 中的 for...in 和 for...of：区别与最佳实践',
    description: '详细探讨 JavaScript 中 for...in 和 for...of 循环的区别、使用场景、性能考虑以及最佳实践，帮助你在实际开发中做出正确的选择。',
    date: '2025-01-14',
    category: 'javascript',
    author: 'CodeGeek',
    tags: ['JavaScript', '循环', '迭代器', '最佳实践'],
    content: `
# 深入理解 JavaScript 中的 for...in 和 for...of：区别与最佳实践

在 JavaScript 中，\`for...in\` 和 \`for...of\` 是两种常用的循环语句，它们看起来很相似，但实际上有着本质的区别。本文将深入探讨这两种循环的特点、使用场景和最佳实践。

## 1. 基本概念

### for...in

\`for...in\` 语句用于遍历对象的可枚举属性。它会遍历对象的整个原型链，除非使用 \`hasOwnProperty()\` 来过滤。

\`\`\`javascript
const obj = {
  name: 'John',
  age: 30,
  city: 'New York'
};

for (const key in obj) {
  console.log(key, obj[key]);
}
// 输出:
// name John
// age 30
// city New York
\`\`\`

### for...of

\`for...of\` 语句用于遍历可迭代对象（如数组、字符串、Set、Map 等）的值。它使用迭代器协议，只遍历值，不包含属性名和原型链上的属性。

\`\`\`javascript
const arr = ['Apple', 'Banana', 'Orange'];

for (const value of arr) {
  console.log(value);
}
// 输出:
// Apple
// Banana
// Orange
\`\`\`

## 2. 主要区别

### 2.1 遍历目标

1. **for...in**：
   - 遍历对象的可枚举属性（包括原型链上的属性）
   - 主要用于普通对象
   - 返回属性名（键名）

2. **for...of**：
   - 遍历可迭代对象的值
   - 用于数组、字符串、Set、Map 等可迭代对象
   - 返回属性值

### 2.2 示例对比

\`\`\`javascript
// 数组遍历对比
const array = ['a', 'b', 'c'];

// for...in 遍历数组
for (const index in array) {
  console.log(index); // 输出: "0", "1", "2"
}

// for...of 遍历数组
for (const value of array) {
  console.log(value); // 输出: "a", "b", "c"
}

// 对象遍历对比
const object = { a: 1, b: 2, c: 3 };

// for...in 可以遍历对象
for (const key in object) {
  console.log(key, object[key]); // 输出: "a 1", "b 2", "c 3"
}

// for...of 不能直接遍历普通对象
// 这会抛出错误：TypeError: object is not iterable
// for (const value of object) { 
//   console.log(value);
// }
\`\`\`

## 3. 特殊情况和注意事项

### 3.1 原型链属性

\`for...in\` 会遍历原型链上的属性，这可能导致意外的结果：

\`\`\`javascript
// 创建一个构造函数
function Person(name) {
  this.name = name;
}

// 在原型上添加一个方法
Person.prototype.sayHello = function() {
  console.log('Hello!');
};

const person = new Person('John');

// for...in 会遍历到原型方法
for (const prop in person) {
  console.log(prop);
}
// 输出:
// name
// sayHello

// 使用 hasOwnProperty 过滤原型属性
for (const prop in person) {
  if (person.hasOwnProperty(prop)) {
    console.log(prop);
  }
}
// 输出:
// name
\`\`\`

### 3.2 数组索引顺序

\`for...in\` 不保证遍历顺序，而 \`for...of\` 会按照迭代器的顺序遍历：

\`\`\`javascript
const arr = ['a', 'b', 'c'];
arr.customProp = 'custom';

// for...in 可能不按照索引顺序遍历
for (const key in arr) {
  console.log(key); // 可能输出: "0", "1", "2", "customProp"
}

// for...of 保证按照迭代顺序遍历
for (const value of arr) {
  console.log(value); // 输出: "a", "b", "c"
}
\`\`\`

## 4. 性能考虑

### 4.1 for...in 的性能

- 需要遍历原型链
- 每次迭代都要进行属性查找
- 在大型对象上可能较慢

### 4.2 for...of 的性能

- 直接访问迭代器
- 不需要遍历原型链
- 通常比 for...in 更快

\`\`\`javascript
// 性能对比示例
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);

console.time('for...in');
for (const index in largeArray) {
  const value = largeArray[index];
}
console.timeEnd('for...in');

console.time('for...of');
for (const value of largeArray) {
  // 直接获取值
}
console.timeEnd('for...of');
\`\`\`

## 5. 最佳实践

### 5.1 使用 for...in 的场景

1. 遍历对象的属性名
2. 需要访问对象的键值对
3. 需要遍历包括原型链上的属性

\`\`\`javascript
// 遍历对象属性的推荐方式
const config = {
  host: 'localhost',
  port: 3000,
  secure: true
};

for (const key in config) {
  if (config.hasOwnProperty(key)) {
    console.log(\`\${key}: \${config[key]}\`);
  }
}
\`\`\`

### 5.2 使用 for...of 的场景

1. 遍历数组元素
2. 遍历字符串字符
3. 遍历 Set 或 Map 的值
4. 需要使用 break 或 continue 语句

\`\`\`javascript
// 遍历数组的推荐方式
const fruits = ['apple', 'banana', 'orange'];
for (const fruit of fruits) {
  console.log(fruit);
}

// 遍历字符串
const str = 'Hello';
for (const char of str) {
  console.log(char);
}

// 遍历 Set
const uniqueNumbers = new Set([1, 2, 3]);
for (const num of uniqueNumbers) {
  console.log(num);
}

// 遍历 Map
const userMap = new Map([
  ['id', 1],
  ['name', 'John']
]);
for (const [key, value] of userMap) {
  console.log(\`\${key}: \${value}\`);
}
\`\`\`

## 6. 总结

1. **for...in**：
   - 用于遍历对象属性
   - 返回可枚举属性名
   - 包含原型链属性
   - 不保证遍历顺序
   - 性能相对较慢

2. **for...of**：
   - 用于遍历可迭代对象的值
   - 返回迭代值
   - 不遍历原型链
   - 保证遍历顺序
   - 性能较好

选择使用哪种循环方式时，需要考虑：

- 遍历的数据类型（对象还是可迭代对象）
- 是否需要访问键名
- 是否需要遍历原型链
- 性能要求
- 代码可读性

## 参考资料

1. MDN Web Docs: for...in
2. MDN Web Docs: for...of
3. ECMAScript 规范
4. JavaScript: The Good Parts

`,
    readingTime: 12,
    slug: 'javascript-for-in-for-of-differences'
  },
  {
    id: 'javascript-debounce-throttle',
    title: '深入理解 JavaScript 防抖和节流：优化性能的关键技术',
    description: '详细探讨 JavaScript 中防抖（Debounce）和节流（Throttle）的原理、实现方式、应用场景以及性能优化策略。',
    date: '2025-01-14',
    category: 'javascript',
    author: 'CodeGeek',
    tags: ['JavaScript', '性能优化', '防抖', '节流', '最佳实践'],
    content: `
# 深入理解 JavaScript 防抖和节流：优化性能的关键技术

在前端开发中，防抖（Debounce）和节流（Throttle）是两种重要的性能优化技术。它们都用于控制函数的执行频率，但适用场景和实现方式有所不同。本文将深入探讨这两种技术的原理、实现和应用场景。

## 1. 防抖（Debounce）

### 1.1 原理

防抖的核心思想是：在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。这可以类比为电梯的运作方式：电梯等待一段时间后才关门，如果有人在这期间进入，就重新计时。

### 1.2 实现方式

#### 基础版本

\`\`\`javascript
function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
\`\`\`

#### 带立即执行选项的完整版本

\`\`\`javascript
function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

// 使用示例
const expensiveOperation = debounce(() => {
  console.log('Expensive operation executed');
}, 250);

// 事件监听
window.addEventListener('resize', expensiveOperation);
\`\`\`

### 1.3 应用场景

1. **搜索框输入联想**
\`\`\`javascript
const searchInput = document.querySelector('#search');
const searchAPI = async (query) => {
  // API 调用
};

const debouncedSearch = debounce(async (query) => {
  const results = await searchAPI(query);
  // 更新搜索结果
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
\`\`\`

2. **窗口调整事件**
\`\`\`javascript
const handleResize = debounce(() => {
  // 更新布局
}, 250);

window.addEventListener('resize', handleResize);
\`\`\`

3. **表单验证**
\`\`\`javascript
const validateEmail = debounce((email) => {
  // 验证邮箱格式
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  updateValidationUI(isValid);
}, 500);
\`\`\`

## 2. 节流（Throttle）

### 2.1 原理

节流的核心思想是：在一段时间内，只执行一次函数。这可以类比为游戏中的技能冷却时间：技能在冷却时间内只能使用一次。

### 2.2 实现方式

#### 使用时间戳的实现

\`\`\`javascript
function throttle(func, limit) {
  let lastFunc;
  let lastRan;

  return function executedFunction(...args) {
    const context = this;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
\`\`\`

#### 使用定时器的实现

\`\`\`javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
const throttledScroll = throttle(() => {
  console.log('Scroll event throttled');
}, 250);

window.addEventListener('scroll', throttledScroll);
\`\`\`

### 2.3 应用场景

1. **滚动事件处理**
\`\`\`javascript
const handleScroll = throttle(() => {
  // 计算滚动位置
  const scrolled = window.scrollY;
  // 更新UI
  updateScrollIndicator(scrolled);
}, 100);

window.addEventListener('scroll', handleScroll);
\`\`\`

2. **游戏中的按键处理**
\`\`\`javascript
const handleKeyPress = throttle((event) => {
  // 处理玩家输入
  if (event.key === 'Space') {
    fireProjectile();
  }
}, 100);

document.addEventListener('keydown', handleKeyPress);
\`\`\`

3. **实时数据更新**
\`\`\`javascript
const updateChartData = throttle(async () => {
  const newData = await fetchLatestData();
  updateChart(newData);
}, 1000);
\`\`\`

## 3. 防抖和节流的区别

### 3.1 执行时机

- **防抖**：在最后一次事件触发后等待一段时间再执行
- **节流**：在一段时间内只执行一次

### 3.2 应用场景对比

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| 搜索框输入 | 防抖 | 等待用户输入完成后再发送请求 |
| 页面滚动 | 节流 | 以固定频率处理滚动事件 |
| 窗口调整 | 防抖 | 等待用户调整完成后再重新计算布局 |
| 按钮点击 | 节流 | 限制按钮点击频率 |

## 4. 性能优化建议

### 4.1 防抖优化

1. **合理设置等待时间**
\`\`\`javascript
// 输入联想可以设置较短的等待时间
const quickDebounce = debounce(func, 200);

// 复杂计算可以设置较长的等待时间
const heavyDebounce = debounce(func, 500);
\`\`\`

2. **使用立即执行选项**
\`\`\`javascript
// 某些场景下需要立即响应
const immediateDebounce = debounce(func, 200, true);
\`\`\`

### 4.2 节流优化

1. **选择合适的时间间隔**
\`\`\`javascript
// 频繁更新的UI可以使用较短的间隔
const quickThrottle = throttle(func, 100);

// 资源密集型操作使用较长的间隔
const heavyThrottle = throttle(func, 500);
\`\`\`

2. **考虑使用 requestAnimationFrame**
\`\`\`javascript
function rafThrottle(func) {
  let ticking = false;

  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}
\`\`\`

## 5. 最佳实践

### 5.1 选择标准

1. **使用防抖的情况**：
   - 用户输入
   - 窗口调整
   - API 请求
   - 表单验证

2. **使用节流的情况**：
   - 滚动事件
   - 动画帧更新
   - 游戏循环
   - 数据流处理

### 5.2 注意事项

1. **内存泄漏防范**
\`\`\`javascript
// 在组件卸载时清除定时器
class Component {
  constructor() {
    this.handleScroll = throttle(this.onScroll.bind(this), 200);
  }

  componentWillUnmount() {
    // 清除事件监听
    window.removeEventListener('scroll', this.handleScroll);
    // 如果实现了取消功能，也要清除定时器
    this.handleScroll.cancel && this.handleScroll.cancel();
  }
}
\`\`\`

2. **保持 this 上下文**
\`\`\`javascript
class SearchComponent {
  constructor() {
    // 绑定 this 上下文
    this.debouncedSearch = debounce(this.search.bind(this), 300);
  }

  search(query) {
    // 这里的 this 会指向正确的实例
    this.setState({ loading: true });
  }
}
\`\`\`

## 6. 总结

防抖和节流都是优化高频事件处理的重要技术：

1. **防抖（Debounce）**：
   - 适合处理最终状态
   - 等待一段时间后执行
   - 重复触发会重新计时

2. **节流（Throttle）**：
   - 适合控制执行频率
   - 保证一定时间内只执行一次
   - 适合实时性要求的场景

选择使用哪种技术时，需要考虑：

- 业务需求（是否需要实时响应）
- 性能影响（函数执行的开销）
- 用户体验（响应的及时性）
- 资源消耗（网络请求、计算量）

## 参考资料

1. MDN Web Docs
2. Underscore.js 源码
3. Lodash 文档
4. JavaScript 高级程序设计（第4版）

`,
    readingTime: 15,
    slug: 'javascript-debounce-throttle-explanation'
  },
  {
    id: 'vue3-hooks-deep-dive',
    title: '深入理解 Vue 3 Hooks：从原理到实践',
    description: '详细探讨 Vue 3 中 Hooks 的工作原理、最佳实践、常见用例以及如何构建自定义 Hooks，帮助你更好地组织和复用组件逻辑。',
    date: '2025-01-14',
    category: 'vue',
    author: 'CodeGeek',
    tags: ['Vue3', 'Hooks', 'Composition API', '最佳实践'],
    content: `
# 深入理解 Vue 3 Hooks：从原理到实践

Vue 3 的 Composition API 为我们提供了一种新的组织组件逻辑的方式，而 Hooks 则是在此基础上实现逻辑复用的最佳实践。本文将深入探讨 Vue 3 Hooks 的工作原理、实践技巧和最佳实践。

## 1. 什么是 Vue 3 Hooks？

Hooks 是一种使用 Composition API 封装和复用有状态逻辑的函数。它们通常以 "use" 开头，可以在不同的组件之间共享逻辑，同时保持响应性。

### 1.1 基本概念

\`\`\`typescript
// 一个简单的 Hook 示例
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

// 在组件中使用
import { useMousePosition } from './hooks/useMousePosition'

export default {
  setup() {
    const { x, y } = useMousePosition()
    return { x, y }
  }
}
\`\`\`

## 2. Hook 的工作原理

### 2.1 响应式系统

Hooks 利用 Vue 3 的响应式系统来管理状态：

\`\`\`typescript
import { ref, watch, computed } from 'vue'

export function useCounter(initialValue = 0) {
  // 创建响应式状态
  const count = ref(initialValue)
  
  // 创建计算属性
  const doubled = computed(() => count.value * 2)
  
  // 监听变化
  watch(count, (newValue, oldValue) => {
    console.log(\`Count changed from \${oldValue} to \${newValue}\`)
  })
  
  // 提供方法
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    doubled,
    increment,
    decrement
  }
}
\`\`\`

### 2.2 生命周期集成

Hooks 可以与 Vue 的生命周期钩子无缝集成：

\`\`\`typescript
import { onMounted, onUnmounted, ref } from 'vue'

export function useInterval(callback: () => void, delay: number) {
  const intervalId = ref<number | null>(null)

  onMounted(() => {
    intervalId.value = setInterval(callback, delay)
  })

  onUnmounted(() => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
  })

  return intervalId
}
\`\`\`

## 3. 高级特性

### 3.1 订阅状态变化

\`\`\`typescript
const store = useCounterStore()

// 订阅状态变化
store.$subscribe((mutation, state) => {
  // 将变化持久化到本地存储
  localStorage.setItem('counter', JSON.stringify(state))
})

// 订阅 action
store.$onAction(({
  name, // action 名称
  store, // store 实例
  args, // 传递给 action 的参数数组
  after, // 在 action 结束后的钩子
  onError // action 抛出错误时的钩子
}) => {
  console.log(\`Action \${name} was triggered\`)

  after((result) => {
    console.log(\`Action \${name} completed with result: \${result}\`)
  })

  onError((error) => {
    console.error(\`Action \${name} failed with error: \${error}\`)
  })
})
\`\`\`

### 3.2 插件系统

创建自定义插件：

\`\`\`typescript
// plugins/my-plugin.ts
import type { Plugin } from 'pinia'

export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    
    // 构建阶段钩子
    buildStart() {
      console.log('构建开始')
    },
    
    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        return {
          code: transformedCode,
          map: null
        }
      }
    },
    
    // 配置服务器
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义中间件
        next()
      })
    }
  }
}
\`\`\`

## 4. 常用 Hooks 实现

### 4.1 状态管理 Hook

\`\`\`typescript
interface UserState {
  profile: {
    id: number
    name: string
    email: string
  } | null
  preferences: Record<string, any>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    preferences: {}
  }),
  getters: {
    userName: (state): string => state.profile?.name ?? 'Guest'
  }
})
\`\`\`

### 4.2 网络请求 Hook

\`\`\`typescript
export function useFetch<T>(): UseFetch<T> {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const mounted = ref(true)

  onUnmounted(() => {
    mounted.value = false
  })

  async function execute(url: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await window.fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      if (mounted.value) {
        loading.value = false
      }
    }
  }

  return {
    data,
    error,
    loading,
    execute
  }
}
\`\`\`

### 4.3 表单处理 Hook

\`\`\`typescript
interface UseForm<T> {
  values: T
  errors: Record<keyof T, string>
  touched: Record<keyof T, boolean>
  handleChange: (field: keyof T, value: any) => void
  handleBlur: (field: keyof T) => void
  validate: () => boolean
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
): UseForm<T> {
  const values = ref(initialValues) as any
  const errors = ref({} as Record<keyof T, string>)
  const touched = ref({} as Record<keyof T, boolean>)

  const handleChange = (field: keyof T, value: any) => {
    values.value[field] = value
    validateField(field)
  }

  const handleBlur = (field: keyof T) => {
    touched.value[field] = true
    validateField(field)
  }

  const validateField = (field: keyof T) => {
    const rule = validationRules[field]
    if (rule) {
      const error = rule(values.value[field])
      errors.value[field] = error || ''
    }
  }

  const validate = () => {
    let isValid = true
    for (const field in validationRules) {
      validateField(field)
      if (errors.value[field]) {
        isValid = false
      }
    }
    return isValid
  }

  return {
    values: values.value,
    errors: errors.value,
    touched: touched.value,
    handleChange,
    handleBlur,
    validate
  }
}
\`\`\`

## 5. 高级用法

### 5.1 组合多个 Hooks

\`\`\`typescript
function useUserProfile(userId: string) {
  const { data: user, loading: userLoading } = useFetch<User>()
  const { data: posts, loading: postsLoading } = useFetch<Post[]>()

  const loading = computed(() => userLoading.value || postsLoading.value)

  async function loadProfile() {
    await user.fetch(\`/api/users/\${userId}\`)
    await posts.fetch(\`/api/users/\${userId}/posts\`)
  }

  return {
    user,
    posts,
    loading,
    loadProfile
  }
}
\`\`\`

### 5.2 条件性 Hook 使用

\`\`\`typescript
function useConditionalFeature(enabled: boolean) {
  if (!enabled) {
    return {
      available: false,
      data: null
    }
  }

  const feature = useFeature()
  
  return {
    available: true,
    ...feature
  }
}
\`\`\`

## 6. 最佳实践

### 6.1 命名规范

1. **使用 use 前缀**
\`\`\`typescript
// ✅ 好的命名
useMousePosition()
useWindowSize()
useLocalStorage()

// ❌ 避免的命名
mousePosition()
getWindowSize()
localStorage()
\`\`\`

2. **返回值命名**
\`\`\`typescript
// ✅ 好的实践
const { data, error, loading } = useFetch()

// ❌ 避免的实践
const { fetchData, fetchError, isFetching } = useFetch()
\`\`\`

### 6.2 错误处理

\`\`\`typescript
export function useSafeAsync<T>(asyncFunction: () => Promise<T>) {
  const mounted = ref(true)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T | null>(null)

  onUnmounted(() => {
    mounted.value = false
  })

  async function execute() {
    loading.value = true
    error.value = null
    
    try {
      const result = await asyncFunction()
      if (mounted.value) {
        data.value = result
      }
    } catch (error) {
      if (mounted.value) {
        error.value = error as Error
      }
    } finally {
      if (mounted.value) {
        loading.value = false
      }
    }
  }

  return {
    loading,
    error,
    data,
    execute
  }
}
\`\`\`

### 6.3 性能优化

\`\`\`typescript
import { ref, computed, watchEffect } from 'vue'

export function useOptimizedComputation<T>(
  heavyComputation: () => T,
  dependencies: any[]
) {
  const cache = ref<T | null>(null)
  const computing = ref(false)

  watchEffect(() => {
    computing.value = true
    // 使用 requestIdleCallback 在空闲时间执行计算
    requestIdleCallback(() => {
      cache.value = heavyComputation()
      computing.value = false
    })
  })

  return {
    result: computed(() => cache.value),
    computing
  }
}
\`\`\`

## 7. 常见问题和解决方案

### 7.1 避免内存泄漏

\`\`\`typescript
export function useEventListener(
  target: EventTarget,
  event: string,
  callback: EventListener
) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
\`\`\`

### 7.2 处理异步操作

\`\`\`typescript
export function useAsync<T>(asyncFunction: () => Promise<T>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const mounted = ref(true)

  onUnmounted(() => {
    mounted.value = false
  })

  async function execute() {
    loading.value = true
    error.value = null
    
    try {
      const result = await asyncFunction()
      if (mounted.value) {
        data.value = result
      }
    } catch (e) {
      if (mounted.value) {
        error.value = e as Error
      }
    } finally {
      if (mounted.value) {
        loading.value = false
      }
    }
  }

  return {
    data,
    error,
    loading,
    execute
  }
}
\`\`\`

## 8. 总结

Vue 3 Hooks 提供了一种强大的逻辑复用方式，主要优点包括：

1. **逻辑复用**：
   - 跨组件复用状态逻辑
   - 保持代码的 DRY 原则
   - 提高维护性

2. **关注点分离**：
   - 相关逻辑集中在一起
   - 提高代码可读性
   - 便于测试和维护

3. **灵活性**：
   - 可组合多个 Hooks
   - 条件性使用
   - 适应不同场景

使用 Hooks 时需要注意：

- 始终在 setup() 或其他 Hooks 中调用
- 保持命名一致性
- 注意内存泄漏
- 处理好异步操作
- 优化性能

## 参考资料

1. Vue 3 官方文档
2. Vue Composition API RFC
3. Vue 3 源码
4. 实用的 Vue Composition API 示例集

`,
    readingTime: 20,
    slug: 'vue3-hooks-deep-dive'
  },
  {
    id: 'vue3-pinia-deep-dive',
    title: '深入理解 Pinia：Vue 3 状态管理的新选择',
    description: '详细探讨 Pinia 的核心概念、最佳实践、性能优化以及与 Vuex 的对比，帮助你掌握 Vue 3 生态系统中的状态管理解决方案。',
    date: '2025-01-14',
    category: 'vue',
    author: 'CodeGeek',
    tags: ['Vue3', 'Pinia', '状态管理', '最佳实践'],
    content: `
# 深入理解 Pinia：Vue 3 状态管理的新选择

Pinia 作为 Vue 的官方状态管理库，为 Vue 3 应用提供了一个简单、类型安全且可扩展的状态管理解决方案。本文将深入探讨 Pinia 的核心概念、实践技巧和性能优化策略。

## 1. Pinia 简介

### 1.1 为什么选择 Pinia？

Pinia 相比 Vuex 具有以下优势：

1. **更好的 TypeScript 支持**
   - 自动类型推断
   - 无需创建自定义复杂类型

2. **更简单的 API**
   - 无需 mutations
   - 更少的样板代码
   - 支持多个 store

3. **更好的开发体验**
   - 热模块替换 (HMR)
   - Vue DevTools 支持
   - 可扩展性强

### 1.2 基本概念

\`\`\`typescript
// store/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  // 计算属性
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  // 操作方法
  actions: {
    increment() {
      this.count++
    }
  }
})
\`\`\`

## 2. Store 的定义与使用

### 2.1 Setup Store

使用组合式 API 风格定义 store：

\`\`\`typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  const name = ref('Counter')
  
  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  
  // 操作方法
  function increment() {
    count.value++
  }
  
  return {
    count,
    name,
    doubleCount,
    increment
  }
})
\`\`\`

### 2.2 在组件中使用

\`\`\`vue
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>
\`\`\`

## 3. 高级特性

### 3.1 订阅状态变化

\`\`\`typescript
const store = useCounterStore()

// 订阅状态变化
store.$subscribe((mutation, state) => {
  // 将变化持久化到本地存储
  localStorage.setItem('counter', JSON.stringify(state))
})

// 订阅 action
store.$onAction(({
  name, // action 名称
  store, // store 实例
  args, // 传递给 action 的参数数组
  after, // 在 action 结束后的钩子
  onError // action 抛出错误时的钩子
}) => {
  console.log(\`Action \${name} was triggered\`)

  after((result) => {
    console.log(\`Action \${name} completed with result: \${result}\`)
  })

  onError((error) => {
    console.error(\`Action \${name} failed with error: \${error}\`)
  })
})
\`\`\`

### 3.2 插件系统

创建自定义插件：

\`\`\`typescript
// plugins/my-plugin.ts
import type { PiniaPluginContext } from 'pinia'

export default function myPlugin({ store }: PiniaPluginContext) {
  // 从本地存储恢复状态
  const savedState = localStorage.getItem(\`store-\${store.$id}\`)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // 监听变化并保存到本地存储
  store.$subscribe((mutation, state) => {
    localStorage.setItem(\`store-\${store.$id}\`, JSON.stringify(state))
  })
}

// 使用插件
const pinia = createPinia()
pinia.use(myPlugin)
\`\`\`

## 4. 最佳实践

### 4.1 Store 组织

\`\`\`typescript
// stores/modules/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    preferences: {}
  }),
  actions: {
    async fetchProfile() {
      // 实现获取用户信息的逻辑
    }
  }
})

// stores/modules/cart.ts
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price, 0)
  }
})

// stores/index.ts
export * from './modules/user'
export * from './modules/cart'
\`\`\`

### 4.2 类型安全

\`\`\`typescript
interface UserState {
  profile: {
    id: number
    name: string
    email: string
  } | null
  preferences: Record<string, any>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    preferences: {}
  }),
  getters: {
    userName: (state): string => state.profile?.name ?? 'Guest'
  }
})
\`\`\`

## 5. 性能优化

### 5.1 状态分割

将大型 store 分割成多个小型 store：

\`\`\`typescript
// 用户基本信息
export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({ /* ... */ })
})

// 用户偏好设置
export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({ /* ... */ })
})

// 用户订单
export const useUserOrdersStore = defineStore('userOrders', {
  state: () => ({ /* ... */ })
})
\`\`\`

### 5.2 避免不必要的响应式

\`\`\`typescript
import { markRaw } from 'vue'

export const useStore = defineStore('main', {
  state: () => ({
    // 标记不需要响应式的大对象
    heavyObject: markRaw({
      // 大量数据
    })
  })
})
\`\`\`

## 6. 与 Vuex 的对比

### 6.1 核心概念对比

| Vuex | Pinia | 说明 |
|------|--------|------|
| Mutations | 不需要 | Pinia 直接在 actions 中修改状态 |
| Actions | Actions | 基本相同，但 Pinia 的 actions 更简洁 |
| Modules | Stores | Pinia 的 stores 天生就是模块化的 |
| 命名空间 | Store ID | Pinia 使用 store ID 自动处理命名空间 |

### 6.2 迁移策略

从 Vuex 迁移到 Pinia：

1. **状态迁移**
\`\`\`typescript
// Vuex
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => commit('increment'), 1000)
    }
  }
})

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
    async asyncIncrement() {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.increment()
    }
  }
})
\`\`\`

## 7. 实战示例

### 7.1 认证 Store

\`\`\`typescript
// stores/auth.ts
import { defineStore } from 'pinia'

interface AuthState {
  currentUser: User | null
  loading: boolean
  error: string | null
}

interface AuthModel {
  namespace: 'auth'
  state: AuthState
  actions: {
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    fetchCurrentUser: () => Promise<void>
  }
}

const AuthModel: AuthModel = {
  namespace: 'auth',
  
  state: {
    currentUser: null,
    loading: false,
    error: null
  },
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.login(email, password)
        this.currentUser = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      try {
        await api.logout()
      } finally {
        this.currentUser = null
      }
    },
    
    async fetchCurrentUser() {
      try {
        const response = await api.getCurrentUser()
        this.currentUser = response.data
      } catch {
        this.currentUser = null
      }
    }
  }
}

export default AuthModel
\`\`\`

### 7.2 购物车 Store

\`\`\`typescript
// stores/cart.ts
import { defineStore } from 'pinia'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  loading: boolean
}

interface CartModel {
  namespace: 'cart'
  state: CartState
  actions: {
    addItem(item: CartItem): void
    removeItem(id: number): void
    syncWithServer(): Promise<void>
  }
}

const CartModel: CartModel = {
  namespace: 'cart',
  
  state: {
    items: [],
    loading: false
  },
  
  actions: {
    addItem(item) {
      const existing = this.items.find(i => i.id === item.id)
      
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...item, quantity: 1 })
      }
      
      this.syncWithServer()
    },
    
    removeItem(id) {
      const index = this.items.findIndex(item => item.id === id)
      if (index > -1) {
        this.items.splice(index, 1)
        this.syncWithServer()
      }
    },
    
    async syncWithServer() {
      this.loading = true
      try {
        await api.post('/cart/sync', { items: this.items })
      } finally {
        this.loading = false
      }
    }
  }
}

export default CartModel
\`\`\`

## 8. 调试与测试

### 8.1 使用 Vue DevTools

Pinia 与 Vue DevTools 完全集成，可以：
- 查看所有 store 的状态
- 追踪状态变化
- 时间旅行调试
- 在开发工具中修改状态

### 8.2 单元测试

\`\`\`typescript
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('increments counter', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    store.increment()
    expect(store.count).toBe(1)
  })

  it('doubles count', () => {
    const store = useCounterStore()
    store.count = 2
    expect(store.doubleCount).toBe(4)
  })
})
\`\`\`

## 9. 总结

Pinia 作为 Vue 3 的官方状态管理方案，具有以下优势：

1. **简单性**
   - API 简洁直观
   - 学习曲线平缓
   - 代码量减少

2. **类型安全**
   - 完整的 TypeScript 支持
   - 自动类型推断
   - IDE 智能提示

3. **模块化**
   - 自然的代码分割
   - 更好的代码组织
   - 按需加载

4. **开发体验**
   - 出色的开发工具支持
   - 热模块替换
   - 插件系统

使用 Pinia 时的最佳实践：

- 合理拆分 store
- 使用 TypeScript
- 实现持久化
- 处理好异步操作
- 注意性能优化

## 参考资料

1. Pinia 官方文档
2. Vue 3 文档
3. TypeScript 文档
4. 状态管理最佳实践指南

`,
    readingTime: 25,
    slug: 'vue3-pinia-deep-dive'
  },
  {
    id: 'vue3-vite-deep-dive',
    title: '深入理解 Vite：下一代前端构建工具',
    description: '详细探讨 Vite 的工作原理、性能优化、插件系统和最佳实践，帮助你构建更快速、更高效的现代前端应用。',
    date: '2025-01-14',
    category: 'engineering',
    author: 'CodeGeek',
    tags: ['Vite', '工程化', '构建工具', '性能优化'],
    content: `
# 深入理解 Vite：下一代前端构建工具

Vite 作为新一代前端构建工具，以其极速的冷启动、即时的热更新和优秀的开发体验而闻名。本文将深入探讨 Vite 的核心原理、最佳实践和性能优化策略。

## 1. Vite 核心原理

### 1.1 为什么选择 Vite？

Vite 相比传统构建工具具有以下优势：

1. **极速的冷启动**
   - 基于 ESM 的开发服务器
   - 按需编译
   - 智能缓存

2. **即时的热更新**
   - 精确的更新范围
   - 状态保留
   - 快速响应

3. **优化的构建**
   - 基于 Rollup
   - 开箱即用的优化
   - 灵活的配置

### 1.2 基本原理

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
\`\`\`

## 2. 开发服务器

### 2.1 ESM 开发服务器

Vite 的开发服务器基于原生 ESM：

\`\`\`html
<!-- index.html -->
<script type="module">
  import { createApp } from '/node_modules/.vite/vue.js'
  import App from '/src/App.vue'
  
  createApp(App).mount('#app')
</script>
\`\`\`

### 2.2 按需编译

\`\`\`typescript
// Vite 只在浏览器请求时编译文件
import.meta.url // 获取模块 URL
import.meta.env // 环境变量
\`\`\`

## 3. 构建优化

### 3.1 预构建依赖

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core'],
    exclude: ['your-local-package']
  }
})
\`\`\`

### 3.2 CSS 处理

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: \`@import "@/styles/variables.scss";\`
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
\`\`\`

## 4. 插件系统

### 4.1 创建自定义插件

\`\`\`typescript
// plugins/my-plugin.ts
import type { Plugin } from 'vite'

export default function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    
    // 构建阶段钩子
    buildStart() {
      console.log('构建开始')
    },
    
    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        return {
          code: transformedCode,
          map: null
        }
      }
    },
    
    // 配置服务器
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义中间件
        next()
      })
    }
  }
}
\`\`\`

### 4.2 常用插件配置

\`\`\`typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
\`\`\`

## 5. 性能优化

### 5.1 构建优化

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // 构建后目录
    outDir: 'dist',
    
    // 静态资源目录
    assetsDir: 'assets',
    
    // 小于此阈值的导入或引用资源将内联为 base64 编码
    assetsInlineLimit: 4096,
    
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    
    // 构建后是否生成 source map 文件
    sourcemap: false,
    
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'nested/index.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
\`\`\`

### 5.2 资源优化

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 启用 gzip 压缩
    brotliSize: true,
    
    // 指定在生成的 HTML 中引入资源的方式
    manifest: true,
    
    // 设置为 'es' 以输出更小的文件
    target: 'es2015',
    
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['lodash-es', 'axios']
        }
      }
    }
  }
})
\`\`\`

## 6. 最佳实践

### 6.1 项目结构

\`\`\`
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── favicon.ico
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── store/
│   ├── styles/
│   └── types/
└── dist/
\`\`\`

### 6.2 性能优化建议

1. **依赖预构建**
\`\`\`typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'lodash-es'
    ]
  }
})
\`\`\`

2. **代码分割**
\`\`\`typescript
// router/index.ts
const routes = [
  {
    path: '/about',
    component: () => import('../views/About.vue')
  }
]
\`\`\`

3. **资源压缩**
\`\`\`typescript
// vite.config.ts
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ]
})
\`\`\`

## 7. 调试与优化

### 7.1 开发调试

\`\`\`typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    https: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
\`\`\`

### 7.2 性能分析

\`\`\`typescript
// vite.config.ts
import analyzer from 'rollup-plugin-analyzer'

export default defineConfig({
  plugins: [
    analyzer({
      summaryOnly: true,
      limit: 10
    })
  ]
})
\`\`\`

## 8. 总结

Vite 作为现代前端构建工具的佼佼者，具有以下优势：

1. **开发体验**
   - 极速的冷启动
   - 即时的热更新
   - 直观的错误提示

2. **构建性能**
   - 基于 ESM
   - 智能的代码分割
   - 高效的资源处理

3. **扩展性**
   - 强大的插件系统
   - 灵活的配置选项
   - 丰富的生态系统

使用 Vite 时的最佳实践：

- 合理配置预构建依赖
- 优化资源加载策略
- 使用合适的插件
- 注意生产环境优化
- 保持项目结构清晰

## 参考资料

1. Vite 官方文档
2. Rollup 文档
3. Vue 3 文档
4. 现代前端工具链指南

`,
    readingTime: 25,
    slug: 'vue3-vite-deep-dive'
  },
  {
    id: 'react-dva-deep-dive',
    title: '深入理解 DVA：基于 Redux 的数据流解决方案',
    description: '详细探讨 DVA 的核心概念、工作原理、最佳实践以及在 React 应用中的实际应用，帮助你更好地管理应用状态。',
    date: '2025-01-14',
    category: 'react',
    author: 'CodeGeek',
    tags: ['React', 'DVA', 'Redux', '状态管理'],
    content: `
# 深入理解 DVA：基于 Redux 的数据流解决方案

DVA 是一个基于 Redux 和 Redux-saga 的数据流方案，它简化了 Redux 的使用，提供了一种优雅的方式来处理数据流。本文将深入探讨 DVA 的核心概念、最佳实践和实际应用。

## 1. DVA 简介

### 1.1 为什么选择 DVA？

DVA 相比原生 Redux 具有以下优势：

1. **简化的 API**
   - 统一的 Model 概念
   - 内置 Redux-saga
   - 减少样板代码

2. **完整的类型支持**
   - TypeScript 友好
   - 完整的类型推导
   - IDE 智能提示

3. **优秀的开发体验**
   - 内置 Redux DevTools
   - 热模块替换
   - 插件机制

### 1.2 基本概念

\`\`\`typescript
// models/counter.ts
export default {
  namespace: 'counter',
  
  state: {
    count: 0
  },
  
  reducers: {
    increment(state) {
      return { ...state, count: state.count + 1 }
    },
    decrement(state) {
      return { ...state, count: state.count - 1 }
    }
  },
  
  effects: {
    *incrementAsync(action, { call, put }) {
      yield call(delay, 1000)
      yield put({ type: 'increment' })
    }
  },
  
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/counter') {
          dispatch({ type: 'increment' })
        }
      })
    }
  }
}
\`\`\`

## 2. Model 详解

### 2.1 State

定义 Model 的初始状态：

\`\`\`typescript
interface CounterState {
  count: number
  loading: boolean
}

const model = {
  namespace: 'counter',
  state: {
    count: 0,
    loading: false
  } as CounterState
}
\`\`\`

### 2.2 Reducers

处理同步操作：

\`\`\`typescript
const model = {
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    
    increment(state) {
      return { ...state, count: state.count + 1 }
    },
    
    // 支持 ImmerJS
    incrementImmer(state, { payload }) {
      state.count += payload
    }
  }
}
\`\`\`

### 2.3 Effects

处理异步操作：

\`\`\`typescript
const model = {
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { id } = payload
      const data = yield call(api.fetchUser, id)
      
      // 获取当前 state
      const count = yield select(state => state.counter.count)
      
      yield put({ type: 'save', payload: { data } })
    },
    
    // 取消操作
    *fetchWithCancel({ payload }, { call, put, race, take }) {
      const { data, cancel } = yield race({
        data: call(api.fetchData),
        cancel: take('FETCH_CANCEL')
      })
      
      if (data) {
        yield put({ type: 'save', payload: data })
      }
    }
  }
}
\`\`\`

### 2.4 Subscriptions

监听外部事件：

\`\`\`typescript
const model = {
  subscriptions: {
    // 监听路由变化
    routeChange({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch' })
        }
      })
    },
    
    // 监听键盘事件
    keyboard({ dispatch }) {
      return window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          dispatch({ type: 'increment' })
        }
      })
    }
  }
}
\`\`\`

## 3. 实战应用

### 3.1 用户认证 Model

\`\`\`typescript
// models/auth.ts
import { Effect, Reducer, Subscription } from 'dva'
import { message } from 'antd'

interface AuthState {
  currentUser: User | null
  loading: boolean
  error: string | null
}

interface AuthModel {
  namespace: 'auth'
  state: AuthState
  effects: {
    login: Effect
    logout: Effect
    fetchCurrentUser: Effect
  }
  reducers: {
    saveCurrentUser: Reducer<AuthState>
    clearUser: Reducer<AuthState>
    setLoading: Reducer<AuthState>
  }
  subscriptions: {
    setup: Subscription
  }
}

const AuthModel: AuthModel = {
  namespace: 'auth',
  
  state: {
    currentUser: null,
    loading: false,
    error: null
  },
  
  effects: {
    *login({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true })
      
      try {
        const response = yield call(api.login, payload)
        yield put({ type: 'saveCurrentUser', payload: response.data })
        message.success('登录成功')
      } catch (error) {
        yield put({ type: 'setError', payload: error.message })
        message.error('登录失败')
      } finally {
        yield put({ type: 'setLoading', payload: false })
      }
    },
    
    *logout(_, { call, put }) {
      yield call(api.logout)
      yield put({ type: 'clearUser' })
      message.success('已退出登录')
    },
    
    *fetchCurrentUser(_, { call, put }) {
      try {
        const response = yield call(api.getCurrentUser)
        yield put({ type: 'saveCurrentUser', payload: response.data })
      } catch (error) {
        yield put({ type: 'clearUser' })
      }
    }
  },
  
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload, error: null }
    },
    
    clearUser(state) {
      return { ...state, currentUser: null, error: null }
    },
    
    setLoading(state, { payload }) {
      return { ...state, loading: payload }
    },
    
    setError(state, { payload }) {
      return { ...state, error: payload }
    }
  },
  
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // 在进入需要认证的页面时检查用户状态
        if (pathname !== '/login') {
          dispatch({ type: 'fetchCurrentUser' })
        }
      })
    }
  }
}

export default AuthModel
\`\`\`

### 3.2 列表管理 Model

\`\`\`typescript
// models/list.ts
import { Effect, Reducer } from 'dva'
import { message } from 'antd'

interface ListState {
  items: any[]
  total: number
  page: number
  pageSize: number
  loading: boolean
}

interface ListModel {
  namespace: 'list'
  state: ListState
  effects: {
    fetch: Effect
    create: Effect
    update: Effect
    remove: Effect
  }
  reducers: {
    saveList: Reducer<ListState>
    updateItem: Reducer<ListState>
    removeItem: Reducer<ListState>
  }
}

const ListModel: ListModel = {
  namespace: 'list',
  
  state: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false
  },
  
  effects: {
    *fetch({ payload }, { call, put }) {
      const { page = 1, pageSize = 10 } = payload
      yield put({ type: 'setLoading', payload: true })
      
      try {
        const response = yield call(api.fetchList, { page, pageSize })
        yield put({
          type: 'saveList',
          payload: {
            items: response.data.items,
            total: response.data.total,
            page,
            pageSize
          }
        })
      } finally {
        yield put({ type: 'setLoading', payload: false })
      }
    },
    
    *create({ payload }, { call, put }) {
      try {
        const response = yield call(api.createItem, payload)
        yield put({ type: 'fetch' })
        message.success('创建成功')
      } catch (error) {
        message.error('创建失败')
      }
    },
    
    *update({ payload }, { call, put }) {
      const { id, data } = payload
      try {
        yield call(api.updateItem, id, data)
        yield put({ type: 'updateItem', payload: { id, data } })
        message.success('更新成功')
      } catch (error) {
        message.error('更新失败')
      }
    },
    
    *remove({ payload }, { call, put }) {
      try {
        yield call(api.removeItem, payload)
        yield put({ type: 'removeItem', payload })
        message.success('删除成功')
      } catch (error) {
        message.error('删除失败')
      }
    }
  },
  
  reducers: {
    saveList(state, { payload }) {
      return { ...state, ...payload }
    },
    
    updateItem(state, { payload }) {
      const { id, data } = payload
      const items = state.items.map(item =>
        item.id === id ? { ...item, ...data } : item
      )
      return { ...state, items }
    },
    
    removeItem(state, { payload }) {
      const items = state.items.filter(item => item.id !== payload)
      return { ...state, items }
    },
    
    setLoading(state, { payload }) {
      return { ...state, loading: payload }
    }
  }
}

export default ListModel
\`\`\`

## 4. 最佳实践

### 4.1 Model 组织

\`\`\`typescript
// models/index.ts
import auth from './auth'
import list from './list'
import counter from './counter'

export default [
  auth,
  list,
  counter
]

// app.ts
import models from './models'
import { createApp } from 'dva'

const app = createApp()
models.forEach(model => app.model(model))
\`\`\`

### 4.2 TypeScript 支持

\`\`\`typescript
// types/dva.d.ts
import { Dispatch } from 'redux'
import { EffectsCommandMap } from 'dva'

export interface DvaState {
  auth: AuthState
  list: ListState
  counter: CounterState
}

export interface DvaDispatch extends Dispatch {
  <R = any>(action: { type: string; payload?: any }): R
}

export interface DvaEffects {
  select: <T>(selector: (state: DvaState) => T) => T
  put: (action: { type: string; payload?: any }) => void
  call: <T>(fn: (...args: any[]) => Promise<T>, ...args: any[]) => T
  take: (type: string) => { type: string; payload?: any }
  cancel: (task: Promise<any>) => void
  [key: string]: any
}

export interface DvaLoading {
  global: boolean
  models: { [key: string]: boolean }
  effects: { [key: string]: boolean }
}
\`\`\`

### 4.3 性能优化

1. **使用 Reselect 优化选择器**

\`\`\`typescript
import { createSelector } from 'reselect'

const selectItems = state => state.list.items
const selectFilter = state => state.list.filter

export const selectFilteredItems = createSelector(
  [selectItems, selectFilter],
  (items, filter) => items.filter(item => 
    item.name.includes(filter)
  )
)
\`\`\`

2. **批量更新**

\`\`\`typescript
function* batchUpdate({ payload }, { put }) {
  yield put({ type: 'startBatch' })
  
  for (const item of payload) {
    yield put({ type: 'updateItem', payload: item })
  }
  
  yield put({ type: 'endBatch' })
}
\`\`\`

### 4.4 错误处理

\`\`\`typescript
// utils/errorHandler.ts
export function* errorHandler(effect) {
  try {
    yield effect
  } catch (error) {
    yield put({ type: 'global/error', payload: error })
    message.error(error.message)
  }
}

// models/example.ts
*fetch({ payload }, { call, put }) {
  yield errorHandler(function* () {
    const data = yield call(api.fetchData)
    yield put({ type: 'save', payload: data })
  })
}
\`\`\`

## 5. 调试技巧

### 5.1 使用 Redux DevTools

\`\`\`typescript
const app = dva({
  onAction: process.env.NODE_ENV === 'development'
    ? [require('redux-logger').createLogger()]
    : []
})
\`\`\`

### 5.2 日志中间件

\`\`\`typescript
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  const result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const app = dva({
  onAction: [logger]
})
\`\`\`

## 6. 插件开发

### 6.1 创建插件

\`\`\`typescript
export default {
  onAction: (action, { dispatch, getState }) => {
    // 处理 action
    return action
  },
  
  onStateChange: (state) => {
    // 状态变化时的处理
  },
  
  onEffect: (effect, { put }, model, actionType) => {
    // 处理 effect
    return function* (...args) {
      yield effect(...args)
    }
  },
  
  extraReducers: {
    // 额外的 reducers
  },
  
  extraEnhancers: [
    // 额外的 enhancers
  ]
}
\`\`\`

### 6.2 使用插件

\`\`\`typescript
import createLoading from 'dva-loading'

const app = dva()
app.use(createLoading())
\`\`\`

## 7. 总结

DVA 作为一个基于 Redux 和 Redux-saga 的数据流方案，具有以下优势：

1. **简单性**
   - 统一的 Model 概念
   - 简化的 API
   - 减少样板代码

2. **可维护性**
   - 清晰的代码组织
   - 类型安全
   - 易于测试

3. **扩展性**
   - 插件机制
   - 中间件支持
   - 完整的生态系统

使用 DVA 时的最佳实践：

- 合理组织 Model
- 使用 TypeScript
- 注意性能优化
- 做好错误处理
- 善用开发工具

## 参考资料

1. DVA 官方文档
2. Redux 文档
3. Redux-saga 文档
4. React 最佳实践指南

`,
    readingTime: 25,
    slug: 'react-dva-deep-dive'
  },
];
