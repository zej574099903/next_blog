# React-Virtualized 虚拟列表实现指南

## 1. 什么是 React-Virtualized

React-Virtualized 是一个高效的 React 组件库，用于渲染大型列表和表格数据。它通过"虚拟化"技术，只渲染当前可视区域内的元素，从而显著提高性能和用户体验。

## 2. 工作原理

### 2.1 核心概念

1. **可视区域（Viewport）**：用户当前可以看到的列表区域
2. **缓冲区（Overscan）**：在可视区域之外额外渲染的项目，用于提供更流畅的滚动体验
3. **虚拟化**：只渲染可视区域和缓冲区内的元素，其他元素用空白占位

### 2.2 渲染流程

1. 计算可视区域大小
2. 根据滚动位置计算应该渲染哪些项目
3. 只渲染这些项目，其他项目用空白占位
4. 监听滚动事件，动态更新渲染的项目

## 3. 基础使用示例

### 3.1 安装

```bash
npm install react-virtualized
```

### 3.2 简单列表示例

```jsx
import React from 'react';
import { List } from 'react-virtualized';
import 'react-virtualized/styles.css';

function VirtualizedList() {
  // 生成大量数据
  const list = Array.from({ length: 100000 }, (_, index) => ({
    id: index,
    text: `Item ${index}`
  }));

  // 渲染每一行的函数
  const rowRenderer = ({ key, index, style }) => {
    const item = list[index];
    return (
      <div key={key} style={style}>
        <div className="row">
          {item.text}
        </div>
      </div>
    );
  };

  return (
    <List
      width={300}              // 列表宽度
      height={400}             // 列表高度
      rowCount={list.length}   // 总行数
      rowHeight={50}           // 行高
      rowRenderer={rowRenderer}// 渲染函数
      overscanRowCount={10}    // 缓冲区行数
    />
  );
}

export default VirtualizedList;
```

### 3.3 带样式的列表

```jsx
import React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import './VirtualizedList.css';

function StyledVirtualizedList() {
  const list = Array.from({ length: 100000 }, (_, index) => ({
    id: index,
    name: `User ${index}`,
    email: `user${index}@example.com`,
    status: index % 2 === 0 ? 'Active' : 'Inactive'
  }));

  const rowRenderer = ({ key, index, style }) => {
    const item = list[index];
    return (
      <div key={key} style={style} className="row">
        <div className="cell">{item.name}</div>
        <div className="cell">{item.email}</div>
        <div className="cell status">{item.status}</div>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={list.length}
            rowHeight={60}
            rowRenderer={rowRenderer}
            overscanRowCount={10}
          />
        )}
      </AutoSizer>
    </div>
  );
}

// 相关样式
const styles = `
.row {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.cell {
  flex: 1;
  padding: 0 10px;
}

.status {
  width: 80px;
  text-align: center;
}
`;
```

## 4. 高级功能示例

### 4.1 无限加载列表

```jsx
import React, { useState } from 'react';
import { InfiniteLoader, List } from 'react-virtualized';

function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟加载数据
  const loadMoreRows = async ({ startIndex, stopIndex }) => {
    setIsLoading(true);
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItems = Array.from(
      { length: stopIndex - startIndex + 1 },
      (_, i) => ({
        id: startIndex + i,
        content: `Loaded item ${startIndex + i}`
      })
    );
    
    setItems(prev => [...prev, ...newItems]);
    setIsLoading(false);
  };

  const isRowLoaded = ({ index }) => {
    return !!items[index];
  };

  const rowRenderer = ({ key, index, style }) => {
    const item = items[index];
    return (
      <div key={key} style={style}>
        {item ? item.content : 'Loading...'}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={100000}
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          ref={registerChild}
          onRowsRendered={onRowsRendered}
          rowCount={100000}
          rowHeight={50}
          rowRenderer={rowRenderer}
          width={300}
          height={400}
        />
      )}
    </InfiniteLoader>
  );
}
```

### 4.2 动态高度列表

```jsx
import React from 'react';
import { CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';

function DynamicHeightList() {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  const list = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    content: `Variable content length ${index} ${'•'.repeat(Math.random() * 100)}`
  }));

  const rowRenderer = ({ key, index, parent, style }) => {
    const item = list[index];

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style} onLoad={measure}>
            <div className="dynamic-row">
              {item.content}
            </div>
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <List
      deferredMeasurementCache={cache}
      height={400}
      rowCount={list.length}
      rowHeight={cache.rowHeight}
      rowRenderer={rowRenderer}
      width={300}
    />
  );
}
```

## 5. 性能优化建议

1. **合理设置 overscanRowCount**
   - 根据实际需求调整缓冲区大小
   - 通常设置为 5-15 之间较为合适

2. **使用 memoization**
   ```jsx
   const rowRenderer = React.useCallback(({ key, index, style }) => {
     const item = list[index];
     return (
       <div key={key} style={style}>
         {item.content}
       </div>
     );
   }, [list]);
   ```

3. **避免不必要的重渲染**
   - 使用 React.memo 包装列表项组件
   - 只传递必要的 props

4. **优化滚动性能**
   - 使用 CSS transform 代替 top/left 定位
   - 避免在滚动时进行复杂计算

## 6. 常见问题解决

1. **滚动位置重置**
   ```jsx
   const listRef = useRef();
   
   // 保持滚动位置
   useEffect(() => {
     const scrollOffset = listRef.current.getScrollTop();
     listRef.current.scrollToPosition(scrollOffset);
   }, [data]);
   ```

2. **动态内容高度**
   - 使用 CellMeasurer 组件
   - 实现 cache 机制

3. **窗口大小变化**
   ```jsx
   <AutoSizer>
     {({ width, height }) => (
       <List
         width={width}
         height={height}
         {...otherProps}
       />
     )}
   </AutoSizer>
   ```

React-Virtualized 是解决大数据列表渲染性能问题的有效工具。通过只渲染可见区域的内容，它可以显著提高应用性能，使得渲染 10 万级别的数据成为可能。合理使用其提供的组件和优化策略，可以构建出高性能的大数据列表界面。