import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { api } from "../../config/api";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

export default function SignInForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetMessage(null);
    
    if (!forgotEmail.trim()) {
      setResetError("Please enter your email address.");
      return;
    }
    
    try {
      const res = await fetch(api("/forgot_password.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
  
      const data = await res.json();
      
      if (data.success) {
        setResetMessage(data.message || "Password reset link sent! Check your email.");
        // Optional: Close the modal after a short delay
        setTimeout(closeModal, 3000); 
      } else {
        setResetError(data.message || "Failed to send reset link. Please check the email address.");
      }
    } catch (err) {
      setResetError("A network error occurred. Please try again later.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(api("/login.php"), {
        method: "POST",
        credentials: "include", // <-- VERY IMPORTANT (for PHP sessions)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid login");
        return;
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }

      return;
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
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

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  {/* <Link
                    to="#!"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link> */}
                  <button
                    type="button"
                    onClick={openModal}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="w-full">
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </button>
              </div>
            </form>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
          <div className="p-8">
            <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
              Reset Your Password
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Enter the email address associated with your account to receive a
              reset link.
            </p>

            {/* Display messages */}
            {resetError && (
              <p className="text-sm text-red-500 mb-4">{resetError}</p>
            )}
            {resetMessage && (
              <p className="text-sm text-green-500 mb-4">{resetMessage}</p>
            )}

            <form onSubmit={handleForgotPassword}>
              {" "}
              <div className="mb-4">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModal} type="button">
                  Cancel
                </Button>
                <Button type="submit">Send Reset Link</Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
