import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '我的博客 - 分享技术与生活',
  description: '一个使用 Next.js、React 和 MySQL 构建的现代化个人博客',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
