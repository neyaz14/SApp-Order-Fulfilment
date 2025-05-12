import { useQuery } from 'react-query';
import { useState } from 'react';

const fetchOrdersWithPagination = async ({ cursor, direction, limit }) => {
  // Build the query string with pagination parameters
  const queryParams = new URLSearchParams();
  if (cursor) queryParams.append('cursor', cursor);
  if (direction) queryParams.append('direction', direction);
  if (limit) queryParams.append('limit', limit);
  
  const queryString = queryParams.toString();
  const url = `/api/ordersPage${queryString ? `?${queryString}` : ''}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  
  return {
    orders: data.edges || [],
    pageInfo: data.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null
    }
  };
};

const useOrdersWithPagination = (initialLimit = 10) => {
  const [paginationState, setPaginationState] = useState({
    cursor: null,
    direction: 'next',
    limit: initialLimit
  });
  
  const {
    data = { orders: [], pageInfo: {} },
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', paginationState],
    queryFn: () => fetchOrdersWithPagination(paginationState),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true
  });
  
  const { orders, pageInfo } = data;
  
  const goToNextPage = () => {
    if (pageInfo.hasNextPage) {
      setPaginationState({
        ...paginationState,
        cursor: pageInfo.endCursor,
        direction: 'next'
      });
    }
  };
  
  const goToPreviousPage = () => {
    if (pageInfo.hasPreviousPage) {
      setPaginationState({
        ...paginationState,
        cursor: pageInfo.startCursor,
        direction: 'previous'
      });
    }
  };
  
  const changeLimit = (newLimit) => {
    setPaginationState({
      ...paginationState,
      limit: newLimit,
      cursor: null // Reset cursor when changing limit
    });
  };
  
  return {
    orders,
    pageInfo,
    isLoading,
    error,
    refetch,
    goToNextPage,
    goToPreviousPage,
    changeLimit,
    currentLimit: paginationState.limit
  };
};

export default useOrdersWithPagination;