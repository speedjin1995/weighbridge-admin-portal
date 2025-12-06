import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../config/api";
import Spinner from "../../components/ui/spinner/Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  userId: number | null;
}

export default function EditProductModal({ open, onClose, onUpdated, userId }: Props) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(api("/get_product.php?id=" + userId), { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") setData(d.product);
      });
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(api("/update_product.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const d = await res.json();
      if (d.status === "success") {
        alert("Product updated.");
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

  return (
    <>
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Spinner size="lg" />
            <span className="text-lg font-medium">Updating Product...</span>
          </div>
        </div>
      )}
      <Modal open={open && !saving} onClose={onClose}>
        <form onSubmit={handleSave} className="flex flex-col h-full max-h-[70vh]">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pb-4 border-b">
            <h2 className="text-xl font-semibold">Edit Product</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Full Name"
                  className="border p-2 rounded w-full"
                  value={data.product_name || ""}
                  onChange={(e) => setData({ ...data, product_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <input
                  placeholder="Description"
                  className="border p-2 rounded w-full"
                  value={data.product_description || ""}
                  onChange={(e) => setData({ ...data, product_description: e.target.value })}
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