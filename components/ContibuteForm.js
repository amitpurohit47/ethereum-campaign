import React, { useState } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContibuteForm = ({ campaignAddress }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMessage("");
    try {
      const campaign = Campaign(campaignAddress);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${campaignAddress}`);
      setValue("");
    } catch (error) {
      setErrMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit} error={errMessage.length > 0}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops!" content={errMessage} />
      <Button type="submit" primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContibuteForm;
