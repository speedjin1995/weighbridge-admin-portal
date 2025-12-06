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

export default function EditUserModal({ open, onClose, onUpdated, userId }: Props) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(api("/get_user.php?id=" + userId), { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") setData(d.user);
      });
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(api("/update_user.php"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const d = await res.json();
      if (d.status === "success") {
        alert("User updated.");
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
            <span className="text-lg font-medium">Updating User...</span>
          </div>
        </div>
      )}
      <Modal open={open && !saving} onClose={onClose}>
        <form onSubmit={handleSave} className="flex flex-col h-full max-h-[70vh]">
          {/* Fixed Header */}
          <div className="flex-shrink-0 pb-4 border-b">
            <h2 className="text-xl font-semibold">Edit User</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Full Name"
                  className="border p-2 rounded w-full"
                  value={data.name || ""}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  placeholder="Username"
                  className="border p-2 rounded w-full bg-gray-100"
                  value={data.username || ""}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Email"
                  type="email"
                  className="border p-2 rounded w-full"
                  value={data.email || ""}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  className="border p-2 rounded w-full"
                  value={data.role_code || ""}
                  onChange={(e) => setData({ ...data, role_code: e.target.value })}
                  required
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SADMIN">Super Admin</option>
                  <option value="USER">User</option>
                </select>
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