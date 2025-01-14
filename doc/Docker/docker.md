# Docker 前端开发指南与面试题

## 一、Docker 基础概念

### 1. Docker 三个基本概念
- **镜像（Image）**：只读的模板，用于创建容器
- **容器（Container）**：镜像的运行实例
- **仓库（Repository）**：存储和分发镜像的地方

### 2. Docker 架构
- **Client**：命令行界面
- **Docker daemon**：服务器组件，管理容器
- **Registry**：镜像仓库，如 Docker Hub

## 二、常用命令

### 1. 镜像相关命令
```bash
# 查看本地所有镜像
docker images

# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest

# 删除镜像
docker rmi nginx

# 构建镜像
docker build -t my-app:1.0 .
```

### 2. 容器相关命令
```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 启动容器
docker run -d -p 80:80 nginx

# 停止容器
docker stop container_id

# 删除容器
docker rm container_id

# 进入容器
docker exec -it container_id bash

# 查看容器日志
docker logs container_id
```

### 3. 前端开发常用命令
```bash
# 启动前端开发环境
docker run -d -p 3000:3000 -v $(pwd):/app node:14 npm start

# 构建前端项目
docker run --rm -v $(pwd):/app node:14 npm run build

# 运行 Nginx 部署前端项目
docker run -d -p 80:80 -v $(pwd)/dist:/usr/share/nginx/html nginx
```

## 三、Dockerfile 编写

### 1. 前端项目的 Dockerfile 示例
```dockerfile
# 构建阶段
FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. 多阶段构建说明
```dockerfile
# 开发环境
FROM node:14 as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

# 生产环境
FROM node:14 as production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
```

## 四、Docker Compose

### 1. 前端开发环境配置
```yaml
# docker-compose.yml
version: '3'
services:
  frontend:
    build: 
      context: .
      target: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

### 2. 常用命令
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs

# 重新构建
docker-compose build
```

## 五、常见面试题

### 1. Docker 的优势是什么？
答：对前端开发来说，Docker 的主要优势包括：
1. 环境一致性：确保开发、测试和生产环境的一致
2. 快速部署：容器化部署更快速、更可靠
3. 版本控制：可以方便地管理不同版本的环境
4. 隔离性：避免环境冲突
5. CI/CD 集成：更容易实现持续集成和部署

### 2. 容器和虚拟机的区别？
答：
1. 容器：
   - 共享主机操作系统内核
   - 启动快，占用资源少
   - 适合微服务架构

2. 虚拟机：
   - 完整的操作系统副本
   - 资源隔离更彻底
   - 启动慢，占用资源多

### 3. 如何优化前端 Docker 镜像大小？
答：
1. 使用多阶段构建
2. 选择合适的基础镜像（如 alpine）
3. 清理构建缓存和不必要的文件
4. 合并 RUN 命令减少层数
```dockerfile
# 优化示例
FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 4. Docker 数据持久化的方式有哪些？
答：
1. Volumes（卷）：
```bash
docker run -v my-volume:/app/data
```

2. Bind Mounts（绑定挂载）：
```bash
docker run -v $(pwd):/app
```

3. tmpfs（临时文件系统）：
```bash
docker run --tmpfs /app/temp
```

### 5. 如何处理前端项目的环境变量？
答：
1. Dockerfile 中设置：
```dockerfile
ENV REACT_APP_API_URL=http://api.example.com
```

2. docker-compose.yml 中设置：
```yaml
services:
  frontend:
    environment:
      - REACT_APP_API_URL=http://api.example.com
```

3. 运行时传入：
```bash
docker run -e REACT_APP_API_URL=http://api.example.com
```

### 6. Docker 网络模式有哪些？
答：
1. bridge：默认网络模式
2. host：共享主机网络
3. none：无网络
4. container：共享其他容器的网络

```bash
# 创建自定义网络
docker network create my-network

# 连接容器到网络
docker run --network my-network
```

### 7. 如何实现容器间通信？
答：
1. Docker Compose 中定义：
```yaml
services:
  frontend:
    networks:
      - app-network
  backend:
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

2. 手动创建网络：
```bash
docker network create app-network
docker run --network app-network
```

## 六、实用技巧

### 1. 开发环境热重载配置
```dockerfile
# Dockerfile.dev
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

```yaml
# docker-compose.dev.yml
version: '3'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
```

### 2. 生产环境 Nginx 配置
```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理配置
    location /api {
        proxy_pass http://api-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 常用调试技巧
```bash
# 查看容器内进程
docker top container_id

# 查看容器资源使用
docker stats

# 查看容器详细信息
docker inspect container_id

# 复制文件到容器
docker cp ./file.txt container_id:/app/

# 从容器复制文件
docker cp container_id:/app/file.txt ./
```
