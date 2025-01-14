import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export function parseMarkdown(content: string) {
  const { data, content: markdownContent } = matter(content)
  const htmlContent = md.render(markdownContent)
  
  return {
    frontmatter: data,
    content: htmlContent,
  }
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function calculateReadingTime(content: string) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}
