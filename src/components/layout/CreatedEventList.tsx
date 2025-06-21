import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { Event } from "../../store/eventStore"
import { formatInputDate, formatTime } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface EventCardsSectionProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'dark:bg-[#294435] bg-[#dcfcec] text-[#1aaa65] hover:!bg-[#dcfcec] dark:hover:!bg-[#294435]' ;
    case 'Pending':
      return 'dark:bg-[#294435] bg-[#feecb5] dark:text-[#87928C] text-[#ad923c] hover:!bg-[#feecb5] dark:hover:!bg-[#294435]';
    default:
      return 'dark:bg-[#294435] bg-[#f5dbd9] text-[#d6675f] hover:!bg-[#f5dbd9] dark:hover:!bg-[#294435]';
  }
};

export const CreatedEventList = ({ events, onEdit, onDelete }: EventCardsSectionProps) => {
const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
const [screenType, setScreenType] = useState<string>('')
  return (
   <div>
  {events.map((event) => (
    <div className="py-3" key={event._id}>
      <Card className="w-full h-auto md:h-[122px] dark:bg-[#062013] dark:border-[#2e483a] bg-white border-gray-200 rounded-lg overflow-hidden border">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1 w-full">
              <img
                className="w-full md:w-[272px] h-[79px] object-cover rounded-lg"
                alt="Event image"
                src={event.bannerUrl}
              />
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 flex-1">
                {/* Event name */}
                <div className="w-full truncate">
                  <div className="font-display-sm-medium text-xl md:text-2xl dark:text-[#828b86] text-gray-800 truncate">
                    {event.name}
                  </div>

                  {/* Date/Time - mobile only */}
                  <div className="md:hidden mt-1 font-text-lg-regular text-base text-gray-600 dark:text-[#828b86]">
                    {`${formatInputDate(new Date(event.date))} ${formatTime(event.time)}`}
                  </div>

                  {/* Badge + Dropdown - mobile only */}
                  <div className="md:hidden block mt-2 flex items-center justify-between w-full">
                    <Badge
                      className={`flex h-[30px] items-center justify-center gap-2 px-3 rounded-[8px] font-medium text-sm tracking-[-0.32px] whitespace-nowrap border-none ${getStatusClass(event.adminStatus)}`}
                    >
                      {event.adminStatus === 'Approved' && (
                        <img src="/icons/tick-circle.svg" className="w-4 h-4" />
                      )}
                      {event.adminStatus}
                    </Badge>

                    <DropdownMenu
                    key={event._id}
                    open={openDropdownId === event._id && screenType == 'isMobile'}
                    onOpenChange={(open) => {
                    setOpenDropdownId(open ? event._id : null);
                    setScreenType(open ? 'isMobile' : '');
                    }}>
                      <DropdownMenuTrigger className="focus-visible:outline-none">
                        <MoreVerticalIcon className="w-5 h-5 dark:text-[#828b86] text-gray-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-[#062013] bg-[#FFFFFF] border dark:border-[#2e483a] border-gray-200 p-3 rounded-lg">
                        <DropdownMenuItem
                          className="dark:text-[#828b86] text-gray-600 cursor-pointer"
                          onSelect={() => {
                            setOpenDropdownId(null)// close dropdown
                            onEdit(event);          // then open modal
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        {event.adminStatus === 'Approved' && (
                          <DropdownMenuItem className="dark:text-[#828b86] text-gray-600 cursor-pointer">
                            <Link to={`/dashboard/organise/analytics/${event._id}`}>
                              View Stats
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onSelect={() => {
                          setOpenDropdownId(null)
                          onDelete(event._id);
                        }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Date/Time - desktop */}
                <div className="hidden md:block font-text-lg-regular text-base text-gray-600 dark:text-[#828b86] truncate mt-2">
                  {`${formatInputDate(new Date(event.date))} ${formatTime(event.time)}`}
                </div>

                {/* Badge - desktop */}
                <div className="hidden md:block">
                  <Badge
                    className={`flex h-[30px] items-center justify-center gap-2 px-2 max-w-[170px]  rounded-[8px] font-medium text-sm tracking-[-0.32px] whitespace-nowrap border-none ${getStatusClass(event.adminStatus)}`}
                  >
                    {event.adminStatus === 'Approved' && (
                      <img src="/icons/tick-circle.svg" className="w-4 h-4" />
                    )}
                    {event.adminStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dropdown - desktop */}
            <div className="hidden md:block">
              <DropdownMenu
                  key={event._id}
                    open={openDropdownId === event._id && screenType == 'isDesktop'}
                    onOpenChange={(open) => {
                    setOpenDropdownId(open ? event._id : null);
                    setScreenType(open ? 'isDesktop' : '');
                    }}>
                <DropdownMenuTrigger className="focus-visible:outline-none">
                  <MoreVerticalIcon className="w-5 h-5 dark:text-[#828b86] text-gray-600 " />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-[#062013] bg-[#FFFFFF] border dark:border-[#2e483a] border-gray-200 p-3 rounded-lg">
                  <DropdownMenuItem
                    className="dark:text-[#828b86] text-gray-600 cursor-pointer dark:hover:!text-[#FFFFFF]"
                    onSelect={() => {
                      setOpenDropdownId(null);
                      onEdit(event);          // then open modal
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  {event.adminStatus === 'Approved' && (
                    <DropdownMenuItem className="dark:text-[#828b86] text-gray-600 cursor-pointer dark:hover:!text-[#FFFFFF]">
                      <Link to={`/dashboard/organise/analytics/${event._id}`}>
                        View Stats
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                     onSelect={() => {
                      setOpenDropdownId(null);
                      onDelete(event._id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ))}
</div>

  );
};