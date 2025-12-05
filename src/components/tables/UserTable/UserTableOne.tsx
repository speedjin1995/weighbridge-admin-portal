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

  useEffect(() => {
    fetch(api("/load_users.php"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setUsers(data.data);
      })
      .catch(() => console.log("Error loading users"));
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>User</TableCell>
                <TableCell isHeader>Role</TableCell>
                <TableCell isHeader>Email</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800">
                          {user.name}
                        </span>
                        <span className="block text-gray-500 text-sm">
                          {user.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}