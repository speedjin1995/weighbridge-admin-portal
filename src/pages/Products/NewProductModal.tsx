import { useState } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../config/api";
import Spinner from "../../components/ui/spinner/Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewProductModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(api("/create_product.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Product created");
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
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Spinner size="lg" />
            <span className="text-lg font-medium">Creating Product...</span>
          </div>
        </div>
      )}
      <Modal open={open && !saving} onClose={onClose}>
        <form onSubmit={handleSave} className="flex flex-col h-full max-h-[70vh]">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pb-4 border-b">
            <h2 className="text-xl font-semibold">Create Product</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Product Name"
                  className="border p-2 rounded w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
