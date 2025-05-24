import { CreatedEventList } from "@/components/layout/CreatedEventList";
import { EmptyState } from "@/components/layout/EmptyState";
import { EventModal } from "@/components/modals/EventModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export const DashboardOrganise = () => {
  const [open, setOpen] = useState(false);
  const events: any = [
    {
      id: 1,
      title: "Music Night",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
    {
      id: 2,
      title: "Album 2.0",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
  ];

  return (
    <div>
    <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Organise Events</h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage your events</p>
        </div>
        <Button 
          onClick={() => setOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Event
        </Button>
      </div>
    <div>
      <div className="mt-5">
            {events.length > 0 ? (
              <div>
                <CreatedEventList events={events} />
              </div>
            ): (
              <div>
            <EmptyState primaryText={'No Event yet'} secondaryText={'When you create an event ticket, it will show up here'} hasButton={true} buttonText={'Organize Event'} onClickButton={() => {setOpen(true)}} />
          </div>
            )}
          </div>
    </div>
    <EventModal open={open} onOpenChange={setOpen} />
    </div>
  );
};