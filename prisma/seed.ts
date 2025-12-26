import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始填充数据...')

  const category1 = await prisma.category.create({
    data: {
      name: '技术分享',
      slug: 'tech',
      description: '分享各种技术文章和编程经验',
    },
  })

  const category2 = await prisma.category.create({
    data: {
      name: '生活随笔',
      slug: 'life',
      description: '记录生活中的点点滴滴',
    },
  })

  const tag1 = await prisma.tag.create({
    data: { name: 'JavaScript', slug: 'javascript' },
  })

  const tag2 = await prisma.tag.create({
    data: { name: 'React', slug: 'react' },
  })

  const tag3 = await prisma.tag.create({
    data: { name: 'Next.js', slug: 'nextjs' },
  })

  const tag4 = await prisma.tag.create({
    data: { name: '旅行', slug: 'travel' },
  })

  await prisma.post.create({
    data: {
      title: '开始使用 Next.js 构建现代化网站',
      slug: 'getting-started-with-nextjs',
      excerpt: 'Next.js 是一个强大的 React 框架，让我们一起学习如何使用它来构建快速、SEO友好的网站。',
      content: `
# 开始使用 Next.js

Next.js 是一个基于 React 的强大框架，它提供了许多开箱即用的功能。

## 主要特性

1. **服务端渲染(SSR)**: 提升首屏加载速度和SEO
2. **静态生成(SSG)**: 构建时生成静态页面
3. **文件路由系统**: 基于文件系统的直观路由
4. **API Routes**: 轻松创建 API 端点
5. **自动代码分割**: 优化加载性能

## 快速开始

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

访问 http://localhost:3000 即可看到你的第一个 Next.js 应用！

## 总结

Next.js 是现代 Web 开发的优秀选择，无论是个人博客还是企业级应用，都能轻松胜任。
      `,
      published: true,
      categoryId: category1.id,
      tags: {
        connect: [{ id: tag1.id }, { id: tag2.id }, { id: tag3.id }],
      },
    },
  })

  await prisma.post.create({
    data: {
      title: '我的第一次日本之旅',
      slug: 'my-first-trip-to-japan',
      excerpt: '记录我在日本的美好旅程，从东京到京都，每一站都充满惊喜。',
      content: `
# 我的第一次日本之旅

上个月终于实现了去日本旅行的梦想！这次旅程给我留下了深刻的印象。

## 东京

东京是一个充满活力的现代化都市。我去了：

- 浅草寺：感受传统日本文化
- 涩谷：体验繁华的都市生活
- 秋叶原：探索动漫和电子产品的天堂

## 京都

京都保留了大量的传统建筑和文化：

- 清水寺：俯瞰整个京都市区
- 金阁寺：金光闪闪的美丽寺庙
- 伏见稻荷大社：千本鸟居令人震撼

## 美食体验

日本的美食令人难忘：
- 寿司和刺身
- 拉面
- 天妇罗
- 和牛

这次旅行让我更加热爱日本文化，期待下次再去！
      `,
      published: true,
      categoryId: category2.id,
      tags: {
        connect: [{ id: tag4.id }],
      },
    },
  })

  await prisma.post.create({
    data: {
      title: 'TypeScript 最佳实践',
      slug: 'typescript-best-practices',
      excerpt: '总结一些在实际项目中使用 TypeScript 的最佳实践和技巧。',
      content: `
# TypeScript 最佳实践

TypeScript 为 JavaScript 项目带来了类型安全，让我们看看一些最佳实践。

## 1. 严格模式

始终在 tsconfig.json 中启用严格模式：

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## 2. 避免使用 any

尽量避免使用 \`any\` 类型，使用 \`unknown\` 作为替代。

## 3. 使用接口和类型别名

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}
\`\`\`

## 4. 利用类型推断

TypeScript 的类型推断非常强大，不需要为每个变量都显式声明类型。

## 5. 使用枚举

枚举可以让代码更具可读性：

\`\`\`typescript
enum Status {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}
\`\`\`

遵循这些最佳实践，可以让你的 TypeScript 项目更加健壮和易于维护！
      `,
      published: true,
      categoryId: category1.id,
      tags: {
        connect: [{ id: tag1.id }],
      },
    },
  })

  await prisma.post.create({
    data: {
      title: 'React Hooks 深入理解',
      slug: 'understanding-react-hooks',
      excerpt: '深入探讨 React Hooks 的工作原理和使用场景。',
      content: `
# React Hooks 深入理解

React Hooks 改变了我们编写 React 组件的方式。

## 常用 Hooks

### useState

管理组件状态：

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect

处理副作用：

\`\`\`jsx
useEffect(() => {
  document.title = \`点击了 \${count} 次\`;
}, [count]);
\`\`\`

### useContext

访问 Context：

\`\`\`jsx
const theme = useContext(ThemeContext);
\`\`\`

## 自定义 Hooks

创建自定义 Hook 来复用逻辑：

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

## 最佳实践

1. 只在顶层调用 Hooks
2. 只在 React 函数中调用 Hooks
3. 使用 ESLint 插件确保规则

Hooks 让函数组件变得更加强大和灵活！
      `,
      published: false,
      categoryId: category1.id,
      tags: {
        connect: [{ id: tag1.id }, { id: tag2.id }],
      },
    },
  })

  console.log('数据填充完成!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
