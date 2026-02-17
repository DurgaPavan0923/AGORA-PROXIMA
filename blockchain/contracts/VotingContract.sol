// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VotingContract
 * @dev Secure, transparent voting system on blockchain
 */
contract VotingContract {
    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        string[] partyNames;
        mapping(uint256 => uint256) voteCounts;
        mapping(address => bool) hasVoted;
        uint256 totalVotes;
        bool exists;
    }

    uint256 private electionCounter;
    mapping(uint256 => Election) public elections;
    address public admin;

    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        uint256 startTime,
        uint256 endTime
    );

    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        uint256 partyIndex,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(elections[_electionId].exists, "Election does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionCounter = 0;
    }

    /**
     * @dev Create a new election
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory _partyNames
    ) external onlyAdmin returns (uint256) {
        require(_startTime < _endTime, "Invalid time range");
        require(_partyNames.length > 0, "At least one party required");

        uint256 electionId = electionCounter++;
        Election storage newElection = elections[electionId];
        
        newElection.id = electionId;
        newElection.title = _title;
        newElection.description = _description;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.partyNames = _partyNames;
        newElection.totalVotes = 0;
        newElection.exists = true;

        emit ElectionCreated(electionId, _title, _startTime, _endTime);
        return electionId;
    }

    /**
     * @dev Cast a vote in an election
     */
    function vote(
        uint256 _electionId,
        uint256 _partyIndex,
        address _voterAddress
    ) external electionExists(_electionId) {
        Election storage election = elections[_electionId];

        require(block.timestamp >= election.startTime, "Election has not started");
        require(block.timestamp <= election.endTime, "Election has ended");
        require(!election.hasVoted[_voterAddress], "Already voted");
        require(_partyIndex < election.partyNames.length, "Invalid party index");

        election.hasVoted[_voterAddress] = true;
        election.voteCounts[_partyIndex]++;
        election.totalVotes++;

        emit VoteCast(_electionId, _voterAddress, _partyIndex, block.timestamp);
    }

    /**
     * @dev Check if a voter has voted in an election
     */
    function hasVoted(uint256 _electionId, address _voter)
        external
        view
        electionExists(_electionId)
        returns (bool)
    {
        return elections[_electionId].hasVoted[_voter];
    }

    /**
     * @dev Get vote count for a specific party
     */
    function getVoteCount(uint256 _electionId, uint256 _partyIndex)
        external
        view
        electionExists(_electionId)
        returns (uint256)
    {
        return elections[_electionId].voteCounts[_partyIndex];
    }

    /**
     * @dev Get total votes in an election
     */
    function getTotalVotes(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (uint256)
    {
        return elections[_electionId].totalVotes;
    }

    /**
     * @dev Get complete election results
     */
    function getElectionResults(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (uint256[] memory)
    {
        Election storage election = elections[_electionId];
        uint256[] memory results = new uint256[](election.partyNames.length);
        
        for (uint256 i = 0; i < election.partyNames.length; i++) {
            results[i] = election.voteCounts[i];
        }
        
        return results;
    }

    /**
     * @dev Get election status: 0 = Pending, 1 = Active, 2 = Ended
     */
    function getElectionStatus(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (uint8)
    {
        Election storage election = elections[_electionId];
        
        if (block.timestamp < election.startTime) {
            return 0; // Pending
        } else if (block.timestamp <= election.endTime) {
            return 1; // Active
        } else {
            return 2; // Ended
        }
    }

    /**
     * @dev Get election details
     */
    function getElection(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            string[] memory partyNames,
            uint256 totalVotes
        )
    {
        Election storage election = elections[_electionId];
        return (
            election.title,
            election.description,
            election.startTime,
            election.endTime,
            election.partyNames,
            election.totalVotes
        );
    }

    /**
     * @dev Get party names for an election
     */
    function getPartyNames(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (string[] memory)
    {
        return elections[_electionId].partyNames;
    }

    /**
     * @dev Get total number of elections
     */
    function getElectionCount() external view returns (uint256) {
        return electionCounter;
    }
}
