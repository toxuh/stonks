import { DashboardHeaderConfigurator } from "./header";

const DashboardPage = () => {
  return (
    <div className="grid gap-4">
      <DashboardHeaderConfigurator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded border p-4">Card 1</div>
        <div className="rounded border p-4">Card 2</div>
        <div className="rounded border p-4">Card 3</div>
      </div>
    </div>
  );
};

export default DashboardPage;

