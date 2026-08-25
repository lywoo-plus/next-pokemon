import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function Loading() {
  return (
    <Dialog open>
      <DialogContent>
        <div className="text-2xl font-medium text-red-500">Loading...</div>
      </DialogContent>
    </Dialog>
  );
}
