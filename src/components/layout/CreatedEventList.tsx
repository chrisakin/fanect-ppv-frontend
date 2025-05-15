import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

interface Event {
    id: string;
    title: string;
    date: string;
    image: string;
  }
  
  interface EventCardsSectionProps {
    events: Event[];
  }

export const CreatedEventList= ( { events }: EventCardsSectionProps ) => {
    return (
        <div>
            {events.map((event) => (
            <div className="py-3">
                <Card
              key={event.id}
              className={`w-full h-auto md:h-[122px] dark:bg-[#062013] dark:border-[#2e483a] bg-white border-gray-200 rounded-lg overflow-hidden border`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[37px]">
                    <img
                      className="w-full md:w-[272px] h-[79px] object-cover rounded-lg"
                      alt="Event image"
                      src={event.image}
                    />
                    <div className={`font-display-sm-medium text-xl md:text-2xl dark:text-[#828b86] text-gray-800`}>
                      {event.title}
                    </div>
                    <div className={`font-text-lg-regular text-base md:text-lg dark:text-[#828b86] text-gray-600`}>
                      {event.date}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVerticalIcon className={`w-6 h-6 dark:text-[#828b86] text-gray-600`} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-[#062013] bg-[#FFFFFF] border dark:border-[#2e483a] bg-white border-gray-200 p-3 rounded-lg ">
                      <DropdownMenuItem className="dark:text-[#828b86] text-gray-600 cursor-pointer">Edit</DropdownMenuItem>
                      <DropdownMenuItem className="dark:text-[#828b86] text-gray-600 cursor-pointer"><Link to={`/dashboard/organise/analytics/${event.id}`}>View Stats</Link></DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
    )}