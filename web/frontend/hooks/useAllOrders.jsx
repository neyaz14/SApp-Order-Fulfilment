import { useQuery } from 'react-query';

const fetchOrders = async () => {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  return data.edges || [];
};

const useAllOrders = (options = {}) => {
  const result = useQuery({
    queryKey: ['allorders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    ...options
  });
  
  const { data: allorders = [], refetch, isLoading, error } = result;
  
  return [allorders, refetch, isLoading, error];
};

export default useAllOrders;