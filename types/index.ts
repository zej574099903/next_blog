export interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  author: string;
  content: string;
  readingTime: number;
  slug: string;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  coverImage?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface TableOfContents {
  id: string;
  level: number;
  text: string;
  children?: TableOfContents[];
}
