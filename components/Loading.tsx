import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <ArrowPathIcon
        className="h-12 w-12 animate-spin text-gray-500"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
