import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/ProductTables/ProductTableOne";
import { useEffect, useState } from "react";
import NewProductModal from "./NewProductModal";
import EditProductModal from "./EditProductModal";

export default function Products() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setEditId(e.detail);   // get ID from event
      setEditOpen(true);     // open modal
    };

    window.addEventListener("open-edit-product", handler);

    return () => window.removeEventListener("open-edit-product", handler);
  }, []);

  return (
    <>
      <PageMeta
        title="Product Management | Admin Portal"
        description="This is products management page for admin portal"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <ComponentCard 
          title="Products"
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
              </svg> New Product
            </button>
          }>
          <BasicTableOne />
        </ComponentCard>
      </div>

      {/* NEW USER MODAL */}
      <NewProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => window.dispatchEvent(new Event("reload-products"))}
      />

      {/* EDIT USER MODAL */}
      <EditProductModal
        open={editOpen}
        userId={editId}
        onClose={() => setEditOpen(false)}
        onUpdated={() => window.dispatchEvent(new Event("reload-products"))}
      />
    </>
  );
}
