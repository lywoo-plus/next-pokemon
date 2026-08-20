import { Trash2Icon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type ReactElement, type ReactNode } from 'react';

export function AlertDialogDestructive({
  open,
  onOpenChange,
  isLoading,
  title = 'Are you sure?',
  description = 'This will permanently delete your data',
  alertDialogTrigger,
  onConfirm,
  onCancel,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  alertDialogTrigger?: ReactElement | null;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  function handleClickCancel() {
    onOpenChange?.(false);
    onCancel?.();
  }

  function handleClickConfirm() {
    onOpenChange?.(false);
    onConfirm?.();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {alertDialogTrigger}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" onClick={handleClickCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={handleClickConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
