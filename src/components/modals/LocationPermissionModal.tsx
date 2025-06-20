import { useState } from "react";
import { MapPinIcon, ShieldCheckIcon, XCircleIcon, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onLocationGranted: () => void;
  onLocationDenied: () => void;
  onVPNDetected: () => void;
}

export const LocationPermissionModal = ({
  isOpen,
  onLocationGranted,
  onLocationDenied,
  onVPNDetected,
}: LocationPermissionModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllowLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { locationService } = await import('../../services/locationService');
      
      // Try to get user location
      await locationService.getUserLocation(true);
      
      setIsLoading(false);
      onLocationGranted();
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.message === 'VPN_DETECTED') {
        onVPNDetected();
      } else if (error.message.includes('denied')) {
        setError('Location access was denied. Please enable location access in your browser settings.');
      } else {
        setError('Failed to get your location. Please try again.');
      }
    }
  };

  const handleDenyLocation = () => {
    onLocationDenied();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] p-0" hideCloseButton>
        <DialogTitle className="sr-only">Location Permission Required</DialogTitle>
        
        <Card className="border-none">
          <CardContent className="flex flex-col items-center space-y-8 p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
                <MapPinIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <div className="space-y-3 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Approximate Location Permission
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  FaNect needs access to your approximate location to display local pricing and event availability. This data isn’t shared and is used only for this purpose.
                </p>
              </div>
            </div>

            {error && (
              <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            <div className="w-full space-y-4">
              {/* <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Privacy & Security
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    We use your location only to show relevant events and detect VPN usage 
                    for security purposes. Your precise location is never stored or shared.
                  </p>
                </div>
              </div> */}

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDenyLocation}
                  disabled={isLoading}
                >
                  Deny Location Access
                </Button>
                
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleAllowLocation}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Getting Location...
                    </>
                  ) : (
                    "Allow Location Access"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};