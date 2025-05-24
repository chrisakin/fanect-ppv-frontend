import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../ui/use-toast";
import axios from "../../lib/axios";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const EventModal = ({ open, onOpenChange }: EventModalProps): JSX.Element => {
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

    if (!formData.eventBanner) {
      newErrors.eventBanner = "Event banner is required";
    }

    if (!formData.eventWatermark) {
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

        await axios.post('/events', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast({
          title: "Success",
          description: "Event created successfully",
        });

        onOpenChange(false);
        setFormData({
          eventName: "",
          eventDate: "",
          eventTime: "",
          eventDescription: "",
          eventBanner: null,
          eventWatermark: null,
        });
        setImagePreviews({})
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

  const formFields = [
    {
      id: "event-name",
      label: "Event Name",
      placeholder: "Enter event name",
      type: "input",
      error: errors.eventName,
    },
    {
      id: "event-date",
      label: "Event Date",
      placeholder: "Enter event date",
      type: "date",
      icon: <CalendarIcon className="w-6 h-6 text-[#1AAA65] dark:text-white" />,
      error: errors.eventDate,
    },
    {
      id: "event-time",
      label: "Event Time",
      placeholder: "Enter event time",
      type: "time",
      icon: <CalendarIcon className="w-6 h-6 text-[#1AAA65] dark:text-white" />,
      error: errors.eventTime,
    },
    {
      id: "event-description",
      label: "Event Description",
      placeholder: "Enter event description",
      type: "textarea",
      error: errors.eventDescription,
    },
  ];

  const uploadFields = [
    {
      id: "event-banner",
      label: "Event Banner",
      uploadText: formData.eventBanner ? formData.eventBanner.name : "Upload event banner",
      error: errors.eventBanner,
    },
    {
      id: "event-watermark",
      label: "Custom Watermark (this could be your logo)",
      uploadText: formData.eventWatermark ? formData.eventWatermark.name : "Upload video watermark",
      error: errors.eventWatermark,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-[850px] h-[90vh] p-0 bg-background overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <Card className="border-none">
            <CardContent className="flex flex-col items-center gap-[60px] py-[35px] px-[45px] relative">
              <DialogClose className="absolute right-4 top-4">
              </DialogClose>

              <div className="flex flex-col w-full items-center gap-[30px]">
                <div className="relative w-[156px] h-[38.56px] text-green-600 text-[42.1px] font-semibold tracking-[-0.84px] leading-[56.1px] whitespace-nowrap">
                  FaNect
                </div>

                <div className="flex flex-col items-center w-full">
                  <DialogTitle className="text-2xl font-semibold">
                    Organise Event
                  </DialogTitle>

                  <DialogDescription className="text-muted-foreground text-center">
                    Enter your event details to create an event
                  </DialogDescription>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 w-full">
                <div className="flex flex-col items-start gap-6 w-full">
                  {formFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex flex-col items-start gap-1.5 w-full"
                    >
                      <label
                        htmlFor={field.id}
                        className="font-medium"
                      >
                        {field.label}
                      </label>

                      {field.type === "textarea" ? (
                        <div className="w-full">
                          <Textarea
                            id={field.id}
                            placeholder={field.placeholder}
                            className="h-[94px] resize-none"
                            value={formData[toCamelCase(field.id) as keyof FormData] as string}
                            onChange={handleInputChange}
                          />
                          {field.error && (
                            <p className="mt-1 text-sm text-red-500">{field.error}</p>
                          )}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex items-center w-full">
                            <Input
                              id={field.id}
                              type={field.type}
                              placeholder={field.placeholder}
                              className="flex-1"
                              value={formData[toCamelCase(field.id) as keyof FormData] as string}
                              onChange={handleInputChange}
                            />
                            {field.icon && <div className="ml-2">{field.icon}</div>}
                          </div>
                          {field.error && (
                            <p className="mt-1 text-sm text-red-500">{field.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {uploadFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex flex-col items-start gap-1.5 w-full"
                    >
                      <label
                        htmlFor={field.id}
                        className="font-medium"
                      >
                        {field.label}
                      </label>

                       <label htmlFor={field.id} className="cursor-pointer w-full">
    <div className="flex items-center justify-center w-full h-[133px] border-2 border-dashed rounded-lg hover:border-green-600 transition-colors">
      <div className="flex flex-col items-center justify-center gap-2.5">
        {imagePreviews[toCamelCase(field.id)] ? (
          <img
            src={imagePreviews[toCamelCase(field.id)]}
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
              {field.uploadText}
            </span>
          </>
        )}
      </div>
    </div>
    <input
      id={field.id}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleFileChange(e, toCamelCase(field.id) as keyof FormData)}
    />
  </label>
                      {field.error && (
                        <p className="mt-1 text-sm text-red-500">{field.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[60px] bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};