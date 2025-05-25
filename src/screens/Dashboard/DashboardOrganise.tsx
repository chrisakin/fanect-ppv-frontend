import { CreatedEventList } from "@/components/layout/CreatedEventList";
import { EmptyState } from "@/components/layout/EmptyState";
import { EventModal } from "@/components/modals/EventModal";
import { DeleteEventModal } from "@/components/modals/DeleteEventModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useEventStore } from "@/store/eventStore";
import { PaginationIndex } from "@/components/utils/Pagination";

export const DashboardOrganise = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    events, 
    isLoading,
    isDeleteLoading,
    pagination,
    fetchMyEvents, 
    deleteEvent,
    selectedEvent,
    setSelectedEvent
  } = useEventStore();

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEventId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Select one event",
      });
      return;
    }

    try {
      await deleteEvent(selectedEventId);
      setIsDeleteModalOpen(false);
      setSelectedEventId(null);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete event",
      });
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setSelectedEvent(null);
  };

  const handlePageChange = (page: number) => {
    fetchMyEvents(page);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Organise Events</h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage your events</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Event
        </Button>
      </div>

      <div>
        <div className="mt-5">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : events.length > 0 ? (
            <div>
              <CreatedEventList 
                events={events} 
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
              <PaginationIndex 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <EmptyState 
              primaryText="No Event yet" 
              secondaryText="When you create an event ticket, it will show up here" 
              hasButton={true} 
              buttonText="Organize Event" 
              onClickButton={() => setIsCreateModalOpen(true)} 
            />
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <EventModal 
          open={isCreateModalOpen} 
          onOpenChange={handleModalClose}
          event={selectedEvent}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteEventModal 
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleDelete}
          isLoading={isDeleteLoading}
        />
      )}
    </div>
  );
};