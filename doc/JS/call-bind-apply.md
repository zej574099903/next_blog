# call、bind、apply 的区别与面试题

## 基本概念

这三个方法都是用来改变函数执行时的上下文（this指向）的，它们的主要区别在于：

### 1. call 方法
- 立即执行函数
- 第一个参数指定 this 值
- 后续参数以参数列表形式传递
- 语法：`func.call(thisArg, arg1, arg2, ...)`

```javascript
const person1 = {
    name: '张三',
    sayHi: function(greeting) {
        console.log(`${greeting}, 我是 ${this.name}`);
    }
};

const person2 = { name: '李四' };
person1.sayHi.call(person2, '你好'); // 输出：你好, 我是 李四
```

### 2. apply 方法
- 立即执行函数
- 第一个参数指定 this 值
- 第二个参数必须是数组，包含所有参数
- 语法：`func.apply(thisArg, [arg1, arg2, ...])`

```javascript
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers); // 等同于 Math.max(...numbers)
console.log(max); // 7
```

### 3. bind 方法
- 返回新函数，不会立即执行
- 永久绑定 this 值
- 可以分两次传入参数
- 语法：`func.bind(thisArg, arg1, arg2, ...)`

```javascript
const person3 = { name: '王五' };
const boundFunction = person1.sayHi.bind(person3);
boundFunction('早上好'); // 输出：早上好, 我是 王五
```

## 常见面试题

### 1. 手写 call 方法
```javascript
Function.prototype.myCall = function(context, ...args) {
    context = context || window; // 如果没有传入上下文，默认为 window
    const fn = Symbol('fn'); // 创建唯一的属性名
    context[fn] = this; // this 指向调用 myCall 的函数
    const result = context[fn](...args);
    delete context[fn];
    return result;
};
```

### 2. 手写 apply 方法
```javascript
Function.prototype.myApply = function(context, args = []) {
    context = context || window;
    const fn = Symbol('fn');
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};
```

### 3. 手写 bind 方法
```javascript
Function.prototype.myBind = function(context, ...args1) {
    const fn = this;
    return function(...args2) {
        return fn.apply(context, [...args1, ...args2]);
    };
};
```

### 4. 面试常见问题

#### Q1: call 和 apply 的区别是什么？
A: 主要区别在于参数的传递方式：
- call 接受参数列表：`func.call(thisArg, arg1, arg2, ...)`
- apply 接受参数数组：`func.apply(thisArg, [arg1, arg2, ...])`

#### Q2: 为什么要使用 bind？
A: bind 主要用于以下场景：
1. 需要固定函数的 this 指向
2. 在事件处理函数中保持正确的 this 指向
3. 函数柯里化
4. 创建偏函数

#### Q3: call、apply、bind 的性能比较？
A: 
- call 的性能通常优于 apply，因为 apply 需要额外的数组解构
- bind 会创建新的函数，所以在需要重复调用的场景下更适合
- 如果参数少于 3 个，优先使用 call
- 如果参数是数组或类数组，使用 apply 更方便

#### Q4: 如何判断一个函数是否是通过 bind 绑定的？
```javascript
function isBindFunction(fn) {
    return fn.name.startsWith('bound ');
}
```

#### Q5: bind 后的函数可以再次 bind 吗？
A: 可以再次 bind，但是第二次及以后的 bind 都不会生效，this 指向由第一次 bind 时确定。

```javascript
const obj1 = { name: '张三' };
const obj2 = { name: '李四' };
function sayName() {
    console.log(this.name);
}

const boundFunc = sayName.bind(obj1);
const boundFunc2 = boundFunc.bind(obj2);
boundFunc2(); // 输出：张三（而不是李四）
```

### 实际应用场景

1. **事件处理**
```javascript
class Button {
    constructor(value) {
        this.value = value;
        // 使用 bind 确保回调函数中的 this 指向正确
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        console.log(this.value);
    }
}
```

2. **函数借用**
```javascript
// 类数组对象借用数组方法
function sum() {
    return Array.prototype.reduce.call(arguments, (sum, num) => sum + num, 0);
}
```

3. **构造函数继承**
```javascript
function Animal(name) {
    this.name = name;
}

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}
```
