import { useTenantList } from '../../services/tenants.service';

const columnClasses = 'px-3 py-2 text-left text-sm text-slate-500';
const cellClasses = 'px-3 py-2 text-sm text-slate-700';

export const TenantsTable = () => {
  const { data, isLoading, isError, refetch } = useTenantList();
  const tenants = data ?? [];

  const handleRetry = () => {
    void refetch();
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading tenants…</p>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Unable to load tenant list.{' '}
        <button
          type="button"
          onClick={handleRetry}
          className="font-medium underline underline-offset-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <thead className="bg-slate-50">
          <tr>
            <th className={`${columnClasses} font-semibold`}>Organization</th>
            <th className={`${columnClasses} font-semibold`}>
              Active products
            </th>
            <th className={`${columnClasses} font-semibold`}>Users</th>
            <th className={`${columnClasses} font-semibold`}>Last activity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-slate-50/80">
              <td className={`${cellClasses} font-medium text-slate-900`}>
                {tenant.name}
              </td>
              <td className={cellClasses}>{tenant.activeProducts}</td>
              <td className={cellClasses}>{tenant.activeUsers}</td>
              <td className={cellClasses}>{tenant.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
