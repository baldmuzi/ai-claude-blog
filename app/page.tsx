import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>
}) {
  const params = await searchParams
  const { category, tag } = params

  // 检查数据库连接
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">数据库未配置</h1>
          <p className="text-gray-600 mb-4">
            请配置 DATABASE_URL 环境变量以连接数据库。
          </p>
          <p className="text-sm text-gray-500">
            在 Vercel 项目设置中添加环境变量，或在本地创建 .env 文件。
          </p>
        </div>
      </div>
    )
  }

  let posts, categories, tags

  try {
    // 构建查询条件
    const where: any = {
      published: true,
    }

    if (category) {
      where.category = { slug: category }
    }

    if (tag) {
      where.tags = {
        some: { slug: tag }
      }
    }

    posts = await prisma.post.findMany({
      where,
      include: {
        category: true,
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } }
        }
      }
    })

    tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } }
        }
      },
      take: 20
    })
  } catch (error) {
    console.error('数据库查询失败:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">数据库连接失败</h1>
          <p className="text-gray-600 mb-4">
            无法连接到数据库，请检查数据库配置和连接状态。
          </p>
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : '未知错误'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">我的博客</h1>
          <p className="mt-1 text-sm text-gray-500">分享技术与生活</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {(category || tag) && (
          <div className="mb-6 flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <span className="text-blue-800">
              当前筛选：
              {category && (
                <span className="font-semibold">
                  分类 "{categories.find(c => c.slug === category)?.name}"
                </span>
              )}
              {tag && (
                <span className="font-semibold">
                  标签 "#{tags.find(t => t.slug === tag)?.name}"
                </span>
              )}
            </span>
            <Link
              href="/"
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              清除筛选
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">暂无文章</p>
                <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                  查看所有文章
                </Link>
              </div>
            ) : (
              <div className="space-y-6">{posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    {post.category && (
                      <Link
                        href={`/?category=${post.category.slug}`}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-200"
                      >
                        {post.category.name}
                      </Link>
                    )}
                  </div>

                  <Link href={`/posts/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/?tag=${tag.slug}`}
                        className="text-xs text-gray-600 hover:text-blue-600"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <time dateTime={post.createdAt.toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <div className="flex gap-4">
                      <span>{post.views} 阅读</span>
                      <span>{post._count.comments} 评论</span>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">分类</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/?category=${category.slug}`}
                      className="flex items-center justify-between text-gray-700 hover:text-blue-600"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category._count.posts})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.slug}`}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-200"
                  >
                    {tag.name} ({tag._count.posts})
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 我的博客. 使用 Next.js、React 和 MySQL 构建
          </p>
        </div>
      </footer>
    </div>
  )
}
