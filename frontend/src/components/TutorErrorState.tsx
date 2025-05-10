import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

// Error state component
export const TutorErrorState = ({ error }: { error: string | null }) => (
  <section className="grid relative top-[10vh] items-center justify-center px-5 w-full">
    <div className="md:w-[60%] xl:w-[50%] mx-auto">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'Could not load tutor information. Please try again later.'}
        </AlertDescription>
      </Alert>
      <div className="mt-4 flex justify-center">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  </section>
);
