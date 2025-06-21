import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteEventModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteEventModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 text-center focus-visible:outline-none">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />

        <DialogTitle className="text-lg font-semibold mt-4">
          Delete Event
        </DialogTitle>

        <DialogDescription className="text-sm text-muted-foreground">
          Are you sure you want to delete this event? This action cannot be undone.
        </DialogDescription>

        <div className="flex gap-4 w-full mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
