import { Dialog, DialogClose, DialogDescription, DialogTitle } from "../ui/dialog";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { DialogContent } from "@radix-ui/react-dialog";

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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("event-", "event")]: value,
    }));
    // Clear error when user starts typing
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [id.replace("event-", "event")]: undefined,
      }));
    }
  };

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
        // Here you would typically send the data to your backend
        console.log("Form submitted:", formData);
        onOpenChange(false);
        // Reset form
        setFormData({
          eventName: "",
          eventDate: "",
          eventTime: "",
          eventDescription: "",
          eventBanner: null,
          eventWatermark: null,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    setIsSubmitting(false);
  };

  // Form field data for mapping
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
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-y-auto rounded-lg">
          <form onSubmit={handleSubmit}>
            <Card className="w-[750px] bg-white dark:bg-[#02150c] rounded-[10px] border border-solid border-[#E4E4E7] dark:border-[#2e483a]">
              <CardContent className="flex flex-col items-center gap-[60px] py-[51px] px-[75px] relative">
                <DialogClose className="absolute right-4 top-4">
                  <Button type="button" variant="ghost" size="icon">
                    <X className="h-4 w-4 text-[#71767C] dark:text-white" />
                  </Button>
                </DialogClose>

                <div className="flex flex-col w-[489px] items-center gap-[30px]">
                  <div className="relative w-[156px] h-[38.56px] [font-family:'Sofia_Pro-SemiBold',Helvetica] font-semibold text-[#1AAA65] text-[42.1px] tracking-[-0.84px] leading-[56.1px] whitespace-nowrap">
                    FaNect
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <DialogTitle className="font-display-lg-semibold font-[number:var(--display-lg-semibold-font-weight)] text-[#333333] dark:text-[#dddddd] text-[length:var(--display-lg-semibold-font-size)] text-center tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)]">
                      Organise Event
                    </DialogTitle>

                    <DialogDescription className="font-display-xs-regular font-[number:var(--display-xs-regular-font-weight)] text-[#71767C] dark:text-[#cccccc] text-[length:var(--display-xs-regular-font-size)] text-center tracking-[var(--display-xs-regular-letter-spacing)] leading-[var(--display-xs-regular-line-height)] whitespace-nowrap">
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
                          className="font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[#333333] dark:text-[#dddddd] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]"
                        >
                          {field.label}
                        </label>

                        {field.type === "textarea" ? (
                          <div className="w-full">
                            <Textarea
                              id={field.id}
                              placeholder={field.placeholder}
                              className="h-[94px] bg-white dark:bg-[#132019] rounded-lg border border-solid border-[#E4E4E7] dark:border-[#2e483a] shadow-shadow-xs [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#71767C] dark:text-[#bbbbbb] text-base tracking-[-0.32px] leading-normal"
                              value={formData[field.id.replace("event-", "event") as keyof FormData] as string}
                              onChange={handleInputChange}
                            />
                            {field.error && (
                              <p className="mt-1 text-sm text-red-500">{field.error}</p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full">
                            <div className="flex items-center w-full h-[60px] bg-white dark:bg-[#13201a] rounded-lg border border-solid border-[#E4E4E7] dark:border-[#2e483a] shadow-shadow-xs">
                              <Input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder}
                                className="h-full border-none bg-transparent shadow-none [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#71767C] dark:text-[#bbbbbb] text-base tracking-[-0.32px] leading-normal"
                                value={formData[field.id.replace("event-", "event") as keyof FormData] as string}
                                onChange={handleInputChange}
                              />
                              {field.icon && <div className="pr-3.5">{field.icon}</div>}
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
                          className="font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[#333333] dark:text-[#dddddd] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]"
                        >
                          {field.label}
                        </label>

                        <label
                          htmlFor={field.id}
                          className="cursor-pointer w-full"
                        >
                          <div className="flex items-center justify-center w-full h-[133px] bg-white dark:bg-[#132019] rounded-lg border border-dashed border-[#E4E4E7] dark:border-[#2e483a] shadow-shadow-xs">
                            <div className="flex flex-col items-center justify-center gap-2.5">
                              <img
                                className="w-6 h-6"
                                alt="Upload icon"
                                src="/icon-content-edit-document-upload.svg"
                              />
                              <span className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#1AAA65] dark:text-[#bbbbbb] text-base tracking-[-0.32px] leading-normal whitespace-nowrap">
                                {field.uploadText}
                              </span>
                            </div>
                          </div>
                          <input
                            id={field.id}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, field.id.replace("event-", "event") as keyof FormData)}
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
                    className="h-[60px] w-full bg-[#96E6BE] hover:bg-[#96E6BE]/90 dark:bg-green-600 dark:hover:bg-green-600/90 rounded-[10px] font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-[#1AAA65] dark:text-white text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)]"
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