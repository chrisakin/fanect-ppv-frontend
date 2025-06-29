import React, { useState } from 'react';
import { useScreenRecordingProtection } from '../../hooks/useScreenRecordingProtection';
import { AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useToast } from '../ui/use-toast';

interface ScreenRecordingProtectionProps {
  children: React.ReactNode;
  enableWatermark?: boolean;
  enableBlurOnFocusLoss?: boolean;
  enableDevToolsDetection?: boolean;
  onRecordingDetected?: () => void;
  strictMode?: boolean; // If true, will block content when recording is detected
}

export const ScreenRecordingProtection: React.FC<ScreenRecordingProtectionProps> = ({
  children,
  enableWatermark = true,
  enableBlurOnFocusLoss = true,
  enableDevToolsDetection = true,
  onRecordingDetected,
  strictMode = false
}) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [suspiciousActivities, setSuspiciousActivities] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  const handleRecordingDetected = () => {
    console.warn('🚨 Screen recording detected!');
    
    toast({
      variant: "destructive",
      title: "Recording Detected",
      description: "Screen recording has been detected. This content is protected.",
    });

    if (strictMode) {
      setIsBlocked(true);
    } else {
      setShowWarning(true);
    }

    onRecordingDetected?.();
  };

  const handleSuspiciousActivity = (activity: string) => {
    console.warn('⚠️ Suspicious activity:', activity);
    setSuspiciousActivities(prev => [...prev.slice(-4), activity]); // Keep last 5 activities
    
    // Show warning for certain activities
    if (activity.includes('Screen capture') || activity.includes('Recording shortcut')) {
      setShowWarning(true);
    }
  };

  const { isRecordingDetected, isProtectionActive, runManualCheck } = useScreenRecordingProtection({
    onRecordingDetected: handleRecordingDetected,
    onSuspiciousActivity: handleSuspiciousActivity,
    enableWatermark,
    enableBlurOnFocusLoss,
    enableDevToolsDetection
  });

  // Blocked content view
  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Content Protected
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This content is protected against screen recording. Please disable any recording software to continue.
            </p>
            <Button 
              onClick={() => {
                setIsBlocked(false);
                setShowWarning(false);
                setSuspiciousActivities([]);
              }}
              className="w-full"
            >
              I've Disabled Recording
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Warning Banner */}
      {showWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Recording activity detected. This content is protected.
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWarning(false)}
              className="text-white hover:bg-red-700"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Protection Status Indicator (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-40">
          <Card className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <Shield className={`h-4 w-4 ${isProtectionActive ? 'text-green-500' : 'text-red-500'}`} />
              <span>Protection: {isProtectionActive ? 'Active' : 'Inactive'}</span>
              {isRecordingDetected && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            {suspiciousActivities.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                <div>Recent activities:</div>
                {suspiciousActivities.slice(-3).map((activity, index) => (
                  <div key={index} className="truncate">• {activity}</div>
                ))}
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={runManualCheck}
              className="mt-2 w-full"
            >
              Run Check
            </Button>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className={showWarning ? 'mt-16' : ''}>
        {children}
      </div>
    </div>
  );
};