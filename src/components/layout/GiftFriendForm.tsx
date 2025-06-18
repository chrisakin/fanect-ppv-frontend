import { useNavigate, useParams } from "react-router-dom";
import { PlusCircleIcon, XCircleIcon, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Event } from "@/store/eventStore";
import { useToast } from "../ui/use-toast";
import { StreampassPaymentButton } from "../utils/StreampassPayment";

type GiftFriendProps = {
  event: Event;
};

interface Friend {
  id: string;
  firstName: string;
  email: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
}

export const GiftFriend = ({ event }: GiftFriendProps): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // State for managing friends
  const [friends, setFriends] = useState<Friend[]>([]);
  
  const [currentFriend, setCurrentFriend] = useState<Friend>({
    id: '',
    firstName: '',
    email: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validation function
  const validateCurrentFriend = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!currentFriend.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!currentFriend.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFriend.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (friends.some(friend => friend.email.toLowerCase() === currentFriend.email.toLowerCase())) {
      newErrors.email = "This email has already been added";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentFriend, friends]);

  const addFriend = useCallback(() => {
    if (validateCurrentFriend()) {
      const newFriend = {
        ...currentFriend,
        id: Date.now().toString()
      };
      setFriends(prev => [...prev, newFriend]);
      setCurrentFriend({ id: '', firstName: '', email: '' });
      setErrors({});
      
      toast({
        title: "Friend added",
        description: `${newFriend.firstName} has been added to the gift list`,
      });
    }
  }, [currentFriend, validateCurrentFriend, toast]);

  const removeFriend = useCallback((friendId: string) => {
    const friendToRemove = friends.find(friend => friend.id === friendId);
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
    
    if (friendToRemove) {
      toast({
        title: "Friend removed",
        description: `${friendToRemove.firstName} has been removed from the gift list`,
      });
    }
  }, [friends, toast]);

  const handleInputChange = useCallback((field: keyof Friend, value: string) => {
    setCurrentFriend(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Memoize friends data for payment to prevent recalculation on every render
  const friendsForPayment = useMemo(() => {
    let allFriends = [...friends];
    
    // Add current friend if both fields are filled and valid
    const hasCurrentFriend = currentFriend.firstName.trim() && currentFriend.email.trim();
    if (hasCurrentFriend) {
      // Create a temporary validation without setting errors
      const tempErrors: FormErrors = {};
      
      if (!currentFriend.firstName.trim()) {
        tempErrors.firstName = "First name is required";
      }

      if (!currentFriend.email.trim()) {
        tempErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFriend.email)) {
        tempErrors.email = "Please enter a valid email address";
      } else if (friends.some(friend => friend.email.toLowerCase() === currentFriend.email.toLowerCase())) {
        tempErrors.email = "This email has already been added";
      }

      // Only add current friend if validation passes
      if (Object.keys(tempErrors).length === 0) {
        allFriends = [...friends, { ...currentFriend, id: Date.now().toString() }];
      }
    }

    // Transform friends data to match the expected format
    return allFriends.map(friend => ({
      firstName: friend.firstName,
      email: friend.email
    }));
  }, [friends, currentFriend]);

  // Validate that we have friends for payment
  const canProceedWithPayment = useMemo(() => {
    return friendsForPayment.length > 0;
  }, [friendsForPayment]);

  // Handle payment button click with validation
  const handlePaymentClick = useCallback(() => {
    // if (!canProceedWithPayment) {
    //   toast({
    //     variant: "destructive",
    //     title: "No friends added",
    //     description: "Please add at least one friend to gift the streampass",
    //   });
    //   return null;
    // }
    return friendsForPayment;
  }, [canProceedWithPayment, friendsForPayment, toast]);

  const totalFriends = friends.length + (currentFriend.firstName.trim() && currentFriend.email.trim() ? 1 : 0);
  const totalPrice = Number(event.price.amount) * Math.max(friendsForPayment.length, 1);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-50 dark:bg-[#092D1B] border border-dashed border-[#a4a7ae] dark:border-[#1AAA65] rounded-[10px] p-6 sm:p-8 md:p-10">
      <div className="flex flex-col items-start gap-8">
        {/* Header Section */}
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-[#CCCCCC]">
            Gift Streampass to a Friend
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-[#CCCCCC]">
            Your friends will get a notification via email
          </p>
        </div>

        <div className="flex flex-col items-start gap-11 w-full">
          {/* Price Section */}
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex flex-col items-start gap-2 w-full">
              <label className="text-sm font-medium text-gray-800 dark:text-[#CCCCCC]">
                Price per friend
              </label>
              <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-[#CCCCCC]">
               {event.price?.currency} {Number(event.price?.amount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Friends Section */}
          <div className="flex flex-col items-start gap-8 w-full">
            {/* Email Badges */}
            {friends.length > 0 && (
              <div className="flex items-start gap-3 flex-wrap">
                {friends.map((friend) => (
                  <Badge
                    key={friend.id}
                    variant="outline"
                    className="flex items-center justify-center gap-2.5 p-2.5 bg-gray-100 dark:bg-gray-800 rounded-[20px] border border-solid border-[#d5d7da] dark:border-[#2e483a] hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {friend.email}
                    </span>
                    <XCircleIcon 
                      className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-red-500 transition-colors" 
                      onClick={() => removeFriend(friend.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Current Friend Form */}
            <div className="flex flex-col items-start gap-6 w-full">
              <h2 className="text-lg font-medium text-[#1aaa65] dark:text-[#1aaa65]">
                Friend {friends.length + 1}
              </h2>

              <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex flex-col items-start gap-6 w-full">
                  {/* First Name Field */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-base sm:text-lg font-medium text-gray-800 dark:text-[#CCCCCC]">
                      Friend's First Name
                    </label>
                    <Input
                      className="h-12 sm:h-14 lg:h-[62px] px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-[#2e483a] text-gray-700 dark:text-gray-300"
                      value={currentFriend.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <span className="text-xs text-red-500">{errors.firstName}</span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-base sm:text-lg font-medium text-gray-800 dark:text-[#CCCCCC]">
                      Friend's Email Address
                    </label>
                    <Input
                      className="h-12 sm:h-14 lg:h-[62px] px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-[#d5d7da] dark:border-[#2e483a] text-gray-700 dark:text-gray-300"
                      value={currentFriend.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      type="email"
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">{errors.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add More Friend Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-0 hover:bg-transparent disabled:opacity-50"
            onClick={addFriend}
            disabled={!currentFriend.firstName.trim() || !currentFriend.email.trim()}
          >
            <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1aaa65]" />
            <span className="font-medium text-[#1aaa65] text-sm sm:text-base">
              Add more friend
            </span>
          </Button>

          {/* Payment Section */}
          <div className="flex flex-col items-center gap-5 w-full">
            <StreampassPaymentButton 
              friends={handlePaymentClick()}
              totalPrice={totalPrice}
              currency={event.price.currency}
            />
            <p className="text-center text-sm text-gray-800 dark:text-[#CCCCCC]">
              By clicking 'Pay Now', you agree with FaNect's terms and condition
            </p>
          </div>

          {/* Purchase for Self Link */}
          <div className="text-center w-full">
            <Button
              variant="link"
              className="text-green-600 text-base underline hover:text-green-700 transition p-0"
              onClick={() => navigate(`/dashboard/tickets/event/streampass/${id}`)}
            >
              Purchase Streampass for myself
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};