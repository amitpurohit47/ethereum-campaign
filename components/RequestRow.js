import React from "react";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const RequestRow = ({ request, id, address, approversCount }) => {
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  const handleApprove = async (e) => {
    e.preventDefault();
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  const handleFinalize = async (e) => {
    e.preventDefault();
    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id + 1}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recepient}</Cell>
      <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={handleApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={handleFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
