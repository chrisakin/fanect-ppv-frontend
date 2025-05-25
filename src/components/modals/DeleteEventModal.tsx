import { Dialog, DialogContent } from "../ui/dialog";
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
  isLoading 
}: DeleteEventModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <div className="flex flex-col items-center gap-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
          
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Delete Event</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-4 w-full">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};