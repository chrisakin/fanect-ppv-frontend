import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { CalendarIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../ui/use-toast";
import axios from "../../lib/axios";
import { useEventStore } from "@/store/eventStore";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any;
}

interface FormData {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventDescription: string;
  eventBanner: File | null;
  eventWatermark: File | null;
}

interface FormErrors {
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventDescription?: string;
  eventBanner?: string;
  eventWatermark?: string;
}

export const EventModal = ({ open, onOpenChange, event }: EventModalProps): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventDescription: "",
    eventBanner: null,
    eventWatermark: null,
  });
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { updateEvent } = useEventStore();

  useEffect(() => {
    if (event) {
      try {
        const eventDate = event.eventDateTime ? new Date(event.eventDateTime) : new Date();
        // Check if the date is valid
        if (isNaN(eventDate.getTime())) {
          throw new Error('Invalid date');
        }
        
        setFormData({
          eventName: event.name || "",
          eventDate: eventDate.toISOString().split('T')[0],
          eventTime: eventDate.toTimeString().slice(0, 5),
          eventDescription: event.description || "",
          eventBanner: null,
          eventWatermark: null,
        });
        setImagePreviews({
          eventBanner: event.bannerUrl || "",
          eventWatermark: event.watermarkUrl || "",
        });
      } catch (error) {
        // If date is invalid, set default values
        const currentDate = new Date();
        setFormData({
          eventName: event.name || "",
          eventDate: currentDate.toISOString().split('T')[0],
          eventTime: currentDate.toTimeString().slice(0, 5),
          eventDescription: event.description || "",
          eventBanner: null,
          eventWatermark: null,
        });
        setImagePreviews({
          eventBanner: event.bannerUrl || "",
          eventWatermark: event.watermarkUrl || "",
        });
      }
    }
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const key = toCamelCase(id) as keyof FormData;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  };

  function toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/^event/, "event");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: file,
        }));
        setErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => ({
            ...prev,
            [fieldName]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Please upload an image file",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    }

    if (!formData.eventTime) {
      newErrors.eventTime = "Event time is required";
    }

    if (!formData.eventDescription.trim()) {
      newErrors.eventDescription = "Event description is required";
    }

    if (!event && !formData.eventBanner) {
      newErrors.eventBanner = "Event banner is required";
    }

    if (!event && !formData.eventWatermark) {
      newErrors.eventWatermark = "Event watermark is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.eventName);
        formDataToSend.append('date', formData.eventDate);
        formDataToSend.append('time', formData.eventTime);
        formDataToSend.append('description', formData.eventDescription);
        if (formData.eventBanner) {
          formDataToSend.append('banner', formData.eventBanner);
        }
        if (formData.eventWatermark) {
          formDataToSend.append('watermark', formData.eventWatermark);
        }

        if (event) {
          await updateEvent(event._id, formDataToSend);
          toast({
            title: "Success",
            description: "Event updated successfully",
          });
        } else {
          await axios.post('/events', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          toast({
            title: "Success",
            description: "Event created successfully",
          });
        }

        onOpenChange(false);
        setFormData({
          eventName: "",
          eventDate: "",
          eventTime: "",
          eventDescription: "",
          eventBanner: null,
          eventWatermark: null,
        });
        setImagePreviews({});
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to create event",
        });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-[850px] h-[90vh] p-0 bg-background overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <Card className="border-none">
            <CardContent className="flex flex-col items-center gap-[60px] py-[35px] px-[45px] relative">
              <DialogClose className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </DialogClose>

              <div className="flex flex-col w-full items-center gap-[30px]">
                <div className="relative w-[156px] h-[38.56px] text-green-600 text-[42.1px] font-semibold tracking-[-0.84px] leading-[56.1px] whitespace-nowrap">
                  FaNect
                </div>

                <div className="flex flex-col items-center w-full">
                  <DialogTitle className="text-2xl font-semibold">
                    {event ? 'Edit Event' : 'Organise Event'}
                  </DialogTitle>

                  <DialogDescription className="text-muted-foreground text-center">
                    {event ? 'Update your event details' : 'Enter your event details to create an event'}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 w-full">
                <div className="flex flex-col items-start gap-6 w-full">
                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="event-name" className="font-medium">
                      Event Name
                    </label>
                    <Input
                      id="event-name"
                      placeholder="Enter event name"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      className="h-10"
                      disabled={isSubmitting}
                    />
                    {errors.eventName && (
                      <span className="text-xs text-red-500">{errors.eventName}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="event-date" className="font-medium">
                      Event Date
                    </label>
                    <div className="flex items-center w-full">
                      <Input
                        id="event-date"
                        type="date"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="h-10"
                        disabled={isSubmitting}
                      />
                      <CalendarIcon className="w-6 h-6 text-[#1AAA65] dark:text-white ml-2" />
                    </div>
                    {errors.eventDate && (
                      <span className="text-xs text-red-500">{errors.eventDate}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="event-time" className="font-medium">
                      Event Time
                    </label>
                    <div className="flex items-center w-full">
                      <Input
                        id="event-time"
                        type="time"
                        value={formData.eventTime}
                        onChange={handleInputChange}
                        className="h-10"
                        disabled={isSubmitting}
                      />
                      <CalendarIcon className="w-6 h-6 text-[#1AAA65] dark:text-white ml-2" />
                    </div>
                    {errors.eventTime && (
                      <span className="text-xs text-red-500">{errors.eventTime}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="event-description" className="font-medium">
                      Event Description
                    </label>
                    <Textarea
                      id="event-description"
                      placeholder="Enter event description"
                      value={formData.eventDescription}
                      onChange={handleInputChange}
                      className="h-[94px] resize-none"
                      disabled={isSubmitting}
                    />
                    {errors.eventDescription && (
                      <span className="text-xs text-red-500">{errors.eventDescription}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="event-banner" className="font-medium">
                      Event Banner
                    </label>
                    <label htmlFor="event-banner" className="cursor-pointer w-full">
                      <div className="flex items-center justify-center w-full h-[133px] border-2 border-dashed rounded-lg hover:border-green-600 transition-colors">
                        <div className="flex flex-col items-center justify-center gap-2.5">
                          {imagePreviews.eventBanner ? (
                            <img
                              src={imagePreviews.eventBanner}
                              alt="Preview"
                              className="w-full h-[120px] object-contain rounded"
                            />
                          ) : (
                            <>
                              <img
                                className="w-6 h-6"
                                alt="Upload icon"
                                src="/icon-content-edit-document-upload.svg"
                              />
                              <span className="text-green-600">
                                Upload event banner
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <input
                        id="event-banner"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'eventBanner')}
                        disabled={isSubmitting}
                      />
                    </label>
                    {errors.eventBanner && (
                      <span className="text-xs text-red-500">{errors.eventBanner}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="event-watermark" className="font-medium">
                      Custom Watermark (this could be your logo)
                    </label>
                    <label htmlFor="event-watermark" className="cursor-pointer w-full">
                      <div className="flex items-center justify-center w-full h-[133px] border-2 border-dashed rounded-lg hover:border-green-600 transition-colors">
                        <div className="flex flex-col items-center justify-center gap-2.5">
                          {imagePreviews.eventWatermark ? (
                            <img
                              src={imagePreviews.eventWatermark}
                              alt="Preview"
                              className="w-full h-[120px] object-contain rounded"
                            />
                          ) : (
                            <>
                              <img
                                className="w-6 h-6"
                                alt="Upload icon"
                                src="/icon-content-edit-document-upload.svg"
                              />
                              <span className="text-green-600">
                                Upload video watermark
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <input
                        id="event-watermark"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'eventWatermark')}
                        disabled={isSubmitting}
                      />
                    </label>
                    {errors.eventWatermark && (
                      <span className="text-xs text-red-500">{errors.eventWatermark}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[60px] bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 
                    (event ? "Updating Event..." : "Creating Event...") : 
                    (event ? "Update Event" : "Create Event")
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};