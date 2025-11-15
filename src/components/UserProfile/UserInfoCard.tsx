import { useState, useEffect, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface UserData {
  id: number;
  username: string;
  name: string;
  role_code: string;
  email: string;
}

interface ApiResponse {
  status: "success" | "error";
  user?: UserData;
  message?: string;
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [fetchedUser, setFetchedUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const API_URL = "http://localhost/wbadmin/api/update_profile.php";
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.status === "success" && result.user) {
          setFetchedUser(result.user);
          setFormData({
            name: result.user.name,
            email: result.user.email,
          });
        } else {
          setError(result.message || "Failed to retrieve user data.");
          setFetchedUser(null);
        }

      } catch (e: any) {
        console.error("Fetching error:", e);
        setError(`A network or parsing error occurred: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveError(null); // Clear errors on input change
    setSaveSuccess(null); // Clear success message on input change
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isOpen && fetchedUser) {
      // Reset formData to the current fetchedUser values when modal opens
      setFormData({
        name: fetchedUser.name,
        email: fetchedUser.email,
      });
      setSaveError(null);
      setSaveSuccess(null);
    }
  }, [isOpen, fetchedUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !fetchedUser) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setSaveError("Name and Email cannot be empty.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      let response: Response;
      response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (result.status === "success" && result.user) {
        setFetchedUser(result.user);
        setSaveSuccess(result.message || "Profile updated successfully!");
        setTimeout(() => closeModal(), 1500);
      } else {
        setSaveError(result.message || "Failed to save profile changes.");
      }
    } catch (e: any) {
      console.error("Saving error: ", e);
      setSaveError(`A network error occurred while saving: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const displayUser = fetchedUser;

  if (isLoading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading personal information...
        </p>
      </div>
    );
  }

  if (error || !displayUser) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 text-center">
        <p className="text-red-500">
          Error: {error || "Failed to load personal profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="flex flex-col space-y-7">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {displayUser.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {displayUser.email}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
            {saveError && (
              <p className="text-sm text-red-500 mb-4">{saveError}</p>
            )}
            {/* Display save success */}
            {saveSuccess && (
              <p className="text-sm text-green-500 mb-4">{saveSuccess}</p>
            )}
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="flex flex-col space-y-5">
                  <div className="w-full">
                    <Label>Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <Label>Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
