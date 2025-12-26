import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const body = await request.json()
    const { content, author, email } = body

    if (!content || !author || !email) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 })
    }

    const { slug } = await params
    const post = await prisma.post.findUnique({
      where: { slug }
    })

    if (!post) {
      return NextResponse.json({ error: '文章未找到' }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        author,
        email,
        postId: post.id
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('创建评论失败:', error)
    return NextResponse.json({ error: '创建评论失败' }, { status: 500 })
  }
}
