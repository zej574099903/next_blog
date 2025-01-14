import { categories, posts } from '@/data/posts'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 分类信息 */}
      <header className="mb-12 text-center">
        {category.coverImage && (
          <div className="relative w-full h-[300px] mb-6">
            <Image
              src={category.coverImage}
              alt={category.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
      </header>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            {post.coverImage && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <Link href={`/post/${post.slug}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.date}</span>
              <span>{post.readingTime} min read</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  href={`/tag/${tag}`}
                  key={tag}
                  className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  {tag}
                </Link>
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
  )
}
