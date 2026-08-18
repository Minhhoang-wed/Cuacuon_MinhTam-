export type Service = {
  slug: string;
  name: string;
  summary: string;
  price: string;
  duration: string;
  warranty: string;
  symptoms: string[];
  process: string[];
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  price: string;
  warranty: string;
  specs: string[];
  accent: string;
};

export type Project = {
  slug: string;
  name: string;
  location: string;
  category: string;
  summary: string;
  result: string;
  accent: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
};


// Sẵn sàng để nhập dữ liệu thực tế của bạn
export const services: Service[] = [];

export const products: Product[] = [];

export const projects: Project[] = [];

export const articles: Article[] = [];

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((item) => item.slug === slug);
}

