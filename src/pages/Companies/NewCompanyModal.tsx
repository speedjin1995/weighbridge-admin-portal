import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../config/api";
import Select from "react-select";
import Spinner from "../../components/ui/spinner/Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface Product {
  id: number;
  product_name: string;
}

interface SelectOption {
  value: number;
  label: string;
}

export default function NewCompanyModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [address4, setAddress4] = useState("");
  const [sector, setSector] = useState("");
  const [domainName, setDomainName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(api("/load_products.php"), {
          credentials: "include",
        });
        const data = await response.json();
        if (data.status === "success") {
          setAvailableProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productIds = selectedProducts.map((p) => p.value);

      const res = await fetch(api("/create_company.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          reg_no: regNo,
          email,
          phone,
          address,
          address2,
          address3,
          address4,
          sector,
          domain_name: domainName,
          products: JSON.stringify(productIds),
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Company created");
        onCreated();
        onClose();
      } else {
        alert(data.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Full Screen Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Spinner size="lg" />
            <span className="text-lg font-medium">Creating company...</span>
          </div>
        </div>
      )}
      
      <Modal open={open && !saving} onClose={onClose} width="w-[900px]">
        <form onSubmit={handleSave} className="flex flex-col h-full max-h-[70vh]">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pb-4 border-b">
            <h2 className="text-xl font-semibold">Create Company</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Company Name"
                  className="border p-2 rounded w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  placeholder="Phone"
                  className="border p-2 rounded w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 1 <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Address 1"
                  className="border p-2 rounded w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 3
                </label>
                <input
                  placeholder="Address 3"
                  className="border p-2 rounded w-full"
                  value={address3}
                  onChange={(e) => setAddress3(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 4
                </label>
                <input
                  placeholder="Address 4"
                  className="border p-2 rounded w-full"
                  value={address4}
                  onChange={(e) => setAddress4(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <input
                  placeholder="Sector"
                  className="border p-2 rounded w-full"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain Name
                </label>
                <input
                  placeholder="Domain Name"
                  className="border p-2 rounded w-full"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>

              {/* Products Multi-Select with react-select */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Products
                </label>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Spinner size="sm" />
                    <span className="ml-2 text-gray-500">Loading products...</span>
                  </div>
                ) : (
                  <Select
                    isMulti
                    options={availableProducts.map((p) => ({
                      value: p.id,
                      label: p.product_name,
                    }))}
                    value={selectedProducts}
                    onChange={(selected) =>
                      setSelectedProducts(selected as SelectOption[])
                    }
                    placeholder="Select products..."
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t pt-3 flex justify-end gap-3">
            <button type="button" className="px-4 py-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}