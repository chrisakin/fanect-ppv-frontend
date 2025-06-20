import { StarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import axios from "../../lib/axios";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName?: string;
}

export const FeedbackModal = ({ isOpen, onClose, eventId, eventName }: FeedbackModalProps): JSX.Element => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a rating before submitting your feedback.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/feedback', {
        eventId,
        ratings: rating,
        comments: comment.trim() || undefined,
      });

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });

      // Reset form and close modal
      setRating(null);
      setComment("");
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(null);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[432px] p-0" hideCloseButton>
        <DialogTitle className="sr-only">
          Rate Your Streaming Experience
        </DialogTitle>
        
        <Card className="w-full rounded-[20px] overflow-hidden border-none">
          <CardContent className="p-0">
            <div className="flex flex-col w-full items-start gap-11 p-[38px_25px_25px]">
              <div className="flex flex-col items-center gap-10 w-full">
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="flex flex-col items-center gap-2 w-full">
                    <h2 className="font-text-xl-medium font-[number:var(--text-xl-medium-font-weight)] text-black dark:text-white text-[length:var(--text-xl-medium-font-size)] text-center tracking-[var(--text-xl-medium-letter-spacing)] leading-[var(--text-xl-medium-line-height)] [font-style:var(--text-xl-medium-font-style)]">
                      How was your streaming experience?
                    </h2>
                    {eventName && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        {eventName}
                      </p>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-[13.58px]">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <StarIcon
                        key={starValue}
                        className={`w-[23.14px] h-[23.14px] cursor-pointer transition-colors ${
                          (hoveredRating !== null && starValue <= hoveredRating) ||
                          (rating !== null && starValue <= rating)
                            ? "text-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                        fill={
                          (hoveredRating !== null && starValue <= hoveredRating) ||
                          (rating !== null && starValue <= rating)
                            ? "currentColor"
                            : "none"
                        }
                        onMouseEnter={() => setHoveredRating(starValue)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleRatingClick(starValue)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col h-[105px] items-start gap-1.5 w-full">
                  <label className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-800 dark:text-gray-200 text-base tracking-[-0.32px]">
                    Tell us more (Optional)
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about the event..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                    className="h-[65px] px-3.5 py-2.5 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 dark:text-gray-300 text-base tracking-[-0.32px] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-[10px] p-2.5"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !rating}
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded-[10px] p-2.5 font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-white text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
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