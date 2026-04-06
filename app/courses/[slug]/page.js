import CourseDetailClient from './CourseDetailClient';

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;

  return <CourseDetailClient key={resolvedParams.slug} slug={resolvedParams.slug} />;
}
