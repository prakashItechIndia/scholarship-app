interface ProductRouteEntry {
  path: string;
  label?: string;
}

export interface ProductRouteConfig {
  code: string;
  label: string;
  defaultPath?: string;
  routes: Record<string, ProductRouteEntry>;
}

const withLeadingSlash = (path: string): string => {
  if (!path) {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
};

export const PRODUCT_ROUTE_CONFIG: Record<string, ProductRouteConfig> = {
  invox: {
    code: 'invox',
    label: 'InvoX',
    defaultPath: '/',
    routes: {
      dashboard: { path: '/', label: 'Dashboard' },
      users: { path: '/users', label: 'Users' },
      invoices: { path: '/invoices', label: 'Invoices' },
    },
  },
  irepo: {
    code: 'irepo',
    label: 'iRepo',
    defaultPath: '/',
    routes: {
      repositories: { path: '/repositories', label: 'Repositories' },
      dashboard: { path: '/', label: 'Dashboard' },
    },
  },
  'customer-portal': {
    code: 'customer-portal',
    label: 'Customer Portal',
    defaultPath: '/',
    routes: {
      home: { path: '/', label: 'Home' },
      tickets: { path: '/tickets', label: 'Tickets' },
    },
  },
  accounts: {
    code: 'accounts',
    label: 'Experience App',
    defaultPath: '/dashboard',
    routes: {
      dashboard: { path: '/dashboard', label: 'Dashboard' },
    },
  },
};

export type ProductRouteResolution =
  | {
      status: 'unknown-product';
    }
  | {
      status: 'invalid-route';
      product: ProductRouteConfig;
      requestedRoute?: string | null;
    }
  | {
      status: 'ok';
      product: ProductRouteConfig;
      routeKey?: string | null;
      routeLabel?: string;
      path: string;
    };

export const resolveProductRoute = (
  rawProductCode: string,
  rawRouteKey: string | null,
): ProductRouteResolution => {
  const productCode = rawProductCode.trim().toLowerCase();
  const product = PRODUCT_ROUTE_CONFIG[productCode];

  if (!product) {
    return { status: 'unknown-product' };
  }

  const routeKey = rawRouteKey?.trim().toLowerCase();

  if (!routeKey) {
    return {
      status: 'ok',
      product,
      path: withLeadingSlash(product.defaultPath ?? '/'),
      routeKey: null,
      routeLabel: undefined,
    };
  }

  const routeEntry = product.routes[routeKey];
  if (!routeEntry) {
    return {
      status: 'invalid-route',
      product,
      requestedRoute: routeKey,
    };
  }

  return {
    status: 'ok',
    product,
    routeKey,
    routeLabel: routeEntry.label,
    path: withLeadingSlash(routeEntry.path),
  };
};
