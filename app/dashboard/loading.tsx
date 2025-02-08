import DashboardSkeleton from '@/app/ui/skeletons';
/**
 * https://nextjs.org/learn/dashboard-app/streaming
 * 
 * A loading skeleton is a simplified version of the UI. Many websites use them as a placeholder (or fallback) to indicate to users that the content is loading.
 * At the page level, with the loading.tsx file (which creates <Suspense> for you).
 * @constructor
 */
export default function Loading() {
    return <DashboardSkeleton />;
}