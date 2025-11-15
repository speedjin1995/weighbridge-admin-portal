import { useState, useEffect } from "react";

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

export default function UserMetaCard() {
  const [fetchedUser, setFetchedUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost/wbadmin/api/update_profile.php";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status} - ${response.statusText}`
          );
        }

        const result: ApiResponse = await response.json();

        if (result.status === "success" && result.user) {
          setFetchedUser(result.user);
        } else {
          setError(result.message || "Failed to retrieve user data.");
          setFetchedUser(null);
        }
      } catch (e: any) {
        console.error("Fetching error: ", e);
        setError(`A network or parsing error occurred: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayUser = fetchedUser;

  if (isLoading) {
    return <p className="text-center p-5">Loading user data...</p>;
  }

  if (error || !displayUser) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 text-center">
        <p className="text-red-500">Error: {error || "Failed to load user profile."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src="./images/user/owner.jpg" alt="user" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {displayUser.username || "User Name Not Found"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                {displayUser.role_code || "User Name Not Found"}
                </p>
              </div>
            </div>
            </div>
        </div>
      </div>
    </>
  );
}
