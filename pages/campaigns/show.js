import React from "react";
import { Card, Grid } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign"; // Capital case because maybe we may use campaign somewhere else
import ContibuteForm from "../../components/ContibuteForm";
import web3 from "../../ethereum/web3";

const CampaignShow = ({
  campaignAddress,
  campaignName,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
}) => {
  const renderCards = () => {
    const items = [
      {
        header: "Manager of contract",
        meta: manager,
        description: "The manager handles the operations of the campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: `Minimum Contribution`,
        meta: `${minimumContribution} wei`,
        description:
          "This is the minimum amount to become a contributor to the campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: "Campaign Balance",
        meta: `${web3.utils.fromWei(balance, "ether")} eth`,
        description: "Current value held by the campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: "Total Contributors",
        meta: approversCount,
        description:
          "The total number of contributors who contributed to the campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: "Total Requests",
        meta: requestsCount,
        description: "Total number of open requests to be approved currently",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} style={{ marginTop: "20px" }} />;
  };

  return (
    <Layout>
      <h3>{campaignName}</h3>
      <Grid>
        <Grid.Column width={10}>{renderCards()}</Grid.Column>
        <Grid.Column width={6}>
          <ContibuteForm campaignAddress={campaignAddress} />
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);
  const summary = await campaign.methods.getSummary().call();
  return {
    campaignAddress: props.query.address,
    campaignName: summary[0],
    minimumContribution: summary[1],
    balance: summary[2],
    requestsCount: summary[3],
    approversCount: summary[4],
    manager: summary[5],
  };
};

export default CampaignShow;
