import { useQuery } from '@tanstack/react-query';
import * as api from '../api';

export const useGroupSummary = (groupId: string) => useQuery({
  queryKey: ['groupSummary', groupId],
  queryFn: () => api.getGroupSummary(groupId),
  enabled: !!groupId,
});

export const useTransactionReport = (filters: api.ReportFilters) => useQuery({
  queryKey: ['transactionReport', filters],
  queryFn: () => api.getTransactionReport(filters),
  enabled: !!filters.startDate && !!filters.endDate,
});
