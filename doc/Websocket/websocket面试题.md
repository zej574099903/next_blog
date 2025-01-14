# WebSocket 面试题总结

## 基础概念

### 1. WebSocket 是什么？
WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。它提供了在客户端和服务器之间建立持久连接的标准方法，使得服务器可以主动向客户端推送数据。

### 2. WebSocket 的特点
1. **全双工通信**：客户端和服务器可以同时发送和接收数据
2. **建立在 TCP 协议之上**：更可靠的数据传输
3. **与 HTTP 协议有良好的兼容性**：默认端口也是 80 和 443
4. **数据格式轻量**：协议控制的数据包头部相对简单
5. **支持扩展**：可以扩展协议，实现自定义的子协议

## 工作原理

### 1. 连接建立过程
1. **握手阶段**：
```http
// 客户端请求
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

// 服务器响应
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

2. **数据传输阶段**：
```javascript
// 客户端代码
const ws = new WebSocket('ws://example.com/socket');

ws.onopen = () => {
  console.log('连接已建立');
  ws.send('Hello Server!');
};

ws.onmessage = (event) => {
  console.log('收到消息:', event.data);
};
```

### 2. 数据帧格式
```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)    |             (16/64)          |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+-------------------------------+
```

## 使用场景

### 1. 实时应用场景
1. **即时通讯**：
   - 聊天应用
   - 在线客服系统
   - 协同编辑工具

2. **实时数据展示**：
   - 股票行情
   - 体育比分
   - 实时图表

3. **游戏应用**：
   - 多人在线游戏
   - 实时策略游戏

4. **物联网应用**：
   - 实时监控
   - 传感器数据收集

## 代码实现

### 1. 基本使用示例
```javascript
// 前端实现
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('连接成功');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      console.log('收到消息:', event.data);
    };
    
    this.ws.onclose = () => {
      console.log('连接关闭');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 3000);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error('WebSocket未连接');
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// 使用示例
const client = new WebSocketClient('ws://example.com/socket');
client.connect();
```

### 2. Node.js 服务端实现
```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('新的连接');

  ws.on('message', function incoming(message) {
    console.log('收到:', message);
    
    // 广播消息给所有客户端
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', function close() {
    console.log('客户端断开连接');
  });
});
```

## 常见面试题

### 1. WebSocket 与 HTTP 的区别是什么？
**答案：**
1. **连接方式**：
   - HTTP 是非持久的、无状态的连接
   - WebSocket 是持久化的连接，一旦建立连接，就保持双向通信

2. **数据传输方式**：
   - HTTP 是单向的，客户端请求，服务器响应
   - WebSocket 是全双工的，服务器和客户端可以同时发送数据

3. **数据格式**：
   - HTTP 每次请求都要带完整的头信息
   - WebSocket 在建立连接后，数据包头部较小

### 2. WebSocket 的心跳机制是什么？
**答案：**
心跳机制用于确保连接的存活状态，实现示例：

```javascript
class HeartbeatWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('连接成功');
      this.startHeartbeat();
    };
    
    this.ws.onclose = () => {
      this.cleanup();
      this.reconnect();
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, 30000); // 每30秒发送一次心跳
  }

  cleanup() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
  }
}
```

### 3. WebSocket 如何处理断线重连？
**答案：**
断线重连需要考虑以下几点：
1. 指数退避算法
2. 最大重试次数
3. 重连状态管理

```javascript
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.maxRetries = 5;
    this.retryCount = 0;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onclose = () => {
      const retryDelay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`${retryDelay}ms 后重试...`);
        setTimeout(() => this.connect(), retryDelay);
      }
    };
    
    this.ws.onopen = () => {
      this.retryCount = 0;
    };
  }
}
```

### 4. WebSocket 的安全性如何保证？
**答案：**
1. **使用 WSS**：
   - 使用 SSL/TLS 加密的 WebSocket 连接
   ```javascript
   const ws = new WebSocket('wss://example.com/socket');
   ```

2. **身份验证**：
   ```javascript
   const ws = new WebSocket(
     `wss://example.com/socket?token=${authToken}`
   );
   ```

3. **数据验证**：
   ```javascript
   ws.onmessage = (event) => {
     try {
       const data = JSON.parse(event.data);
       if (validateData(data)) {
         processData(data);
       }
     } catch (e) {
       console.error('Invalid data received');
     }
   };
   ```

### 5. WebSocket 与 Socket.IO 的区别？
**答案：**
1. **兼容性**：
   - WebSocket 是原生的协议
   - Socket.IO 提供了更好的浏览器兼容性，可以降级到其他传输方式

2. **功能特性**：
   - Socket.IO 提供了更多功能：
     - 自动重连
     - 房间概念
     - 广播机制
   
3. **使用场景**：
   - WebSocket 适合简单的实时通信
   - Socket.IO 适合需要更多功能和更好兼容性的场景

```javascript
// WebSocket 示例
const ws = new WebSocket('ws://example.com');

// Socket.IO 示例
const socket = io('http://example.com', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on('connect', () => {
  console.log('connected');
  socket.emit('join', 'room1');
});
```
