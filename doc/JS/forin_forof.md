# for...in 和 for...of 的区别

## 基本概念

### for...in
- 用于遍历对象的可枚举属性（包括原型链上的属性）
- 遍历的是属性名（键名）
- 适用于对象（Object）的遍历
- 不建议用于数组遍历（可能会遍历到原型链上的属性）

### for...of
- 用于遍历可迭代对象（iterable）的值
- 遍历的是属性值
- 适用于数组（Array）、字符串（String）、Set、Map 等可迭代对象
- 不能直接用于普通对象（会报错）

## 代码示例

### 1. 数组的遍历比较
```javascript
const array = ['a', 'b', 'c'];

// for...in 遍历数组
console.log('=== for...in with array ===');
for (let index in array) {
    console.log(index); // 输出：'0', '1', '2'（索引）
}

// for...of 遍历数组
console.log('=== for...of with array ===');
for (let value of array) {
    console.log(value); // 输出：'a', 'b', 'c'（值）
}
```

### 2. 对象的遍历比较
```javascript
const object = {
    name: '张三',
    age: 25,
    city: '北京'
};

// for...in 遍历对象
console.log('=== for...in with object ===');
for (let key in object) {
    console.log(key, object[key]); // 输出键值对
}

// for...of 遍历对象（会报错）
console.log('=== for...of with object ===');
try {
    for (let value of object) {
        console.log(value);
    }
} catch (error) {
    console.log('Error: 对象不是可迭代的');
}
```

### 3. 字符串遍历
```javascript
const str = 'Hello';

// for...in 遍历字符串
for (let index in str) {
    console.log(index); // 输出索引：0,1,2,3,4
}

// for...of 遍历字符串
for (let char of str) {
    console.log(char); // 输出字符：H,e,l,l,o
}
```

## 主要区别总结

1. **遍历对象**：
   - `for...in` 可以遍历对象的可枚举属性
   - `for...of` 不能直接遍历普通对象（除非实现了 Iterator 接口）

2. **遍历内容**：
   - `for...in` 遍历键名（属性名）
   - `for...of` 遍历键值（属性值）

3. **适用范围**：
   - `for...in` 主要用于普通对象
   - `for...of` 用于可迭代对象（Array、String、Set、Map等）

4. **原型链**：
   - `for...in` 会遍历原型链上的属性
   - `for...of` 只遍历当前对象的属性值

## 面试相关问题

### Q1: 如何使普通对象可以使用 for...of？
```javascript
const obj = {
    name: '张三',
    age: 25,
    [Symbol.iterator]: function* () {
        yield* Object.values(this);
    }
};

for (let value of obj) {
    console.log(value); // 输出：'张三', 25
}
```

### Q2: for...in 遍历数组的潜在问题？
```javascript
Array.prototype.customMethod = function() {};
const arr = ['a', 'b', 'c'];

for (let key in arr) {
    console.log(key); // 输出：'0', '1', '2', 'customMethod'
}

// 解决方法：使用 hasOwnProperty
for (let key in arr) {
    if (arr.hasOwnProperty(key)) {
        console.log(key); // 只输出：'0', '1', '2'
    }
}
```

### Q3: 性能考虑
- `for...of` 通常比 `for...in` 快，因为它不需要遍历原型链
- 如果需要最佳性能，建议使用传统的 for 循环
- `for...in` 的枚举顺序不是固定的，不同浏览器可能会有不同的实现

## 最佳实践建议

1. 遍历数组时：
   - 优先使用 `for...of`
   - 需要索引时使用 `forEach` 或传统 for 循环

2. 遍历对象时：
   - 使用 `for...in` 配合 `hasOwnProperty`
   - 或使用 `Object.keys()`、`Object.values()`、`Object.entries()`

3. 遍历字符串时：
   - 使用 `for...of` 可以正确处理 Unicode 字符