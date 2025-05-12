import React, { useState } from 'react';
import { Button, Divider, FormLayout, TextField } from '@shopify/polaris';

export default function TesingComp() {
    const [storeName, setStoreName] = useState('');
    const [accountEmail, setAccountEmail] = useState('');

    const handleStoreNameChange = (value) => setStoreName(value);
    const handleAccountEmailChange = (value) => setAccountEmail(value);

    const handleSubmit = () => {
        

        console.log({storeName, accountEmail})
        // You can send these values to your backend, validate, etc.
    };


    return (
        <div>
            <FormLayout>
                <TextField
                    label="Store name"
                    value={storeName}
                    onChange={handleStoreNameChange}
                    autoComplete="off"
                />
                <TextField
                    type="email"
                    label="Account email"
                    value={accountEmail}
                    onChange={handleAccountEmailChange}
                    autoComplete="email"
                />
                <button type="button" onClick={handleSubmit}>Submit</button>
            </FormLayout>
            <Divider></Divider>


        </div>
    );
};

