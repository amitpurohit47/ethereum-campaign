import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { Router } from "../../routes";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

const NewCampaign = () => {
  const [minContri, setMinContri] = useState("");
  const [campName, setCampName] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContri, campName).send({
        from: accounts[0],
      });
      Router.push("/");
    } catch (error) {
      setErrMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <Layout>
        <h3>Create a new Campaign</h3>
        {/* We need to pass the error prop to Form only then we get the Semantic UI error message, else the message is hidden */}
        {/* error should be passed conditionally */}
        <Form onSubmit={handleSubmit} error={errMessage.length > 0}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              value={minContri}
              onChange={(e) => setMinContri(e.target.value)}
              label="wei"
              labelPosition="right"
            />
          </Form.Field>
          <Form.Field>
            <label>Campaign name</label>
            <Input
              value={campName}
              onChange={(e) => setCampName(e.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={errMessage} />
          <Button type="submit" primary loading={loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    </div>
  );
};

export default NewCampaign;
