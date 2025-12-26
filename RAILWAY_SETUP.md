# Railway 云数据库设置指南（最简单！）

## 为什么选择 Railway？

❌ **Ngrok TCP 需要信用卡验证**（虽然不收费，但需要卡）
❌ **Cloudflare Tunnel 需要域名**
✅ **Railway 完全免费，不需要信用卡，5分钟搞定！**

---

## Railway 优势

- ✅ **真正免费**: $5/月使用额度（约500小时）
- ✅ **不需要信用卡**: 用 GitHub 登录即可
- ✅ **MySQL 支持**: 原生支持，不需要改代码
- ✅ **自动备份**: 数据安全
- ✅ **电脑可以关机**: 云数据库，24/7 运行
- ✅ **一键迁移**: 可以导入本地数据

---

## 🚀 设置步骤（5分钟）

### 第一步：创建 Railway 账号

1. **访问**: https://railway.app
2. **点击 "Login"**
3. **使用 GitHub 登录**（最快）
4. 授权后自动创建账号

### 第二步：创建 MySQL 数据库

1. 登录后，点击 **"New Project"**
2. 选择 **"Provision MySQL"**
3. 等待几秒钟，数据库创建完成

### 第三步：获取连接信息

1. 点击新创建的 **MySQL 服务**
2. 切换到 **"Variables"** 标签
3. 找到并复制以下变量：
   - `MYSQL_URL` (完整的连接字符串)
   - 或者分别复制：
     - `MYSQLHOST`
     - `MYSQLPORT`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQLDATABASE`

连接字符串格式类似：
```
mysql://root:password@containers-us-west-123.railway.app:7123/railway
```

### 第四步：配置 Vercel

1. 访问 **Vercel Dashboard** → 您的项目
2. **Settings** → **Environment Variables**
3. 添加变量：
   - **Key**: `DATABASE_URL`
   - **Value**: 粘贴 Railway 的 `MYSQL_URL`
   - **Environments**: 勾选 Production, Preview, Development
4. 保存

### 第五步：迁移数据库表结构

在本地终端运行：

```bash
# 1. 临时更新 .env 文件，使用 Railway 连接
# 编辑 .env，将 DATABASE_URL 改为 Railway 的连接字符串

# 2. 运行迁移
npx prisma db push

# 3. 查看数据（可选）
npx prisma studio
```

### 第六步：导入本地数据（可选）

如果您想保留本地数据：

```bash
# 1. 导出本地数据
mysqldump -u root -pljx123456 myblog > backup.sql

# 2. 导入到 Railway
# 从 Railway 变量中获取连接信息
mysql -h RAILWAY_HOST -P RAILWAY_PORT -u RAILWAY_USER -pRAILWAY_PASSWORD RAILWAY_DATABASE < backup.sql
```

或者重新运行种子脚本：
```bash
npx tsx scripts/seed.ts
```

### 第七步：测试

1. **本地测试**:
   ```bash
   # 更新 .env 使用 Railway 连接
   npm run dev
   # 访问 http://localhost:3000
   ```

2. **Vercel 测试**:
   - Deployments → 最新部署 → Redeploy
   - 访问部署的 URL

---

## 💰 费用说明

Railway 免费套餐：
- ✅ $5/月使用额度
- ✅ 约 500 小时运行时间
- ✅ 对个人博客完全足够
- ✅ 超出后会通知，不会自动扣费

实际使用（个人博客）：
- 数据库: ~50-100 小时/月
- 成本: $0-1/月
- 远低于 $5 免费额度

---

## ✨ 为什么这是最佳方案

| 特性 | Ngrok | Cloudflare | Railway |
|------|-------|------------|---------|
| 需要信用卡 | ✅ | ❌ | ❌ |
| 需要域名 | ❌ | ✅ | ❌ |
| 电脑必须开机 | ✅ | ✅ | ❌ |
| 设置难度 | 中 | 难 | 易 |
| 生产环境 | ❌ | ⚠️ | ✅ |
| 推荐度 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 开始设置

准备好了吗？

1. 访问: https://railway.app
2. 用 GitHub 登录
3. 创建 MySQL 数据库
4. 告诉我 "已创建"，我会帮您完成剩余步骤！

整个过程只需要 5 分钟！🚀
