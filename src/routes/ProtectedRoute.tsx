import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [auth, setAuth] = useState<null | boolean>(null);

  useEffect(() => {
    fetch("http://localhost/wbadmin/api/check_session.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAuth(data.loggedIn === true);
      })
      .catch(() => setAuth(false));
  }, []);

  // Still loading session check
  if (auth === null) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>Checking session...</div>
      </div>
    );
  }

  return auth ? <Outlet /> : <Navigate to="/signin" replace />;
}
