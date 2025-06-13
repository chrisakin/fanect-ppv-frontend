import { useNavigate, useParams } from "react-router-dom";
import { PlusCircleIcon, XCircleIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Event } from "@/store/eventStore";
import { useToast } from "../ui/use-toast";
import axios from "@/lib/axios";

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
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateCurrentFriend = (): boolean => {
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
  };

  const addFriend = () => {
    if (validateCurrentFriend()) {
      const newFriend = {
        ...currentFriend,
        id: Date.now().toString()
      };
      setFriends([...friends, newFriend]);
      setCurrentFriend({ id: '', firstName: '', email: '' });
      setErrors({});
      
      toast({
        title: "Friend added",
        description: `${newFriend.firstName} has been added to the gift list`,
      });
    }
  };

  const removeFriend = (friendId: string) => {
    const friendToRemove = friends.find(friend => friend.id === friendId);
    setFriends(friends.filter(friend => friend.id !== friendId));
    
    if (friendToRemove) {
      toast({
        title: "Friend removed",
        description: `${friendToRemove.firstName} has been removed from the gift list`,
      });
    }
  };

  const handleInputChange = (field: keyof Friend, value: string) => {
    setCurrentFriend({ ...currentFriend, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleGiftFriends = async () => {
    // Validate current friend if fields are filled
    const hasCurrentFriend = currentFriend.firstName.trim() || currentFriend.email.trim();
    let allFriends = [...friends];

    if (hasCurrentFriend) {
      if (validateCurrentFriend()) {
        allFriends = [...friends, { ...currentFriend, id: Date.now().toString() }];
      } else {
        return; // Stop if validation fails
      }
    }

    if (allFriends.length === 0) {
      toast({
        variant: "destructive",
        title: "No friends added",
        description: "Please add at least one friend to gift the streampass",
      });
      return;
    }

    setIsLoading(true);
    try {
      const giftData = {
        eventId: id,
        friends: allFriends.map(friend => ({
          firstName: friend.firstName,
          email: friend.email
        }))
      };

      await axios.post('/gift/gift-friend', giftData);
      
      toast({
        title: "Success",
        description: `Streampass gifted to ${allFriends.length} friend${allFriends.length > 1 ? 's' : ''}`,
      });

      // Navigate to payment success or confirmation page
      navigate(`/dashboard/tickets/event/paid/${id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to gift streampass. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalFriends = friends.length + (currentFriend.firstName.trim() && currentFriend.email.trim() ? 1 : 0);
  const totalPrice = Number(event.price) * Math.max(friends.length, 1);

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
                NGN {Number(event.price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
            disabled={!currentFriend.firstName.trim() || !currentFriend.email.trim() || isLoading}
          >
            <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1aaa65]" />
            <span className="font-medium text-[#1aaa65] text-sm sm:text-base">
              Add more friend
            </span>
          </Button>

          {/* Payment Section */}
          <div className="flex flex-col items-center gap-5 w-full">
            <Button 
              onClick={handleGiftFriends}
              className="w-full h-12 sm:h-14 bg-green-600 hover:bg-green-700 rounded-[10px] text-white text-base sm:text-lg font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay Now (NGN ${totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
              )}
            </Button>
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
              disabled={isLoading}
            >
              Purchase Streampass for myself
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};