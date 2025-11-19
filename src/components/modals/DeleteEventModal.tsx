import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Props for DeleteEventModal
 * @interface DeleteEventModalProps
 * @property {boolean} open - Modal visibility state
 * @property {Function} onOpenChange - Callback to toggle modal
 * @property {Function} onConfirm - Callback when delete confirmed
 * @property {boolean} [isLoading] - Loading state during deletion
 */
interface DeleteEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * DeleteEventModal Component - Confirmation dialog to delete an event
 * 
 * Features:
 * - Warning icon and message
 * - Cancel and Delete buttons
 * - Loading state with "Deleting..." text
 * - Disabled state during async operation
 * 
 * @param {DeleteEventModalProps} props - Component props
 * @returns {JSX.Element} Event deletion confirmation dialog
 */
export const DeleteEventModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteEventModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 text-center focus-visible:outline-none">
        {/* Warning icon */}
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />

        {/* Title */}
        <DialogTitle className="text-lg font-semibold mt-4">
          Delete Event
        </DialogTitle>

        {/* Warning message */}
        <DialogDescription className="text-sm text-muted-foreground">
          Are you sure you want to delete this event? This action cannot be undone.
        </DialogDescription>

        {/* Action buttons */}
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
