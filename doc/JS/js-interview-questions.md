# JavaScript 常见面试题

## 1. 数据类型与类型判断

### Q: JavaScript 有哪些数据类型？如何判断？
```javascript
// 基本数据类型（原始类型）：
- number
- string
- boolean
- undefined
- null
- symbol (ES6)
- bigint (ES2020)

// 引用类型：
- object
- array
- function

// 判断方法：
// 1. typeof
typeof 42;                  // "number"
typeof "abc";              // "string"
typeof true;               // "boolean"
typeof undefined;          // "undefined"
typeof null;               // "object" (这是一个历史遗留bug)
typeof Symbol();           // "symbol"
typeof 42n;                // "bigint"

// 2. instanceof（判断引用类型）
[] instanceof Array;        // true
{} instanceof Object;       // true

// 3. Object.prototype.toString.call()
Object.prototype.toString.call([]);        // "[object Array]"
Object.prototype.toString.call({});        // "[object Object]"
Object.prototype.toString.call(null);      // "[object Null]"
```

### Q: null 和 undefined 的区别？
```javascript
// undefined：
1. 变量声明但未赋值
2. 对象属性不存在
3. 函数没有返回值
4. 函数参数未传递

// null：
1. 表示"空"对象
2. 原型链的终点
3. 手动设置变量或对象的值为"空"
```

## 2. 作用域与闭包

### Q: 什么是闭包？请给出实例
```javascript
// 闭包是能够访问自由变量的函数
function createCounter() {
    let count = 0;  // 自由变量
    return {
        increment() {
            count++;
            return count;
        },
        getCount() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
```

### Q: 说明 var、let、const 的区别
```javascript
// 1. 变量提升
console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError
let b = 2;

// 2. 暂时性死区
{
    console.log(a); // undefined
    var a = 1;
    
    console.log(b); // ReferenceError
    let b = 2;
}

// 3. 块级作用域
{
    var a = 1;
    let b = 2;
}
console.log(a); // 1
console.log(b); // ReferenceError

// 4. 重复声明
var a = 1;
var a = 2; // 允许

let b = 1;
let b = 2; // SyntaxError

// 5. const 特性
const obj = { name: 'John' };
obj.name = 'Mike'; // 允许
obj = {}; // TypeError
```

## 3. 原型与继承

### Q: 实现继承的几种方式
```javascript
// 1. 原型链继承
function Parent() {
    this.name = 'parent';
}
function Child() {}
Child.prototype = new Parent();

// 2. 构造函数继承
function Child() {
    Parent.call(this);
}

// 3. 组合继承
function Child() {
    Parent.call(this);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

// 4. 寄生组合继承
function Child() {
    Parent.call(this);
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 5. ES6 class 继承
class Parent {
    constructor() {
        this.name = 'parent';
    }
}
class Child extends Parent {
    constructor() {
        super();
    }
}
```

## 4. 异步编程

### Q: Promise、async/await 的理解和使用
```javascript
// Promise 基本使用
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
});

promise
    .then(result => console.log(result))
    .catch(error => console.error(error));

// async/await
async function fetchData() {
    try {
        const result = await promise;
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
```

### Q: 实现一个 Promise.all
```javascript
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            reject(new TypeError('promises must be an array'));
        }
        
        const results = [];
        let completed = 0;
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(result => {
                    results[index] = result;
                    completed++;
                    
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
}
```

## 5. 事件循环（Event Loop）

### Q: 解释 JavaScript 的事件循环机制
```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

Promise.resolve().then(() => {
    console.log('3');
});

console.log('4');

// 输出顺序：1, 4, 3, 2
// 解释：
// 1. 同步代码先执行
// 2. 微任务（Promise）在当前循环结束时执行
// 3. 宏任务（setTimeout）在下一个循环执行
```

## 6. 性能优化

### Q: 防抖和节流的实现
```javascript
// 防抖：多次触发，只执行最后一次
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 节流：规定时间内只执行一次
function throttle(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
}
```

## 7. ES6+ 新特性

### Q: 说明 Map 和 WeakMap 的区别
```javascript
// Map：
// 1. 可以使用任何类型作为键
// 2. 可以获取大小
// 3. 可以遍历
const map = new Map();
map.set('key', 'value');
map.set({}, 'object');

// WeakMap：
// 1. 只能使用对象作为键
// 2. 键是弱引用，可被垃圾回收
// 3. 不可遍历
const weakMap = new WeakMap();
weakMap.set({}, 'value');
```

## 8. 设计模式

### Q: 实现单例模式
```javascript
class Singleton {
    static instance = null;
    
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }
    
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}
```

## 9. 实际应用题

### Q: 实现数组扁平化（多种方法）
```javascript
const arr = [1, [2, [3, 4]]];

// 方法1：递归
function flatten(arr) {
    return arr.reduce((flat, item) => {
        return flat.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}

// 方法2：ES6 flat
arr.flat(Infinity);

// 方法3：toString + split
arr.toString().split(',').map(Number);

// 方法4：JSON.stringify + 正则
JSON.stringify(arr).replace(/\[|\]/g, '').split(',').map(Number);
```

### Q: 实现深拷贝
```javascript
function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);
    
    let clone = Array.isArray(obj) ? [] : {};
    hash.set(obj, clone);
    
    Reflect.ownKeys(obj).forEach(key => {
        clone[key] = deepClone(obj[key], hash);
    });
    
    return clone;
}
```

## 10. 浏览器相关

### Q: 跨域解决方案
```javascript
// 1. CORS
// 服务器设置响应头
Access-Control-Allow-Origin: *

// 2. JSONP
function jsonp(url, callback) {
    const script = document.createElement('script');
    script.src = `${url}?callback=${callback}`;
    document.body.appendChild(script);
}

// 3. 代理服务器
// nginx 配置
location /api {
    proxy_pass http://target-server;
}
```
