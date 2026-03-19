import { defaultPosts } from '@/data/blog'
import BlogPostClient from './BlogPostClient'

export function generateStaticParams() {
  return defaultPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage() {
  return <BlogPostClient />
}
