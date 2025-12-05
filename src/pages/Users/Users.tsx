import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/UserTable/UserTableOne";

export default function Users() {
  const handleAddUser = () => {
    // Example - navigate to Add User page
    window.location.href = "/users/new";
  };

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
          /*actions={
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              ➕ New User
            </button>
          }*/
        >
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}

