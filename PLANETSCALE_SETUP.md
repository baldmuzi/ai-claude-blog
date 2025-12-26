# PlanetScale 数据库设置指南

本指南将帮助您将博客项目从本地 MySQL 迁移到 PlanetScale 云数据库。

## 第一步：注册并创建 PlanetScale 数据库

### 1. 注册账号
1. 访问 [PlanetScale](https://planetscale.com)
2. 点击 "Sign up" 注册账号（可以使用 GitHub 账号快速登录）
3. 选择免费套餐 (Hobby plan - 免费)

### 2. 创建数据库
1. 登录后，点击 "Create a database"
2. 填写信息：
   - **Database name**: `myblog` (或您喜欢的名字)
   - **Region**: 选择 `AWS - Tokyo (ap-northeast-1)` 或最接近您的地区
3. 点击 "Create database"

## 第二步：获取数据库连接字符串

### 1. 创建密码
1. 在数据库页面，点击 "Connect" 按钮
2. 选择 "Create password"
3. 填写密码名称：`production` (或任意名称)
4. 点击 "Create password"

### 2. 获取连接字符串
1. 在连接页面选择 "Prisma"
2. 复制显示的连接字符串，格式类似：
   ```
   mysql://xxxxxxxx:************@aws.connect.psdb.cloud/myblog?sslaccept=strict
   ```
3. **重要：保存这个连接字符串！** 关闭页面后将无法再看到密码

## 第三步：配置 Vercel 环境变量

### 1. 在 Vercel 中设置环境变量
1. 访问您的 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的博客项目
3. 点击 "Settings" → "Environment Variables"
4. 添加新的环境变量：
   - **Key**: `DATABASE_URL`
   - **Value**: 粘贴刚才复制的 PlanetScale 连接字符串
   - **Environment**: 勾选 `Production`, `Preview`, `Development` (全选)
5. 点击 "Save"

### 2. 重新部署
1. 回到 "Deployments" 标签
2. 点击最新部署右侧的三个点
3. 选择 "Redeploy"

## 第四步：运行数据库迁移

现在需要在 PlanetScale 数据库中创建表结构。

### 方法 1: 使用 Vercel CLI（推荐）

在本地终端运行：

```bash
# 1. 安装 Vercel CLI (如果还没安装)
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接到您的项目
vercel link

# 4. 拉取环境变量（包含 DATABASE_URL）
vercel env pull .env.production

# 5. 使用生产环境的 DATABASE_URL 运行迁移
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db push

# 6. 导入数据（如果需要）
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx tsx scripts/seed.ts
```

### 方法 2: 直接在 Vercel 上运行迁移

如果您不想在本地运行，可以创建一个临时的 API 端点：

1. 创建文件 `app/api/migrate/route.ts`（完成后删除）
2. 访问 `https://your-site.vercel.app/api/migrate` 触发迁移

## 第五步：导入本地数据到 PlanetScale

### 1. 导出本地数据

```bash
# 导出本地 MySQL 数据
mysqldump -u root -pljx123456 myblog > backup.sql
```

### 2. 导入到 PlanetScale

```bash
# 安装 PlanetScale CLI (可选，用于高级操作)
# macOS:
brew install planetscale/tap/pscale

# 或者使用 MySQL 客户端直接导入
mysql --host=aws.connect.psdb.cloud \
  --user=your-username \
  --password=your-password \
  --database=myblog \
  --ssl-mode=VERIFY_IDENTITY \
  --ssl-ca=/etc/ssl/cert.pem \
  < backup.sql
```

### 3. 或者使用 Prisma Studio

```bash
# 1. 临时修改本地 .env 文件的 DATABASE_URL 为 PlanetScale 连接
# 2. 打开 Prisma Studio
npx prisma studio

# 3. 手动复制数据（适合数据量少的情况）
```

## 第六步：验证部署

1. 访问您的 Vercel 部署 URL
2. 检查是否能看到博客文章
3. 尝试发表评论，确认数据库可写

## PlanetScale 与本地 MySQL 的主要区别

1. **不支持外键约束**: PlanetScale 使用无外键架构
   - 我们的 schema 使用了 `@relation` 但没有使用 `onDelete: Restrict`
   - 已有的 `onDelete: Cascade` 需要在应用层面处理

2. **连接字符串格式**: 必须包含 SSL 参数

3. **分支管理**: PlanetScale 支持数据库分支（类似 Git）

## 故障排查

### 问题：连接超时
- 检查 Vercel 环境变量是否正确设置
- 确认 PlanetScale 数据库处于活动状态

### 问题：表不存在
- 运行 `prisma db push` 创建表结构

### 问题：外键错误
- PlanetScale 不支持外键，需要修改 Prisma schema 移除 `relationMode`

## 费用

PlanetScale 免费套餐包括：
- ✅ 1 个数据库
- ✅ 10 GB 存储
- ✅ 1 billion row reads/month
- ✅ 10 million row writes/month

对于个人博客完全足够！

## 其他选择

如果您想尝试其他云数据库：
1. **Railway**: https://railway.app (简单易用，有免费额度)
2. **Supabase**: https://supabase.com (需要改用 PostgreSQL)
3. **Vercel Postgres**: Vercel 官方数据库服务

---

完成以上步骤后，您的博客就能在 Vercel 上正常运行了！
