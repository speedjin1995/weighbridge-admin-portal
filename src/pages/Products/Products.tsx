import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/ProductTables/ProductTableOne";

export default function Products() {
  return (
    <>
      <PageMeta
        title="Product Management | Admin Portal"
        description="This is products management page for admin portal"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <ComponentCard title="Products">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
