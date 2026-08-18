# Programming Track Mobile

手机优先版，两年编程学习追踪 PWA。

## 你会看到什么
- 今日任务
- 完成/部分完成/未开始
- 学习分钟数、掌握感、学习记录
- 两年日历填色
- 高二上 22 周固定路线
- 高三自动降为维护模式
- 导入 / 导出进度
- 深色 / 浅色模式
- 支持 PWA 安装到主屏幕
- 支持离线缓存

## 最简单的本地预览

电脑安装 Python 后，在这个文件夹运行：

```bash
python -m http.server 8000
```

然后浏览器打开：

```text
http://localhost:8000
```

如果手机和电脑在同一个 Wi‑Fi，可以把 `localhost` 换成电脑局域网 IP，例如：

```text
http://192.168.1.10:8000
```

> 注意：手机上通过局域网 HTTP 可以正常使用大部分功能，但“安装为 PWA / 离线 service worker”通常需要 HTTPS 或 localhost。

## 真正作为手机 App 使用

推荐把这几个静态文件部署到任意 HTTPS 静态托管：
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

部署后直接用手机浏览器打开网站，再选择：
- Android Chrome：菜单 → 添加到主屏幕 / 安装应用
- iPhone Safari：分享 → 添加到主屏幕

## 数据

进度保存在浏览器 `localStorage`，不会上传服务器。
换手机、清理浏览器数据之前，先在“数据”页导出 JSON。

## 计划

- 2026-08-24 开始
- 高二上：Python → 工程基础 → NumPy → ML → PyTorch → MNIST
- 2027 春季：巩固
- 2027 暑假：完整 AI 小项目
- 高三：每周 1 次维护，不开新坑
