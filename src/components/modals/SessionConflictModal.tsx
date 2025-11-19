import { AlertTriangleIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

/**
 * Modal interface for multi-device streampass conflict
 * @interface SessionConflictModalProps
 * @property {boolean} isOpen - Modal visibility
 * @property {() => void} onClose - Callback for "Go Back" action
 * @property {() => void} onForceStart - Callback to terminate other session and start here
 * @property {string} [eventName] - Optional event name for context display
 */
interface SessionConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForceStart: () => void;
  eventName?: string;
}


/**
 * Alert for concurrent streampass usage on multiple devices
 * @component
 * Shows warning with device icons and options: Go Back or Force Start (terminates other session)
 */
export const SessionConflictModal = ({ 
  isOpen, 
  onClose, 
  onForceStart, 
  eventName 
}: SessionConflictModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] p-0" hideCloseButton>
        <DialogTitle className="sr-only">Multiple Device Session Detected</DialogTitle>
        
        <Card className="border-none">
          <CardContent className="flex flex-col items-center space-y-8 p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full">
                <AlertTriangleIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              
              <div className="space-y-3 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Multiple Device Access Detected
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  This streampass is already being used on another device. Each streampass 
                  can only be used on one device at a time.
                </p>
                {eventName && (
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Event: {eventName}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-2 mt-1">
                  <MonitorIcon className="w-4 h-4 text-blue-500" />
                  <SmartphoneIcon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    What you can do:
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Close the stream on your other device first</li>
                    <li>• Or force start here (will end the other session)</li>
                    <li>• Contact support if you need help</li>
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
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={onForceStart}
                >
                  Force Start Here
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};