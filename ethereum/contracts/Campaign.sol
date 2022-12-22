// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.26;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minContri, string memory name) public {
        address newCampaign = new Campaign(minContri, name, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        address recepient;
        uint256 value;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    string public campaignName;
    Request[] public requests;
    address public manager;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    uint256 public minimumContribution;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, string memory name, address mngr) public {
        manager = mngr;
        minimumContribution = minimum;
        campaignName = name;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory desc,
        uint256 val,
        address rec
    ) public restricted {
        Request memory newRequest = Request({
            description: desc,
            value: val,
            recepient: rec,
            approvalCount: 0,
            complete: false
        });
        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(request.approvals[msg.sender] == false);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(request.complete == false);

        request.recepient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (string, uint, uint, uint, uint, address)
    {
        return (
            campaignName,
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
