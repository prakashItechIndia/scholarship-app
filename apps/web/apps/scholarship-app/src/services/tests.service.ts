import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '../shared/api-client';

const TestRecordSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
});

const TestRecordListSchema = z.array(TestRecordSchema);

export type TestRecord = z.infer<typeof TestRecordSchema>;

export interface CreateTestInput {
  name: string;
  description?: string;
}

const TEST_QUERY_KEY = ['tests'];

export const fetchTests = async (): Promise<TestRecord[]> => {
  const response = await apiClient.get('/test');
  return TestRecordListSchema.parse(response.data);
};

export const createTestRecord = async (
  payload: CreateTestInput,
): Promise<TestRecord> => {
  const response = await apiClient.post('/test', payload);
  return TestRecordSchema.parse(response.data);
};

export const useTestList = () =>
  useQuery({
    queryKey: TEST_QUERY_KEY,
    queryFn: fetchTests,
  });

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: TEST_QUERY_KEY });
    },
  });
};
