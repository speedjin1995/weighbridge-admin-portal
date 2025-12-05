import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../config/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  userId: number | null;
}

export default function EditUserModal({ open, onClose, onUpdated, userId }: Props) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    fetch(api("/get_user.php?id=" + userId), { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") setData(d.user);
      });
  }, [userId]);

  const handleSave = async () => {
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
  };

  if (!data) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>

      <div className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={data.role_code}
          onChange={(e) => setData({ ...data, role_code: e.target.value })}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SADMIN">SADMIN</option>
          <option value="USER">USER</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button onClick={onClose}>Cancel</button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}