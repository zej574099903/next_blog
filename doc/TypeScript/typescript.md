# TypeScript 核心知识与面试题总结

## 一、TypeScript 常用类型和语法

### 1. 基础类型
```typescript
// 基本类型
let isDone: boolean = false;
let count: number = 10;
let name: string = "TypeScript";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
let u: undefined = undefined;
let n: null = null;

// 枚举
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;

// any 和 unknown
let notSure: any = 4;
let uncertain: unknown = "hello";

// void 和 never
function warnUser(): void {
  console.log("Warning!");
}

function error(): never {
  throw new Error("error");
}
```

### 2. 接口（Interface）
```typescript
interface User {
  name: string;
  age?: number;  // 可选属性
  readonly id: number;  // 只读属性
}

interface SearchFunc {
  (source: string, subString: string): boolean;  // 函数类型接口
}

// 类接口
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}
```

### 3. 类型别名（Type Aliases）
```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;  // 联合类型
type UserCallback = (user: User) => void;  // 函数类型
```

### 4. 泛型（Generics）
```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

### 5. 高级类型

```typescript
// 交叉类型
type Admin = User & { privileges: string[] };

// 联合类型
type StringOrNumber = string | number;

// 类型守卫
function isString(value: any): value is string {
  return typeof value === "string";
}

// 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
```

## 二、TypeScript 常见面试题

### 1. TypeScript 相比 JavaScript 有什么优势？
答：
- 静态类型检查，可以在编译时发现错误
- 更好的 IDE 支持，提供智能提示和重构功能
- 更好的可维护性和可读性
- 支持最新的 ECMAScript 特性
- 强大的类型系统，支持泛型、接口等

### 2. any 和 unknown 的区别是什么？
答：
- any：完全放弃类型检查，可以进行任何操作
- unknown：最顶层类型，比 any 更安全
  - 不能直接进行任何操作
  - 需要先进行类型检查或类型断言
  - 赋值给其他类型时需要进行类型检查

### 3. interface 和 type 的区别？
答：
1. 语法差异：
   - interface 使用 interface 关键字
   - type 使用 type 关键字和等号
   
2. 扩展方式：
   - interface 可以重复声明，自动合并
   - type 不可重复声明，但可以使用 & 运算符交叉
   
3. 应用场景：
   - interface 更适合描述对象结构
   - type 更适合定义联合类型、交叉类型等复杂类型

### 4. 泛型是什么？什么时候使用泛型？
答：
- 泛型是一种参数化类型，可以用来创建可重用的组件
- 使用场景：
  1. 当函数、接口或类需要支持多种数据类型时
  2. 需要保持类型的一致性时
  3. 需要在编译时保证类型安全时

```typescript
// 示例
function map<T, U>(array: T[], callback: (item: T) => U): U[] {
  return array.map(callback);
}
```

### 5. TypeScript 中的装饰器是什么？
答：
- 装饰器是一种特殊类型的声明，可以附加到类、方法、属性或参数上
- 使用 @ 符号表示
- 常见类型：
  1. 类装饰器
  2. 方法装饰器
  3. 属性装饰器
  4. 参数装饰器

```typescript
// 示例
function log(target: any, propertyKey: string) {
  console.log(`Calling ${propertyKey}`);
}

class Example {
  @log
  method() {}
}
```

### 6. 什么是类型守卫？
答：
- 类型守卫是一种运行时检查，用于确保类型安全
- 常见的类型守卫：
  1. typeof
  2. instanceof
  3. in
  4. 自定义类型谓词 is

```typescript
// 示例
function isString(value: any): value is string {
  return typeof value === "string";
}

function process(value: string | number) {
  if (isString(value)) {
    // 这里 value 被收窄为 string 类型
    return value.toUpperCase();
  }
  // 这里 value 被收窄为 number 类型
  return value.toFixed(2);
}
```

### 7. keyof 和 typeof 操作符的作用是什么？
答：
- keyof：获取类型的所有属性名
- typeof：获取值的类型

```typescript
interface Person {
  name: string;
  age: number;
}

// keyof 示例
type PersonKeys = keyof Person; // "name" | "age"

// typeof 示例
const person = { name: "Tom", age: 25 };
type PersonType = typeof person; // { name: string; age: number; }
```

### 8. 如何处理 TypeScript 中的 this？
答：
1. 使用箭头函数保持 this 上下文
2. 使用 this 参数声明
3. 在 tsconfig.json 中设置 noImplicitThis

```typescript
class Handler {
  info: string;
  
  // 方法一：箭头函数
  onHandle = () => {
    this.info = "handled";
  }
  
  // 方法二：this 参数
  process(this: Handler) {
    this.info = "processed";
  }
}
```

### 9. TypeScript 中的模块解析策略有哪些？
答：
1. Classic：传统的 Node.js 解析策略
2. Node：Node.js 风格的解析策略
3. 可以在 tsconfig.json 中配置：
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node"
     }
   }
   ```

### 10. 如何在 TypeScript 中实现混入（Mixins）？
答：
```typescript
// 混入示例
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}

class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

class SmartObject implements Disposable, Activatable {
  isDisposed: boolean = false;
  isActive: boolean = false;
  dispose!: () => void;
  activate!: () => void;
  deactivate!: () => void;
}

// 实现混入
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(SmartObject, [Disposable, Activatable]);
```

## 三、实用工具类型

### 1. 内置工具类型
```typescript
// Partial - 将所有属性变为可选
type PartialPoint = Partial<Point>;

// Required - 将所有属性变为必需
type RequiredPoint = Required<Point>;

// Readonly - 将所有属性变为只读
type ReadonlyPoint = Readonly<Point>;

// Pick - 从类型中选择部分属性
type NameOnly = Pick<User, "name">;

// Omit - 从类型中排除部分属性
type WithoutAge = Omit<User, "age">;

// Record - 创建键值对类型
type PageInfo = Record<string, string>;

// ReturnType - 获取函数返回值类型
type FuncReturn = ReturnType<typeof someFunction>;
```

### 2. 自定义工具类型
```typescript
// 深度 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 非空属性
type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// 可选属性
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```
