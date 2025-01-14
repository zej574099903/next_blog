# 防抖（Debounce）详解

## 一、防抖原理
防抖（Debounce）是一种优化技术，用于限制函数的执行频率。当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次。如果设定的时间到来之前，又一次触发了事件，就重新开始延时。

## 二、基础实现

### 1. 简单版防抖函数
```javascript
/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回防抖处理后的函数
 */
function debounce(fn, delay) {
  // 定义定时器变量
  let timer = null;
  
  // 返回防抖处理后的函数
  return function (...args) {
    // 如果已经设定过定时器，则清除上一次的定时器
    if (timer) clearTimeout(timer);
    
    // 设定新的定时器，delay毫秒后执行fn
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用示例
const handleSearch = (e) => {
  console.log('搜索内容：', e.target.value);
};

// 创建防抖版本的搜索函数，延迟500ms执行
const debouncedSearch = debounce(handleSearch, 500);

// 绑定到输入框
searchInput.addEventListener('input', debouncedSearch);
```

## 三、React自定义Hook实现

### 1. useDebounce Hook
```typescript
import { useCallback, useRef } from 'react';

/**
 * 防抖Hook
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 返回防抖处理后的函数
 */
function useDebounce(fn: Function, delay: number) {
  // 使用useRef存储定时器ID
  const timerRef = useRef<NodeJS.Timeout>();
  
  // 使用useCallback缓存函数，避免不必要的重渲染
  return useCallback((...args: any[]) => {
    // 清除之前的定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // 设置新的定时器
    timerRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
}

// 使用示例
function SearchComponent() {
  const handleSearch = (value: string) => {
    console.log('搜索内容：', value);
  };
  
  // 创建防抖版本的搜索函数
  const debouncedSearch = useDebounce(handleSearch, 500);
  
  return (
    <input
      type="text"
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="请输入搜索内容"
    />
  );
}
```

## 四、常见应用场景

### 1. 搜索框输入防抖
```typescript
function SearchBox() {
  const [searchResults, setSearchResults] = useState([]);
  
  // 搜索函数
  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('搜索出错：', error);
    }
  };
  
  // 创建防抖版本的搜索函数
  const debouncedSearch = useDebounce(handleSearch, 500);
  
  return (
    <div>
      <input
        type="text"
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder="请输入搜索内容"
      />
      <ul>
        {searchResults.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. 表单输入验证
```typescript
function RegistrationForm() {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 邮箱验证函数
  const validateEmail = async (email: string) => {
    try {
      const response = await fetch(`/api/validate-email?email=${email}`);
      const { isValid, message } = await response.json();
      setIsEmailValid(isValid);
      setErrorMessage(message);
    } catch (error) {
      console.error('验证出错：', error);
    }
  };
  
  // 创建防抖版本的验证函数
  const debouncedValidate = useDebounce(validateEmail, 500);
  
  return (
    <div>
      <input
        type="email"
        onChange={(e) => debouncedValidate(e.target.value)}
        placeholder="请输入邮箱"
      />
      {!isEmailValid && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
```

### 3. 窗口大小调整
```typescript
function ResponsiveLayout() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // 更新窗口大小的函数
  const updateSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  
  // 创建防抖版本的更新函数
  const debouncedUpdateSize = useDebounce(updateSize, 200);
  
  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', debouncedUpdateSize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', debouncedUpdateSize);
    };
  }, [debouncedUpdateSize]);
  
  return (
    <div>
      <p>窗口宽度: {windowSize.width}px</p>
      <p>窗口高度: {windowSize.height}px</p>
    </div>
  );
}
```

## 五、注意事项

1. **选择合适的延迟时间**
   - 搜索框：300-500ms
   - 表单验证：500ms
   - 窗口调整：200ms

2. **及时清理定时器**
   - 在组件卸载时清理定时器
   - 在设置新定时器前清理旧定时器

3. **避免闭包陷阱**
   - 使用useRef存储最新的函数引用
   - 使用useCallback缓存防抖函数

4. **合理使用依赖数组**
   - 在useCallback中正确设置依赖项
   - 在useEffect中添加必要的依赖
