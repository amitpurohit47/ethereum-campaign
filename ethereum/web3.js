import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // if we are in the browser and metamask exists
  web3 = new Web3(window.web3.currentProvider);
} else {
  // if browser doesn't have metamask we directly interact with the ethereum network
  const provider = new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/2d3d2100f8dd4a06bc203a5e52b8750f"
  );
  web3 = new Web3(provider);
}

export default web3;
