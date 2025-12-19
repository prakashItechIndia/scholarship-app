import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '../shared/api-client';

const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  activeProducts: z.number(),
  activeUsers: z.number(),
  lastActive: z.string(),
});

export type Tenant = z.infer<typeof TenantSchema>;

const TenantListSchema = z.array(TenantSchema);

const FALLBACK_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Acme Manufacturing',
    activeProducts: 3,
    activeUsers: 42,
    lastActive: '5 minutes ago',
  },
  {
    id: 'tenant-2',
    name: 'Mosaic Financial',
    activeProducts: 2,
    activeUsers: 18,
    lastActive: '18 minutes ago',
  },
  {
    id: 'tenant-3',
    name: 'Northwind Renewables',
    activeProducts: 1,
    activeUsers: 9,
    lastActive: '42 minutes ago',
  },
];

export const fetchTenants = async (): Promise<Tenant[]> => {
  try {
    const response = await apiClient.get('/tenants', {
      params: { take: 25 },
    });
    return TenantListSchema.parse(response.data);
  } catch (error) {
    console.warn(
      '[scholarship-app] falling back to mock tenants while /tenants endpoint is unavailable',
      error,
    );
    return FALLBACK_TENANTS;
  }
};

export const useTenantList = () =>
  useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
    staleTime: 1000 * 60,
    initialData: FALLBACK_TENANTS,
  });
