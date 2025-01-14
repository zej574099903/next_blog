# JavaScript 常用设计模式

设计模式是软件开发中常见问题的典型解决方案。以下是前端开发中最常用的设计模式。

## 1. 单例模式（Singleton Pattern）
确保一个类只有一个实例，并提供一个访问它的全局访问点。

```javascript
// ES6 实现
class Singleton {
    static instance = null;
    
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        this.data = 'Singleton';
        Singleton.instance = this;
    }
    
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}

// 使用示例
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true

// 实际应用场景：Modal弹窗
class Modal {
    static instance = null;
    
    constructor() {
        if (Modal.instance) {
            return Modal.instance;
        }
        this.createElement();
        Modal.instance = this;
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'modal';
        document.body.appendChild(this.element);
    }
    
    show() {
        this.element.style.display = 'block';
    }
    
    hide() {
        this.element.style.display = 'none';
    }
}
```

## 2. 工厂模式（Factory Pattern）
定义一个创建对象的接口，让子类决定实例化哪个类。

```javascript
// 简单工厂
class UserFactory {
    static createUser(type) {
        switch(type) {
            case 'admin':
                return new AdminUser();
            case 'regular':
                return new RegularUser();
            default:
                throw new Error('Unknown user type');
        }
    }
}

// 实际应用场景：表单验证器
class ValidatorFactory {
    static createValidator(type) {
        switch(type) {
            case 'email':
                return {
                    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                };
            case 'phone':
                return {
                    validate: (value) => /^\d{11}$/.test(value)
                };
            default:
                return {
                    validate: () => true
                };
        }
    }
}
```

## 3. 观察者模式（Observer Pattern）
定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动更新。

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event]
                .filter(cb => cb !== callback);
        }
    }
}

// 使用示例
const emitter = new EventEmitter();
const handler = data => console.log(data);

emitter.on('data', handler);
emitter.emit('data', 'Hello World'); // 输出：Hello World
emitter.off('data', handler);
```

## 4. 策略模式（Strategy Pattern）
定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

```javascript
// 策略对象
const strategies = {
    A: score => score * 4,
    B: score => score * 3,
    C: score => score * 2,
    D: score => score * 1
};

// 策略类
class Bonus {
    constructor() {
        this.strategy = null;
    }
    
    setStrategy(level) {
        this.strategy = strategies[level];
    }
    
    calculateBonus(score) {
        return this.strategy(score);
    }
}

// 使用示例
const bonus = new Bonus();
bonus.setStrategy('A');
console.log(bonus.calculateBonus(100)); // 400
```

## 5. 代理模式（Proxy Pattern）
为其他对象提供一种代理以控制对这个对象的访问。

```javascript
// ES6 Proxy 实现
const target = {
    name: 'target'
};

const handler = {
    get: function(target, property) {
        console.log(`访问了 ${property} 属性`);
        return target[property];
    },
    
    set: function(target, property, value) {
        console.log(`设置了 ${property} 属性为 ${value}`);
        target[property] = value;
        return true;
    }
};

const proxy = new Proxy(target, handler);

// 使用示例
proxy.name; // 输出：访问了 name 属性
proxy.name = 'new target'; // 输出：设置了 name 属性为 new target

// 实际应用：图片懒加载
class ImageLoader {
    constructor(targetImage) {
        this.targetImage = targetImage;
    }
    
    loadImage(imageUrl) {
        this.targetImage.src = imageUrl;
    }
}

class ProxyImageLoader {
    constructor(targetImage) {
        this.imageLoader = new ImageLoader(targetImage);
    }
    
    loadImage(imageUrl) {
        // 显示loading
        this.imageLoader.targetImage.src = 'loading.gif';
        
        // 创建图片对象
        const img = new Image();
        img.onload = () => {
            this.imageLoader.loadImage(imageUrl);
        };
        img.src = imageUrl;
    }
}
```

## 6. 装饰器模式（Decorator Pattern）
动态地给一个对象添加一些额外的职责。

```javascript
// ES7 装饰器语法
function readonly(target, key, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

class Example {
    @readonly
    pi() { return 3.14; }
}

// 传统实现
function decorateArmor(target) {
    target.defense += 100;
    return target;
}

function decorateAtk(target) {
    target.attack += 50;
    return target;
}

let hero = {
    defense: 100,
    attack: 100
};

hero = decorateArmor(hero);
hero = decorateAtk(hero);
```

## 7. 适配器模式（Adapter Pattern）
将一个类的接口转换成客户希望的另外一个接口。

```javascript
// 旧接口
class OldInterface {
    oldMethod() {
        return 'old method';
    }
}

// 新接口
class NewInterface {
    newMethod() {
        return 'new method';
    }
}

// 适配器
class Adapter {
    constructor(oldInterface) {
        this.oldInterface = oldInterface;
    }
    
    newMethod() {
        // 调用旧接口，返回新接口格式的数据
        const result = this.oldInterface.oldMethod();
        return `adapted: ${result}`;
    }
}

// 使用示例
const oldInterface = new OldInterface();
const adapter = new Adapter(oldInterface);
console.log(adapter.newMethod()); // adapted: old method
```

## 8. 发布-订阅模式（Pub-Sub Pattern）
比观察者模式更松散的耦合，发布者和订阅者之间有一个事件通道。

```javascript
class PubSub {
    constructor() {
        this.subscribers = {};
    }
    
    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
        
        // 返回取消订阅的函数
        return () => {
            this.subscribers[event] = 
                this.subscribers[event].filter(cb => cb !== callback);
        };
    }
    
    publish(event, data) {
        if (!this.subscribers[event]) return;
        
        this.subscribers[event].forEach(callback => {
            callback(data);
        });
    }
}

// 使用示例
const pubsub = new PubSub();
const unsubscribe = pubsub.subscribe('event', data => {
    console.log(data);
});

pubsub.publish('event', 'Hello World'); // 输出：Hello World
unsubscribe(); // 取消订阅
```

## 实际应用场景总结

1. **单例模式**：
   - 全局状态管理（如 Redux store）
   - 全局弹窗管理
   - 全局缓存

2. **工厂模式**：
   - 表单验证器创建
   - DOM 元素创建
   - API 接口封装

3. **观察者模式**：
   - 事件处理
   - 状态管理
   - 数据绑定

4. **策略模式**：
   - 表单验证
   - 价格计算
   - 动画效果切换

5. **代理模式**：
   - 图片懒加载
   - 缓存代理
   - 虚拟代理

6. **装饰器模式**：
   - 日志记录
   - 性能统计
   - 权限验证

7. **适配器模式**：
   - API 兼容
   - 数据格式转换
   - 第三方库整合

8. **发布-订阅模式**：
   - 组件通信
   - 事件总线
   - 消息推送

## 设计模式的选择原则

1. **单一职责原则**：一个类只负责一个功能领域中的相应职责
2. **开闭原则**：对扩展开放，对修改关闭
3. **里氏代换原则**：子类对象必须能够替换掉所有父类对象
4. **依赖倒转原则**：依赖于抽象而不是具体实现
5. **接口隔离原则**：使用多个专门的接口，而不使用单一的总接口
6. **合成复用原则**：尽量使用对象组合，而不是继承来达到复用的目的
