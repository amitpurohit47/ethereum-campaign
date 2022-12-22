import React from "react";
import { Button, Card } from "semantic-ui-react";
import { Link } from "../routes";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";

const Home = ({ campaigns }) => {
  const renderCampaigns = () => {
    const campaignCards = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={campaignCards} />;
  };

  return (
    <Layout>
      <div>
        <h3 style={{ marginTop: "15px" }}>Open Campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              content="Create Campaign"
              icon="add circle"
              floated="right"
              primary
            />
          </a>
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  try {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  } catch (error) {
    console.log(error.message);
  }
};

export default Home;
