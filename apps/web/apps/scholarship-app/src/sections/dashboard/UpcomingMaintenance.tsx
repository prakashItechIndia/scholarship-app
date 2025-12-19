const maintenanceWindows = [
  {
    id: 'mw-1',
    product: 'Customer Portal',
    window: 'Nov 22, 01:00—02:00 UTC',
    impact: 'Read-only mode and delayed webhooks',
  },
  {
    id: 'mw-2',
    product: 'Billing BFF',
    window: 'Nov 30, 04:00—04:30 UTC',
    impact: 'Intermittent Zoho sync delays',
  },
];

export const UpcomingMaintenance = () => (
  <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <header>
      <h2 className="text-lg font-semibold text-slate-900">
        Scheduled maintenance
      </h2>
      <p className="text-sm text-slate-500">
        Keep customer success informed about upcoming downtime windows.
      </p>
    </header>

    <ul className="grid gap-3">
      {maintenanceWindows.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3"
        >
          <span className="text-sm font-semibold text-slate-900">
            {item.product}
          </span>
          <span className="text-sm text-slate-600">{item.window}</span>
          <span className="text-xs text-slate-500">{item.impact}</span>
        </li>
      ))}
    </ul>
  </section>
);
