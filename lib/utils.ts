export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function cleanSlug(slug: string) {
  return slug.replace(/\.mdx?$/, '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/\.$/g, '');
} 