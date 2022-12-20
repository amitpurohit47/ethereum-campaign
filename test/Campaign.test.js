const assert = require("assert"); // assert modeule is required to check whether our cases pass/fail
const ganache = require("ganache-cli"); // ganache provides a local blockchain
const Web3 = require("web3"); // It is the Web3 constructor
const web3 = new Web3(ganache.provider()); // We make the web3 instance using the provider given by ganache and communicate with the blockchain
const compiledFactory = require("../ethereum/build/CampaignFactory.json"); // Getting the compiled campaignFactory contract
const compiledCampaign = require("../ethereum/build/Campaign.json"); // Getting the compiled campaign contract

let accounts; // fetches all the accounts in the blockchain
let factory; // the javascript instance of the factory contract
let campaignAddress; // deals with the deployed campaign
let campaign; // the javascript instance of the campaign contract

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // deploying involves using the Contract constructor to create new instance
  // it expects a JS object of the abi so we have to parse it
  // the ganache provider expects gas property while sending transaction
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  // deploying campaign contract using factory
  await factory.methods
    .createCampaign("100", "camp1")
    .send({ from: accounts[0], gas: "1000000" });

  // getDeployedCampaign returns array of deployed campaigns
  // we get the 1st campaign address by destructuring it
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  // We have already deployed the campaign contract and have its address
  // so we pass the address along with the bytecode while getting JS version of contract
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  // checking if our contract instance deployed properly
  it("deploys a factory and a contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  // checking if the account which created the contract is the manager
  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  // checking if allows people to contribute and become approvers
  it("allows people to contribute and become approvers", async () => {
    await campaign.methods.contribute().send({
      value: "101",
      from: accounts[1],
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "0",
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("allows manager to create a request", async () => {
    await campaign.methods
      .createRequest("Buy Batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();

    assert.equal(request.description, "Buy Batteries");
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[1],
    });

    let initialBalance = await web3.eth.getBalance(accounts[2]);
    initialBalance = web3.utils.fromWei(initialBalance, "ether");
    await campaign.methods
      .createRequest(
        "Buy Batteries",
        web3.utils.toWei("5", "ether"),
        accounts[2]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let finalBalance = await web3.eth.getBalance(accounts[2]);
    finalBalance = web3.utils.fromWei(finalBalance, "ether");

    assert(finalBalance - initialBalance > 4);
  });
});
