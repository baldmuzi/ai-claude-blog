import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('获取文章详情失败:', error)
    return NextResponse.json({ error: '获取文章详情失败' }, { status: 500 })
  }
}
