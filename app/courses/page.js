import CoursesPageClient from './CoursesPageClient';

export default async function CoursesPage({ searchParams }) {
  const params = await searchParams;
  const rawCategory = params?.category;
  const initialCategory = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory || 'all';

  return <CoursesPageClient key={initialCategory} initialCategory={initialCategory} />;
}
