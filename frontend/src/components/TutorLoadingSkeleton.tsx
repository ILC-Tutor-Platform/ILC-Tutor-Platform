import { Skeleton } from './ui/skeleton';

// Loading skeleton component
export const TutorLoadingSkeleton = () => (
  <section className="grid relative top-[10vh] items-center justify-center px-5 w-full">
    <div className="flex flex-col bg-ilc-tutor-card p-5 gap-5 rounded-2xl mx-auto">
      <div className="bg-white p-5 rounded-xl">
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-ilc-green p-5">
        <Skeleton className="h-8 w-1/2 bg-white/20" />
        <Skeleton className="h-24 w-full bg-white/20" />
      </div>

      <div className="grid gap-5">
        <Skeleton className="h-8 w-1/3 bg-white mx-auto" />
        <Skeleton className="h-10 w-1/2 mx-auto bg-ilc-yellow" />
      </div>

      <div className="mx-auto">
        <Skeleton className="w-80" />
      </div>
    </div>
  </section>
);

export const TutorCardLoadingSkeleton = () => (
  <div className="flex flex-col bg-ilc-tutor-card p-5 gap-5 rounded-2xl mx-auto">
    <div className="bg-white p-5 rounded-xl">
      <div className="flex">
        <Skeleton className="h-12 w-12 rounded-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
      </div>

      <Skeleton className="h-6 w-full mb-2 bg-ilc-yellow" />
      <Skeleton className="h-6 w-1/2" />
    </div>

    <div className="mx-auto">
      <Skeleton className="w-80" />
    </div>
  </div>
);
