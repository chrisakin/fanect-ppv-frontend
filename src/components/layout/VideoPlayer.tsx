import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { FeedbackModal } from "../modals/FeedbackModal";

/**
 * Props for VideoPlayer component
 * @interface VideoPlayerProps
 * @property {string} [eventId] - Event identifier for feedback
 * @property {string} [eventName] - Event name for feedback context
 * @property {string | null} [sessionToken] - AWS IVS session token
 * @property {boolean} [isSessionActive] - Whether streaming session is active
 */
interface VideoPlayerProps {
  eventId?: string;
  eventName?: string;
  sessionToken?: string | null;
  isSessionActive?: boolean;
}

/**
 * VideoPlayer Component - Video streaming player placeholder
 * 
 * Features:
 * - Placeholder for AWS IVS integration
 * - Feedback modal trigger capability
 * - Responsive height (300px mobile → 460px desktop)
 * - White card container with rounded corners
 * 
 * Note: Currently shows placeholder - integrate AWS IVS for live streaming
 * 
 * @param {VideoPlayerProps} props - Component props
 * @returns {JSX.Element} Video player container with optional feedback modal
 */
export const VideoPlayer = ({ eventId, eventName }: VideoPlayerProps): JSX.Element => {
  /**
   * Toggles feedback modal visibility
   * @type {[boolean, Function]}
   */
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      {/* Video player wrapper - Responsive flex layout */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
        {/* Video player card container - Responsive height */}
        {/* Mobile: 300px, Tablet: 400px, Desktop: 460px */}
        <Card className="relative w-full lg:w-full h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
          <CardContent className="p-0">
            {/* Placeholder content - Replace with AWS IVS player */}
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Video player component - AWS IVS should be used instead</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback modal - Shown when eventId provided and modal opened */}
      {eventId && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          eventId={eventId}
          eventName={eventName}
        />
      )}
    </>
  );
};
