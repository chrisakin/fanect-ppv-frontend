import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";

/**
 * EmptyStateProps
 *
 * Props for the EmptyState component for displaying empty/no-results states.
 *  - primaryText: string – Main heading text (e.g. "No Events Found")
 *  - secondaryText: string – Subheading or description text below primary text
 *  - hasButton?: boolean – Whether to show an action button (default: false)
 *  - buttonText?: string – Text label for the action button (only used if hasButton is true)
 *  - onClickButton?: (open: boolean) => void – Callback when button is clicked, passes true
 */
interface EmptyStateProps {
  primaryText: string;
  secondaryText: string;
  hasButton?: boolean;
  buttonText?: string;
  onClickButton?: (open: boolean) => void;
}

/**
 * EmptyState
 *
 * Reusable component for displaying empty/no-results states across the application.
 *
 * Features:
 *  - Centered card layout with search icon illustration
 *  - Primary heading text (larger, semibold)
 *  - Secondary description text (smaller, muted)
 *  - Optional action button for triggering modals or actions
 *  - Responsive text sizing: smaller on mobile, larger on desktop (md+)
 *  - Full width with max-width constraint for proper centering
 *  - No shadow or border for clean appearance
 *  - Dark mode compatible color classes
 *
 * Common Use Cases:
 *  - No search results found
 *  - Empty event lists
 *  - No notifications
 *  - No purchased events/tickets
 *  - Empty user data states
 *
 * Arguments:
 *  - primaryText: string – Main heading (e.g. "No Events Found")
 *  - secondaryText: string – Description text
 *  - hasButton?: boolean – Show action button (optional)
 *  - buttonText?: string – Button label text (optional)
 *  - onClickButton?: (open: boolean) => void – Callback when button clicked (optional)
 *
 * Returns: JSX.Element
 *
 * Example:
 *   <EmptyState
 *     primaryText="No Events Found"
 *     secondaryText="Try searching for a different keyword or create a new event"
 *     hasButton={true}
 *     buttonText="Create Event"
 *     onClickButton={(open) => setModalOpen(open)}
 *   />
 */
export const EmptyState = ({
  primaryText,
  secondaryText,
  hasButton,
  buttonText,
  onClickButton,
}: EmptyStateProps) => {
  return (
    <div className="w-full flex justify-center px-4">
      {/* Card wrapper: No shadow or border for clean appearance */}
      <Card className="w-full max-w-5xl border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-6 py-10 text-center">
          {/* Search/Empty icon illustration */}
          <div className="w-32 h-auto">
            <img
              src="/icons/search.svg"
              alt="Empty"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Text content section */}
          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            {/* Primary heading text */}
            <h2 className="text-gray-500 text-lg md:text-xl font-semibold">
              {primaryText}
            </h2>

            {/* Secondary description text */}
            <p className="text-gray-400 text-sm md:text-base">
              {secondaryText}
            </p>

            {/* Optional action button (conditionally rendered) */}
            {hasButton && (
              <div className="mt-4 w-full max-w-sm">
                <Button
                  onClick={() => onClickButton?.(true)}
                  className="w-full bg-green-600 hover:bg-green-600/90 rounded-lg py-2.5 px-6"
                >
                  <span className="text-white text-base md:text-lg font-medium">
                    {buttonText}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
