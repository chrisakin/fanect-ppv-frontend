import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { useSettingsStore } from "../../store/settingsStore";
import { PasswordResetModal } from "../../components/modals/PasswordResetModal";
import { DeleteAccountModal } from "../../components/modals/DeleteAccountModal";
import { useToast } from "../../components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const DashboardSettings = (): JSX.Element => {
  const { 
    settings, 
    withdrawalDetails,
    isLoading, 
    isSaving,
    isWithdrawalLoading,
    isWithdrawalSaving,
    fetchProfile, 
    fetchWithdrawalDetails,
    updateField, 
    updateWithdrawalField,
    updateNotification, 
    saveSettings,
    saveWithdrawalDetails
  } = useSettingsStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchWithdrawalDetails();
  }, [fetchProfile, fetchWithdrawalDetails]);

  const handleSaveChanges = async () => {
    try {
      await saveSettings();
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save settings",
      });
    }
  };

  const handleSaveWithdrawalDetails = async () => {
    try {
      await saveWithdrawalDetails();
      toast({
        title: "Success",
        description: "Withdrawal details saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to save withdrawal details",
      });
    }
  };

  const handleResetPassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 mb-20 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-semibold">Settings</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Manage your account settings</p>
      </div>

      <div className="w-[70%] space-y-12 lg:space-y-16">
        {/* Account Settings Section */}
        <section className="flex flex-col gap-6 lg:gap-8">
          <div className="p-2.5 rounded-[20px]">
            <h2 className="font-display-xs-semibold dark:text-[#a4a7ae] text-gray-700 text-lg sm:text-xl lg:text-2xl">
              Account Settings
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Email Address */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                Email Address
              </label>
              <Input
                className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                value={settings.email}
                disabled
                readOnly
              />
            </div>

            {/* First Name */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                First Name
              </label>
              <Input
                className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                value={settings.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                Last Name
              </label>
              <Input
                className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                value={settings.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
              <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                Password
              </label>
              <div className="flex flex-col sm:flex-row w-full items-stretch sm:items-center gap-3 sm:gap-4">
                <Input
                  className="w-full sm:flex-1 h-12 sm:h-14 lg:h-[42px] dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  type="password"
                  value="**************"
                  disabled
                  readOnly
                />
                <Button
                  className="w-full sm:w-auto sm:flex-shrink-0 h-12 sm:h-14 lg:h-[42px] bg-green-600 text-white rounded-[10px] hover:bg-green-700 text-sm sm:text-base px-4 sm:px-6"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
              </div>
            </div>

            {/* Action Buttons for Account Settings */}
            {/* <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 w-full mt-6">
              <Button
                variant="outline"
                className="w-full sm:w-auto sm:min-w-[140px] h-12 sm:h-14 border-[#D5D7DA] rounded-[10px] text-sm sm:text-base"
                onClick={() => fetchProfile()}
                disabled={isSaving}
              >
                Cancel Changes
              </Button>
              <Button
                className="w-full sm:w-auto sm:min-w-[120px] h-12 sm:h-14 bg-green-600 rounded-[10px] hover:bg-green-700 text-sm sm:text-base"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div> */}
          </div>
        </section>

        {/* Withdrawal Details Section */}
        <section className="flex flex-col gap-6 lg:gap-8">
          <div className="px-2.5 rounded-[20px]">
            <h2 className="font-display-xs-semibold dark:text-[#a4a7ae] text-gray-700 text-lg sm:text-xl lg:text-2xl">
              Withdrawal Details
            </h2>
          </div>

          {isWithdrawalLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:gap-8 w-full">
              {/* Bank Name */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                  Bank Name
                </label>
                <Input
                  className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  value={withdrawalDetails.bankName}
                  onChange={(e) => updateWithdrawalField('bankName', e.target.value)}
                />
              </div>

              {/* Bank Account Number */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                  Bank Account Number
                </label>
                <Input
                  className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  value={withdrawalDetails.accountNumber}
                  onChange={(e) => updateWithdrawalField('accountNumber', e.target.value)}
                />
              </div>

              {/* Name on Account */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                  Name on Account
                </label>
                <Input
                  className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  value={withdrawalDetails.accountName}
                  onChange={(e) => updateWithdrawalField('accountName', e.target.value)}
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                  Bank Type
                </label>
                <Input
                  className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  value={withdrawalDetails.bankType}
                  onChange={(e) => updateWithdrawalField('bankType', e.target.value)}
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                  Bank Routing Number
                </label>
                <Input
                  className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  value={withdrawalDetails.bankRoutingNumber}
                  onChange={(e) => updateWithdrawalField('bankRoutingNumber', e.target.value)}
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <label className="w-full lg:w-48 xl:w-56 font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-sm sm:text-base flex-shrink-0">
                  Address
                </label>
                <Input
                  className="h-12 sm:h-14 lg:h-[42px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA] text-sm sm:text-base"
                  value={withdrawalDetails.address}
                  onChange={(e) => updateWithdrawalField('address', e.target.value)}
                />
              </div>

              {/* Action Buttons for Withdrawal Details */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 w-full mt-6">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto sm:min-w-[140px] h-12 sm:h-14 border-[#D5D7DA] rounded-[10px] text-sm sm:text-base"
                  onClick={() => fetchWithdrawalDetails()}
                  disabled={isWithdrawalSaving}
                >
                  Cancel Changes
                </Button>
                <Button
                  className="w-full sm:w-auto sm:min-w-[120px] h-12 sm:h-14 bg-green-600 rounded-[10px] hover:bg-green-700 text-sm sm:text-base"
                  onClick={handleSaveWithdrawalDetails}
                  disabled={isWithdrawalSaving}
                >
                  {isWithdrawalSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Notification Settings Section */}
        <section className="flex flex-col gap-6 lg:gap-8">
          <div className="p-2.5 rounded-[20px]">
            <h2 className="font-display-xs-semibold dark:text-[#a4a7ae] text-gray-700 text-lg sm:text-xl lg:text-2xl">
              Notification Setting
            </h2>
          </div>

          <div className="flex flex-col gap-8 lg:gap-12 w-full">
            {/* In-app Notifications */}
            <div className="flex flex-col gap-6 lg:gap-8">
              <h3 className="font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-base sm:text-lg">
                In-app Notification
              </h3>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="dark:text-[#bbbbbb] text-gray-700 flex-1 text-sm sm:text-base leading-relaxed">
                    Notify me when my registered event live stream begins
                  </div>
                  <Checkbox
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    checked={settings.notifications.appNotifLiveStreamBegins}
                    onCheckedChange={(checked) =>
                      updateNotification('appNotifLiveStreamBegins', checked as boolean)
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="dark:text-[#bbbbbb] text-gray-700 flex-1 text-sm sm:text-base leading-relaxed">
                    Notify me when my registered event live stream ends
                  </div>
                  <Checkbox
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    checked={settings.notifications.appNotifLiveStreamEnds}
                    onCheckedChange={(checked) =>
                      updateNotification('appNotifLiveStreamEnds', checked as boolean)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex flex-col gap-6 lg:gap-8">
              <h3 className="font-text-lg-medium dark:text-[#dddddd] text-gray-700 text-base sm:text-lg">
                Email Notification
              </h3>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="dark:text-[#bbbbbb] text-gray-700 flex-1 text-sm sm:text-base leading-relaxed">
                    Notify me when my registered event live stream begins
                  </div>
                  <Checkbox
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    checked={settings.notifications.emailNotifLiveStreamBegins}
                    onCheckedChange={(checked) =>
                      updateNotification('emailNotifLiveStreamBegins', checked as boolean)
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="dark:text-[#bbbbbb] text-gray-700 flex-1 text-sm sm:text-base leading-relaxed">
                    Notify me when my registered event live stream ends
                  </div>
                  <Checkbox
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    checked={settings.notifications.emailNotifLiveStreamEnds}
                    onCheckedChange={(checked) =>
                      updateNotification('emailNotifLiveStreamEnds', checked as boolean)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Save Button for Notifications */}
            <div className="flex items-center justify-end">
              <Button
                className="w-full sm:w-auto sm:min-w-[120px] h-12 sm:h-14 bg-green-600 rounded-[10px] hover:bg-green-700 text-sm sm:text-base"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Delete Account Section */}
        <section className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[240px] h-12 sm:h-14 border-[#d92c20] rounded-[10px] text-[#D92D20] hover:bg-red-50 dark:hover:bg-red-950 text-sm sm:text-base"
            onClick={handleDeleteAccount}
          >
            Delete my Account
          </Button>
        </section>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={isDeleteAccountModalOpen} 
        onClose={() => setIsDeleteAccountModalOpen(false)} 
      />
    </div>
  );
};