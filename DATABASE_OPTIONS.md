# 免费云数据库方案对比

PlanetScale 已取消免费套餐，以下是其他可行的免费方案：

## 🎯 推荐方案

### 方案 1: Railway (推荐 ⭐⭐⭐⭐⭐)
**优点:**
- 免费额度: $5/月使用额度（约 500 小时运行时间）
- 支持 MySQL/PostgreSQL
- 设置超级简单
- 自动备份
- 提供公网访问

**免费额度:**
- 执行时间：500 小时/月
- 1 GB RAM
- 1 GB 存储

**适合:** 个人博客、小型项目

**设置步骤:**
1. 访问 https://railway.app
2. 使用 GitHub 登录
3. 创建新项目 → 选择 "MySQL"
4. 复制连接字符串

---

### 方案 2: Neon (PostgreSQL) ⭐⭐⭐⭐
**优点:**
- 完全免费套餐
- Serverless PostgreSQL
- 自动休眠（节省资源）
- 0.5 GB 存储

**缺点:**
- 需要将 MySQL 改为 PostgreSQL（需要修改 Prisma schema）

**免费额度:**
- 0.5 GB 存储
- 无限 Serverless 计算
- 自动休眠功能

**适合:** 愿意切换到 PostgreSQL 的用户

---

### 方案 3: Supabase (PostgreSQL) ⭐⭐⭐⭐
**优点:**
- 完全免费套餐
- 500 MB 存储
- 提供很多额外功能（认证、存储等）

**缺点:**
- 需要改用 PostgreSQL

**免费额度:**
- 500 MB 数据库
- 无限 API 请求
- 5 GB 带宽

---

### 方案 4: Aiven (MySQL) ⭐⭐⭐
**优点:**
- 支持 MySQL
- 免费试用 30 天，之后 $9/月起

**缺点:**
- 只有试用期免费

---

### 方案 5: 使用本地数据库 + Cloudflare Tunnel (免费) ⭐⭐⭐⭐
**优点:**
- 完全免费
- 使用您现有的本地 MySQL
- 不需要迁移数据
- 通过 Cloudflare 隧道安全暴露到公网

**缺点:**
- 需要本地电脑持续运行
- 电脑关机网站就无法访问
- 不适合生产环境

**适合:** 测试、演示、学习

---

## 🚀 快速推荐

### 如果您想要最简单的方案:
→ **使用 Railway (方案 1)**
  - 5 分钟设置完成
  - 保持 MySQL，不需要修改代码
  - 免费额度足够个人博客使用

### 如果您愿意学习 PostgreSQL:
→ **使用 Neon 或 Supabase (方案 2/3)**
  - 完全免费
  - 更好的性能
  - 需要修改几行 Prisma 代码

### 如果只是临时测试:
→ **使用本地数据库 + Cloudflare Tunnel (方案 5)**
  - 完全免费
  - 不需要迁移数据
  - 电脑开着就能访问

---

## 详细设置指南

### Railway 设置步骤 (最推荐)

#### 1. 创建 Railway 数据库
```bash
# 1. 访问 https://railway.app
# 2. 用 GitHub 登录
# 3. 点击 "New Project" → "Provision MySQL"
# 4. 等待数据库创建完成
```

#### 2. 获取连接字符串
1. 在 Railway 项目中点击 MySQL 服务
2. 切换到 "Variables" 标签
3. 找到 `DATABASE_URL` 变量
4. 复制完整的连接字符串（格式类似）:
   ```
   mysql://root:password@containers-us-west-123.railway.app:7123/railway
   ```

#### 3. 配置 Vercel
1. Vercel 项目 → Settings → Environment Variables
2. 添加 `DATABASE_URL` = Railway 连接字符串
3. 重新部署

#### 4. 迁移数据库
```bash
# 使用 Railway 连接字符串运行迁移
DATABASE_URL="your-railway-url" npx prisma db push

# 导入本地数据（可选）
DATABASE_URL="your-railway-url" npx tsx scripts/seed.ts
```

---

### Cloudflare Tunnel 设置步骤（使用本地数据库）

#### 1. 安装 Cloudflare Tunnel
```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# 或下载: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

#### 2. 登录并创建隧道
```bash
# 登录
cloudflared tunnel login

# 创建隧道
cloudflared tunnel create myblog-db

# 这会生成一个隧道 ID 和配置文件
```

#### 3. 配置隧道
创建文件 `~/.cloudflared/config.yml`:
```yaml
tunnel: your-tunnel-id
credentials-file: /Users/your-user/.cloudflared/your-tunnel-id.json

ingress:
  - hostname: myblog-db.your-domain.com
    service: tcp://localhost:3306
  - service: http_status:404
```

#### 4. 启动隧道
```bash
cloudflared tunnel run myblog-db
```

#### 5. 配置 MySQL 允许远程连接
```sql
-- 登录 MySQL
mysql -u root -p

-- 创建远程用户
CREATE USER 'vercel'@'%' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON myblog.* TO 'vercel'@'%';
FLUSH PRIVILEGES;
```

#### 6. Vercel 配置
```
DATABASE_URL="mysql://vercel:your-password@myblog-db.your-domain.com:3306/myblog"
```

**注意:** 这个方案需要您的电脑持续运行！

---

## 我的建议

对于您的博客项目，我推荐：

1. **短期方案（现在）**: Railway
   - 快速、简单、免费额度足够
   - 5 分钟就能设置完成

2. **长期方案**: 考虑迁移到 Neon (PostgreSQL)
   - 完全免费，没有时间限制
   - 只需要修改几行 Prisma 代码
   - 性能更好

您想尝试哪个方案？我可以立即帮您设置！
