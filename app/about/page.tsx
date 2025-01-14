import Image from 'next/image';
import Avatar from '../components/Avatar';
import Link from 'next/link';

export default function About() {
  const skills = [
    { name: '前端基础', items: ['HTML5', 'CSS3', 'JavaScript', 'ES6+'] },
    { name: '前端框架', items: ['React', 'Vue2/3', 'Redux', 'Pinia'] },
    { name: '工程化工具', items: ['Webpack', 'Vite', 'Docker'] },
    { name: '预处理器', items: ['Less', 'Sass'] },
    { name: '可视化', items: ['ECharts', 'AntV G6', 'AntV X6', 'DataV'] },
    { name: '跨端开发', items: ['Uniapp'] },
    { name: '微前端', items: ['Qiankun'] },
    { name: '后端技能', items: ['Node.js', 'Java', 'MySQL'] },
  ];

  const experiences = [
    {
      company: '杭州人瑞人力资源服务有限公司',
      position: '前端组长',
      period: '2022.11 – 2024.06',
      achievements: [
        '带领前端团队，完成项目排期分配、开发、迭代、重构等任务',
        '参与核心代码编写，负责抽离、开发共用组件，编写组件文档',
        '完善团队开发工作流程，制定代码规范，编写开发文档',
        '负责项目前端展示效果把关，指导解决技术难点'
      ]
    },
    {
      company: '工保科技（浙江）有限公司',
      position: '前端开发',
      period: '2019.01 – 2022.11',
      achievements: [
        '完成响应式PC端和移动端web前端页面开发',
        '与产品设计团队沟通审核业务需求，设计技术方案',
        '解决Web前端页面的浏览器兼容性问题'
      ]
    },
    {
      company: '上海开奈电子通讯有限公司',
      position: '前端开发',
      period: '2017.08 – 2019.01',
      achievements: [
        '前端、移动端页面搭建，后台管理系统开发与维护',
        '项目性能优化，提升用户体验',
        '解决Web前端页面的浏览器兼容性问题'
      ]
    }
  ];

  return (
    <main className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      {/* Back to Home Button */}
      <div className="fixed top-8 left-8 z-10">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <Avatar />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            周恩军
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            7年前端开发经验 | 现居杭州
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:574099903@qq.com"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              574099903@qq.com
            </a>
            <a
              href="tel:15158802043"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              15158802043
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            技术技能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            工作经历
          </h2>
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
