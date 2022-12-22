import web3 from "./web3";
import compiledCampaign from "./build/Campaign.json";

export default (address) => {
  const instance = new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    address
  );
  return instance;
};
