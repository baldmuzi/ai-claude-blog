import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Comments from './Comments'

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true }
  })

  if (!post) {
    return { title: '文章未找到' }
  }

  return {
    title: `${post.title} - 我的博客`,
    description: post.excerpt
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true
    },
    include: {
      category: true,
      tags: true,
      comments: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!post) {
    notFound()
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 返回首页
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <article className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            {post.category && (
              <Link
                href={`/?category=${post.category.slug}`}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200"
              >
                {post.category.name}
              </Link>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <time dateTime={post.createdAt.toISOString()}>
              发布于 {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.views} 阅读</span>
            <span>•</span>
            <span>{post.comments.length} 评论</span>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 1
                const text = paragraph.replace(/^#+\s*/, '')
                const className = "font-bold mt-6 mb-4"

                // 根据级别返回对应的标题标签
                if (level === 1) return <h1 key={index} className={className}>{text}</h1>
                if (level === 2) return <h2 key={index} className={className}>{text}</h2>
                if (level === 3) return <h3 key={index} className={className}>{text}</h3>
                if (level === 4) return <h4 key={index} className={className}>{text}</h4>
                if (level === 5) return <h5 key={index} className={className}>{text}</h5>
                return <h6 key={index} className={className}>{text}</h6>
              } else if (paragraph.trim().startsWith('```')) {
                return null
              } else if (paragraph.trim().startsWith('-')) {
                return (
                  <li key={index} className="ml-6">
                    {paragraph.replace(/^-\s*/, '')}
                  </li>
                )
              } else if (paragraph.trim()) {
                return (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              }
              return <br key={index} />
            })}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t">
              <span className="text-gray-600">标签:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/?tag=${tag.slug}`}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-200"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </article>

        <Comments
          slug={post.slug}
          initialComments={post.comments.map(comment => ({
            ...comment,
            createdAt: comment.createdAt.toISOString()
          }))}
        />
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 我的博客. 使用 Next.js、React 和 MySQL 构建
          </p>
        </div>
      </footer>
    </div>
  )
}
