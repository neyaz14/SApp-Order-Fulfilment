import React, { useState } from 'react';
import {
    IndexTable,
    Card,
    Text,
    Badge,

    Button,
} from '@shopify/polaris';
import axios from "axios";





const OrdersTable = ({ orders }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");


    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };


    const handleAddConfrimedTag = async (orderId) => {
        console.log(orderId)
        setLoading(true);
        setStatus("");

        try {
            const response = await fetch("/api/add-confirmed-tag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus("✅ Tag added successfully!");
            } else {
                setStatus("⚠️ Failed to add tag.");
            }
        } catch (err) {
            console.error(err);
            setStatus("❌ Error occurred.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <Card>
            <IndexTable
                resourceName={resourceName}
                itemCount={orders.length}
                hasMoreItems={false}
                headings={[
                    { title: 'Customer' },
                    { title: 'Order ID' },
                    { title: 'Status' },
                    { title: 'Shipping Address' },
                    { title: 'Total (BDT)' },

                    { title: 'Actions' },
                ]}
                selectable={false}
                hasBulkActions={false}
            >
                {orders.map((order, index) => {
                    const { node } = order;
                    const customer = node?.customer;
                    const shipping = node?.shippingAddress;
                    const total = node?.totalPriceSet?.shopMoney;
                    const tags = node?.tags;

                    const isConfirmed = tags.includes("Confirmed");

                    return (
                        <IndexTable.Row
                            id={node?.id}
                            key={node.id}
                            position={index}
                        >
                            <IndexTable.Cell>
                                <Text variant="bodyMd" fontWeight="bold">
                                    {customer?.firstName} {customer?.lastName}
                                </Text>
                                <div>{customer?.email}</div>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <Text>{node.id.split('/').pop()}</Text>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <Badge status="success">{node?.displayFinancialStatus}</Badge>
                                <br />
                                <Badge status="info">{node?.displayFulfillmentStatus}</Badge>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <div>
                                    {shipping?.address1}, {shipping?.city}, {shipping?.country}
                                </div>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                ৳{total?.amount}
                            </IndexTable.Cell>


                            <IndexTable.Cell>
                                {isConfirmed ? (
                                    <Badge status="success">Confirmed</Badge>
                                ) : (
                                    <Button onClick={() => handleAddConfrimedTag(node?.id)}>
                                        Confirm
                                    </Button>
                                )}
                            </IndexTable.Cell>
                        </IndexTable.Row>
                    );
                })}
            </IndexTable>
        </Card>
    );
};

export default OrdersTable;
