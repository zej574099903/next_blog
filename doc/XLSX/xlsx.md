# XLSX 使用指南

## 1. 安装与配置

```bash
# 安装 xlsx 库
npm install xlsx

# 如果需要文件流操作，还需要安装
npm install file-saver
```

## 2. 基础使用方法

### 2.1 导出 Excel 工具函数

```typescript
// utils/excel.ts
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'

interface ExportOptions {
  filename?: string
  bookType?: string
  header?: string[]
  autoWidth?: boolean
}

export class ExcelExporter {
  /**
   * 导出 Excel 文件
   * @param data 要导出的数据
   * @param options 导出选项
   */
  static export(data: any[], options: ExportOptions = {}) {
    const {
      filename = 'export',
      bookType = 'xlsx',
      header,
      autoWidth = true
    } = options

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    
    // 将数据转换为工作表
    const ws = this.jsonToSheet(data, header)
    
    // 设置列宽
    if (autoWidth) {
      this.setColumnWidth(ws, data)
    }
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    
    // 生成文件并下载
    const wbout = XLSX.write(wb, {
      bookType: bookType,
      bookSST: false,
      type: 'array'
    })
    
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        `${filename}.${bookType}`
      )
    } catch (e) {
      console.error('导出失败', e)
    }
  }

  /**
   * 将 JSON 数据转换为工作表
   */
  private static jsonToSheet(data: any[], header?: string[]) {
    if (header) {
      const headerRow = {}
      header.forEach((h, i) => {
        headerRow[String.fromCharCode(65 + i)] = h
      })
      data = [headerRow, ...data]
    }
    
    return XLSX.utils.json_to_sheet(data, { skipHeader: true })
  }

  /**
   * 自动设置列宽
   */
  private static setColumnWidth(ws: XLSX.WorkSheet, data: any[]) {
    const colWidth = data.map(row => 
      Object.keys(row).map(key => {
        const length = row[key]?.toString().length || 10
        return { wch: Math.max(length, 10) }
      })
    )
    
    ws['!cols'] = colWidth[0]
  }
}
```

### 2.2 封装 Vue3 组件

```vue
<!-- components/ExcelExport.vue -->
<template>
  <el-button
    :loading="loading"
    @click="handleExport"
  >
    <slot>导出 Excel</slot>
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ExcelExporter } from '@/utils/excel'

interface Props {
  data: any[]
  filename?: string
  header?: string[]
  autoWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  filename: 'export',
  autoWidth: true
})

const loading = ref(false)

const handleExport = async () => {
  try {
    loading.value = true
    await ExcelExporter.export(props.data, {
      filename: props.filename,
      header: props.header,
      autoWidth: props.autoWidth
    })
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

## 3. 高级功能实现

### 3.1 大数据量分片导出

```typescript
// utils/excel-chunk.ts
export class ChunkExcelExporter {
  private static readonly CHUNK_SIZE = 1000 // 每片数据量

  /**
   * 分片导出大数据量
   * @param getData 获取数据的函数
   * @param options 导出选项
   */
  static async exportLargeData(
    getData: (page: number, size: number) => Promise<any[]>,
    options: ExportOptions & { total: number }
  ) {
    const { total, ...exportOptions } = options
    const chunks = Math.ceil(total / this.CHUNK_SIZE)
    const allData: any[] = []

    for (let i = 0; i < chunks; i++) {
      const data = await getData(i + 1, this.CHUNK_SIZE)
      allData.push(...data)
    }

    ExcelExporter.export(allData, exportOptions)
  }
}
```

### 3.2 自定义样式导出

```typescript
// utils/excel-style.ts
export class StyledExcelExporter extends ExcelExporter {
  static exportWithStyle(data: any[], options: ExportOptions & { styles?: any }) {
    const { styles, ...exportOptions } = options
    const ws = this.jsonToSheet(data, options.header)
    
    // 应用样式
    if (styles) {
      ws['!styles'] = styles
    }
    
    // 设置默认样式
    this.setDefaultStyles(ws)
    
    return this.export([ws], exportOptions)
  }

  private static setDefaultStyles(ws: XLSX.WorkSheet) {
    // 设置表头样式
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "CCCCCC" } },
      alignment: { horizontal: "center" }
    }
    
    // 应用表头样式
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
      ws[cellRef].s = headerStyle
    }
  }
}
```

## 4. 使用示例

### 4.1 基础导出

```vue
<template>
  <excel-export
    :data="tableData"
    filename="用户数据"
    :header="['姓名', '年龄', '地址']"
  />
</template>

<script setup>
import ExcelExport from '@/components/ExcelExport.vue'

const tableData = [
  { name: '张三', age: 18, address: '北京' },
  { name: '李四', age: 20, address: '上海' }
]
</script>
```

### 4.2 大数据量导出

```vue
<template>
  <el-button @click="exportLargeData" :loading="loading">
    导出大数据量
  </el-button>
</template>

<script setup>
import { ref } from 'vue'
import { ChunkExcelExporter } from '@/utils/excel-chunk'

const loading = ref(false)

const getData = async (page: number, size: number) => {
  // 模拟分页获取数据
  return await api.getPageData(page, size)
}

const exportLargeData = async () => {
  try {
    loading.value = true
    await ChunkExcelExporter.exportLargeData(getData, {
      filename: '大数据导出',
      total: 10000,
      header: ['ID', '名称', '数值']
    })
  } finally {
    loading.value = false
  }
}
</script>
```

### 4.3 自定义样式导出

```typescript
const exportWithStyle = () => {
  const styles = {
    // 设置第一列样式
    A1: {
      font: { color: { rgb: "FF0000" } },
      fill: { fgColor: { rgb: "FFFF00" } }
    },
    // 设置整行样式
    1: {
      font: { bold: true },
      alignment: { horizontal: "center" }
    }
  }

  StyledExcelExporter.exportWithStyle(data, {
    filename: '样式导出',
    styles
  })
}
```

## 5. 性能优化建议

1. **数据处理优化**：
   - 使用 Web Worker 处理大量数据
   - 实现数据分片处理
   - 采用虚拟滚动显示大量数据

2. **内存优化**：
   - 及时释放大对象
   - 避免重复创建对象
   - 使用流式处理大文件

3. **用户体验优化**：
   - 添加进度提示
   - 实现断点续传
   - 优化错误处理

## 6. 最佳实践

1. **数据预处理**：
   - 清理无效数据
   - 格式化日期时间
   - 处理特殊字符

2. **错误处理**：
   - 添加错误边界
   - 实现重试机制
   - 友好的错误提示

3. **扩展性考虑**：
   - 支持多种文件格式
   - 可配置的导出选项
   - 插件化的设计
