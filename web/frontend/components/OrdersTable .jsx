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
        console.log(orderId);
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

            if (data?.success) {
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
    };

    return (
        <Card>
            <IndexTable
                resourceName={resourceName}
                itemCount={orders?.length || 0}
                hasMoreItems={false}
                headings={[
                    { title: 'Order gid' },
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

                    const isConfirmed = tags?.includes("Confirmed");

                    return (
                        <IndexTable.Row
                            id={node?.id}
                            key={node?.id}
                            position={index}
                        >

                            <IndexTable.Cell>
                                <Text>{node?.id?.split('/')?.pop()}</Text>
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
                                    {shipping?.address2} ,
                                    {shipping?.address1} , 
                                </div>
                                <div>
                                     {shipping?.city} , {shipping?.country}
                                </div>
                            </IndexTable.Cell>


                            <IndexTable.Cell>
                                ৳ {total?.amount}
                            </IndexTable.Cell>


                            <IndexTable.Cell>
                                {
                                    node?.displayFinancialStatus === "PAID" ? (
                                        <Badge status="success"  size="large">
                                            Paid
                                        </Badge>
                                    ) : node?.displayFinancialStatus === "PARTIALLY_PAID" ? (
                                        <Badge status="warning" >
                                            Partially Paid
                                        </Badge>
                                    ) : (
                                        <Badge status="critical" >
                                            Unpaid
                                        </Badge>
                                    )
                                }
                                <br />
                                <br />
                                {
                                    node?.displayFulfillmentStatus === "PARTIALLY_FULFILLED" ? (
                                        <Badge progress="partiallyComplete" status="warning" >
                                            Partially Fulfilled
                                        </Badge>
                                    ) : node?.displayFulfillmentStatus === "FULFILLED" ? (
                                        <Badge status="success" >
                                            Fulfilled
                                        </Badge>
                                    ) : (
                                        <Badge status="attention" >
                                            Unfulfilled
                                        </Badge>
                                    )
                                }

                            </IndexTable.Cell>


                            <IndexTable.Cell>
                                {isConfirmed ? (
                                    <Badge status="success">Confirmed</Badge>
                                ) : (
                                    <Button status="warning" onClick={() => handleAddConfrimedTag(node?.id)}>
                                        Confirm
                                    </Button>
                                )}
                            </IndexTable.Cell>


                            <IndexTable.Cell>
                                <Button variant="monochromePlain" fullWidth  size='slim'>Steadfast</Button>
                                <br />
                                <Button variant="primary"   fullWidth size='slim'>Pathao</Button>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                                <Button variant="plain"   size='slim'>Download Invoice</Button>
                            </IndexTable.Cell>
                        </IndexTable.Row>
                    );
                })}
            </IndexTable>
        </Card>
    );
};

export default OrdersTable;
