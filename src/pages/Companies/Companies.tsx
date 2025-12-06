import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CompanyTableOne from "../../components/tables/CompanyTables/CompanyTableOne";
import NewCompanyModal from "./NewCompanyModal";
import EditCompanyModal from "./EditCompanyModal";

export default function Companies() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setEditId(e.detail); // get ID from event
      setEditOpen(true); // open modal
    };

    window.addEventListener("open-edit-user", handler);

    return () => window.removeEventListener("open-edit-user", handler);
  }, []);

  return (
    <>
      <PageMeta
        title="Companies Management | Admin Portal"
        description="This is companies management page for admin portal"
      />
      <PageBreadcrumb pageTitle="Companies" />
      <div className="space-y-6">
        <ComponentCard
          title="Companies"
          actions={
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Company
            </button>
          }
        >
          <CompanyTableOne />
        </ComponentCard>
      </div>

      {/* NEW USER MODAL */}
      <NewCompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => window.dispatchEvent(new Event("reload-companies"))}
      />

      {/* EDIT USER MODAL */}
      <EditCompanyModal
        open={editOpen}
        companyId={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={() => window.dispatchEvent(new Event("reload-companies"))}
      />
    </>
  );
}
