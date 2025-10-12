import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { FeedbackModal } from "../modals/FeedbackModal";

interface VideoPlayerProps {
  eventId?: string;
  eventName?: string;
  sessionToken?: string | null;
  isSessionActive?: boolean;
}

export const VideoPlayer = ({ eventId, eventName }: VideoPlayerProps): JSX.Element => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
        <Card className="relative w-full lg:w-full h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Video player component - AWS IVS should be used instead</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
