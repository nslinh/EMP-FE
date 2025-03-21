const ActivityLogSummary = ({ data }: { data: any }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500">Tổng người dùng</h3>
        <p className="mt-2 text-3xl font-semibold">{data?.totalUsers}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500">Tổng hoạt động</h3>
        <p className="mt-2 text-3xl font-semibold">{data?.totalActions}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-500">Hoạt động hôm nay</h3>
        <p className="mt-2 text-3xl font-semibold">
          {data?.todayActions || 0}
        </p>
      </div>
    </div>
  );
};

export default ActivityLogSummary; 