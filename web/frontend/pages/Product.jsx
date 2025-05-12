import { Divider, LegacyCard, Page } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import TesingComp from '../components/TesingComp';
import { NavLink } from 'react-router-dom';
// import { TestingComp } from '../components';

const Product = () => {
    // let fetch= useAuthenticateFetch
    // let [storeName, setStoreName] = useState('')
    // useEffect(async()=>{
    //     try{
    //         let request =await fetch('/api/store/info', {
    //             method:"GET",
    //             headers:{"Content-Type":"application/json"}
    //         })
    //         let response = await request.json();
    //         console.log(response.data)
    //         setStoreName(response?.data[0]?.name)
    //     }catch(err){
    //         console.log(err)
    //     }
    // })


    const [domain, setDomain] = useState("");

    useEffect(() => {
        async function loadDomain() {
            const res = await fetch("/api/shop-domain");
            console.log(res)
            const data = await res.json();
            console.log(data)
            setDomain(data);
            console.log(domain)
        }
        loadDomain();
    }, []);






    return (
        <div>
            <Page

                title="General"
                primaryAction={{ content: 'Save' }}
            >
                <LegacyCard title="Credit card" sectioned>
                    <h1 className=''></h1>
                    <p>Credit card information</p>
                    <p>My shopDomain : {domain?.myshopifyDomain} </p>
                    <NavLink> {domain?.primaryUrl} </NavLink>
                    <p>Primary Host : {domain?.primaryHost} </p>
                    <Divider />

                    
                </LegacyCard>
            </Page>
        </div>
    );
};

export default Product;