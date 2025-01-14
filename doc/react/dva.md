# DVA 详解

## DVA 与 UMI 的关系与区别

### DVA
DVA 是一个基于 Redux 和 Redux-saga 的数据流解决方案，同时内置了 React-router 用于路由。它的特点是：
- 基于 Redux、Redux-saga 的数据流方案
- 简化的 Redux 写法
- 内置 react-router 路由
- 支持 HMR（热模块替换）
- 插件机制

### UMI
UMI 是一个可插拔的企业级 React 应用框架，它的特点是：
- 内置了 DVA
- 插件化架构
- 约定式路由
- 开箱即用
- 完整的工程化工具链

### 两者关系
- UMI 是框架，DVA 是数据流方案
- UMI 内置了 DVA，可以直接使用 DVA 的功能
- UMI = React + DVA + 插件体系 + 工程化能力

## DVA 核心概念

### 1. Model
Model 是 DVA 中最重要的概念，每个 Model 包含：

#### State
- 模型的状态数据
- 对应 Redux 的 state

#### Reducer
- 处理同步操作
- 用于修改 state
- 由 action 触发
```javascript
reducers: {
    save(state, action) {
        return { ...state, ...action.payload };
    },
}
```

#### Effect
- 处理异步操作
- 基于 Redux-saga 实现
- 用 generator 函数声明
```javascript
effects: {
    *fetch({ payload }, { call, put }) {
        const response = yield call(service.fetch, payload);
        yield put({ type: 'save', payload: response });
    },
}
```

#### Subscription
- 订阅数据源
- 用于监听数据变化
```javascript
subscriptions: {
    setup({ dispatch, history }) {
        return history.listen(({ pathname }) => {
            if (pathname === '/users') {
                dispatch({ type: 'fetch' });
            }
        });
    },
}
```

### 2. Action
- 改变状态的唯一途径
- 通过 dispatch 函数调用

### 3. Dispatch
- 触发 action 的方法
- 可以调用 reducer 或 effect

## DVA 实践 Demo

### 1. 项目结构
```
src/
  ├── models/         # 模型目录
  ├── services/       # 后端接口服务
  ├── components/     # 组件
  └── pages/         # 页面
```

### 2. Model 示例
```javascript
// models/users.js
export default {
  namespace: 'users',
  state: {
    list: [],
    loading: false,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
  effects: {
    *fetchUsers({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(usersService.fetch, payload);
        yield put({ type: 'save', payload: { list: response.data } });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetchUsers' });
        }
      });
    },
  },
};
```

### 3. 组件中使用
```javascript
// pages/Users.js
import { connect } from 'dva';

const Users = ({ dispatch, users }) => {
  const { list, loading } = users;

  const handleRefresh = () => {
    dispatch({ type: 'users/fetchUsers' });
  };

  return (
    <div>
      <button onClick={handleRefresh}>刷新</button>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <ul>
          {list.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default connect(({ users }) => ({
  users,
}))(Users);
```

### 4. Service 示例
```javascript
// services/users.js
import request from 'umi-request';

export function fetch() {
  return request('/api/users');
}
```

## 数据流转过程

1. 组件通过 dispatch 发起 action
2. 如果是异步操作，进入 effect
   - effect 通过 call 调用服务端接口
   - 获取数据后通过 put 触发 reducer
3. 如果是同步操作，直接进入 reducer
4. reducer 更新 state
5. 通过 connect 将更新后的状态传递给组件
6. 组件重新渲染

## 最佳实践

1. **Model 设计原则**
   - 按业务领域划分 model
   - 保持 state 扁平化
   - reducer 保持纯函数特性

2. **Effect 使用建议**
   - 复杂异步逻辑放在 effect 中
   - 使用 try-catch 处理异常
   - 合理使用 loading 状态

3. **Subscription 使用场景**
   - 监听路由变化
   - 监听窗口尺寸变化
   - 订阅数据源

4. **性能优化**
   - 合理使用 connect
   - 避免频繁的 dispatch
   - 适当使用 memo 和 useMemo