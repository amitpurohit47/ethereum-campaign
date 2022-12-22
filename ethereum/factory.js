import web3 from "./web3";
import compiledFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  "0xcb678ECC2Df3104Cf1B74ef28E1F90481047d82F"
);

export default instance;
