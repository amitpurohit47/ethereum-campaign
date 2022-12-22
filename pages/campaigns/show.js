import React from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';// Capital case because maybe we may use campaign somewhere else

const CampaignShow = ({summary}) => {
  return (
    <Layout>

    </Layout>
  )
}

CampaignShow.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {summary};
}

export default CampaignShow;