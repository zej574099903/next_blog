# 节流（Throttle）详解

## 一、节流原理
节流（Throttle）是一种优化技术，用于限制函数在一定时间内只能执行一次。与防抖不同，节流会保证函数在一定时间间隔内至少执行一次。

## 二、基础实现

### 1. 时间戳版本
```javascript
/**
 * 节流函数（时间戳版本）
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回节流处理后的函数
 */
function throttle(fn, delay) {
  // 上次执行时间
  let lastTime = 0;
  
  // 返回节流处理后的函数
  return function (...args) {
    // 当前时间
    const now = Date.now();
    
    // 如果距离上次执行超过了延迟时间，则执行
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

### 2. 定时器版本
```javascript
/**
 * 节流函数（定时器版本）
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回节流处理后的函数
 */
function throttle(fn, delay) {
  // 定时器
  let timer = null;
  
  // 返回节流处理后的函数
  return function (...args) {
    // 如果定时器不存在，则设置定时器
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
```

## 三、React自定义Hook实现

### 1. useThrottle Hook
```typescript
import { useCallback, useRef } from 'react';

/**
 * 节流Hook
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回节流处理后的函数
 */
function useThrottle(fn: Function, delay: number) {
  // 使用useRef存储上次执行时间
  const lastTimeRef = useRef<number>(0);
  
  // 使用useCallback缓存函数，避免不必要的重渲染
  return useCallback((...args: any[]) => {
    const now = Date.now();
    
    if (now - lastTimeRef.current >= delay) {
      fn(...args);
      lastTimeRef.current = now;
    }
  }, [fn, delay]);
}

// 使用示例
function ScrollComponent() {
  const handleScroll = (e: React.UIEvent) => {
    console.log('滚动位置：', e.currentTarget.scrollTop);
  };
  
  // 创建节流版本的滚动处理函数
  const throttledScroll = useThrottle(handleScroll, 200);
  
  return (
    <div
      style={{ height: '300px', overflow: 'auto' }}
      onScroll={throttledScroll}
    >
      {/* 滚动内容 */}
    </div>
  );
}
```

## 四、常见应用场景

### 1. 滚动事件处理
```typescript
function ScrollList() {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // 滚动处理函数
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
    
    // 检查是否滚动到底部
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      console.log('滚动到底部，加载更多数据');
    }
  };
  
  // 创建节流版本的滚动处理函数
  const throttledScroll = useThrottle(handleScroll, 200);
  
  return (
    <div
      style={{ height: '400px', overflow: 'auto' }}
      onScroll={throttledScroll}
    >
      <div>当前滚动位置：{scrollPosition}px</div>
      {/* 列表内容 */}
    </div>
  );
}
```

### 2. 页面resize处理
```typescript
function ResizeHandler() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // resize处理函数
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  
  // 创建节流版本的resize处理函数
  const throttledResize = useThrottle(handleResize, 200);
  
  useEffect(() => {
    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
    };
  }, [throttledResize]);
  
  return (
    <div>
      <p>窗口宽度: {dimensions.width}px</p>
      <p>窗口高度: {dimensions.height}px</p>
    </div>
  );
}
```

### 3. 按钮点击处理
```typescript
function SubmitButton() {
  const [count, setCount] = useState(0);
  
  // 提交处理函数
  const handleSubmit = async () => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({ count })
      });
      setCount(prev => prev + 1);
    } catch (error) {
      console.error('提交失败：', error);
    }
  };
  
  // 创建节流版本的提交函数
  const throttledSubmit = useThrottle(handleSubmit, 1000);
  
  return (
    <button onClick={throttledSubmit}>
      提交 (点击次数: {count})
    </button>
  );
}
```

## 五、节流与防抖的区别

1. **执行时机**
   - 防抖：在一段时间内多次触发，只执行最后一次
   - 节流：在一段时间内多次触发，按时间间隔执行

2. **应用场景**
   - 防抖：输入框搜索、表单验证等需要等待用户输入完成的场景
   - 节流：滚动事件处理、页面缩放、按钮快速点击等需要限制执行频率的场景

3. **执行频率**
   - 防抖：不保证一定会执行，可能会被下一次操作打断
   - 节流：保证一定时间内至少执行一次

## 六、注意事项

1. **选择合适的延迟时间**
   - 滚动事件：100-200ms
   - 窗口调整：200-300ms
   - 按钮点击：500-1000ms

2. **选择合适的实现方式**
   - 时间戳版：第一次会立即执行
   - 定时器版：第一次会延迟执行

3. **及时清理事件监听**
   - 在组件卸载时移除事件监听器
   - 使用useEffect的清理函数

4. **避免闭包陷阱**
   - 使用useRef存储状态
   - 使用useCallback缓存函数
