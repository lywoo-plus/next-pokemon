import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="grid h-full place-content-center">
      <div className="flex flex-col items-center text-gray-500">
        <LoaderCircle className="animate-spin" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
