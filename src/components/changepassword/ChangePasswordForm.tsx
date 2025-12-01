import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ChangePasswordForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  //const [isChecked, setIsChecked] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New Password and Confirm New Password must match.");
      return;
    }

    try {
      const API_URL = "http://localhost/wbadmin/api/change_password.php";
      const res = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid login");
        return;
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        alert("Password successfully changed!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }

      return;
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 w-full max-w-2xl">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Change Password
          </h4>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-x-6 gap-y-6">
                <div className="w-full lg:w-[calc(50%-12px)]">
                  <Label>
                    Old Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      className="a"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your old password"
                      value={oldPassword}
                      onChange={(e: any) => setOldPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-full lg:w-[calc(50%-12px)]">
                  <Label>
                    New Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      className="b"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e: any) => setNewPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-full lg:w-[calc(50%-12px)]">
                  <Label>
                    Confirm New Password{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      className="c"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password again"
                      value={confirmNewPassword}
                      onChange={(e: any) => setConfirmNewPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex justify-start w-full mt-6">
                    <button type="submit">
                      <Button className="mt-6" size="sm">
                        Save Changes
                      </Button>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
