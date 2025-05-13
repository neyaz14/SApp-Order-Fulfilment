import {
  Page,
  Layout,
  FormLayout,
  TextField,
  Button,
  Form,
  Text,
  Card,
} from '@shopify/polaris';
import { useState } from "react";

export default function PageName() {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = () => {
    console.log('API Key:', apiKey);
    console.log('Secret Key:', secretKey);
  };

  return (
    <Page title="Credentials">
      <Layout>
        <Layout.Section>
          <Card
            sectioned
            title="Add Steadfast Credentials"
            actions={[{ content: ' ' }]}
          >
            <div
              style={{
                maxWidth: '900px',
                margin: '0 auto',
              }}
            >
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    label="Base Url"
                    value="https://portal.packzy.com/api/v1"
                    onChange={() => {}}
                    disabled
                    autoComplete="off"
                  />
                  <TextField
                    label="API Key"
                    value={apiKey}
                    onChange={(value) => setApiKey(value)}
                    autoComplete="off"
                  />
                  <TextField
                    label="Secret Key"
                    type="password"
                    value={secretKey}
                    onChange={(value) => setSecretKey(value)}
                    autoComplete="off"
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Button submit primary>
                      Save
                    </Button>
                  </div>
                </FormLayout>
              </Form>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
