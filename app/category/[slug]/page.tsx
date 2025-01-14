import { categories, posts } from '@/data/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((category) => category.slug === params.slug)
  const categoryPosts = posts.filter((post) => post.category === category?.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 导航 */}
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </nav>

        {/* 分类信息 */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </header>

        {/* 文章列表 */}
        <div className="space-y-8">
          {categoryPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
            >
              <Link 
                href={`/post/${post.slug}`}
                className="block group"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readingTime} min read
                    </span>
                  </div>
                </div>
              </Link>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {categoryPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  )
}
