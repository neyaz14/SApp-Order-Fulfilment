import React from 'react';
import {
    Text,
    Button,
    LegacyStack,
    Select,
    Spinner
} from '@shopify/polaris';
import OrdersTable from '../components/OrdersTablePage';
import useOrdersWithPagination from '../hooks/useOrdersWithPagination';

const Order = () => {
    const {
        orders,
        pageInfo,
        isLoading,
        refetch,
        goToNextPage,
        goToPreviousPage,
        changeLimit,
        currentLimit
    } = useOrdersWithPagination(10);

    const handleLimitChange = (value) => {
        changeLimit(parseInt(value));
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Spinner size="large" />
                <Text as="p" variant="headingMd" tone="caution" alignment="center">
                    Loading orders data...
                </Text>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginTop: '16px' , marginBottom:'16px'}}>
                <LegacyStack distribution="equalSpacing" alignment="center" spacing="tight">
                    <Button onClick={refetch} primary>
                        Refresh Orders
                    </Button>

                    <LegacyStack distribution="trailing" alignment="center" spacing="tight">
                        <Select
                            label="Items per page"
                            labelInline
                            options={[
                                { label: '5', value: '5' },
                                { label: '10', value: '10' },
                                { label: '25', value: '25' },
                                { label: '50', value: '50' }
                            ]}
                            value={currentLimit.toString()}
                            onChange={handleLimitChange}
                        />

                        <Text variant="bodyMd">
                            {orders.length > 0 ? `Showing ${orders.length} orders` : 'No orders found'}
                        </Text>

                        <Button
                            onClick={goToPreviousPage}
                            disabled={!pageInfo.hasPreviousPage}
                            icon={
                                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16l-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6z" fill="currentColor" />
                                </svg>
                            }
                        >Previous</Button>

                        <Button
                            onClick={goToNextPage}
                            disabled={!pageInfo.hasNextPage}
                            icon={
                                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 16l6-6-6-6-1.4 1.4 4.6 4.6-4.6 4.6z" fill="currentColor" />
                                </svg>
                            }
                         >Next</Button>
                    </LegacyStack>
                </LegacyStack>
            </div>

            <div style={{ marginTop: '16px' }}>
                <OrdersTable orders={orders} />
            </div>
        </div>
    );
};

export default Order;