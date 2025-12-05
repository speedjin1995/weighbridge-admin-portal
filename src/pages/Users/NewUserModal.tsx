import { useState } from "react";
import Modal from "../../components/common/Modal";
import { api } from "../../config/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewUserModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("NORMAL");
  const [email, setEmail] = useState("");

  const handleSave = async () => {
    const res = await fetch(api("/create_user.php"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, role }),
    });

    const data = await res.json();
    if (data.status === "success") {
      alert("User created");
      onCreated();
      onClose();
    } else {
      alert(data.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Create User</h2>

      <div className="flex flex-col gap-3">
        <input
          placeholder="Full Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          type="email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="NORMAL">Normal</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="border-t mt-4 pt-3 flex justify-end gap-3">
        <button className="px-4 py-2" onClick={onClose}>
          Cancel
        </button>
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
