import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { useSettingsStore } from "../../store/settingsStore";


export const DashboardSettings = (): JSX.Element => {
  const { settings, updateField, updateNotification } = useSettingsStore();
  const [password, setPassword] = useState("**************");

  const handleSaveChanges = () => {
    // Handle save changes logic here
    console.log("Saving changes:", settings);
  };

  const handleResetPassword = () => {
    // Handle password reset logic here
    console.log("Resetting password");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Deleting account");
  };

  return (
    <div className="flex flex-col gap-[30px] md:gap-[50px] px-4 md:px-2 mb-[70px]">
      {/* Header Section */}
      <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-gray-500 dark:text-gray-400">Manage your account settings</p>
    </div>

    <div className="w-[80%]">
        {/* Account Settings Section */}
        <section className="flex flex-col gap-6">
        <div className="p-2.5 rounded-[20px]">
          <h2 className="font-display-xs-semibold dark:text-[#a4a7ae] text-gray-700 text-xl md:text-2xl">
            Account Settings
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
            <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
              Email Address
            </label>
            <Input
              className="h-[62px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
              value={settings.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
            <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
              First Name
            </label>
            <Input
              className="h-[62px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
              value={settings.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
            <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
              Last Name
            </label>
            <Input
              className="h-[62px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
              value={settings.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
            <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
              Password
            </label>
            <div className="flex flex-col md:flex-row w-full md:w-[647px] items-center gap-2.5">
              <Input
                className="w-full md:w-[451px] h-[62px] dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="w-full md:w-auto flex-1 bg-green-600 text-whitewhite rounded-[10px]"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Withdrawal Details Section */}
      <section className="flex flex-col gap-6 mt-[80px]">
        <div className="px-2.5 rounded-[20px]">
          <h2 className="font-display-xs-semibold dark:text-[#a4a7ae] text-gray-700 text-xl md:text-2xl">
            Withdrawal Details
          </h2>
        </div>

        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
              <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
                Bank Name
              </label>
                  <Input
                    className="h-[62px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
                    value={settings.bankName}
                    onChange={(e) => updateField('bankName', e.target.value)}
                  />
                  {/* <ChevronDownIcon className="w-6 h-6" /> */}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
              <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
                Bank Account Number
              </label>
              <Input
                className="h-[62px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
                value={settings.accountNumber}
                onChange={(e) => updateField('accountNumber', e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2.5 md:pl-[50px]">
              <label className="w-full md:w-[200px] font-text-lg-medium dark:text-[#dddddd] text-gray-700">
                Name on Account
              </label>
              <Input
                className="h-[62px] flex-1 dark:bg-[#13201A] dark:border-[#2E483A] dark:text-[#bbbbbb] border-[#D5D7DA]"
                value={settings.accountName}
                onChange={(e) => updateField('accountName', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-5 w-full mt-5">
            <Button
              variant="outline"
              className="w-full md:w-[183px] border-[#D5D7DA] rounded-[10px]"
              onClick={() => window.location.reload()}
            >
              Cancel Changes
            </Button>
            <Button
              className="w-full md:w-[138px] bg-green-600 rounded-[10px]"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      {/* Notification Settings Section */}
      <section className="flex flex-col gap-6 mt-[80px]">
        <div className="p-2.5 rounded-[20px]">
          <h2 className="font-display-xs-semibold dark:text-[#a4a7ae] text-gray-700 text-xl md:text-2xl">
            Notification Setting
          </h2>
        </div>

        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-10">
            {/* In-app Notifications */}
            <div className="flex-col items-start justify-center gap-8 flex md:pl-[50px]">
              <h3 className="font-text-lg-medium dark:text-[#dddddd] text-gray-700 w-full md:w-[672px]">
                In-app Notification
              </h3>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="dark:text-[#bbbbbb] w-full md:w-[672px]">
                    Notify me when someone follows me
                  </div>
                  <Checkbox
                    className="w-6 h-6"
                    checked={settings.notifications.inApp.followMe}
                    onCheckedChange={(checked) =>
                      updateNotification('inApp', 'followMe', checked as boolean)
                    }
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="dark:text-[#bbbbbb] w-full md:w-[672px]">
                    Notify me when my registered event live stream begins
                  </div>
                  <Checkbox
                    className="w-6 h-6"
                    checked={settings.notifications.inApp.streamBegins}
                    onCheckedChange={(checked) =>
                      updateNotification('inApp', 'streamBegins', checked as boolean)
                    }
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="dark:text-[#bbbbbb] w-full md:w-[672px]">
                    Notify me when my registered event live stream ends
                  </div>
                  <Checkbox
                    className="w-6 h-6"
                    checked={settings.notifications.inApp.streamEnds}
                    onCheckedChange={(checked) =>
                      updateNotification('inApp', 'streamEnds', checked as boolean)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex-col items-start justify-center gap-8 flex md:pl-[50px]">
              <h3 className="font-text-lg-medium dark:text-[#dddddd] text-gray-700 w-full md:w-[672px]">
                Email Notification
              </h3>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="dark:text-[#bbbbbb] w-full md:w-[672px]">
                    Notify me when someone follows me
                  </div>
                  <Checkbox
                    className="w-6 h-6"
                    checked={settings.notifications.email.followMe}
                    onCheckedChange={(checked) =>
                      updateNotification('email', 'followMe', checked as boolean)
                    }
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="dark:text-[#bbbbbb] w-full md:w-[672px]">
                    Notify me when my registered event live stream begins
                  </div>
                  <Checkbox
                    className="w-6 h-6"
                    checked={settings.notifications.email.streamBegins}
                    onCheckedChange={(checked) =>
                      updateNotification('email', 'streamBegins', checked as boolean)
                    }
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="dark:text-[#bbbbbb] w-full md:w-[672px]">
                    Notify me when my registered event live stream ends
                  </div>
                  <Checkbox
                    className="w-6 h-6"
                    checked={settings.notifications.email.streamEnds}
                    onCheckedChange={(checked) =>
                      updateNotification('email', 'streamEnds', checked as boolean)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-5 py-6">
            <Button
              className="w-full md:w-[138px] bg-green-600 rounded-[10px]"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      {/* Delete Account Section */}
      <section>
        <Button
          variant="outline"
          className="w-full md:w-[303px] border-[#d92c20] rounded-[10px] text-[#D92D20]"
          onClick={handleDeleteAccount}
        >
          Delete my Account
        </Button>
      </section>
</div>
    </div>
  );
};