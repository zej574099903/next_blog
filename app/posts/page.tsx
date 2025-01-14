'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories, posts } from '@/data/posts';
import PostFilter from '../components/PostFilter';

export default function Posts() {
  const [filteredPosts, setFilteredPosts] = useState(posts);

  return (
    <main className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          所有文章
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          探索全部技术文章，获取深度技术见解
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <PostFilter posts={posts} onFilterChange={setFilteredPosts} />
      </div>

      {/* Posts List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">未找到文章</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              尝试调整搜索条件或重置筛选器
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="block group"
              >
                <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm rounded-full">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.date}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readingTime} 分钟阅读
                      </span>
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {post.tags.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="mr-2">阅读全文</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Back to Home */}
      <div className="fixed bottom-8 right-8 z-10">
        <Link
          href="/"
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          返回首页
        </Link>
      </div>
    </main>
  );
}
