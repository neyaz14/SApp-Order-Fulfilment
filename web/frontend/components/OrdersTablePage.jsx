import React, { useState } from 'react';
import {
    IndexTable,
    Card,
    Text,
    Badge,
    Button,
    LegacyStack,
    Spinner
} from '@shopify/polaris';
import axios from "axios";

const OrdersTablePage = ({ orders }) => {
    const [loadingTags, setLoadingTags] = useState({});
    const [tagStatuses, setTagStatuses] = useState({});

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const handleAddConfirmedTag = async (orderId) => {
        setLoadingTags(prev => ({ ...prev, [orderId]: true }));
        setTagStatuses(prev => ({ ...prev, [orderId]: "" }));

        try {
            const response = await fetch("/api/add-confirmed-tag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (data?.success) {
                setTagStatuses(prev => ({ ...prev, [orderId]: "success" }));
            } else {
                setTagStatuses(prev => ({ ...prev, [orderId]: "error" }));
            }
        } catch (err) {
            console.error(err);
            setTagStatuses(prev => ({ ...prev, [orderId]: "error" }));
        } finally {
            setLoadingTags(prev => ({ ...prev, [orderId]: false }));
        }
    };

    // Show a message when no orders are available
    if (!orders?.length) {
        return (
            <Card>
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <Text variant="headingMd" as="h2">No orders found</Text>
                    <Text variant="bodyMd" as="p">There are no orders matching your criteria.</Text>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <IndexTable
                resourceName={resourceName}
                itemCount={orders?.length || 0}
                hasMoreItems={false}
                headings={[
                    { title: 'Order ID' },
                    { title: 'Customer' },
                    { title: 'Shipping Address' },
                    { title: 'Total (BDT)' },
                    { title: 'Status' },
                    { title: 'Confirm' },
                    { title: 'Send to Courier' },
                    { title: 'Download' },
                ]}
                selectable={false}
                hasBulkActions={false}
            >
                {orders?.map((order, index) => {
                    const { node } = order || {};
                    const customer = node?.customer;
                    const shipping = node?.shippingAddress;
                    const total = node?.totalPriceSet?.shopMoney;
                    const tags = node?.tags;
                    const orderId = node?.id;
                    const isConfirmed = tags?.includes("Confirmed");
                    const isLoadingTag = loadingTags[orderId];
                    const tagStatus = tagStatuses[orderId];

                    return (
                        <IndexTable.Row
                            id={orderId}
                            key={orderId}
                            position={index}
                        >
                            <IndexTable.Cell>
                                <Text>{orderId?.split('/')?.pop()}</Text>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <Text variant="bodyMd" fontWeight="bold">
                                    {customer?.firstName} {customer?.lastName}
                                </Text>
                                <div>{customer?.email}</div>
                                <div>{customer?.phone}</div>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <div>
                                    {shipping?.address2 && `${shipping?.address2}, `}
                                    {shipping?.address1}
                                </div>
                                <div>
                                    {shipping?.city}{shipping?.city && shipping?.country && ", "}
                                    {shipping?.country}
                                </div>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                ৳ {total?.amount}
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                {node?.displayFinancialStatus === "PAID" ? (
                                    <Badge status="success" size="large">
                                        Paid
                                    </Badge>
                                ) : node?.displayFinancialStatus === "PARTIALLY_PAID" ? (
                                    <Badge status="warning">
                                        Partially Paid
                                    </Badge>
                                ) : (
                                    <Badge status="critical">
                                        Unpaid
                                    </Badge>
                                )}
                                <br />
                                <br />
                                {node?.displayFulfillmentStatus === "PARTIALLY_FULFILLED" ? (
                                    <Badge progress="partiallyComplete" status="warning">
                                        Partially Fulfilled
                                    </Badge>
                                ) : node?.displayFulfillmentStatus === "FULFILLED" ? (
                                    <Badge status="success">
                                        Fulfilled
                                    </Badge>
                                ) : (
                                    <Badge status="attention">
                                        Unfulfilled
                                    </Badge>
                                )}
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                {isConfirmed ? (
                                    <Badge status="success">Confirmed</Badge>
                                ) : isLoadingTag ? (
                                    <Button loading>Confirming...</Button>
                                ) : (
                                    <LegacyStack vertical spacing="tight">
                                        <Button status="warning" onClick={() => handleAddConfirmedTag(orderId)}>
                                            Confirm
                                        </Button>
                                        {tagStatus === "success" && <Text variant="bodySm" tone="success">Tag added!</Text>}
                                        {tagStatus === "error" && <Text variant="bodySm" tone="critical">Failed to add tag</Text>}
                                    </LegacyStack>
                                )}
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <LegacyStack vertical spacing="tight">
                                    <Button variant="monochromePlain" fullWidth size="slim">Steadfast</Button>
                                    <Button variant="primary" fullWidth size="slim">Pathao</Button>
                                </LegacyStack>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <Button variant="plain" size="slim">Download Invoice</Button>
                            </IndexTable.Cell>
                        </IndexTable.Row>
                    );
                })}
            </IndexTable>
        </Card>
    );
};

export default OrdersTablePage;