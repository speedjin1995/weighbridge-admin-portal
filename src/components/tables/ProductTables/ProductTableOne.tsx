import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Spinner from "../../ui/spinner/Spinner";
import { api } from "../../../config/api";

interface Product {
  id: number;
  no: string;
  product_name: string;
  product_description: string;
}

export default function BasicTableOne() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(api("/load_products.php"), { credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProducts(data.data);
        }
      })
      .catch(() => console.log("Error loading products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    window.addEventListener("reload-products", load);
    return () => window.removeEventListener("reload-products", load);
  }, []);

  const handleEdit = (id: number) => {
    window.dispatchEvent(new CustomEvent("open-edit-product", { detail: id }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const res = await fetch(api("/delete_product.php"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.status === "success") {
      load();
    } else {
      alert(data.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="text-center">No.</TableCell>
                <TableCell isHeader className="text-center">Product Name</TableCell>
                <TableCell isHeader className="text-center">Product Description</TableCell>
                <TableCell isHeader className="text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((product) => (
                <TableRow key={product.id}>
                  {/* USER */}
                  <TableCell className="text-center px-6 py-4">
                    {product.no || "-"}
                  </TableCell>

                  {/* ROLE */}
                  <TableCell className="text-center">
                    {product.product_name || "-"}
                  </TableCell>

                  {/* ROLE */}
                  <TableCell className="text-center">
                    {product.product_description || "-"}
                  </TableCell>
                  
                  {/* ACTIONS */}
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-4">

                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
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