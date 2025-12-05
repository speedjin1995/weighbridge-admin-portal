import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserTableOne from "../../components/tables/UserTable/UserTableOne";
import NewUserModal from "./NewUserModal";
import EditUserModal from "./EditUserModal"; // <-- MUST IMPORT

export default function Users() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setEditId(e.detail);   // get ID from event
      setEditOpen(true);     // open modal
    };

    window.addEventListener("open-edit-user", handler);

    return () => window.removeEventListener("open-edit-user", handler);
  }, []);

  return (
    <>
      <PageMeta
        title="Users Management | Admin Portal"
        description="This is users management page for admin portal"
      />

      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <ComponentCard
          title="Users"
          actions={
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              ➕ New User
            </button>
          }
        >
          <UserTableOne />
        </ComponentCard>
      </div>

      {/* NEW USER MODAL */}
      <NewUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => window.dispatchEvent(new Event("reload-users"))}
      />

      {/* EDIT USER MODAL */}
      <EditUserModal
        open={editOpen}
        userId={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={() => window.dispatchEvent(new Event("reload-users"))}
      />
    </>
  );
}