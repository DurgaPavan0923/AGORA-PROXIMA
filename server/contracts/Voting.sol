// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @dev Transparent, tamper-proof voting system for elections
 * Integrates with Soulbound Tokens to ensure one vote per verified citizen
 */
interface ISBT {
    function balanceOf(address owner) external view returns (uint256);
}

contract Voting {
    // Election structure
    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        string[] partyNames;
        uint256[] voteCounts;
        bool active;
        uint256 totalVotes;
    }
    
    // State variables
    uint256 private _electionIdCounter;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voterChoice;
    
    address public admin;
    address public sbtContract; // Reference to Soulbound Token contract
    
    // Events
    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 partyIndex, uint256 timestamp);
    event ElectionEnded(uint256 indexed electionId, uint256 totalVotes);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier electionExists(uint256 electionId) {
        require(elections[electionId].active, "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 electionId) {
        require(
            block.timestamp >= elections[electionId].startTime &&
            block.timestamp <= elections[electionId].endTime,
            "Election is not currently active"
        );
        _;
    }
    
    constructor(address _sbtContract) {
        admin = msg.sender;
        sbtContract = _sbtContract;
        _electionIdCounter = 1;
    }
    
    /**
     * @dev Create a new election
     */
    function createElection(
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        string[] memory partyNames
    ) external onlyAdmin returns (uint256) {
        require(startTime < endTime, "Invalid time range");
        require(partyNames.length > 0, "Must have at least one party");
        require(partyNames.length <= 50, "Too many parties");
        
        uint256 electionId = _electionIdCounter;
        _electionIdCounter++;
        
        uint256[] memory voteCounts = new uint256[](partyNames.length);
        
        elections[electionId] = Election({
            id: electionId,
            title: title,
            description: description,
            startTime: startTime,
            endTime: endTime,
            partyNames: partyNames,
            voteCounts: voteCounts,
            active: true,
            totalVotes: 0
        });
        
        emit ElectionCreated(electionId, title, startTime, endTime);
        
        return electionId;
    }
    
    /**
     * @dev Cast a vote in an election
     * @param electionId The election ID
     * @param partyIndex The index of the party to vote for
     * @param voterAddress The address of the voter (must have SBT)
     */
    function vote(
        uint256 electionId,
        uint256 partyIndex,
        address voterAddress
    ) 
        external 
        electionExists(electionId) 
        electionActive(electionId) 
    {
        require(!hasVoted[electionId][voterAddress], "Already voted in this election");
        require(partyIndex < elections[electionId].partyNames.length, "Invalid party index");
        
        // Verify voter holds a Soulbound Token
        if (sbtContract != address(0)) {
            require(ISBT(sbtContract).balanceOf(voterAddress) > 0, "Voter must have a Soulbound Token");
        }
        
        hasVoted[electionId][voterAddress] = true;
        voterChoice[electionId][voterAddress] = partyIndex;
        elections[electionId].voteCounts[partyIndex]++;
        elections[electionId].totalVotes++;
        
        emit VoteCast(electionId, voterAddress, partyIndex, block.timestamp);
    }
    
    /**
     * @dev Check if a voter has voted in an election
     */
    function hasVotedInElection(uint256 electionId, address voter) 
        external 
        view 
        returns (bool) 
    {
        return hasVoted[electionId][voter];
    }
    
    /**
     * @dev Get vote count for a specific party
     */
    function getVoteCount(uint256 electionId, uint256 partyIndex) 
        external 
        view 
        electionExists(electionId) 
        returns (uint256) 
    {
        require(partyIndex < elections[electionId].partyNames.length, "Invalid party index");
        return elections[electionId].voteCounts[partyIndex];
    }
    
    /**
     * @dev Get total votes in an election
     */
    function getTotalVotes(uint256 electionId) 
        external 
        view 
        electionExists(electionId) 
        returns (uint256) 
    {
        return elections[electionId].totalVotes;
    }
    
    /**
     * @dev Get all results for an election
     */
    function getElectionResults(uint256 electionId) 
        external 
        view 
        electionExists(electionId) 
        returns (uint256[] memory) 
    {
        return elections[electionId].voteCounts;
    }
    
    /**
     * @dev Get election details
     */
    function getElectionDetails(uint256 electionId) 
        external 
        view 
        electionExists(electionId) 
        returns (
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            string[] memory partyNames,
            uint256[] memory voteCounts,
            uint256 totalVotes
        ) 
    {
        Election memory election = elections[electionId];
        return (
            election.title,
            election.description,
            election.startTime,
            election.endTime,
            election.partyNames,
            election.voteCounts,
            election.totalVotes
        );
    }
    
    /**
     * @dev Get election status
     * 0 = Pending, 1 = Active, 2 = Ended
     */
    function getElectionStatus(uint256 electionId) 
        external 
        view 
        electionExists(electionId) 
        returns (uint8) 
    {
        if (block.timestamp < elections[electionId].startTime) {
            return 0; // Pending
        } else if (block.timestamp <= elections[electionId].endTime) {
            return 1; // Active
        } else {
            return 2; // Ended
        }
    }
    
    /**
     * @dev End an election (admin only, for emergency)
     */
    function endElection(uint256 electionId) 
        external 
        onlyAdmin 
        electionExists(electionId) 
    {
        elections[electionId].endTime = block.timestamp;
        emit ElectionEnded(electionId, elections[electionId].totalVotes);
    }
}
