import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../config/api";
import Select from "react-select";
import Spinner from "../../components/ui/spinner/Spinner";

interface Props {
  open: boolean;
  companyId: number | null;
  onClose: () => void;
  onUpdated: () => void;
}

interface Product {
  id: number;
  product_name: string;
}

interface SelectOption {
  value: number;
  label: string;
}

export default function EditCompanyModal({
  open,
  companyId,
  onClose,
  onUpdated,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    // Load products
    fetch(api("/load_products.php"), { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") setAvailableProducts(d.data);
      });

    // Load company
    fetch(api("/get_company.php?id=" + companyId), { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") setData(d.data);
      });
  }, [companyId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(api("/update_company.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const d = await res.json();
      if (d.status === "success") {
        alert(d.message);
        onUpdated();
        onClose();
      } else {
        alert(d.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;

  const selectedProducts = data.products
    ? (() => {
        try {
          const productIds = JSON.parse(data.products);
          return productIds
            .map((id: number) => {
              const product = availableProducts.find((p) => p.id === id);
              return product
                ? { value: product.id, label: product.product_name }
                : null;
            })
            .filter(Boolean);
        } catch (e) {
          return [];
        }
      })()
    : [];

  return (
    <>
      {/* Full Screen Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Spinner size="lg" />
            <span className="text-lg font-medium">Updating company...</span>
          </div>
        </div>
      )}
      
      <Modal open={open && !saving} onClose={onClose} width="w-[900px]">
      <form onSubmit={handleSave} className="flex flex-col h-full max-h-[70vh]">
        <div className="flex-shrink-0 pb-4 border-b">
          <h2 className="text-xl font-semibold">Edit Company</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Company Name"
                className="border p-2 rounded w-full"
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <input
                placeholder="Registration Number"
                className="border p-2 rounded w-full"
                value={data.reg_no || ""}
                onChange={(e) => setData({ ...data, reg_no: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                placeholder="Email"
                type="email"
                className="border p-2 rounded w-full"
                value={data.email || ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                placeholder="Phone"
                className="border p-2 rounded w-full"
                value={data.phone || ""}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 1 <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Address 1"
                className="border p-2 rounded w-full"
                value={data.address || ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 2
              </label>
              <input
                placeholder="Address 2"
                className="border p-2 rounded w-full"
                value={data.address2 || ""}
                onChange={(e) => setData({ ...data, address2: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 3
              </label>
              <input
                placeholder="Address 3"
                className="border p-2 rounded w-full"
                value={data.address3 || ""}
                onChange={(e) => setData({ ...data, address3: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 4
              </label>
              <input
                placeholder="Address 4"
                className="border p-2 rounded w-full"
                value={data.address4 || ""}
                onChange={(e) => setData({ ...data, address4: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <input
                placeholder="Sector"
                className="border p-2 rounded w-full"
                value={data.sector || ""}
                onChange={(e) => setData({ ...data, sector: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain Name
              </label>
              <input
                placeholder="Domain Name"
                className="border p-2 rounded w-full"
                value={data.domain_name || ""}
                onChange={(e) =>
                  setData({ ...data, domain_name: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products
              </label>
              <Select
                isMulti
                options={availableProducts.map((p) => ({
                  value: p.id,
                  label: p.product_name,
                }))}
                value={selectedProducts}
                onChange={(selected) => {
                  const productIds = (selected as SelectOption[]).map(
                    (s) => s.value
                  );
                  setData({ ...data, products: JSON.stringify(productIds) });
                }}
                placeholder="Select products..."
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-t pt-3 flex justify-end gap-3">
          <button type="button" className="px-4 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
    </>
  );
}
