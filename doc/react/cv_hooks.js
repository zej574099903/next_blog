import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

/**
 * 表单处理自定义Hook，用于管理表单状态和操作
 * @param {Object} initialValues - 表单初始值对象
 * @returns {Object} 返回表单状态和操作方法
 * @property {Object} values - 当前表单值
 * @property {Object} errors - 表单错误信息
 * @property {Function} handleChange - 处理表单字段变更
 * @property {Function} handleSubmit - 处理表单提交
 * @property {Function} reset - 重置表单到初始状态
 */
function useForm(initialValues = {}) {
  // 初始化表单状态
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // 处理表单字段变更，使用useCallback优化性能
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // 处理表单提交，防止默认行为并调用回调
  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault();
    onSubmit(values);
  }, [values]);

  // 重置表单状态到初始值
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, handleChange, handleSubmit, reset };
}

/**
 * 表格管理自定义Hook，处理分页和排序功能
 * @param {Object} options - 配置选项
 * @param {Array} options.data - 表格数据数组
 * @param {number} options.pageSize - 每页显示的条数
 * @param {Object} options.initialSort - 初始排序配置
 * @returns {Object} 返回表格状态和操作方法
 */
function useTable({
  data = [],
  pageSize = 10,
  initialSort = { field: null, direction: 'asc' }
}) {
  // 初始化分页和排序状态
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState(initialSort);
  
  // 根据排序条件处理数据，使用useMemo优化性能
  const sortedData = useMemo(() => {
    if (!sorting.field) return data;
    return [...data].sort((a, b) => {
      if (sorting.direction === 'asc') {
        return a[sorting.field] > b[sorting.field] ? 1 : -1;
      }
      return a[sorting.field] < b[sorting.field] ? 1 : -1;
    });
  }, [data, sorting]);

  // 处理分页数据，使用useMemo优化性能
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return {
    data: paginatedData,
    currentPage,
    totalPages: Math.ceil(data.length / pageSize),
    setCurrentPage,
    sorting,
    setSorting
  };
}

/**
 * 拖拽功能自定义Hook
 * @param {Object} initialPosition - 初始位置坐标
 * @param {number} initialPosition.x - 初始X坐标
 * @param {number} initialPosition.y - 初始Y坐标
 * @returns {Object} 返回拖拽状态和事件处理器
 */
function useDrag(initialPosition = { x: 0, y: 0 }) {
  // 初始化拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 处理鼠标按下事件，记录起始位置
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  // 处理鼠标移动事件，更新位置
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  // 处理鼠标释放事件，结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    position,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp
    }
  };
}

/**
 * 文件上传自定义Hook
 * @param {Object} options - 上传配置选项
 * @param {Function} options.onSuccess - 上传成功回调
 * @param {Function} options.onError - 上传失败回调
 * @param {number} options.maxSize - 最大文件大小（字节）
 * @returns {Object} 返回上传状态和操作方法
 */
function useUpload({ onSuccess, onError, maxSize = 5 * 1024 * 1024 }) {
  // 初始化上传状态
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // 处理文件上传，使用useCallback优化性能
  const upload = useCallback(async (file) => {
    // 检查文件大小是否超过限制
    if (file.size > maxSize) {
      const error = `文件大小不能超过 ${maxSize / 1024 / 1024}MB`;
      setError(error);
      onError?.(error);
      return;
    }

    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 发送上传请求
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          // 计算并更新上传进度
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      const result = await response.json();
      onSuccess?.(result);
    } catch (err) {
      // 处理上传错误
      setError(err.message);
      onError?.(err);
    } finally {
      // 重置上传状态
      setUploading(false);
      setProgress(0);
    }
  }, [maxSize, onSuccess, onError]);

  return { upload, uploading, progress, error };
}

/**
 * 组件状态缓存自定义Hook
 * @param {string} key - 缓存的唯一标识符
 * @returns {Object} 返回缓存状态和操作方法
 * @property {boolean} cached - 是否有缓存的状态
 * @property {Function} clearCache - 清除所有缓存的方法
 */
function useKeepAlive(key) {
  // 使用useRef保存缓存Map，确保在组件重渲染时保持状态
  const cacheRef = useRef(new Map());

  // 组件卸载时缓存状态
  useEffect(() => {
    return () => {
      if (key) {
        const element = document.getElementById(key);
        if (element) {
          // 保存DOM内容到缓存
          cacheRef.current.set(key, element.innerHTML);
        }
      }
    };
  }, [key]);

  // 组件挂载时恢复缓存状态
  useEffect(() => {
    if (key && cacheRef.current.has(key)) {
      const element = document.getElementById(key);
      if (element) {
        // 从缓存恢复DOM内容
        element.innerHTML = cacheRef.current.get(key);
      }
    }
  }, [key]);

  return {
    cached: key ? cacheRef.current.has(key) : false,
    clearCache: () => cacheRef.current.clear()
  };
}

/**
 * 时间管理自定义Hook
 * @param {Object} options - 配置选项
 * @param {number} options.interval - 更新时间间隔（毫秒）
 * @param {string} options.format - 时间格式（'HH:mm' 或 'HH:mm:ss'）
 * @returns {Object} 返回时间状态和格式化方法
 * @property {Date} time - 当前时间对象
 * @property {string} formattedTime - 格式化后的时间字符串
 */
function useTime(options = {}) {
  const {
    interval = 1000,
    format = 'HH:mm:ss'
  } = options;

  // 初始化时间状态
  const [time, setTime] = useState(new Date());

  // 设置定时器更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, interval);

    // 清理定时器
    return () => clearInterval(timer);
  }, [interval]);

  // 格式化时间，使用useCallback优化性能
  const formatTime = useCallback((date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    switch (format) {
      case 'HH:mm':
        return `${hours}:${minutes}`;
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      default:
        return date.toLocaleTimeString();
    }
  }, [format]);

  return {
    time,
    formattedTime: formatTime(time)
  };
}