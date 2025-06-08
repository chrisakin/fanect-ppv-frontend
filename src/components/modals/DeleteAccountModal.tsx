import { AlertCircleIcon, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import axios from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../../lib/auth";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps): JSX.Element => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axios.delete('/auth/delete-account');
      
      // Clear tokens and logout user
      clearTokens();
      logout();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      
      // Close modal and redirect to home
      onClose();
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete account. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogTitle className="sr-only">Delete Account</DialogTitle>
        <Card className="flex flex-col w-full items-center gap-20 relative border-none">
          <CardContent className="flex flex-col w-full items-center gap-11 pt-6">
            <div className="flex flex-col w-full items-center gap-[30px] relative">
              {/* Using AlertCircleIcon icon from lucide-react instead of the image */}
              <AlertCircleIcon className="w-[100px] h-[100px] text-red-500" />

              <div className="flex flex-col items-center w-full">
                <h1 className="font-display-lg-semibold font-[number:var(--display-lg-semibold-font-weight)] text-gray-900 dark:text-[#dddddd] text-[length:var(--display-lg-semibold-font-size)] text-center tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)] [font-style:var(--display-lg-semibold-font-style)]">
                  Delete Account
                </h1>

                <p className="w-full max-w-[456px] font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-gray-600 dark:text-[#cccccc] text-[length:var(--text-xl-regular-font-size)] text-center tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)] [font-style:var(--text-xl-regular-font-style)] mt-4">
                  Are you sure you want to delete your account? If you delete your account, you will not be able to access it anymore and your active Streampasses will be lost. This action cannot be undone.
                </p>
              </div>
            </div>
          </CardContent>

          <div className="flex items-start justify-center gap-5 self-stretch w-full mb-6 px-6">
            <Button
              variant="outline"
              className="h-[62px] flex-1 rounded-[10px] border border-solid border-[#a4a7ae]"
              onClick={onClose}
              disabled={isDeleting}
            >
              <span className="font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-gray-400 text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
                No, Cancel
              </span>
            </Button>

            <Button
              variant="destructive"
              className="h-[60px] flex-1 bg-red-600 rounded-[10px] hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              <span className="font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-white text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
                {isDeleting ? "Deleting..." : "Yes, Delete my Account"}
              </span>
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};