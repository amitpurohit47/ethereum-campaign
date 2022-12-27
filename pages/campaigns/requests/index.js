import React from "react";
import Layout from "../../../components/Layout";
import { Link, Router } from "../../../routes";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const Requests = ({ address, requests, approversCount, requestCount }) => {
  const { Row, Header, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={`Request${index}`}
          request={request}
          address={address}
          id={index}
          approversCount={approversCount}
        />
      );
    });
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary>Add Request</Button>
        </a>
      </Link>
      <Table celled>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recepient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <h3>Found {requestCount} requests</h3>
    </Layout>
  );
};

Requests.getInitialProps = async (props) => {
  const { address } = props.query;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return { address, requests, approversCount, requestCount };
};

export default Requests;
