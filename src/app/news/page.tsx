import NewsClient from './NewsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NewsPage() {
  return <NewsClient />;
}
