import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CompanyTableOne from "../../components/tables/CompanyTables/CompanyTableOne";

export default function Companies() {
  return (
    <>
      <PageMeta
        title="Companies Management | Admin Portal"
        description="This is companies management page for admin portal"
      />
      <PageBreadcrumb pageTitle="Companies" />
      <div className="space-y-6">
        <ComponentCard title="Companies">
          <CompanyTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
