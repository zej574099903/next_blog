# ES6 常见面试题

## 1. let、const 和 var 的区别？

**答案：**
1. 变量提升
   - var 存在变量提升
   - let/const 不存在变量提升，存在暂时性死区
   
2. 重复声明
   - var 允许重复声明
   - let/const 不允许重复声明
   
3. 块级作用域
   - var 不存在块级作用域
   - let/const 存在块级作用域
   
4. 修改声明的变量
   - var/let 可以修改声明的变量
   - const 声明后不能修改（对于引用类型，可以修改其属性）

```javascript
// 示例
{
    console.log(a); // undefined (变量提升)
    var a = 1;
    
    console.log(b); // ReferenceError (暂时性死区)
    let b = 2;
}
console.log(a); // 1
console.log(b); // ReferenceError (块级作用域)
```

## 2. 箭头函数与普通函数的区别？

**答案：**
1. this指向
   - 普通函数：this指向调用时的对象
   - 箭头函数：this继承自外层作用域，不会被调用方式影响

2. arguments对象
   - 普通函数：有自己的arguments对象
   - 箭头函数：没有自己的arguments对象

3. 构造函数
   - 普通函数：可以作为构造函数使用new
   - 箭头函数：不能作为构造函数使用new

```javascript
// 示例
const obj = {
    name: 'test',
    sayName1: function() {
        setTimeout(function() {
            console.log(this.name); // undefined
        }, 100);
    },
    sayName2: function() {
        setTimeout(() => {
            console.log(this.name); // test
        }, 100);
    }
};
```

## 3. Promise 相关问题

**问题1：Promise 的三种状态是什么？如何转换？**

**答案：**
- pending（等待态）
- fulfilled（成功态）
- rejected（失败态）
- 状态只能从pending转换到fulfilled或rejected，且转换后不可再变

**问题2：Promise.all 和 Promise.race 的区别？**

**答案：**
- Promise.all：
  - 所有Promise都成功才成功
  - 任一Promise失败则失败
  - 返回所有Promise结果的数组
  
- Promise.race：
  - 返回最先完成的Promise的结果
  - 不管是成功还是失败

```javascript
// Promise.all示例
Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
]).then(values => console.log(values)); // [1, 2, 3]

// Promise.race示例
Promise.race([
    new Promise(resolve => setTimeout(() => resolve(1), 1000)),
    new Promise(resolve => setTimeout(() => resolve(2), 2000))
]).then(value => console.log(value)); // 1
```

## 4. async/await 相关问题

**问题：async/await 的原理是什么？有什么优势？**

**答案：**
1. 原理
   - async/await 是Generator函数的语法糖
   - 通过Promise和生成器实现异步编程
   
2. 优势
   - 使异步代码看起来像同步代码
   - 更好的错误处理机制
   - 避免回调地狱
   - 更易于调试

```javascript
// 示例
async function fetchData() {
    try {
        const response = await fetch('api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
```

## 5. ES6 模块化（import/export）

**问题：ES6模块与CommonJS模块有什么区别？**

**答案：**
1. 语法差异
   - ES6: import/export
   - CommonJS: require/module.exports

2. 加载时机
   - ES6模块是编译时加载
   - CommonJS是运行时加载

3. 输出值
   - ES6模块输出值的引用
   - CommonJS输出值的拷贝

```javascript
// ES6模块
export const name = 'ES6';
import { name } from './module';

// CommonJS
module.exports = {
    name: 'CommonJS'
};
const { name } = require('./module');
```

## 6. 解构赋值的使用和原理

**问题：解构赋值的常见用法有哪些？**

**答案：**
1. 数组解构
```javascript
const [a, b, ...rest] = [1, 2, 3, 4, 5];
// a = 1, b = 2, rest = [3, 4, 5]
```

2. 对象解构
```javascript
const { name, age, address: { city } = {} } = person;
```

3. 函数参数解构
```javascript
function print({ name, age }) {
    console.log(name, age);
}
```

## 7. Set和Map的区别和使用场景

**答案：**
1. Set
   - 存储唯一值的集合
   - 常用于数组去重
   - 值不能重复

2. Map
   - 存储键值对
   - 键可以是任意类型
   - 常用于需要键值对的场景

```javascript
// Set示例
const set = new Set([1, 2, 2, 3]);
console.log([...set]); // [1, 2, 3]

// Map示例
const map = new Map();
map.set('name', 'ES6');
map.set({}, 'object');
```

## 面试技巧

1. 回答问题时先说概念，再举例说明
2. 注意说明实际开发中的使用场景
3. 对比不同特性的优缺点
4. 适当展示对ES6深入理解的地方
5. 准备一些实际项目中使用ES6特性的例子
