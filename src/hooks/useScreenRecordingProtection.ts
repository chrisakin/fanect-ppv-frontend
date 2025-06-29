import { useEffect, useRef, useState } from 'react';

interface ScreenRecordingProtectionOptions {
  onRecordingDetected?: () => void;
  onSuspiciousActivity?: (activity: string) => void;
  enableWatermark?: boolean;
  enableBlurOnFocusLoss?: boolean;
  enableDevToolsDetection?: boolean;
}

export const useScreenRecordingProtection = (options: ScreenRecordingProtectionOptions = {}) => {
  const [isRecordingDetected, setIsRecordingDetected] = useState(false);
  const [isProtectionActive, setIsProtectionActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const devToolsCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Method 1: Detect screen capture API usage
  const detectScreenCapture = async () => {
    try {
      // Check if getDisplayMedia is being used
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        
        navigator.mediaDevices.getDisplayMedia = function(...args) {
          console.warn('Screen capture detected!');
          setIsRecordingDetected(true);
          options.onRecordingDetected?.();
          options.onSuspiciousActivity?.('Screen capture API usage detected');
          return originalGetDisplayMedia.apply(this, args);
        };
      }
    } catch (error) {
      console.warn('Could not set up screen capture detection:', error);
    }
  };

  // Method 2: Detect browser extensions commonly used for recording
  const detectRecordingExtensions = () => {
    // Check for common screen recording extension indicators
    const suspiciousElements = [
      'div[data-extension="screen-recorder"]',
      'div[id*="recorder"]',
      'div[class*="recording"]',
      'div[data-testid*="record"]'
    ];

    suspiciousElements.forEach(selector => {
      if (document.querySelector(selector)) {
        options.onSuspiciousActivity?.(`Potential recording extension detected: ${selector}`);
      }
    });
  };

  // Method 3: Monitor for suspicious DOM changes
  const setupDOMMonitoring = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const className = element.className?.toString().toLowerCase() || '';
              const id = element.id?.toLowerCase() || '';
              
              // Check for recording-related elements
              if (className.includes('record') || 
                  className.includes('capture') || 
                  id.includes('record') || 
                  id.includes('capture')) {
                options.onSuspiciousActivity?.('Suspicious DOM element detected');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  };

  // Method 4: Detect developer tools (often used with recording)
  const detectDevTools = () => {
    if (!options.enableDevToolsDetection) return;

    const threshold = 160;
    let devtools = false;

    const checkDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools) {
          devtools = true;
          options.onSuspiciousActivity?.('Developer tools detected');
        }
      } else {
        devtools = false;
      }
    };

    devToolsCheckRef.current = setInterval(checkDevTools, 1000);
  };

  // Method 5: Monitor for focus loss (common during recording setup)
  const setupFocusMonitoring = () => {
    if (!options.enableBlurOnFocusLoss) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        options.onSuspiciousActivity?.('Page lost focus - potential recording setup');
        // Optionally blur content
        document.body.style.filter = 'blur(10px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    const handleBlur = () => {
      options.onSuspiciousActivity?.('Window lost focus');
      if (options.enableBlurOnFocusLoss) {
        document.body.style.filter = 'blur(5px)';
      }
    };

    const handleFocus = () => {
      document.body.style.filter = 'none';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  };

  // Method 6: Canvas fingerprinting to detect recording
  const setupCanvasProtection = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a unique fingerprint
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Screen recording protection active', 2, 2);
      
      const originalToDataURL = canvas.toDataURL;
      canvas.toDataURL = function(...args) {
        options.onSuspiciousActivity?.('Canvas data extraction detected');
        return originalToDataURL.apply(this, args);
      };
    }
  };

  // Method 7: Detect right-click and keyboard shortcuts
  const setupKeyboardProtection = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common recording shortcuts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === 'R' || e.key === 'r') {
          e.preventDefault();
          options.onSuspiciousActivity?.('Recording shortcut detected');
        }
      }
      
      // Detect screenshot shortcuts
      if (e.key === 'PrintScreen' || 
          (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))) {
        options.onSuspiciousActivity?.('Screenshot shortcut detected');
      }
      
      // Detect F12 (dev tools)
      if (e.key === 'F12') {
        e.preventDefault();
        options.onSuspiciousActivity?.('F12 pressed - dev tools attempt');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      options.onSuspiciousActivity?.('Right-click detected');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  };

  // Method 8: Dynamic watermarking
  const setupDynamicWatermark = () => {
    if (!options.enableWatermark) return;

    const watermark = document.createElement('div');
    watermark.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 48px;
      color: rgba(255, 255, 255, 0.1);
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      font-family: Arial, sans-serif;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    `;
    
    const updateWatermark = () => {
      const timestamp = new Date().toLocaleString();
      const userId = 'USER_' + Math.random().toString(36).substr(2, 9);
      watermark.textContent = `FaNect - ${userId} - ${timestamp}`;
    };

    updateWatermark();
    document.body.appendChild(watermark);

    // Update watermark every 5 seconds
    const watermarkInterval = setInterval(updateWatermark, 5000);

    return () => {
      clearInterval(watermarkInterval);
      if (watermark.parentNode) {
        watermark.parentNode.removeChild(watermark);
      }
    };
  };

  // Method 9: Monitor performance for recording indicators
  const monitorPerformance = () => {
    const checkPerformance = () => {
      if ('performance' in window && 'memory' in (window.performance as any)) {
        const memory = (window.performance as any).memory;
        
        // High memory usage might indicate recording
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
          options.onSuspiciousActivity?.('High memory usage detected');
        }
      }
      
      // Check for frame rate drops
      let lastTime = performance.now();
      requestAnimationFrame(function checkFrameRate(currentTime) {
        const delta = currentTime - lastTime;
        if (delta > 50) { // Less than 20 FPS
          options.onSuspiciousActivity?.('Low frame rate detected');
        }
        lastTime = currentTime;
        requestAnimationFrame(checkFrameRate);
      });
    };

    intervalRef.current = setInterval(checkPerformance, 5000);
  };

  // Initialize protection
  useEffect(() => {
    setIsProtectionActive(true);
    
    detectScreenCapture();
    const domObserver = setupDOMMonitoring();
    const focusCleanup = setupFocusMonitoring();
    const keyboardCleanup = setupKeyboardProtection();
    const watermarkCleanup = setupDynamicWatermark();
    
    setupCanvasProtection();
    detectDevTools();
    monitorPerformance();

    // Periodic checks
    intervalRef.current = setInterval(() => {
      detectRecordingExtensions();
    }, 10000);

    return () => {
      setIsProtectionActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (devToolsCheckRef.current) clearInterval(devToolsCheckRef.current);
      domObserver?.disconnect();
      focusCleanup?.();
      keyboardCleanup?.();
      watermarkCleanup?.();
    };
  }, []);

  return {
    isRecordingDetected,
    isProtectionActive,
    // Manual trigger for additional checks
    runManualCheck: () => {
      detectRecordingExtensions();
      options.onSuspiciousActivity?.('Manual protection check performed');
    }
  };
};