import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { Event } from "../../store/eventStore"

interface EventCardsSectionProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export const CreatedEventList = ({ events, onEdit, onDelete }: EventCardsSectionProps) => {
  return (
    <div>
      {events.map((event) => (
        <div className="py-3" key={event._id}>
          <Card className="w-full h-auto md:h-[122px] dark:bg-[#062013] dark:border-[#2e483a] bg-white border-gray-200 rounded-lg overflow-hidden border">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[37px] flex-1">
                  <img
                    className="w-full md:w-[272px] h-[79px] object-cover rounded-lg"
                    alt="Event image"
                    src={event.bannerUrl}
                  />
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <div>
                      <div className="font-display-sm-medium text-xl md:text-2xl dark:text-[#828b86] text-gray-800">
                        {event.name}
                      </div>
                      <div className="font-text-lg-regular text-base md:text-lg dark:text-[#828b86] text-gray-600">
                        {event.eventDateTime}
                      </div>
                    </div>
                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVerticalIcon className="w-6 h-6 dark:text-[#828b86] text-gray-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-[#062013] bg-[#FFFFFF] border dark:border-[#2e483a] bg-white border-gray-200 p-3 rounded-lg">
                          <DropdownMenuItem 
                            className="dark:text-[#828b86] text-gray-600 cursor-pointer"
                            onClick={() => onEdit(event)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="dark:text-[#828b86] text-gray-600 cursor-pointer">
                            <Link to={`/dashboard/organise/analytics/${event._id}`}>View Stats</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => onDelete(event._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVerticalIcon className="w-6 h-6 dark:text-[#828b86] text-gray-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-[#062013] bg-[#FFFFFF] border dark:border-[#2e483a] bg-white border-gray-200 p-3 rounded-lg">
                      <DropdownMenuItem 
                        className="dark:text-[#828b86] text-gray-600 cursor-pointer"
                        onClick={() => onEdit(event)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="dark:text-[#828b86] text-gray-600 cursor-pointer">
                        <Link to={`/dashboard/organise/analytics/${event._id}`}>View Stats</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer"
                        onClick={() => onDelete(event._id)}
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