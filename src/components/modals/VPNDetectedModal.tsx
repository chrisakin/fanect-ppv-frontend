import { ShieldXIcon, AlertTriangleIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface VPNDetectedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VPNDetectedModal = ({ isOpen, onClose }: VPNDetectedModalProps) => {
  const handleDisableVPN = () => {
    // Reload the page to retry location detection
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] p-0" hideCloseButton>
        <DialogTitle className="sr-only">VPN Detected</DialogTitle>
        
        <Card className="border-none">
          <CardContent className="flex flex-col items-center space-y-8 p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full">
                <ShieldXIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="space-y-3 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-red-600 dark:text-red-400">
                  VPN Detected
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  We've detected that you're using a VPN or proxy service. For security 
                  and licensing reasons, please disable your VPN to access FaNect.
                </p>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    Why is this required?
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Content licensing restrictions by region</li>
                    <li>• Security and fraud prevention</li>
                    <li>• Compliance with local regulations</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Go Back
                </Button>
                
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleDisableVPN}
                >
                  I've Disabled VPN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};