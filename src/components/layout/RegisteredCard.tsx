import { getUser } from "@/lib/auth";
import { Card, CardContent } from "../ui/card";
import { Event } from "@/store/eventStore";
import { Barcode } from "../utils/Barcode";

/**
 * Props for RegisteredCard component
 * @typedef {Object} GiftFriendProps
 * @property {Event} event - Event object with details and banner
 */
type GiftFriendProps = {
  event: Event;
};

/**
 * RegisteredCard Component - Ticket confirmation card after registration
 * 
 * Displays:
 * - Success message with user's first name
 * - Stylized ticket card with event details (name, location, date/time)
 * - Event banner image
 * - Barcode for ticket verification
 * - Dotted separation line for ticket visual design
 * 
 * Features:
 * - Dark green ticket styling (#092D1B) with dashed border
 * - Decorative notches for ticket perforation effect
 * - Barcode generation from ticket URL
 * - Responsive ticket dimensions
 * 
 * @param {GiftFriendProps} props - Component props
 * @returns {JSX.Element} Ticket confirmation card
 */
export const RegisteredCard = ({ event }: GiftFriendProps): JSX.Element => {
   const ticketUrl = `https://fanect.com/watch-event/live/${event._id}`;
  /**
   * Generate barcode value from ticket URL
   * Removes non-alphanumeric chars and limits to 20 chars for barcode encoding
   * @type {string}
   */
  const barcodeValue = ticketUrl.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

  return (
    <div className="min-h-screen flex items-center justify-center py-4 md:px-4">
      {/* Main card wrapper - Light green background with dashed border */}
      <Card className="relative w-[515px] h-[693px] bg-[#d6ece1] rounded-[30px] overflow-hidden border-2 border-dashed border-[#1aaa65]">
        <CardContent className="w-full gap-[31px] pt-[53px] flex flex-col items-center px-4">
          {/* Success message with user name and celebration emoji */}
          <h1 className="w-full max-w-[452px] text-3xl font-semibold text-gray-800 text-center leading-tight">
            Hi {getUser()?.firstName}, you've successfully registered 🎉🎉
          </h1>

          {/* Ticket container section */}
          <div className="gap-[30px] self-stretch w-full flex-[0_0_auto] flex flex-col items-center">
            {/* Main ticket card - Dark theme with decorative elements */}
            <div className="relative w-[300px] h-[479px] bg-[#092D1B] rounded-[30px] shadow-2xl overflow-hidden">
              {/* Decorative notches (4) for ticket perforation effect */}
              <div className="absolute -left-4  w-8 h-8 bg-[#d6ece1] rounded-full"></div>
              <div className="absolute -right-4  w-8 h-8 bg-[#d6ece1] rounded-full"></div>
              <div className="absolute -left-4 top-[300px] w-8 h-8 bg-[#d6ece1] rounded-full"></div>
              <div className="absolute -right-4 top-[300px] w-8 h-8 bg-[#d6ece1] rounded-full"></div>

              {/* Event details card - Semi-transparent with backdrop blur */}
              <Card className="flex w-[262px] h-[280px] items-center p-4 absolute top-[19px] left-[19px] bg-black/20 rounded-2xl border-2 border-solid border-[#1AAA65] backdrop-blur-sm">
                <CardContent className="flex flex-col w-full items-center gap-4 p-0">
                  <div className="flex flex-col w-full items-center text-center">
                    {/* Event name (truncated to 15 chars) in bold font */}
                    <h2 className="text-white text-[28px] font-bold leading-tight mb-2" style={{ fontFamily: 'Road Rage, cursive' }}>
                     {event?.name.substring(0, 15) + '...'}
                    </h2>

                    {/* Event metadata - Location and date/time */}
                    <div className="flex flex-col items-center gap-1.5 p-1">
                      <p className="text-white text-xs font-medium">
                        📍 Online
                      </p>
                      <p className="text-white text-xs font-medium">
                        📅 {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })} | {event.time}
                      </p>
                    </div>
                  </div>

                  {/* Event banner image in gradient container */}
                  <div className="w-[120px] h-[120px] bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="text-white text-3xl font-bold"><img src={event.bannerUrl} className="cover max-h-[120px]" alt="" /></div>
                  </div>
                </CardContent>
              </Card>

              {/* Dotted separator line - Divides event details from barcode */}
              <div className="absolute left-4 !py-4 right-4 !top-[310px] border-t-2 border-dotted border-white/40"></div>

              {/* Barcode section - Contains ticket ID and barcode */}
              <div className="absolute bottom-2.5 left-4 right-4">
                <Card className="bg-black/20 rounded-lg border-2 border-[#1AAA65] p-4 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center gap-2">
                      {/* Ticket ID display */}
                      <div className="text-white text-xs font-medium mb-2">Ticket ID: {event._id}</div>
                      
                      {/* Barcode visualization - Generated from ticket URL */}
                      <div className="bg-white/10 rounded p-2 flex justify-center">
                        <Barcode 
                          value={barcodeValue}
                          width={1.5}
                          height={35}
                          displayValue={false}
                          textColor="#ffffff"
                          lineColor="#ffffff"
                        />
                      </div>
                      
                      {/* Barcode numbers - Display under barcode */}
                      <div className="flex justify-between w-full text-white text-xs font-mono mt-1">
                        <span>1</span>
                        <span>234567</span>
                        <span>891026</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
