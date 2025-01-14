# React 高阶组件（HOC）详解

## 一、HOC 原理
高阶组件（Higher-Order Component, HOC）是 React 中用于复用组件逻辑的高级技术。HOC 本身不是 React API 的一部分，而是一种基于 React 组合特性的设计模式。

具体来说，HOC 是一个函数，它接收一个组件作为参数，返回一个新的增强组件：
```typescript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

## 二、实现方式

### 1. 属性代理（Props Proxy）
```typescript
/**
 * 属性代理方式实现 HOC
 * 通过传递 props 来操纵组件的输入
 * @param WrappedComponent 被包装的组件
 * @returns 增强后的组件
 */
function withProps<P extends object>(WrappedComponent: React.ComponentType<P>) {
  // 返回一个新的函数组件
  return function EnhancedComponent(props: P) {
    // 可以在这里添加新的 props
    const newProps = {
      ...props,
      extraProp: 'hello'
    };
    
    // 返回被包装组件，传入新的 props
    return <WrappedComponent {...newProps} />;
  };
}

// 使用示例
interface UserProps {
  name: string;
  age: number;
}

const UserComponent: React.FC<UserProps> = ({ name, age, extraProp }) => (
  <div>
    <p>Name: {name}</p>
    <p>Age: {age}</p>
    <p>Extra: {extraProp}</p>
  </div>
);

// 使用 HOC 增强组件
const EnhancedUser = withProps(UserComponent);
```

### 2. 反向继承（Inheritance Inversion）
```typescript
/**
 * 反向继承方式实现 HOC
 * 通过继承被包装组件来实现功能增强
 * @param WrappedComponent 被包装的组件
 * @returns 增强后的组件
 */
function withLogging<P extends object>(WrappedComponent: React.ComponentType<P>) {
  // 返回一个继承自 WrappedComponent 的类组件
  return class extends React.Component<P> {
    // 可以添加生命周期方法
    componentDidMount() {
      console.log('Component mounted');
    }
    
    componentWillUnmount() {
      console.log('Component will unmount');
    }
    
    render() {
      // 调用父类的 render 方法
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

### 3. 组合多个 HOC
```typescript
/**
 * 组合多个 HOC
 * 可以将多个 HOC 组合使用
 */
function compose(...funcs: Function[]) {
  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
}

// HOC: 添加日志功能
const withLogger = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function WithLogger(props: P) {
    useEffect(() => {
      console.log('Component mounted');
      return () => console.log('Component will unmount');
    }, []);
    
    return <WrappedComponent {...props} />;
  };
};

// HOC: 添加加载状态
const withLoading = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function WithLoading(props: P & { loading?: boolean }) {
    if (props.loading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
};

// 组合多个 HOC
const enhance = compose(withLogger, withLoading);
const EnhancedComponent = enhance(BaseComponent);
```

## 三、常见应用场景

### 1. 权限控制
```typescript
/**
 * 权限控制 HOC
 * 用于控制组件的访问权限
 */
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { isAuthenticated, user } = useAuth(); // 假设使用了某个认证 Hook
    
    // 如果未认证，显示登录页面或提示
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    // 如果已认证，渲染组件
    return <WrappedComponent {...props} user={user} />;
  };
}

// 使用示例
const ProtectedComponent = withAuth(UserProfile);
```

### 2. 数据加载
```typescript
/**
 * 数据加载 HOC
 * 处理组件的数据获取逻辑
 */
function withData<P extends object, T>(
  WrappedComponent: React.ComponentType<P & { data: T }>,
  fetchData: () => Promise<T>
) {
  return function WithData(props: Omit<P, 'data'>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await fetchData();
          setData(result);
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return null;
    
    return <WrappedComponent {...props} data={data} />;
  };
}

// 使用示例
const UserList = withData(
  ({ data }) => (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  ),
  () => fetch('/api/users').then(res => res.json())
);
```

### 3. 性能优化
```typescript
/**
 * 性能优化 HOC
 * 实现组件的性能优化
 */
function withMemo<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  // 使用 React.memo 优化组件渲染
  return React.memo(WrappedComponent, areEqual);
}

// 使用示例
const MemoizedComponent = withMemo(ExpensiveComponent, (prev, next) => {
  return prev.id === next.id; // 只有 id 改变时才重新渲染
});
```

## 四、常见面试题

### 1. HOC 和 Hooks 的区别？
答：
1. **实现方式**
   - HOC: 是一个函数，接收组件作为参数，返回新的组件
   - Hooks: 是函数，直接在函数组件内部使用

2. **代码复用**
   - HOC: 通过包装组件实现逻辑复用
   - Hooks: 通过自定义 Hook 实现逻辑复用

3. **使用场景**
   - HOC: 适合需要对组件进行包装，添加额外功能的场景
   - Hooks: 适合复用状态逻辑的场景

### 2. HOC 的优缺点？
答：
优点：
1. 逻辑复用
2. 不影响原组件
3. 可组合多个 HOC

缺点：
1. 可能产生多层嵌套，增加调试难度
2. props 可能被覆盖
3. 需要额外的组件实例

### 3. 如何解决 HOC 的 props 覆盖问题？
```typescript
/**
 * 解决 props 覆盖问题的 HOC
 */
function withSafeProps<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithSafeProps(props: P) {
    // 创建新的 props 对象，确保不覆盖原有 props
    const safeProps = {
      ...props,
      // 只在原 props 不存在时添加新 props
      extraProp: props.hasOwnProperty('extraProp') ? props.extraProp : 'default'
    };
    
    return <WrappedComponent {...safeProps} />;
  };
}
```

### 4. 如何实现 HOC 的链式调用？
```typescript
/**
 * HOC 链式调用示例
 */
// 创建多个 HOC
const withStyle = (style: React.CSSProperties) => (WrappedComponent: React.ComponentType) => 
  (props: any) => <WrappedComponent {...props} style={style} />;

const withClassName = (className: string) => (WrappedComponent: React.ComponentType) => 
  (props: any) => <WrappedComponent {...props} className={className} />;

// 链式调用
const enhance = compose(
  withStyle({ color: 'red' }),
  withClassName('my-component')
);

const EnhancedComponent = enhance(BaseComponent);
```

## 五、最佳实践

1. **命名规范**
   - HOC 函数名以 `with` 开头
   - 被包装组件名要体现在返回的组件名中

2. **不要修改原组件**
   - 不直接修改原组件的 prototype
   - 使用组合而不是修改

3. **透传不相关的 props**
   - 确保 HOC 透传与自身无关的 props
   - 避免 props 命名冲突

4. **保持组件纯净**
   - HOC 应该是纯函数
   - 避免在 HOC 中产生副作用

5. **使用 compose 组合多个 HOC**
   - 使用 compose 函数组合多个 HOC
   - 注意 HOC 的调用顺序
