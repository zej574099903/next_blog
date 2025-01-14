# React-CodeMirror 使用指南

React-CodeMirror 是一个强大的代码编辑器组件，基于 CodeMirror 封装成 React 组件。它适用于以下场景：

1. 在线代码编辑器
2. 代码展示
3. SQL 编辑器
4. 配置文件编辑器
5. Markdown 编辑器

## 基础安装

```bash
npm install @uiw/react-codemirror
# 安装必要的语言支持
npm install @codemirror/lang-javascript @codemirror/lang-sql
```

## 基础使用示例

```jsx
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';

function Editor() {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log('value:', value);
  }, []);

  return (
    <CodeMirror
      value="console.log('hello world!');"
      height="200px"
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
    />
  );
}
```

## 添加快捷键注释功能

```jsx
import { keymap } from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';

// 定义快捷键
const commentKeymap = keymap.of([
  {
    key: "Ctrl-/",
    run: (view) => {
      // 获取选中的行
      const lines = view.state.doc.lineAt(view.state.selection.main.from);
      // 切换注释
      const newText = lines.text.startsWith('//') 
        ? lines.text.substring(2) 
        : '//' + lines.text;
      
      view.dispatch({
        changes: {
          from: lines.from,
          to: lines.to,
          insert: newText
        }
      });
      return true;
    }
  }
]);

// 使用示例
function Editor() {
  return (
    <CodeMirror
      extensions={[javascript(), commentKeymap]}
      // ... 其他配置
    />
  );
}
```

## SQL关键字提示

```jsx
import { sql } from '@codemirror/lang-sql';
import { autocompletion } from '@codemirror/autocomplete';

// 自定义SQL提示
const customSQLCompletions = {
  autocomplete: (context) => {
    const before = context.matchBefore(/\w+/);
    if (!before) return null;
    
    return {
      from: before.from,
      options: [
        { label: 'SELECT', type: 'keyword' },
        { label: 'FROM', type: 'keyword' },
        { label: 'WHERE', type: 'keyword' },
        { label: 'ORDER BY', type: 'keyword' },
        // 添加表名提示
        { label: 'users', type: 'table' },
        { label: 'orders', type: 'table' },
        // 添加字段提示
        { label: 'id', type: 'field' },
        { label: 'name', type: 'field' },
        { label: 'email', type: 'field' },
      ]
    };
  }
};

function SQLEditor() {
  return (
    <CodeMirror
      extensions={[
        sql(),
        autocompletion({ override: [customSQLCompletions] })
      ]}
      // ... 其他配置
    />
  );
}
```

## 自定义主题和关键字颜色

```jsx
import { tags } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';

// 自定义主题
const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: '#4D4D4C',
    caret: '#AEAFAD',
    selection: '#D6D6D6',
    selectionMatch: '#D6D6D6',
    lineHighlight: '#EFEFEF',
  },
  styles: [
    { tag: tags.keyword, color: '#1a85ff' },        // 关键字颜色
    { tag: tags.string, color: '#50a14f' },         // 字符串颜色
    { tag: tags.comment, color: '#a0a1a7' },        // 注释颜色
    { tag: tags.function, color: '#c678dd' },       // 函数名颜色
    { tag: tags.number, color: '#986801' },         // 数字颜色
    { tag: tags.operator, color: '#4078f2' },       // 操作符颜色
  ]
});

function Editor() {
  return (
    <CodeMirror
      theme={myTheme}
      extensions={[javascript()]}
      // ... 其他配置
    />
  );
}
```

## 常用配置项

```jsx
<CodeMirror
  value={code}
  height="400px"
  theme={myTheme}
  extensions={[javascript()]}
  editable={true}
  readOnly={false}
  basicSetup={{
    lineNumbers: true,
    foldGutter: true,
    highlightActiveLineGutter: true,
    highlightSpecialChars: true,
    history: true,
    bracketMatching: true,
    autocompletion: true,
    closeBrackets: true,
    highlightSelectionMatches: true,
  }}
  onChange={(value, viewUpdate) => {
    console.log('value:', value);
  }}
/>
```

以上示例展示了 React-CodeMirror 的主要使用方法，包括：
- 基础配置
- 快捷键注释功能
- SQL关键字提示
- 自定义主题和语法高亮
- 常用配置项

你可以根据具体需求组合使用这些功能，打造适合你项目的代码编辑器。