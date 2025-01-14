import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="py-20 text-center bg-gradient-to-r from-blue-50 to-blue-100">
        <h1 className="text-4xl font-bold mb-4">周恩军的个人博客</h1>
        <p className="text-gray-600">分享技术，记录生活</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">最新文章</h2>
          <div className="space-y-6">
            <article className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">
                <a href="#">欢迎来到我的博客</a>
              </h3>
              <p className="text-gray-600 mb-2">这是我的第一篇博客文章，让我们开始这段旅程吧...</p>
              <div className="text-sm text-gray-500">
                发布于 2025-01-14
              </div>
            </article>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">关于我</h2>
          <p className="text-gray-600">
            你好，我是周恩军，一名热爱技术的开发者。这个博客将会分享我在技术领域的学习心得和日常思考。
          </p>
        </section>
      </main>

      <footer className="text-center py-6 text-gray-500 border-t mt-12">
        <p> 2025 周恩军的博客. All rights reserved.</p>
      </footer>
    </div>
  );
}
