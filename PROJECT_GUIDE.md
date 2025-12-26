# 个人博客系统完整说明文档

> 🎯 本文档面向前端小白，用最通俗易懂的语言解释整个项目的方方面面

---

## 📚 目录

1. [项目概览](#项目概览)
2. [技术栈详解](#技术栈详解)
3. [项目结构](#项目结构)
4. [数据库详解](#数据库详解)
5. [核心功能实现](#核心功能实现)
6. [数据流转过程](#数据流转过程)
7. [关键文件解析](#关键文件解析)
8. [常用命令](#常用命令)
9. [如何扩展](#如何扩展)
10. [常见问题](#常见问题)
11. [GitHub 上传和部署](#github-上传和部署)

---

## 项目概览

### 这是一个什么项目？

这是一个**功能完整的个人博客网站**，包含：
- ✅ 文章发布和浏览
- ✅ 分类和标签系统
- ✅ 评论功能
- ✅ 阅读量统计
- ✅ 响应式设计（手机、平板、电脑都能完美显示）

### 项目架构

```
┌─────────────────────────────────────────────┐
│          前端（用户看到的界面）              │
│  • 博客首页（文章列表）                      │
│  • 文章详情页（完整内容 + 评论）             │
│  • 分类筛选                                  │
│  • 标签筛选                                  │
└────────────────┬────────────────────────────┘
                 │ HTTP 请求/响应
┌────────────────┴────────────────────────────┐
│        后端（处理业务逻辑）                  │
│  • API 路由（接收请求，返回数据）            │
│  • 服务端渲染（生成 HTML）                   │
│  • Prisma ORM（翻译代码为SQL）               │
└────────────────┬────────────────────────────┘
                 │ SQL 查询
┌────────────────┴────────────────────────────┐
│         数据库（存储所有数据）               │
│  • posts 表：文章内容                        │
│  • categories 表：分类信息                   │
│  • tags 表：标签信息                         │
│  • comments 表：用户评论                     │
└─────────────────────────────────────────────┘
```

---

## 技术栈详解

### 1. Next.js 16 - 全栈框架

**是什么？**
- 基于 React 的全栈框架
- 可以同时写前端和后端代码

**为什么用它？**
- ✅ 自动路由（文件即路由）
- ✅ 服务端渲染（SEO 友好）
- ✅ 内置 API 路由（不需要单独的后端服务器）
- ✅ 热更新（改代码立即生效）

**在项目中的作用：**
```
app/page.tsx          → 首页路由 (/)
app/posts/[slug]/page.tsx → 文章详情路由 (/posts/xxx)
app/api/posts/route.ts    → API 路由 (/api/posts)
```

---

### 2. React 19 - UI 库

**是什么？**
- Facebook 开发的前端 UI 库
- 用"组件"的方式构建界面

**核心概念：**

#### 组件（Component）
```typescript
// 一个评论表单组件
function CommentForm() {
  return (
    <form>
      <input placeholder="你的名字" />
      <textarea placeholder="评论内容" />
      <button>提交</button>
    </form>
  )
}
```

#### 状态（State）
```typescript
// 存储用户输入的数据
const [name, setName] = useState('')

// 当用户输入时更新状态
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

#### Props（属性）
```typescript
// 父组件传数据给子组件
<CommentForm postId={123} />
```

---

### 3. TypeScript - 类型安全的 JavaScript

**是什么？**
- JavaScript 的超集，增加了类型检查

**为什么用它？**

❌ **JavaScript（容易出错）：**
```javascript
function add(a, b) {
  return a + b
}
add("5", 3)  // 结果是 "53"，不是 8！
```

✅ **TypeScript（提前发现错误）：**
```typescript
function add(a: number, b: number): number {
  return a + b
}
add("5", 3)  // ❌ 编辑器直接报错：类型不匹配！
```

**在项目中：**
```typescript
// 定义文章的数据结构
interface Post {
  id: number
  title: string
  content: string
  published: boolean
  createdAt: Date
}

// 使用时必须符合结构
const post: Post = {
  id: 1,
  title: "我的文章",
  content: "内容...",
  published: true,
  createdAt: new Date()
}
```

---

### 4. Prisma 5 - 数据库工具（ORM）

**是什么？**
- Object-Relational Mapping（对象关系映射）
- 用 TypeScript 代码操作数据库，不用写 SQL

**对比：**

❌ **传统方式（写 SQL）：**
```javascript
const result = await db.query(`
  SELECT * FROM posts
  WHERE published = true
  ORDER BY createdAt DESC
`)
```

✅ **Prisma 方式（写代码）：**
```typescript
const posts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' }
})
```

**核心文件：**

#### `prisma/schema.prisma` - 数据库结构定义
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

这个文件定义了数据库有哪些表、每个表有哪些字段。

#### `lib/prisma.ts` - 数据库连接
```typescript
import { PrismaClient } from '@prisma/client'

// 创建数据库连接实例
export const prisma = new PrismaClient()

// 在其他文件中使用：
import { prisma } from '@/lib/prisma'
const posts = await prisma.post.findMany()
```

---

### 5. MySQL 8 - 数据库

**是什么？**
- 关系型数据库（就像 Excel 表格，但更强大）

**数据库连接信息：**
```
主机：localhost（本地电脑）
端口：3306（MySQL 默认端口）
用户：root
密码：ljx123456
数据库名：myblog
```

**连接字符串（在 .env 文件中）：**
```
DATABASE_URL="mysql://root:ljx123456@localhost:3306/myblog"
```

---

### 6. Tailwind CSS 4 - 样式框架

**是什么？**
- 实用优先的 CSS 框架
- 用类名快速写样式

**传统方式 vs Tailwind：**

❌ **传统 CSS：**
```css
/* style.css */
.button {
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
```
```html
<button class="button">点击</button>
```

✅ **Tailwind CSS：**
```html
<button class="bg-blue-600 text-white px-4 py-2 rounded">
  点击
</button>
```

**常用类名：**
```
bg-blue-600     → 背景色蓝色
text-white      → 文字白色
px-4            → 左右内边距 1rem
py-2            → 上下内边距 0.5rem
rounded         → 圆角
hover:bg-blue-700 → 鼠标悬停时背景变深
```

---

## 项目结构

### 完整目录树

```
my-blog/
├── app/                        # Next.js App Router 目录
│   ├── layout.tsx             # 全局布局（HTML 结构）
│   ├── page.tsx               # 首页（博客列表）
│   ├── globals.css            # 全局样式
│   │
│   ├── posts/                 # 文章相关页面
│   │   └── [slug]/            # 动态路由（文章详情）
│   │       ├── page.tsx       # 文章详情页
│   │       ├── Comments.tsx   # 评论列表组件
│   │       └── CommentForm.tsx # 评论表单组件
│   │
│   └── api/                   # 后端 API 接口
│       ├── posts/             # 文章 API
│       │   ├── route.ts       # GET /api/posts
│       │   └── [slug]/        # 单篇文章 API
│       │       ├── route.ts   # GET /api/posts/:slug
│       │       └── comments/  # 评论 API
│       │           └── route.ts # POST /api/posts/:slug/comments
│       ├── categories/        # 分类 API
│       │   └── route.ts       # GET /api/categories
│       └── tags/              # 标签 API
│           └── route.ts       # GET /api/tags
│
├── lib/                       # 工具库
│   └── prisma.ts             # Prisma 数据库连接实例
│
├── prisma/                    # Prisma 相关文件
│   ├── schema.prisma         # 数据库模型定义
│   ├── seed.ts               # 种子数据（示例数据）
│   └── migrations/           # 数据库迁移记录
│       └── 20251226035504_init/
│           └── migration.sql # 创建表的 SQL 语句
│
├── node_modules/              # 依赖包（自动生成）
│
├── .env                       # 环境变量（数据库密码等）
├── .gitignore                # Git 忽略文件
├── next.config.js            # Next.js 配置
├── package.json              # 项目依赖和脚本
├── postcss.config.js         # PostCSS 配置
├── tailwind.config.ts        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 项目说明
```

---

## 数据库详解

### 数据库表结构

#### 1. Post 表（文章）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键，自动递增 | 1, 2, 3... |
| title | String | 文章标题 | "开始使用 Next.js" |
| slug | String | URL 友好的标识符（唯一） | "getting-started-with-nextjs" |
| content | Text | 文章完整内容 | "# 标题\n内容..." |
| excerpt | String | 文章摘要 | "Next.js 是一个强大的框架..." |
| coverImage | String? | 封面图片 URL（可选） | "/images/cover.jpg" |
| published | Boolean | 是否发布 | true / false |
| views | Int | 阅读量 | 0, 100, 500... |
| createdAt | DateTime | 创建时间 | 2025-12-26 10:30:00 |
| updatedAt | DateTime | 更新时间 | 2025-12-26 11:45:00 |
| categoryId | Int? | 所属分类 ID（可选） | 1, 2, null |

**关系：**
- 一篇文章属于一个分类（多对一）
- 一篇文章可以有多个标签（多对多）
- 一篇文章可以有多条评论（一对多）

---

#### 2. Category 表（分类）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键 | 1, 2, 3... |
| name | String | 分类名称（唯一） | "技术分享", "生活随笔" |
| slug | String | URL 标识符（唯一） | "tech", "life" |
| description | String? | 分类描述（可选） | "分享各种技术文章" |
| createdAt | DateTime | 创建时间 | 2025-12-26 10:00:00 |

**示例数据：**
```
id: 1, name: "技术分享", slug: "tech"
id: 2, name: "生活随笔", slug: "life"
```

---

#### 3. Tag 表（标签）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键 | 1, 2, 3... |
| name | String | 标签名称（唯一） | "JavaScript", "React" |
| slug | String | URL 标识符（唯一） | "javascript", "react" |
| createdAt | DateTime | 创建时间 | 2025-12-26 10:00:00 |

**示例数据：**
```
id: 1, name: "JavaScript", slug: "javascript"
id: 2, name: "React", slug: "react"
id: 3, name: "Next.js", slug: "nextjs"
```

---

#### 4. Comment 表（评论）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | Int | 主键 | 1, 2, 3... |
| content | Text | 评论内容 | "写得很好！" |
| author | String | 评论者昵称 | "张三" |
| email | String | 评论者邮箱 | "zhangsan@example.com" |
| postId | Int | 所属文章 ID | 1, 2, 3... |
| createdAt | DateTime | 创建时间 | 2025-12-26 15:30:00 |

**关系：**
- 每条评论属于一篇文章（多对一）
- 删除文章时，自动删除所有评论（级联删除）

---

### 表关系图

```
Category (分类)
    │
    │ 一对多
    ↓
Post (文章) ←──────┐
    │              │
    │ 一对多       │ 多对多
    ↓              │
Comment (评论)    Tag (标签)
```

### 数据库连接流程

```
1. 应用启动
   ↓
2. 加载 .env 文件，读取 DATABASE_URL
   ↓
3. lib/prisma.ts 创建 PrismaClient 实例
   ↓
4. 连接到 MySQL 数据库（localhost:3306/myblog）
   ↓
5. 应用可以执行数据库操作
```

---

## 核心功能实现

### 功能 1：首页文章列表

**文件：** `app/page.tsx`

**流程：**
```
1. 用户访问 http://localhost:3000
   ↓
2. Next.js 执行 app/page.tsx
   ↓
3. 从数据库查询已发布的文章：
   const posts = await prisma.post.findMany({
     where: { published: true },
     orderBy: { createdAt: 'desc' }
   })
   ↓
4. 渲染 HTML 并返回给浏览器
   ↓
5. 用户看到文章列表
```

**关键代码：**
```typescript
export default async function Home() {
  // 服务器端代码：查询数据库
  const posts = await prisma.post.findMany({
    where: { published: true },  // 只查已发布的
    include: {
      category: true,  // 包含分类信息
      tags: true,      // 包含标签信息
      _count: {
        select: { comments: true }  // 统计评论数
      }
    },
    orderBy: { createdAt: 'desc' },  // 按时间倒序
    take: 10  // 最多 10 篇
  })

  // 渲染 HTML
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

---

### 功能 2：文章详情页

**文件：** `app/posts/[slug]/page.tsx`

**动态路由：**
```
URL: /posts/getting-started-with-nextjs
     ↓
Next.js 自动提取: slug = "getting-started-with-nextjs"
     ↓
根据 slug 查询文章
```

**关键代码：**
```typescript
export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  // 获取 URL 参数
  const { slug } = await params

  // 根据 slug 查询文章
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
      comments: { orderBy: { createdAt: 'desc' } }
    }
  })

  // 增加阅读量
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  return <article>{post.content}</article>
}
```

---

### 功能 3：分类和标签筛选

**URL 查询参数：**
```
/?category=tech     → 筛选"技术分享"分类
/?tag=react         → 筛选"React"标签
```

**实现：**
```typescript
export default async function Home({ searchParams }) {
  const params = await searchParams
  const { category, tag } = params

  // 构建查询条件
  const where: any = { published: true }

  if (category) {
    where.category = { slug: category }
  }

  if (tag) {
    where.tags = { some: { slug: tag } }
  }

  // 执行查询
  const posts = await prisma.post.findMany({ where })
}
```

---

### 功能 4：评论系统

#### 前端：评论表单

**文件：** `app/posts/[slug]/CommentForm.tsx`

```typescript
'use client'  // 客户端组件（可交互）

export default function CommentForm({ slug }) {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 发送 POST 请求到后端
    const response = await fetch(`/api/posts/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (response.ok) {
      alert('评论发表成功！')
      // 清空表单
      setFormData({ author: '', email: '', content: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.author}
        onChange={e => setFormData({...formData, author: e.target.value})}
        placeholder="你的名字"
      />
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData({...formData, email: e.target.value})}
        placeholder="你的邮箱"
      />
      <textarea
        value={formData.content}
        onChange={e => setFormData({...formData, content: e.target.value})}
        placeholder="评论内容"
      />
      <button type="submit">发表评论</button>
    </form>
  )
}
```

#### 后端：API 处理

**文件：** `app/api/posts/[slug]/comments/route.ts`

```typescript
export async function POST(request, { params }) {
  // 1. 解析请求数据
  const { slug } = await params
  const { author, email, content } = await request.json()

  // 2. 验证数据
  if (!author || !email || !content) {
    return NextResponse.json(
      { error: '请填写所有字段' },
      { status: 400 }
    )
  }

  // 3. 查找文章
  const post = await prisma.post.findUnique({
    where: { slug }
  })

  if (!post) {
    return NextResponse.json(
      { error: '文章未找到' },
      { status: 404 }
    )
  }

  // 4. 创建评论
  const comment = await prisma.comment.create({
    data: {
      author,
      email,
      content,
      postId: post.id
    }
  })

  // 5. 返回结果
  return NextResponse.json(comment, { status: 201 })
}
```

---

## 数据流转过程

### 场景 1：用户访问首页

```
┌──────────────────────────────────────────────┐
│ 1. 用户在浏览器输入 http://localhost:3000  │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 2. 浏览器发送 HTTP GET 请求到服务器         │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 3. Next.js 收到请求，执行 app/page.tsx      │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 4. 执行服务器端代码：                        │
│    const posts = await prisma.post.findMany()│
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 5. Prisma 将代码翻译成 SQL：                 │
│    SELECT * FROM Post WHERE published = 1    │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 6. MySQL 执行 SQL，返回数据                  │
│    [{id:1, title:"...", ...}, ...]           │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 7. React 将数据渲染成 HTML                   │
│    <article><h2>标题</h2>...</article>       │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 8. Next.js 返回完整的 HTML 给浏览器          │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 9. 浏览器渲染页面，用户看到博客首页          │
└──────────────────────────────────────────────┘
```

---

### 场景 2：用户发表评论

```
┌──────────────────────────────────────────────┐
│ 1. 用户填写评论表单                          │
│    昵称：张三                                 │
│    邮箱：zhangsan@example.com                │
│    内容：写得很好！                           │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 2. 点击"发表评论"按钮                        │
│    触发 handleSubmit 函数                    │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 3. 前端发送 POST 请求：                       │
│    fetch('/api/posts/xxx/comments', {        │
│      method: 'POST',                         │
│      body: JSON.stringify({                  │
│        author: '张三',                        │
│        email: 'zhangsan@example.com',        │
│        content: '写得很好！'                  │
│      })                                      │
│    })                                        │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 4. 请求到达后端 API：                         │
│    app/api/posts/[slug]/comments/route.ts    │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 5. 后端验证数据                               │
│    - 检查是否有空字段                         │
│    - 验证邮箱格式                             │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 6. 后端查找文章：                             │
│    const post = await prisma.post.findUnique()│
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 7. 后端创建评论：                             │
│    await prisma.comment.create({             │
│      data: { author, email, content, postId }│
│    })                                        │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 8. Prisma 执行 SQL：                          │
│    INSERT INTO Comment                       │
│    (author, email, content, postId)          │
│    VALUES ('张三', 'zhangsan@...', ...)      │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 9. MySQL 保存数据，返回新创建的评论记录      │
│    { id: 5, author: '张三', ... }            │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 10. 后端返回 JSON 响应：                      │
│     { id: 5, author: '张三', ... }           │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 11. 前端收到响应                              │
│     - 显示成功提示                            │
│     - 清空表单                                │
│     - 刷新评论列表                            │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│ 12. 用户看到自己的评论出现在页面上           │
└──────────────────────────────────────────────┘
```

---

## 关键文件解析

### 1. `.env` - 环境变量

**作用：** 存储敏感信息（如数据库密码）

```env
DATABASE_URL="mysql://root:ljx123456@localhost:3306/myblog"
```

**格式解析：**
```
mysql://     → 数据库类型
root         → 用户名
ljx123456    → 密码
localhost    → 主机地址
3306         → 端口号
myblog       → 数据库名
```

⚠️ **注意：** 这个文件不要提交到 Git（已在 .gitignore 中排除）

---

### 2. `package.json` - 项目配置

**作用：** 定义项目依赖和脚本命令

```json
{
  "name": "my-blog",
  "scripts": {
    "dev": "next dev",      // 启动开发服务器
    "build": "next build",  // 构建生产版本
    "start": "next start"   // 启动生产服务器
  },
  "dependencies": {         // 生产依赖
    "next": "^16.1.1",
    "react": "^19.2.3",
    "@prisma/client": "^5.22.0",
    "mysql2": "^3.16.0"
  },
  "devDependencies": {      // 开发依赖
    "typescript": "^5.9.3",
    "prisma": "^5.22.0",
    "tailwindcss": "^4.1.18"
  }
}
```

---

### 3. `prisma/schema.prisma` - 数据库模型

**作用：** 定义数据库表结构

```prisma
// 数据库连接配置
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Prisma 客户端生成配置
generator client {
  provider = "prisma-client-js"
}

// 定义 Post 表
model Post {
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(255)
  slug        String    @unique @db.VarChar(255)
  content     String    @db.Text
  published   Boolean   @default(false)
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // 关系
  categoryId  Int?
  category    Category? @relation(fields: [categoryId], references: [id])
  tags        Tag[]     @relation("PostTags")
  comments    Comment[]
}

// 定义 Category 表
model Category {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  slug        String   @unique
  posts       Post[]
}

// 定义 Tag 表
model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  slug  String @unique
  posts Post[] @relation("PostTags")
}

// 定义 Comment 表
model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  author    String
  email     String
  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

**字段修饰符：**
- `@id` - 主键
- `@default(autoincrement())` - 自动递增
- `@unique` - 唯一约束
- `@default(now())` - 默认值为当前时间
- `@updatedAt` - 自动更新时间
- `?` - 可选字段（可以为 null）

---

### 4. `app/layout.tsx` - 全局布局

**作用：** 定义所有页面共享的 HTML 结构

```typescript
import './globals.css'

export const metadata = {
  title: '我的博客',
  description: '分享技术与生活'
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {/* children 是每个页面的内容 */}
        {children}
      </body>
    </html>
  )
}
```

---

### 5. `app/globals.css` - 全局样式

**作用：** 引入 Tailwind CSS 和自定义样式

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
```

---

### 6. `lib/prisma.ts` - 数据库连接实例

**作用：** 创建和导出 Prisma 客户端

```typescript
import { PrismaClient } from '@prisma/client'

// 全局变量，避免热更新时重复创建连接
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 单例模式：整个应用只有一个 Prisma 实例
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**为什么这样写？**
- 开发环境会频繁热更新
- 每次更新都创建新连接会耗尽数据库连接池
- 用全局变量缓存连接实例

---

## 常用命令

### 开发命令

```bash
# 启动开发服务器（支持热更新）
npm run dev
# 访问: http://localhost:3000

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 数据库命令

```bash
# 打开数据库可视化工具
npx prisma studio
# 访问: http://localhost:5555

# 创建数据库迁移（修改表结构后）
npx prisma migrate dev --name 描述

# 重新生成 Prisma 客户端
npx prisma generate

# 查看数据库状态
npx prisma migrate status

# 填充示例数据
npx tsx prisma/seed.ts
```

### Git 命令

```bash
# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "提交说明"

# 查看状态
git status

# 查看提交历史
git log
```

---

## 如何扩展

### 扩展 1：添加点赞功能

#### 1. 修改数据库模型

```prisma
// prisma/schema.prisma
model Post {
  // ...现有字段
  likes Int @default(0)  // 新增：点赞数
}
```

#### 2. 运行迁移

```bash
npx prisma migrate dev --name add_likes
```

#### 3. 创建点赞 API

```typescript
// app/api/posts/[slug]/like/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  const { slug } = await params

  // 增加点赞数
  const post = await prisma.post.update({
    where: { slug },
    data: { likes: { increment: 1 } }
  })

  return NextResponse.json({ likes: post.likes })
}
```

#### 4. 前端按钮

```typescript
// app/posts/[slug]/page.tsx
<button
  onClick={async () => {
    await fetch(`/api/posts/${slug}/like`, { method: 'POST' })
    // 刷新页面或更新状态
  }}
>
  ❤️ 点赞 ({post.likes})
</button>
```

---

### 扩展 2：添加搜索功能

#### 1. 创建搜索 API

```typescript
// app/api/search/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } }
      ]
    }
  })

  return NextResponse.json(posts)
}
```

#### 2. 前端搜索框

```typescript
// app/components/SearchBox.tsx
'use client'
import { useState } from 'react'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    const response = await fetch(`/api/search?q=${query}`)
    const data = await response.json()
    setResults(data)
  }

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="搜索文章..."
      />
      <button onClick={handleSearch}>搜索</button>

      {results.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

---

### 扩展 3：添加用户认证

可以使用 **NextAuth.js**：

```bash
npm install next-auth
```

配置登录（Google、GitHub 等）：

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

## 常见问题

### Q1: 修改代码后页面没有更新？

**解决：**
- 检查开发服务器是否在运行（`npm run dev`）
- 刷新浏览器（Cmd/Ctrl + R）
- 如果还是不行，重启开发服务器

---

### Q2: 数据库连接失败？

**检查：**
```bash
# 1. MySQL 是否运行？
mysql.server status

# 2. 如果没运行，启动它
mysql.server start

# 3. 测试连接
mysql -u root -pljx123456 -e "SHOW DATABASES;"

# 4. 检查 .env 文件中的密码是否正确
```

---

### Q3: 修改数据库模型后如何更新？

**步骤：**
```bash
# 1. 修改 prisma/schema.prisma

# 2. 创建并应用迁移
npx prisma migrate dev --name 描述

# 3. 重新生成 Prisma 客户端
npx prisma generate
```

---

### Q4: 如何查看数据库中的数据？

**三种方式：**

1. **Prisma Studio**（最简单）
   ```bash
   npx prisma studio
   # 打开 http://localhost:5555
   ```

2. **MySQL Workbench**
   - 连接信息：localhost:3306, root, ljx123456
   - 数据库：myblog

3. **命令行**
   ```bash
   mysql -u root -pljx123456 myblog
   SELECT * FROM Post;
   ```

---

### Q5: 如何部署到线上？

**推荐使用 Vercel（免费）：**

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 配置环境变量（在 Vercel 网站）
# DATABASE_URL=你的云数据库地址
```

**注意：** 需要将数据库也迁移到云端（如 PlanetScale、Railway）

---

### Q6: 为什么有些文件看不到？

**隐藏文件：**
- `.env` - 环境变量
- `.gitignore` - Git 忽略规则
- `.next/` - Next.js 构建文件（自动生成）
- `node_modules/` - 依赖包（自动生成）

**显示隐藏文件：**
- macOS: `Cmd + Shift + .`
- VS Code: 默认显示

---

### Q7: npm install 很慢怎么办？

**使用国内镜像：**
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm
cnpm install
```

---

### Q8: TypeScript 报错怎么办？

**常见错误：**

1. **类型不匹配**
   ```typescript
   // ❌ 错误
   const age: number = "25"

   // ✅ 正确
   const age: number = 25
   ```

2. **属性不存在**
   ```typescript
   // ❌ 错误
   post.titlee  // 拼写错误

   // ✅ 正确
   post.title
   ```

3. **可选链**
   ```typescript
   // ❌ 可能报错
   post.category.name  // category 可能是 null

   // ✅ 安全
   post.category?.name  // 使用可选链
   ```

---

### Q9: 如何添加新页面？

**步骤：**
```bash
# 1. 在 app 目录下创建新文件
# app/about/page.tsx

# 2. 编写页面内容
export default function AboutPage() {
  return <div>关于我们</div>
}

# 3. 访问 http://localhost:3000/about
```

---

### Q10: 如何备份数据？

**方法 1：导出 SQL**
```bash
mysqldump -u root -pljx123456 myblog > backup.sql
```

**方法 2：Prisma Studio**
- 打开 Prisma Studio
- 选择表 → 导出为 CSV

**恢复备份：**
```bash
mysql -u root -pljx123456 myblog < backup.sql
```

---

## 学习资源

### 官方文档

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **Prisma**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### 推荐教程

- Next.js 中文文档: https://www.nextjs.cn/
- Prisma 中文教程: https://prisma.yoga/
- React 中文文档: https://zh-hans.react.dev/

---

## 项目总结

### 已实现的功能

✅ 完整的博客系统
- 文章发布和浏览
- 分类和标签管理
- 评论功能
- 阅读量统计
- 筛选和排序

✅ 现代化技术栈
- Next.js 16 App Router
- React 19 服务端组件
- TypeScript 类型安全
- Prisma ORM
- Tailwind CSS

✅ 响应式设计
- 适配手机、平板、电脑
- 流畅的用户体验

### 技术亮点

🌟 **服务端渲染** - SEO 友好，首屏加载快
🌟 **类型安全** - TypeScript 减少 bug
🌟 **开发体验** - 热更新，实时预览
🌟 **数据库管理** - Prisma 简化操作
🌟 **可扩展** - 易于添加新功能

### 适合谁学习？

👨‍💻 前端开发者 - 学习全栈开发
👩‍🎓 计算机学生 - 课程项目参考
🚀 创业者 - 快速搭建产品原型
📝 博主 - 建立个人网站

---

## 下一步建议

### 功能扩展

1. 添加用户系统（注册、登录）
2. 实现文章编辑器（Markdown）
3. 添加图片上传
4. 实现文章草稿功能
5. 添加文章点赞
6. 实现评论回复
7. 添加文章搜索
8. 实现 RSS 订阅

### 性能优化

1. 添加缓存（Redis）
2. 图片优化（Next/Image）
3. 代码分割优化
4. 数据库查询优化
5. CDN 加速

### 安全加固

1. 添加 CSRF 保护
2. 实现评论审核
3. 防止 SQL 注入
4. XSS 过滤
5. 访问限流

---

## GitHub 上传和部署

### 第一步：准备项目上传到 GitHub

#### 1. 检查已完成的准备工作

✅ 项目已包含 `.gitignore` 文件（防止上传敏感信息）
✅ 已创建 `.env.example` 文件（模板示例）
✅ 真实的 `.env` 文件会被自动忽略（不会上传到 GitHub）

#### 2. 初始化 Git 仓库

打开终端，在项目目录执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 创建第一次提交
git commit -m "Initial commit: 个人博客系统"
```

#### 3. 在 GitHub 上创建仓库

1. 访问 [github.com](https://github.com)，登录你的账号
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `my-blog`（或你喜欢的名字）
   - **Description**: "基于 Next.js + MySQL 的个人博客系统"
   - **Public** 或 **Private**：选择 Public（公开）
   - ❌ **不要勾选** "Add a README file"（我们已经有代码了）
4. 点击 "Create repository"

#### 4. 将本地代码推送到 GitHub

GitHub 会显示命令，复制执行：

```bash
# 添加远程仓库地址（替换成你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/my-blog.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

完成后，刷新 GitHub 页面，就能看到你的代码了！

---

### 第二步：免费部署到 Vercel（让全世界都能访问）

#### 为什么选择 Vercel？

- ✅ **完全免费**（个人项目）
- ✅ **自动 HTTPS**（安全链接）
- ✅ **全球 CDN**（访问速度快）
- ✅ **自动部署**（推送代码自动更新）
- ✅ **Next.js 原生支持**（Vercel 是 Next.js 的母公司）

#### 部署步骤

##### 1. 注册 Vercel 账号

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"（用 GitHub 账号登录最方便）

##### 2. 导入 GitHub 项目

1. 登录后，点击 "Add New..." → "Project"
2. 找到你的 `my-blog` 仓库
3. 点击 "Import"

##### 3. 配置项目

Vercel 会自动检测到这是 Next.js 项目，大部分配置无需修改：

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: ./（默认）
- **Build Command**: `npm run build`（自动填写）
- **Output Directory**: .next（自动填写）

##### 4. 配置环境变量（重要！）

在 "Environment Variables" 部分，点击展开：

由于 Vercel 无法使用本地 MySQL，我们需要使用云数据库。有两个选择：

**选项 A：使用 PlanetScale（推荐，免费）**

1. 访问 [planetscale.com](https://planetscale.com)，用 GitHub 账号注册
2. 创建新数据库：
   - Database name: `myblog`
   - Region: 选择离你最近的（如 AWS ap-northeast-1 Tokyo）
3. 创建后，点击 "Connect" → "Prisma"
4. 复制 `DATABASE_URL`
5. 回到 Vercel，添加环境变量：
   ```
   Name: DATABASE_URL
   Value: mysql://xxxxxxx（粘贴 PlanetScale 的连接字符串）
   ```

**选项 B：使用 Railway（免费额度）**

1. 访问 [railway.app](https://railway.app)，用 GitHub 账号注册
2. 创建新项目 → "Provision MySQL"
3. 创建后，点击 MySQL → "Connect" → 复制 `DATABASE_URL`
4. 回到 Vercel，添加环境变量：
   ```
   Name: DATABASE_URL
   Value: mysql://xxxxxxx（粘贴 Railway 的连接字符串）
   ```

**选项 C：使用 SQLite（最简单，但有限制）**

如果暂时不想配置云数据库，可以先用 SQLite：

1. 在 Vercel 环境变量中添加：
   ```
   Name: DATABASE_URL
   Value: file:./dev.db
   ```
2. 修改 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "sqlite"  // 改为 sqlite
     url      = env("DATABASE_URL")
   }
   ```
3. **注意**：SQLite 在 Vercel 上每次部署都会重置数据，仅适合测试！

##### 5. 部署项目

1. 点击 "Deploy" 按钮
2. 等待 2-3 分钟，Vercel 会：
   - 安装依赖 (`npm install`)
   - 运行 Prisma 生成 (`npx prisma generate`)
   - 构建项目 (`npm run build`)
   - 部署到全球 CDN

##### 6. 初始化数据库

部署成功后，需要初始化数据库：

1. 在 Vercel 项目页面，点击 "Settings" → "Environment Variables"
2. 确认 `DATABASE_URL` 已配置
3. 点击 "Deployments" → 最新的部署 → "..." → "Redeploy"
4. 勾选 "Use existing build cache"
5. 点击 "Redeploy"

如果使用 PlanetScale 或 Railway，需要手动执行数据库迁移：

**方法 1：本地执行（推荐）**

```bash
# 在本地项目目录，临时修改 .env
DATABASE_URL="mysql://xxxxxxx"  # 粘贴云数据库 URL

# 执行迁移
npx prisma db push

# 填充示例数据
npx tsx prisma/seed.ts
```

**方法 2：使用 Vercel CLI**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 执行命令
vercel env pull .env.local
npx prisma db push
npx tsx prisma/seed.ts
```

##### 7. 访问你的网站

部署完成后，Vercel 会提供一个链接，类似：
```
https://my-blog-xxxxxxxxx.vercel.app
```

点击访问，你的博客就上线了！🎉

---

### 第三步：自定义域名（可选）

#### 免费域名选项

**选项 1：Vercel 提供的免费域名**
- 格式：`项目名-xxxxxx.vercel.app`
- 优点：自动配置，无需任何操作
- 缺点：域名较长，不够个性化

**选项 2：使用 Freenom 免费域名**
1. 访问 [freenom.com](https://www.freenom.com)
2. 注册免费域名（如 `.tk`, `.ml`, `.ga`）
3. 在 Vercel 项目 → "Settings" → "Domains"
4. 添加域名，按提示配置 DNS

**选项 3：购买个性化域名（推荐）**
- 在 [namesilo.com](https://www.namesilo.com) 或 [namecheap.com](https://www.namecheap.com)
- 价格：约 ¥50-100/年
- 配置方法：
  1. Vercel 项目 → "Settings" → "Domains"
  2. 输入你的域名 → "Add"
  3. 按提示在域名注册商处添加 DNS 记录

---

### 自动部署配置

每次推送代码到 GitHub，Vercel 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "更新博客功能"
git push

# Vercel 会自动检测并重新部署（约 2-3 分钟）
```

---

### 常见部署问题

#### 问题 1：部署成功但数据库为空

**原因**：未初始化数据库表和数据

**解决**：
```bash
# 本地连接云数据库
DATABASE_URL="云数据库URL" npx prisma db push
DATABASE_URL="云数据库URL" npx tsx prisma/seed.ts
```

#### 问题 2：Error: P1001: Can't reach database server

**原因**：数据库连接字符串配置错误

**解决**：
1. 检查 Vercel 环境变量中的 `DATABASE_URL`
2. 确认云数据库服务正常运行
3. 检查数据库防火墙设置（允许所有 IP 访问）

#### 问题 3：Module not found: Can't resolve 'mysql2'

**原因**：依赖未正确安装

**解决**：
```bash
# 确保 package.json 中包含
"dependencies": {
  "mysql2": "^3.16.0"
}

# 重新提交
git add package.json
git commit -m "fix: add mysql2 dependency"
git push
```

#### 问题 4：Build failed: prisma generate error

**原因**：Prisma 配置问题

**解决**：
1. 确认 `prisma/schema.prisma` 文件存在
2. 检查 `package.json` 中是否包含：
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```

#### 问题 5：本地 MySQL 数据能否迁移到云端？

**可以！** 使用 Prisma 迁移：

```bash
# 1. 导出本地数据库
mysqldump -u root -p myblog > backup.sql

# 2. 导入到云数据库
mysql -h 云数据库地址 -u 用户名 -p 数据库名 < backup.sql

# 或使用 MySQL Workbench 的数据导出/导入功能
```

---

### 监控和维护

#### Vercel 提供的功能

1. **Analytics**（分析）
   - 访问量统计
   - 地理位置分布
   - 页面性能监控

2. **Logs**（日志）
   - 实时日志查看
   - 错误追踪
   - 性能分析

3. **Speed Insights**（性能洞察）
   - 真实用户性能数据
   - Core Web Vitals 指标
   - 优化建议

#### 访问方式

1. 进入 Vercel 项目
2. 点击顶部导航的 "Analytics" 或 "Logs"
3. 查看实时数据和历史记录

---

### 分享你的博客

部署完成后，你可以：

1. **分享链接**：
   ```
   https://my-blog-xxxxxxxxx.vercel.app
   ```

2. **添加到简历**：
   ```
   个人博客：https://你的域名.com
   技术栈：Next.js + TypeScript + MySQL + Prisma
   ```

3. **在社交媒体分享**

4. **让朋友评论互动**

---

### 成本总结

| 服务 | 费用 | 说明 |
|------|------|------|
| **GitHub** | 免费 | 代码托管（公开仓库无限制） |
| **Vercel** | 免费 | 网站部署（个人项目免费额度充足） |
| **PlanetScale** | 免费 | 数据库（5GB 免费额度） |
| **Railway** | 免费 | 数据库（$5 免费额度/月） |
| **域名（可选）** | ¥50-100/年 | 个性化域名 |

**结论**：可以完全免费部署和运行！

---

## 联系方式

如果在学习过程中遇到问题：

1. 查看本文档的"常见问题"部分
2. 阅读官方文档
3. 在项目 issues 中提问
4. 搜索 Stack Overflow

---

**祝你学习愉快！🎉**

这个项目不仅是一个博客系统，更是学习现代 Web 开发的绝佳实践。
通过这个项目，你可以掌握：
- 前端开发（React、TypeScript）
- 后端开发（Next.js API）
- 数据库操作（Prisma、MySQL）
- 全栈项目架构

继续探索，不断实践，你一定能成为优秀的全栈开发者！💪
