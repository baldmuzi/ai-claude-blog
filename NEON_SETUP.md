# Neon PostgreSQL 设置指南

Neon 是一个完全免费的 Serverless PostgreSQL 数据库，非常适合个人博客项目。

## ✅ 已完成的准备工作

- ✅ Prisma schema 已更新为 PostgreSQL
- ✅ 依赖包已更新 (mysql2 → pg)
- ✅ 代码无需修改，Prisma 会自动处理差异

## 🚀 第一步：创建 Neon 数据库

### 1. 注册 Neon 账号
1. 访问 **https://neon.tech**
2. 点击 "Sign up" 注册账号（推荐使用 GitHub 登录）
3. 免费套餐包括：
   - 0.5 GB 存储
   - 无限 Serverless 计算
   - 自动休眠功能（节省资源）
   - 完全免费，无需信用卡

### 2. 创建项目和数据库
1. 登录后会自动引导创建第一个项目
2. 填写项目信息：
   - **Project name**: `my-blog`（或您喜欢的名字）
   - **Database name**: `myblog`
   - **Region**: 选择 `AWS Asia Pacific (Singapore)` 或 `AWS Asia Pacific (Tokyo)` (最接近中国的节点)
3. 点击 "Create Project"

### 3. 获取数据库连接字符串
创建完成后，您会看到两个连接字符串：

#### Pooled Connection (推荐用于 Vercel)
```
postgres://user:password@ep-xxx.region.aws.neon.tech/myblog?sslmode=require
```

#### Direct Connection (用于迁移和开发)
```
postgres://user:password@ep-xxx.region.aws.neon.tech/myblog?sslmode=require&connect_timeout=10
```

**重要：保存这两个连接字符串！**

---

## 第二步：配置环境变量

### 1. 本地开发环境
编辑本地的 `.env` 文件：

```bash
# Neon Pooled Connection (用于应用连接)
DATABASE_URL="postgres://user:password@ep-xxx.aws.neon.tech/myblog?sslmode=require"

# Neon Direct Connection (用于数据库迁移)
DIRECT_URL="postgres://user:password@ep-xxx.aws.neon.tech/myblog?sslmode=require&connect_timeout=10"
```

### 2. Vercel 生产环境
1. 访问 **Vercel Dashboard** → 您的项目
2. 进入 **Settings** → **Environment Variables**
3. 添加两个环境变量：

   **变量 1:**
   - Key: `DATABASE_URL`
   - Value: Pooled Connection 字符串
   - Environments: 勾选 Production, Preview, Development

   **变量 2:**
   - Key: `DIRECT_URL`
   - Value: Direct Connection 字符串
   - Environments: 勾选 Production, Preview, Development

4. 点击 "Save"

---

## 第三步：运行数据库迁移

### 方法 1: 使用 Prisma Migrate (推荐)

```bash
# 1. 创建初始迁移
npx prisma migrate dev --name init

# 这会：
# - 创建迁移文件
# - 在 Neon 数据库中创建所有表
# - 生成 Prisma Client
```

### 方法 2: 使用 Prisma Push (快速原型)

```bash
# 直接推送 schema 到数据库，不创建迁移文件
npx prisma db push
```

**推荐使用方法 1**，因为它会保留迁移历史。

---

## 第四步：导入初始数据

### 创建种子脚本

创建文件 `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建分类
  const tech = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: {
      name: '技术',
      slug: 'tech',
      description: '技术文章和教程'
    }
  })

  const life = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: {
      name: '生活',
      slug: 'life',
      description: '生活随笔'
    }
  })

  // 创建标签
  const nextjs = await prisma.tag.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: {
      name: 'Next.js',
      slug: 'nextjs'
    }
  })

  const typescript = await prisma.tag.upsert({
    where: { slug: 'typescript' },
    update: {},
    create: {
      name: 'TypeScript',
      slug: 'typescript'
    }
  })

  // 创建示例文章
  const post1 = await prisma.post.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Next.js 入门指南',
      slug: 'getting-started-with-nextjs',
      excerpt: '学习如何使用 Next.js 构建现代化的 Web 应用',
      content: `# Next.js 入门指南

Next.js 是一个基于 React 的全栈框架，提供了服务端渲染、静态网站生成等强大功能。

## 为什么选择 Next.js？

- 零配置
- 自动代码分割
- 优秀的 SEO 支持
- 丰富的生态系统

开始使用 Next.js 非常简单...`,
      published: true,
      categoryId: tech.id,
      tags: {
        connect: [{ id: nextjs.id }, { id: typescript.id }]
      }
    }
  })

  console.log('✅ 数据库种子数据已创建')
  console.log({ tech, life, nextjs, typescript, post1 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 配置 package.json

在 `package.json` 中添加 seed 脚本：

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### 运行种子脚本

```bash
npx prisma db seed
```

---

## 第五步：验证和测试

### 1. 查看数据库
```bash
# 打开 Prisma Studio 查看数据
npx prisma studio
```

### 2. 本地测试
```bash
# 运行开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 3. 部署到 Vercel
```bash
# 提交代码
git add .
git commit -m "feat: 迁移到 Neon PostgreSQL"
git push origin main

# Vercel 会自动检测并部署
```

---

## 第六步：迁移现有 MySQL 数据 (可选)

如果您想迁移本地 MySQL 的数据到 Neon：

### 方法 1: 使用 Prisma

```bash
# 1. 临时将 .env 改回 MySQL
DATABASE_URL="mysql://root:ljx123456@localhost:3306/myblog"

# 2. 导出数据为 JSON
node scripts/export-mysql-data.js

# 3. 改回 Neon PostgreSQL 连接
DATABASE_URL="postgres://..."

# 4. 导入数据
node scripts/import-to-postgres.js
```

### 方法 2: 手动复制

使用 Prisma Studio 从两个数据库复制数据：

```bash
# 终端 1: 打开 MySQL 数据库
DATABASE_URL="mysql://root:ljx123456@localhost:3306/myblog" npx prisma studio

# 终端 2: 打开 Neon 数据库
DATABASE_URL="postgres://..." npx prisma studio

# 手动复制数据
```

---

## Neon 特性和优势

### ✅ 优点
- **完全免费**: 0.5GB 存储，无限计算
- **自动休眠**: 不使用时自动休眠，节省资源
- **分支功能**: 可以创建数据库分支用于测试
- **优秀的性能**: Serverless 架构，按需扩展
- **内置连接池**: 无需额外配置

### ⚠️ 注意事项
- 免费套餐有 0.5GB 存储限制（足够个人博客）
- 数据库会在不活动时休眠（首次访问可能慢 1-2 秒）
- 需要稳定的网络连接到国外服务器

### 💡 最佳实践
1. 使用 Pooled Connection 用于应用连接
2. 使用 Direct Connection 用于迁移
3. 定期备份数据（Neon 提供自动备份）
4. 监控数据库大小

---

## 故障排查

### 问题：连接超时
- 检查连接字符串是否正确
- 确认 `sslmode=require` 参数存在
- 检查网络连接

### 问题：表不存在
- 运行 `npx prisma db push` 或 `npx prisma migrate dev`

### 问题：Vercel 部署失败
- 确认 Vercel 环境变量已正确配置
- 检查 `DATABASE_URL` 和 `DIRECT_URL` 都已设置

---

## 总结

迁移到 Neon 的步骤：
1. ✅ 更新 Prisma schema → PostgreSQL
2. ✅ 更新依赖包 → pg
3. 🔄 创建 Neon 数据库
4. 🔄 配置环境变量
5. 🔄 运行数据库迁移
6. 🔄 导入初始数据
7. 🔄 部署到 Vercel

完成这些步骤后，您的博客就能在 Vercel 上完美运行了！
