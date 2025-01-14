# 高德地图 API 使用指南与面试题

## 一、基础配置

### 1. 引入高德地图 JS API
```html
<!-- 引入 JSAPI -->
<script src="https://webapi.amap.com/maps?v=2.0&key=您的key值"></script>
```

### 2. 初始化地图
```javascript
// 创建地图实例
const map = new AMap.Map('container', {
    zoom: 11,  // 地图级别
    center: [116.397428, 39.90923],  // 地图中心点
    viewMode: '3D'  // 地图模式
});
```

## 二、常用 API

### 1. 标记点（Marker）
```javascript
// 创建 marker
const marker = new AMap.Marker({
    position: [116.397428, 39.90923],
    title: '北京',
    icon: 'custom.png',  // 自定义图标
    anchor: 'bottom-center'  // 锚点
});

// 将 marker 添加到地图
marker.setMap(map);

// 绑定点击事件
marker.on('click', () => {
    // 处理点击事件
});
```

### 2. 信息窗体（InfoWindow）
```javascript
// 创建信息窗体
const infoWindow = new AMap.InfoWindow({
    content: '<div>信息窗体内容</div>',
    offset: new AMap.Pixel(0, -30)
});

// 打开信息窗体
infoWindow.open(map, [116.397428, 39.90923]);
```

### 3. 绘制线段（Polyline）
```javascript
// 创建折线
const polyline = new AMap.Polyline({
    path: [[116.397428, 39.90923], [116.397428, 39.90923]],
    strokeColor: "#FF0000",
    strokeWeight: 3,
    strokeOpacity: 0.8
});

// 将折线添加到地图
polyline.setMap(map);
```

### 4. 绘制多边形（Polygon）
```javascript
// 创建多边形
const polygon = new AMap.Polygon({
    path: [
        [116.403322, 39.920255],
        [116.410703, 39.897555],
        [116.402292, 39.892353]
    ],
    strokeColor: "#FF33FF",
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillOpacity: 0.4,
    fillColor: '#1791fc'
});

polygon.setMap(map);
```

### 5. 地理编码与逆地理编码
```javascript
// 地理编码
const geocoder = new AMap.Geocoder();

// 地址转坐标
geocoder.getLocation('北京市海淀区', (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
        const location = result.geocodes[0].location;
        console.log(location);
    }
});

// 坐标转地址
geocoder.getAddress([116.397428, 39.90923], (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
        const address = result.regeocode.formattedAddress;
        console.log(address);
    }
});
```

### 6. 路径规划
```javascript
// 驾车路径规划
const driving = new AMap.Driving({
    map: map,
    panel: "panel"  // 结果列表容器
});

// 根据起终点经纬度规划驾车导航路线
driving.search(
    [116.379028, 39.865042],  // 起点
    [116.427281, 39.903719],  // 终点
    {
        waypoints: [[116.405289, 39.904987]]  // 途经点
    }
);
```

## 三、常见面试题

### 1. 如何优化地图性能？
答：
1. 合理使用图层管理
   - 使用图层组（LayerGroup）管理大量标记
   - 不需要的图层及时移除
   
2. 标记点优化
   - 使用海量点标记（MassMarks）代替普通标记
   - 根据缩放级别显示不同数量的标记
   
3. 事件优化
   - 使用事件委托处理标记点事件
   - 避免频繁添加移除事件监听
   
4. 资源加载优化
   - 按需加载地图插件
   - 使用雪碧图优化标记点图标

### 2. 高德地图常用坐标系统有哪些？
答：
1. GCJ-02：国测局坐标系，高德地图使用的坐标系
2. WGS-84：GPS原始坐标系
3. BD-09：百度坐标系

需要注意在不同坐标系统间进行转换：
```javascript
// GCJ-02 转 WGS-84
AMap.convertFrom([116.397428, 39.90923], 'gps', (status, result) => {
    if (result.info === 'ok') {
        const lnglat = result.locations[0];
    }
});
```

### 3. 如何实现地图拖拽选点功能？
答：
```javascript
// 创建可拖拽的标记
const marker = new AMap.Marker({
    position: [116.397428, 39.90923],
    draggable: true,
    cursor: 'move'
});

// 拖拽结束后获取坐标
marker.on('dragend', (e) => {
    const position = e.target.getPosition();
    // 获取地址信息
    const geocoder = new AMap.Geocoder();
    geocoder.getAddress(position, (status, result) => {
        if (status === 'complete') {
            const address = result.regeocode.formattedAddress;
            console.log(address);
        }
    });
});
```

### 4. 如何实现自定义地图样式？
答：
```javascript
// 自定义地图样式
const map = new AMap.Map('container', {
    mapStyle: 'amap://styles/dark',  // 内置样式
    // 或使用自定义样式
    customMapStyle: {
        styleJson: [
            {
                featureType: 'land',
                elementType: 'geometry',
                stylers: {
                    color: '#081734'
                }
            }
        ]
    }
});
```

### 5. 如何处理地图缩放级别限制？
答：
```javascript
// 设置地图缩放级别限制
const map = new AMap.Map('container', {
    zoom: 11,
    zooms: [3, 18],  // 地图缩放范围
});

// 监听缩放事件
map.on('zoomchange', () => {
    const zoom = map.getZoom();
    // 根据不同缩放级别显示不同内容
    if (zoom >= 12) {
        // 显示详细信息
    } else {
        // 显示概要信息
    }
});
```

### 6. 如何实现地图区域限制？
答：
```javascript
// 设置地图显示范围
const bounds = new AMap.Bounds(
    [116.027143, 39.772348],  // 西南角坐标
    [116.832025, 40.126349]   // 东北角坐标
);

map.setLimitBounds(bounds);  // 限制地图显示范围

// 判断坐标是否在限制范围内
const isPointInBounds = bounds.contains([116.397428, 39.90923]);
```

### 7. 如何优化海量点标记的性能？
答：
```javascript
// 使用 MassMarks 绘制海量点
const massMarks = new AMap.MassMarks(data, {
    opacity: 0.8,
    zIndex: 111,
    cursor: 'pointer',
    style: [{
        url: 'marker.png',
        anchor: new AMap.Pixel(5, 5),
        size: new AMap.Size(10, 10)
    }]
});

// 添加到地图
massMarks.setMap(map);

// 事件监听
massMarks.on('click', (e) => {
    const position = e.data.lnglat;
    // 处理点击事件
});
```

## 四、实用技巧

### 1. 自适应显示所有标记点
```javascript
// 获取所有标记点的坐标
const positions = markers.map(marker => marker.getPosition());

// 自适应显示
map.setFitView(null, {
    padding: [100, 100, 100, 100]  // 四周留空
});
```

### 2. 聚合点处理
```javascript
// 点聚合
const cluster = new AMap.MarkerClusterer(map, markers, {
    gridSize: 80,
    minClusterSize: 2,
    maxZoom: 18
});

// 自定义聚合点样式
cluster.setStyles([{
    content: '<div>聚合点</div>',
    size: new AMap.Size(32, 32)
}]);
```

### 3. 绘制工具
```javascript
// 初始化绘制工具
const mouseTool = new AMap.MouseTool(map);

// 绘制多边形
mouseTool.polygon({
    strokeColor: "#FF33FF",
    strokeWeight: 6,
    fillColor: '#1791fc',
    fillOpacity: 0.4
});

// 监听绘制完成事件
mouseTool.on('draw', (e) => {
    const geometry = e.obj;  // 绘制的图形对象
});
```
