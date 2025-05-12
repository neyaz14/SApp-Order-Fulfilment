import React, { useEffect, useState } from 'react';
import {
  IndexTable,
  Card,
  Text,
  Badge,
  useIndexResourceState,
  Button,
} from '@shopify/polaris';
import OrdersTable from '../components/OrdersTable ';
import useAllOrders from '../hooks/useAllOrders';

const Order = () => {

  const [allorders, refetch, isLoading] = useAllOrders();
  if (isLoading) return (<Text as="p" variant="heading2xl" tone="caution" alignment="center">
    <Text as="span">Wait to get the orders data.....</Text>
  </Text>)
  console.log('all orders ->', allorders)

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div>
      <Button class="order-Refresh-btn" variant="primary" onClick={handleRefresh}>Refresh the Orders </Button>
      <OrdersTable orders={allorders}></OrdersTable>
    </div>
  );
};

export default Order;
