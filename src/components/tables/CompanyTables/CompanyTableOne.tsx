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

interface Company {
  id: number;
  reg_no: string;
  name: string;
  address: string;
  address2: string;
  address3: string;
  address4: string;
  phone: string;
  email: string;
  products: string;
  domain_name: string;
  sector: string;
}

export default function BasicTableOne() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (id: number) => {
    window.dispatchEvent(new CustomEvent("open-edit-user", { detail: id }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    const res = await fetch(api("/delete_company.php"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.status === "success") {
      // Reload companies
      const fetchCompanies = async () => {
        try {
          setLoading(true);
          const url = api("/load_companies.php");

          const response = await fetch(url, {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch companies");
          }

          const data = await response.json();

          if (data.status === "success") {
            setCompanies(data.data);
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (err) {
          console.error("Error fetching companies:", err);
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };
      fetchCompanies();
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const url = api("/load_companies.php");

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();

        if (data.status === "success") {
          setCompanies(data.data);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="text-center">
                  No
                </TableCell>
                <TableCell isHeader className="text-center">
                  Company Details
                </TableCell>
                <TableCell isHeader className="text-center">
                  Contact Information
                </TableCell>
                <TableCell isHeader className="text-center">
                  Address
                </TableCell>
                <TableCell isHeader className="text-center">
                  Sector
                </TableCell>
                <TableCell isHeader className="text-center">
                  Domain
                </TableCell>
                <TableCell isHeader className="text-center">
                  Products
                </TableCell>
                <TableCell isHeader className="text-center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {companies.map((company, index) => (
                <TableRow key={company.id}>
                  {/* NO */}
                  <TableCell className="text-center px-6 py-4">
                    <span className="font-medium text-gray-800">
                      {index + 1}
                    </span>
                  </TableCell>

                  {/* COMPANY DETAILS */}
                  <TableCell className="text-center px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-gray-800">
                        {company.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        Reg: {company.reg_no}
                      </span>
                    </div>
                  </TableCell>

                  {/* CONTACT INFORMATION */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      {company.phone && (
                        <span className="text-gray-500">{company.phone}</span>
                      )}
                      {company.email && (
                        <span className="text-sm text-gray-500">
                          {company.email}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* ADDRESS */}
                  <TableCell className="text-center">
                    <div className="max-w-xs mx-auto text-gray-500">
                      <p>{company.address}</p>
                      {company.address2 && <p>{company.address2}</p>}
                      {company.address3 && <p>{company.address3}</p>}
                      {company.address4 && <p>{company.address4}</p>}
                    </div>
                  </TableCell>

                  {/* SECTOR */}
                  <TableCell className="text-center text-gray-500">
                    {company.sector || "-"}
                  </TableCell>

                  {/* DOMAIN NAME */}
                  <TableCell className="text-center text-gray-500">
                    {company.domain_name || "-"}
                  </TableCell>

                  {/* PRODUCTS */}
                  <TableCell className="text-center">
                    <div className="max-w-xs mx-auto text-gray-500 whitespace-pre-line">
                      {company.products || "-"}
                    </div>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(company.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(company.id)}
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
