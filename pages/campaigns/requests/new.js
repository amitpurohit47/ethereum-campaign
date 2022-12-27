import React, { useState } from "react";
import web3 from "../../../ethereum/web3";
import { Button, Message, Form, Input, Grid } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

const NewRequest = ({ campaignAddress }) => {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [recepient, setRecepient] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(campaignAddress);
      await campaign.methods
        .createRequest(desc, web3.utils.toWei(value, "ether"), recepient)
        .send({
          from: accounts[0],
        });
      Router.pushRoute(`/campaigns/${campaignAddress}/requests`);
    } catch (error) {
      setErrMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form onSubmit={handleSubmit} error={errMessage.length > 0}>
        <Form.Field>
          <label>Description</label>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)}></Input>
        </Form.Field>
        <Form.Field>
          <label>Amount in Ether</label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label="Eth"
            labelPosition="right"
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Recepient Address</label>
          <Input
            value={recepient}
            onChange={(e) => setRecepient(e.target.value)}
          ></Input>
        </Form.Field>
        <Message error header="Oops!" content={errMessage} />
        <Button primary type="submit" loading={loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

NewRequest.getInitialProps = async (props) => {
  const { address } = props.query;
  return { campaignAddress: address };
};

export default NewRequest;
