# Programming Track Mobile

手机和电脑通用的两年编程学习追踪 PWA。支持本地优先、离线使用和 Supabase 跨设备同步。

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
- 邮箱账号登录与跨设备云同步
- 本地和云端记录按更新时间自动合并

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

## 安装到电脑

用 Chrome 或 Edge 打开 HTTPS 网站，点击地址栏右侧的安装图标。安装后会像普通桌面 App 一样在独立窗口运行；无需额外打包 EXE。

## 开启云端同步

1. 创建一个 Supabase 项目。
2. 打开项目的 SQL Editor，运行 `supabase-schema.sql`。
3. 在 Supabase 的 API 设置中复制 Project URL 和 Publishable key（旧项目也可使用 anon key）。
4. 打开 Programming Track 的“数据”页，在“首次配置云端”中粘贴并保存。
5. 注册账号；如果项目开启了邮箱验证，先点击验证邮件，再回来登录。
6. 在手机和电脑上登录同一个账号，即可自动同步。

不要把 secret key 或 service_role key 填进网页。数据库已通过 Row Level Security 限制每个账号只能访问自己的记录。

## 数据

进度始终先保存在浏览器 `localStorage`。未配置云端时不会上传；登录后会在联网时同步到 Supabase。换手机或清理浏览器数据之前，仍建议导出 JSON 备份。

## 计划

- 2026-08-24 开始
- 高二上：Python → 工程基础 → NumPy → ML → PyTorch → MNIST
- 2027 春季：巩固
- 2027 暑假：完整 AI 小项目
- 高三：每周 1 次维护，不开新坑
