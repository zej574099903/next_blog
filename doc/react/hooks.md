# React Hooks 详解

## 1. useState

### 基本用法
```javascript
import React, { useState } from 'react';

function Counter() {
  // 声明一个叫 count 的 state 变量，初始值为 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

### 进阶用法 - 函数式更新
```javascript
function Counter() {
  const [count, setCount] = useState(0);

  // 推荐：使用函数式更新
  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };

  // 不推荐：直接更新可能导致批处理问题
  const handleClickBad = () => {
    setCount(count + 1);
    setCount(count + 1); // 这样写不会得到期望的结果
  };

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={handleClick}>增加 2</button>
    </div>
  );
}
```

### 实现思路
- useState 返回一个数组，包含当前状态和更新函数
- 状态更新会触发组件重新渲染
- React 会保存状态的最新值
- 更新函数可以接收值或函数作为参数

## 2. useEffect

### 基本用法
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [data, setData] = useState(null);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData();
  }, []); // 空依赖数组表示只在挂载时执行

  // 带清理的 effect
  useEffect(() => {
    const subscription = someAPI.subscribe();
    
    // 清理函数
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <div>{/* 渲染数据 */}</div>;
}
```

### 依赖项使用
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 当 userId 改变时重新获取数据
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]); // userId 作为依赖项

  return <div>{user ? user.name : 'Loading...'}</div>;
}
```

### 实现思路
- 每次渲染后执行
- 可以通过依赖数组控制执行时机
- 返回清理函数用于清理副作用
- 按照声明顺序执行

## 3. useContext

### 基本用法
```javascript
import React, { createContext, useContext } from 'react';

// 创建 Context
const ThemeContext = createContext('light');

// 提供者组件
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 消费者组件
function Toolbar() {
  const theme = useContext(ThemeContext);
  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      <Button />
    </div>
  );
}
```

### 实现思路
- 避免 Props 层层传递
- 适用于全局状态管理
- 配合 Provider 使用
- context 更新会触发使用该 context 的组件重新渲染

## 4. useReducer

### 基本用法
```javascript
import React, { useReducer } from 'react';

// 定义 reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

### 实现思路
- 适用于复杂的状态逻辑
- 类似 Redux 的状态管理模式
- 可以把状态逻辑提取到组件外
- 便于测试和复用

## 5. useMemo 和 useCallback  (相当于vue中的computed)

### useMemo 示例
```javascript
import React, { useMemo } from 'react';

function ExpensiveComponent({ data, filter }) {
  // 只在 data 或 filter 改变时重新计算
  const filteredData = useMemo(() => {
    return data.filter(item => item.includes(filter));
  }, [data, filter]);

  return (
    <ul>
      {filteredData.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### useCallback 示例
```javascript
function ParentComponent() {
  const [count, setCount] = useState(0);

  // 缓存回调函数
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // 空依赖数组，函数永远不会改变

  return <ChildComponent onClick={handleClick} />;
}
```

### 实现思路
- useMemo 缓存计算结果
- useCallback 缓存函数
- 用于性能优化
- 避免不必要的重新渲染

## 6. 自定义 Hook

### 示例：useWindowSize
```javascript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 使用自定义 Hook
function App() {
  const size = useWindowSize();
  return (
    <div>
      Window size: {size.width} x {size.height}
    </div>
  );
}
```

### 示例：useAPI
```javascript
function useAPI(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 使用示例
function UserList() {
  const { data, loading, error } = useAPI('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 实现思路
- 复用状态逻辑
- 遵循 Hooks 规则
- 命名以 "use" 开头
- 可以使用其他 Hooks

## 7. Hooks 使用规则

1. 只在最顶层使用 Hooks
```javascript
// 正确
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Count: ${count}`;
  });
}

// 错误 - 条件语句中使用 Hook
function Example(props) {
  if (props.condition) {
    const [count, setCount] = useState(0); // 不允许
  }
}
```

2. 只在 React 函数组件中调用 Hooks
```javascript
// 正确
function Example() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// 错误 - 普通函数中使用 Hook
function normalFunction() {
  const [count, setCount] = useState(0); // 不允许
}
```

## 8. 性能优化建议

1. 合理使用依赖数组
```javascript
// 优化前
useEffect(() => {
  doSomething(a, b);
}, [a, b]); // 每次 a 或 b 变化都会执行

// 优化后
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

useEffect(() => {
  memoizedCallback();
}, [memoizedCallback]); // 只在回调函数变化时执行
```

2. 避免重复创建对象
```javascript
// 不推荐
function Component() {
  const style = { color: 'red' }; // 每次渲染都创建新对象
  return <div style={style}>Hello</div>;
}

// 推荐
function Component() {
  const style = useMemo(() => ({ color: 'red' }), []); // 只创建一次
  return <div style={style}>Hello</div>;
}
```

3. 使用 React.memo 配合 useCallback
```javascript
const ChildComponent = React.memo(function ChildComponent({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
});

function ParentComponent() {
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []); // 空依赖数组，函数永远不变

  return <ChildComponent onClick={handleClick} />;
}

```

## React Hooks 常见面试题

## 1. React Hooks 是什么？为什么要使用 Hooks？
**答案：**
React Hooks 是 React 16.8 引入的新特性，它可以让你在函数组件中使用 state 和其他 React 特性。

使用 Hooks 的主要原因：
1. 更好的逻辑复用：可以把组件逻辑提取到自定义 Hook，实现逻辑复用
2. 减少复杂度：避免了 class 组件中的 this 指向问题
3. 更好的代码组织：相关的逻辑可以放在一起
4. 避免了生命周期函数的困扰：用更直观的方式处理副作用

## 2. useEffect 和 useLayoutEffect 有什么区别？
**答案：**
主要区别在于执行时机：
- `useEffect` 是异步执行的，在浏览器完成渲染之后执行
- `useLayoutEffect` 是同步执行的，在浏览器执行绘制之前执行

使用建议：
- 优先使用 `useEffect`，因为它不会阻塞浏览器渲染
- 只有在 `useEffect` 引起页面闪烁时，才考虑使用 `useLayoutEffect`

## 3. 为什么不能在循环、条件或嵌套函数中调用 Hook？
**答案：**
React Hooks 依赖于调用顺序，必须保证每次渲染时 Hooks 的调用顺序是稳定的。如果在条件或循环中使用 Hooks：
1. React 无法确保 Hook 的调用顺序
2. 可能导致状态的混乱
3. 会破坏 Hooks 的内部状态机制

正确做法是将条件判断放在 Hook 内部：
```javascript
useEffect(() => {
  if (condition) {
    // 执行操作
  }
}, [condition]);
```

## 4. 如何正确地在 useEffect 中获取最新的 state 值？
**答案：**
有几种方法：

1. 使用 ref：
```javascript
function Example() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  useEffect(() => {
    countRef.current = count;
  }, [count]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('当前count:', countRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
}
```

2. 使用依赖数组：
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('当前count:', count);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // 将count加入依赖数组
```

## 5. 如何自定义 Hook？
**答案：**
自定义 Hook 是一个以 "use" 开头的函数，它可以调用其他的 Hook。例如：

```javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

## 6. useState 的setState是同步还是异步的？
**答案：**
在 React 18 中：
1. 在 React 事件处理函数中是异步的（批处理）
2. 在 setTimeout、原生事件处理函数中也是异步的（自动批处理）
3. 如果需要同步更新，可以使用 `flushSync`

```javascript
import { flushSync } from 'react-dom';

function Example() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    flushSync(() => {
      setCount(c => c + 1); // 同步更新
    });
    // 这里可以立即获取到更新后的 DOM
  };
}
```

## 7. useMemo 和 useCallback 的区别是什么？
**答案：**
- `useMemo` 用于缓存计算结果，避免重复进行昂贵的计算
- `useCallback` 用于缓存函数，主要用于避免函数重新创建导致子组件不必要的重渲染

使用场景：
1. `useMemo`：
   - 需要进行复杂计算
   - 需要缓存引用类型数据作为其他 hook 的依赖
   
2. `useCallback`：
   - 需要将函数作为 props 传递给子组件
   - 需要将函数作为其他 hook 的依赖

```javascript
// useMemo 示例
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useCallback 示例
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

## 8. 如何处理 useEffect 的依赖项过多问题？
**答案：**
有几种解决方案：

1. 拆分 useEffect：
```javascript
// 不好的写法
useEffect(() => {
  // 处理 a 相关逻辑
  // 处理 b 相关逻辑
}, [a, b, c, d, e]);

// 好的写法
useEffect(() => {
  // 处理 a 相关逻辑
}, [a]);

useEffect(() => {
  // 处理 b 相关逻辑
}, [b]);
```

2. 使用 useReducer：
```javascript
const [state, dispatch] = useReducer(reducer, initialState);

useEffect(() => {
  // 只依赖 dispatch，不需要其他依赖
  dispatch({ type: 'update' });
}, [dispatch]);
```

3. 使用 ref 存储不需要触发更新的数据：
```javascript
const configRef = useRef(config);
useEffect(() => {
  // 使用 configRef.current
}, []); // 不需要将 config 加入依赖数组
```

## 9. React Hook 性能优化有哪些方案？
**答案：**
1. 使用 `useMemo` 缓存计算结果：
```javascript
const memoizedValue = useMemo(() => computeExpensive(prop), [prop]);
```

2. 使用 `useCallback` 缓存函数：
```javascript
const memoizedFn = useCallback(() => {
  console.log(a, b);
}, [a, b]);
```

3. 使用 `useRef` 保存不需要触发重渲染的数据：
```javascript
const countRef = useRef(0);
// 修改 countRef.current 不会触发重渲染
```

4. 合理拆分组件，避免大组件：
```javascript
// 拆分前
function BigComponent() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  // 大量逻辑...
}

// 拆分后
function SmallComponentA() {
  const [a, setA] = useState(0);
}

function SmallComponentB() {
  const [b, setB] = useState(0);
}
```

## 10. 如何在 Hook 中实现类似 componentDidMount 的生命周期？
**答案：**
有几种方式：

1. 使用空依赖数组的 useEffect：
```javascript
useEffect(() => {
  // 这里的代码只会在组件挂载时执行一次
  console.log('组件挂载');
  
  return () => {
    // 这里的代码只会在组件卸载时执行一次
    console.log('组件卸载');
  };
}, []); // 空依赖数组
```

2. 使用 ref 标记是否是首次渲染：
```javascript
function Example() {
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    if (isFirstRender.current) {
      // 仅在首次渲染时执行
      isFirstRender.current = false;
    }
  });
}
