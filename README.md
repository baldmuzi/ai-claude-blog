# 我的博客 - 个人博客系统

一个功能丰富的个人博客网站，使用 Next.js、React、TypeScript、Prisma 和 MySQL 构建。

## 功能特性

- ✅ 博客文章管理（发布、编辑、查看）
- ✅ 分类系统
- ✅ 标签系统
- ✅ 评论功能
- ✅ 阅读量统计
- ✅ 响应式设计
- ✅ 服务端渲染（SSR）
- ✅ 数据库迁移管理
- ✅ 类型安全（TypeScript）

## 技术栈

- **前端框架**: Next.js 16 + React 19
- **样式**: Tailwind CSS 4
- **数据库**: MySQL 8
- **ORM**: Prisma 5
- **语言**: TypeScript
- **运行时**: Node.js 24

## 项目结构

```
my-blog/
├── app/                      # Next.js App Router 目录
│   ├── api/                 # API 路由
│   │   ├── posts/          # 文章相关API
│   │   ├── categories/     # 分类API
│   │   └── tags/           # 标签API
│   ├── posts/              # 文章详情页
│   │   └── [slug]/         # 动态路由
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── globals.css         # 全局样式
├── lib/                     # 工具库
│   └── prisma.ts           # Prisma客户端实例
├── prisma/                  # Prisma配置
│   ├── schema.prisma       # 数据库模型
│   ├── seed.ts             # 种子数据
│   └── migrations/         # 数据库迁移
├── .env                     # 环境变量
├── package.json            # 项目依赖
└── tsconfig.json           # TypeScript配置
```

## 数据库模型

### Post（文章）
- id: 自增主键
- title: 标题
- slug: URL友好标识符
- content: 文章内容
- excerpt: 摘要
- published: 是否发布
- views: 阅读量
- categoryId: 分类ID
- createdAt/updatedAt: 时间戳

### Category（分类）
- id: 自增主键
- name: 分类名称
- slug: URL标识符
- description: 描述

### Tag（标签）
- id: 自增主键
- name: 标签名称
- slug: URL标识符

### Comment（评论）
- id: 自增主键
- content: 评论内容
- author: 作者昵称
- email: 邮箱
- postId: 所属文章ID
- createdAt: 创建时间

## 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/my-blog.git
   cd my-blog
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置数据库**

   复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

   编辑 `.env` 文件，配置数据库连接：
   ```env
   DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"
   ```

4. **初始化数据库**
   ```bash
   # 创建数据库表
   npx prisma db push

   # 填充示例数据（可选）
   npx tsx prisma/seed.ts
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**

   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 可用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行代码检查

# 数据库
npx prisma studio    # 打开数据库可视化管理界面
npx prisma db push   # 同步数据库结构
npx tsx prisma/seed.ts  # 填充示例数据
```

## 部署

### Vercel（推荐）

本项目可以免费部署到 Vercel，并获得全球 CDN 加速：

1. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/my-blog.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com) 并用 GitHub 登录
   - 导入你的 `my-blog` 仓库
   - 配置环境变量 `DATABASE_URL`（使用云数据库如 PlanetScale 或 Railway）
   - 点击 "Deploy"

3. **初始化云数据库**
   ```bash
   # 本地连接云数据库并初始化
   DATABASE_URL="云数据库URL" npx prisma db push
   DATABASE_URL="云数据库URL" npx tsx prisma/seed.ts
   ```

完整的部署教程（包括免费云数据库配置）请查看 [PROJECT_GUIDE.md](./PROJECT_GUIDE.md#github-上传和部署)

### 其他平台

- **Netlify**: 支持 Next.js，配置类似 Vercel
- **Railway**: 可同时部署应用和数据库
- **自建服务器**: 使用 `npm run build && npm start`

## API 端点

- `GET /api/posts` - 获取文章列表（支持分页、分类、标签筛选）
- `GET /api/posts/[slug]` - 获取文章详情
- `POST /api/posts/[slug]/comments` - 创建评论
- `GET /api/categories` - 获取所有分类
- `GET /api/tags` - 获取所有标签

## 环境变量

```env
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"
```

## 功能说明

### 首页
- 显示最新发布的博客文章列表
- 侧边栏显示分类和热门标签
- 支持按分类和标签筛选
- 显示阅读量和评论数

### 文章详情页
- 完整的文章内容展示
- Markdown 格式渲染
- 自动增加阅读量
- 评论系统
- 相关标签展示

### 评论系统
- 实时发表评论
- 显示评论者昵称和时间
- 表单验证

## 未来扩展建议

- 添加管理后台
- 实现用户认证
- 添加文章搜索功能
- 支持 Markdown 编辑器
- 添加文章点赞功能
- RSS 订阅
- 深色模式切换
- 图片上传功能
- SEO 优化

## 文档

- 📖 [完整项目文档](./PROJECT_GUIDE.md) - 包含技术详解、架构说明、部署教程
- 🔧 [环境变量模板](./.env.example) - 数据库配置示例
- 📊 [数据库模型](./prisma/schema.prisma) - Prisma 数据模型定义

## 技术要点

- **服务端渲染（SSR）**: 使用 Next.js App Router 实现
- **类型安全**: 全栈 TypeScript + Prisma 类型生成
- **响应式设计**: Tailwind CSS 工具类
- **数据库 ORM**: Prisma 提供类型安全的查询
- **动态路由**: Next.js 文件系统路由

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
