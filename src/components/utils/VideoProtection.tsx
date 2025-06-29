import React, { useEffect, useRef } from 'react';

interface VideoProtectionProps {
  children: React.ReactNode;
  enableTextSelection?: boolean;
  enableRightClick?: boolean;
  enableDragAndDrop?: boolean;
  enablePrintScreen?: boolean;
}

export const VideoProtection: React.FC<VideoProtectionProps> = ({
  children,
  enableTextSelection = false,
  enableRightClick = false,
  enableDragAndDrop = false,
  enablePrintScreen = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Disable text selection
    if (!enableTextSelection) {
      container.style.userSelect = 'none';
      container.style.webkitUserSelect = 'none';
      // Fix: Use type assertion for vendor-specific properties
      (container.style as any).mozUserSelect = 'none';
      (container.style as any).msUserSelect = 'none';
    }

    // Disable drag and drop
    if (!enableDragAndDrop) {
      const handleDragStart = (e: Event) => {
        e.preventDefault();
        return false;
      };

      const handleSelectStart = (e: Event) => {
        e.preventDefault();
        return false;
      };

      container.addEventListener('dragstart', handleDragStart);
      container.addEventListener('selectstart', handleSelectStart);

      return () => {
        container.removeEventListener('dragstart', handleDragStart);
        container.removeEventListener('selectstart', handleSelectStart);
      };
    }
  }, [enableTextSelection, enableDragAndDrop]);

  // CSS to prevent various interactions
  const protectionStyles: React.CSSProperties = {
    ...(!enableTextSelection && {
      userSelect: 'none',
      WebkitUserSelect: 'none',
      // Note: mozUserSelect and msUserSelect are handled in useEffect due to TypeScript limitations
    }),
    ...(!enableDragAndDrop && {
      WebkitUserDrag: 'none',
      WebkitTouchCallout: 'none',
    }),
    // Prevent highlighting
    WebkitTapHighlightColor: 'transparent',
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!enableRightClick) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!enablePrintScreen) {
      // Prevent Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+A (Select All)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
      }
      
      // Prevent F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+I (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      style={protectionStyles}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Make div focusable for keyboard events
      className="outline-none"
    >
      {children}
    </div>
  );
};