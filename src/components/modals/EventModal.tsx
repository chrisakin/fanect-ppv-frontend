import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { CalendarIcon, ClockIcon, X, EyeIcon, UploadIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
  currency: string;
  price: string;
  hasBroadcastRoom: string;
  broadcastSoftware: string;
  testStreamDate: string;
  eventBanner: File | null;
  eventWatermark: File | null;
  eventTrailer: File | null;
}

interface FormErrors {
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventDescription?: string;
  currency?: string;
  price?: string;
  hasBroadcastRoom?: string;
  broadcastSoftware?: string;
  testStreamDate?: string;
  eventBanner?: string;
  eventWatermark?: string;
  eventTrailer?: string;
}

export const EventModal = ({ open, onOpenChange, event }: EventModalProps): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventDescription: "",
    currency: "NGN",
    price: "",
    hasBroadcastRoom: "",
    broadcastSoftware: "",
    testStreamDate: "",
    eventBanner: null,
    eventWatermark: null,
    eventTrailer: null,
  });
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { updateEvent } = useEventStore();

  // Currency options
  const currencies = [
    { code: "NGN", label: "NGN" },
    { code: "USD", label: "USD" },
    { code: "EUR", label: "EUR" },
    { code: "GBP", label: "GBP" },
    { code: "CAD", label: "CAD" },
  ];

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
          currency: event.currency || "NGN",
          price: event.price || "",
          hasBroadcastRoom: event.hasBroadcastRoom || "",
          broadcastSoftware: event.broadcastSoftware || "",
          testStreamDate: event.testStreamDate || "",
          eventBanner: null,
          eventWatermark: null,
          eventTrailer: null,
        });
        setImagePreviews({
          eventBanner: event.bannerUrl || "",
          eventWatermark: event.watermarkUrl || "",
          eventTrailer: event.trailerUrl || "",
        });
      } catch (error) {
        // If date is invalid, set default values
        const currentDate = new Date();
        setFormData({
          eventName: event.name || "",
          eventDate: currentDate.toISOString().split('T')[0],
          eventTime: currentDate.toTimeString().slice(0, 5),
          eventDescription: event.description || "",
          currency: event.currency || "NGN",
          price: event.price || "",
          hasBroadcastRoom: event.hasBroadcastRoom || "",
          broadcastSoftware: event.broadcastSoftware || "",
          testStreamDate: event.testStreamDate || "",
          eventBanner: null,
          eventWatermark: null,
          eventTrailer: null,
        });
        setImagePreviews({
          eventBanner: event.bannerUrl || "",
          eventWatermark: event.watermarkUrl || "",
          eventTrailer: event.trailerUrl || "",
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

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  function toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/^event/, "event");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = fieldName === 'eventTrailer';
      const validType = isVideo ? file.type.startsWith('video/') : file.type.startsWith('image/');
      
      if (validType) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: file,
        }));
        setErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
        
        // Generate preview for images only
        if (!isVideo) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews((prev) => ({
              ...prev,
              [fieldName]: reader.result as string,
            }));
          };
          reader.readAsDataURL(file);
        } else {
          // For videos, just set a placeholder or file name
          setImagePreviews((prev) => ({
            ...prev,
            [fieldName]: file.name,
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: isVideo ? "Please upload a video file" : "Please upload an image file",
        }));
      }
    }
  };

  const validateStep1 = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    if (!formData.hasBroadcastRoom) {
      newErrors.hasBroadcastRoom = "Please select if you have a broadcast room";
    }

    if (!formData.broadcastSoftware.trim()) {
      newErrors.broadcastSoftware = "Broadcast software information is required";
    }

    if (!formData.testStreamDate) {
      newErrors.testStreamDate = "Test stream date is required";
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

  const handleContinue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateStep2()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.eventName);
        formDataToSend.append('date', formData.eventDate);
        formDataToSend.append('time', formData.eventTime);
        formDataToSend.append('description', formData.eventDescription);
        formDataToSend.append('currency', formData.currency);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('hasBroadcastRoom', formData.hasBroadcastRoom);
        formDataToSend.append('broadcastSoftware', formData.broadcastSoftware);
        formDataToSend.append('testStreamDate', formData.testStreamDate);
        
        if (formData.eventBanner) {
          formDataToSend.append('banner', formData.eventBanner);
        }
        if (formData.eventWatermark) {
          formDataToSend.append('watermark', formData.eventWatermark);
        }
        if (formData.eventTrailer) {
          formDataToSend.append('trailer', formData.eventTrailer);
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
        setCurrentStep(1);
        setFormData({
          eventName: "",
          eventDate: "",
          eventTime: "",
          eventDescription: "",
          currency: "NGN",
          price: "",
          hasBroadcastRoom: "",
          broadcastSoftware: "",
          testStreamDate: "",
          eventBanner: null,
          eventWatermark: null,
          eventTrailer: null,
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

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(1);
    setFormData({
      eventName: "",
      eventDate: "",
      eventTime: "",
      eventDescription: "",
      currency: "NGN",
      price: "",
      hasBroadcastRoom: "",
      broadcastSoftware: "",
      testStreamDate: "",
      eventBanner: null,
      eventWatermark: null,
      eventTrailer: null,
    });
    setImagePreviews({});
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[800px] h-[90vh] p-0 bg-background overflow-y-auto">
        <form onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
          <Card className="w-full bg-gray-50 dark:bg-[#092D1B] rounded-[10px] border border-solid border-[#d5d7da] dark:border-[#1AAA65]">
            <CardContent className="flex flex-col items-center p-0">
              <DialogClose className="absolute right-4 top-4 z-10">
                <X className="h-4 w-4" />
              </DialogClose>

              <div className="flex flex-col w-full max-w-[600px] items-center gap-[60px] py-[75px] px-6">
                {/* Header Section */}
                <div className="flex flex-col w-full max-w-[489px] items-center gap-[30px]">
                  <div className="flex flex-col items-center w-full">
                    <DialogTitle className="font-display-lg-semibold text-gray-800 dark:text-[#CCCCCC] text-[length:var(--display-lg-semibold-font-size)] text-center tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)]">
                      {event ? 'Edit Event' : 'Organize Event'}
                    </DialogTitle>

                    <DialogDescription className="font-display-xs-regular text-[#717680] dark:text-[#CCCCCC] text-[length:var(--display-xs-regular-font-size)] text-center tracking-[var(--display-xs-regular-letter-spacing)] leading-[var(--display-xs-regular-line-height)]">
                      {event ? 'Update your event details' : 'Enter your event details to create an event'}
                    </DialogDescription>
                  </div>
                  <p className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#717680] dark:text-[#CCCCCC] text-lg tracking-[-0.36px]">
                    Step {currentStep} of 2
                  </p>
                </div>

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <>
                    {/* Form Fields */}
                    <div className="flex flex-col items-start gap-6 w-full">
                      {/* Event Name Field */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <label className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Name
                        </label>
                        <div className="relative w-full">
                          <Input
                            id="event-name"
                            className="h-[60px] px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 dark:text-gray-200 text-base tracking-[-0.32px]"
                            placeholder="Enter event name"
                            value={formData.eventName}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                        {errors.eventName && (
                          <span className="text-xs text-red-500">{errors.eventName}</span>
                        )}
                      </div>

                      {/* Event Date Field */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <label className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Date
                        </label>
                        <div className="relative w-full">
                          <Input
                            id="event-date"
                            type="date"
                            className="h-[60px] px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 dark:text-gray-200 text-base tracking-[-0.32px]"
                            value={formData.eventDate}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                          <CalendarIcon className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                        </div>
                        {errors.eventDate && (
                          <span className="text-xs text-red-500">{errors.eventDate}</span>
                        )}
                      </div>

                      {/* Event Time Field */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <label className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Time
                        </label>
                        <div className="relative w-full">
                          <Input
                            id="event-time"
                            type="time"
                            className="h-[60px] px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 dark:text-gray-200 text-base tracking-[-0.32px]"
                            value={formData.eventTime}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                          <ClockIcon className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                        </div>
                        {errors.eventTime && (
                          <span className="text-xs text-red-500">{errors.eventTime}</span>
                        )}
                      </div>

                      {/* Event Description Field with Rich Text */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <label className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Description
                        </label>
                        <Textarea
                          id="event-description"
                          className="h-[94px] px-3.5 pt-5 pb-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 dark:text-gray-200 text-base tracking-[-0.32px] resize-none"
                          placeholder="Enter event description. You can use line breaks for paragraphs and format your text as needed."
                          value={formData.eventDescription}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          style={{ whiteSpace: 'pre-wrap' }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tip: Use line breaks to create paragraphs. Your formatting will be preserved.
                        </p>
                        {errors.eventDescription && (
                          <span className="text-xs text-red-500">{errors.eventDescription}</span>
                        )}
                      </div>
                    </div>

                    {/* Continue Button */}
                    <div className="flex flex-col items-center w-full">
                      <Button 
                        type="button"
                        onClick={handleContinue}
                        className="h-[60px] w-full bg-green-600 rounded-[10px] font-text-lg-semibold text-whitewhite text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] hover:bg-green-700"
                        disabled={isSubmitting}
                      >
                        Continue
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2: Pricing and Media Upload */}
                {currentStep === 2 && (
                  <>
                    {/* Form Fields */}
                    <div className="flex flex-col items-start gap-6 w-full">
                      {/* Event Pricing */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Pricing
                        </h3>
                        
                        <div className="flex items-start gap-1.5 w-full">
                          <div className="w-[93px] h-[60px] flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600">
                            <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                              <SelectTrigger className="w-full h-full border-0 bg-transparent">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency.code} value={currency.code}>
                                    {currency.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex-1 h-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600">
                            <div className="flex items-center justify-between px-3.5 py-2.5 h-full">
                              <Input
                                id="price"
                                type="number"
                                className="border-0 bg-transparent text-gray-700 dark:text-gray-200 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-base tracking-[-0.32px] shadow-none focus-visible:ring-0 p-0 h-full"
                                placeholder="Enter amount"
                                value={formData.price}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                              />
                              <EyeIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        {(errors.currency || errors.price) && (
                          <span className="text-xs text-red-500">
                            {errors.currency || errors.price}
                          </span>
                        )}
                      </div>

                      {/* Broadcast Room Question */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Do you have a broadcast room?
                        </h3>

                        <Select value={formData.hasBroadcastRoom} onValueChange={(value) => handleSelectChange('hasBroadcastRoom', value)}>
                          <SelectTrigger className="h-[60px] bg-gray-50 dark:bg-gray-800 border-[#d5d7da] dark:border-gray-600 w-full">
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.hasBroadcastRoom && (
                          <span className="text-xs text-red-500">{errors.hasBroadcastRoom}</span>
                        )}
                      </div>

                      {/* Broadcast Software */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          What broadcast software will you be using?
                        </h3>

                        <Textarea
                          id="broadcast-software"
                          className="h-[94px] bg-gray-50 dark:bg-gray-800 border-[#d5d7da] dark:border-gray-600 rounded-lg pt-5 pb-2.5 px-3.5 text-gray-700 dark:text-gray-200 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-base tracking-[-0.32px] resize-none"
                          placeholder="Enter answer"
                          value={formData.broadcastSoftware}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {errors.broadcastSoftware && (
                          <span className="text-xs text-red-500">{errors.broadcastSoftware}</span>
                        )}
                      </div>

                      {/* Test Stream Date */}
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Schedule Test Stream with FaNect Support
                        </h3>

                        <div className="relative w-full">
                          <Input
                            id="test-stream-date"
                            type="date"
                            className="h-[60px] px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-gray-600 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-gray-700 dark:text-gray-200 text-base tracking-[-0.32px]"
                            value={formData.testStreamDate}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                          <CalendarIcon className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                        </div>
                        {errors.testStreamDate && (
                          <span className="text-xs text-red-500">{errors.testStreamDate}</span>
                        )}
                      </div>

                      {/* Event Banner Upload */}
                      <div className="flex flex-col w-full h-[165px] items-start gap-1.5">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Banner
                        </h3>

                        <label htmlFor="event-banner" className="cursor-pointer w-full">
                          <div className="h-[133px] flex items-center justify-center w-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-[#a4a7ae] dark:border-gray-600 shadow-shadow-xs hover:border-green-600 transition-colors">
                            <div className="flex flex-col w-[157px] items-center justify-center gap-2.5">
                              {imagePreviews.eventBanner ? (
                                <img
                                  src={imagePreviews.eventBanner}
                                  alt="Banner Preview"
                                  className="w-full h-[120px] object-contain rounded"
                                />
                              ) : (
                                <>
                                  <UploadIcon className="w-6 h-6 text-green-600" />
                                  <span className="text-green-600 whitespace-nowrap [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-base tracking-[-0.32px]">
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

                      {/* Event Watermark Upload */}
                      <div className="flex flex-col w-full h-[165px] items-start gap-1.5">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Custom Watermark (this could be your logo)
                        </h3>

                        <label htmlFor="event-watermark" className="cursor-pointer w-full">
                          <div className="h-[133px] flex items-center justify-center w-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-[#a4a7ae] dark:border-gray-600 shadow-shadow-xs hover:border-green-600 transition-colors">
                            <div className="flex flex-col w-[157px] items-center justify-center gap-2.5">
                              {imagePreviews.eventWatermark ? (
                                <img
                                  src={imagePreviews.eventWatermark}
                                  alt="Watermark Preview"
                                  className="w-full h-[120px] object-contain rounded"
                                />
                              ) : (
                                <>
                                  <UploadIcon className="w-6 h-6 text-green-600" />
                                  <span className="text-green-600 whitespace-nowrap [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-base tracking-[-0.32px]">
                                    Upload watermark
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

                      {/* Event Trailer Upload */}
                      <div className="flex flex-col w-full h-[165px] items-start gap-1.5">
                        <h3 className="font-text-lg-medium text-gray-800 dark:text-[#CCCCCC] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                          Event Trailer
                        </h3>

                        <label htmlFor="event-trailer" className="cursor-pointer w-full">
                          <div className="h-[133px] flex items-center justify-center w-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-[#a4a7ae] dark:border-gray-600 shadow-shadow-xs hover:border-green-600 transition-colors">
                            <div className="flex flex-col w-[157px] items-center justify-center gap-2.5">
                              {imagePreviews.eventTrailer ? (
                                <div className="flex flex-col items-center gap-2">
                                  <UploadIcon className="w-6 h-6 text-green-600" />
                                  <span className="text-green-600 text-xs text-center">
                                    {imagePreviews.eventTrailer}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <UploadIcon className="w-6 h-6 text-green-600" />
                                  <span className="text-green-600 whitespace-nowrap [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-base tracking-[-0.32px]">
                                    Upload event trailer
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <input
                            id="event-trailer"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'eventTrailer')}
                            disabled={isSubmitting}
                          />
                        </label>
                        {errors.eventTrailer && (
                          <span className="text-xs text-red-500">{errors.eventTrailer}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-4 w-full">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-[60px] w-full bg-green-600 rounded-[10px] font-text-lg-semibold text-whitewhite text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] hover:bg-green-700"
                      >
                        {isSubmitting ? 
                          (event ? "Updating Event..." : "Creating Event...") : 
                          (event ? "Update Event" : "Create Event")
                        }
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="h-[60px] w-full border-[#d5d7da] dark:border-gray-600 rounded-[10px] font-text-lg-semibold text-gray-700 dark:text-gray-200 text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)]"
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};