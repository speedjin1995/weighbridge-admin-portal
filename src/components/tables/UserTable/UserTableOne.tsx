import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { api } from "../../../config/api";

interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  email: string;
  image?: string;
}

export default function BasicTableOne() {
  const [users, setUsers] = useState<User[]>([]);

  const load = () => {
    fetch(api("/load_users.php"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setUsers(data.data);
      })
      .catch(() => console.log("Error loading users"));
  };

  useEffect(() => {
    load();
    window.addEventListener("reload-users", load);
    return () => window.removeEventListener("reload-users", load);
  }, []);

  const handleEdit = (id: number) => {
    window.dispatchEvent(new CustomEvent("open-edit-user", { detail: id }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const res = await fetch(api("/delete_user.php"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.status === "success") load();
    else alert(data.message);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="text-center">User</TableCell>
                <TableCell isHeader className="text-center">Role</TableCell>
                <TableCell isHeader className="text-center">Email</TableCell>
                <TableCell isHeader className="text-right pr-6">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  {/* USER */}
                  <TableCell className="text-center px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-gray-800">{user.name}</span>
                      <span className="text-sm text-gray-500">{user.username}</span>
                    </div>
                  </TableCell>

                  {/* ROLE */}
                  <TableCell className="text-center">
                    <Badge
                      size="sm"
                      color={
                        user.role === "ADMIN"
                          ? "success"
                          : user.role === "SADMIN"
                          ? "warning"
                          : "info"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell className="text-center">{user.email}</TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-4">

                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑 Delete
                      </button>

                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}