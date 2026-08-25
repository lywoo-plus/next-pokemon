import Loading from '@/components/loading';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function LoadingPage() {
  return (
    <Dialog open>
      <DialogContent>
        <Loading />
      </DialogContent>
    </Dialog>
  );
}
