'use client'

import { useState, useEffect } from 'react'
import CommentForm from './CommentForm'

interface Comment {
  id: number
  content: string
  author: string
  createdAt: string
}

interface CommentsProps {
  slug: string
  initialComments: Comment[]
}

export default function Comments({ slug, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const refreshComments = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}`)
      const data = await response.json()
      setComments(data.comments)
    } catch (error) {
      console.error('刷新评论失败:', error)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">评论 ({comments.length})</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">发表评论</h3>
        <CommentForm slug={slug} onCommentAdded={refreshComments} />
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{comment.author}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
