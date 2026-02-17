// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VotingEnhanced
 * @dev Complete blockchain-based voting system with immutable data storage
 */
contract VotingEnhanced {
    struct Party {
        string name;
        string logo;
        uint256 voteCount;
    }

    struct Election {
        string title;
        string description;
        string category;
        uint256 startDate;
        uint256 endDate;
        Party[] parties;
        bool isActive;
        uint256 totalVotes;
        address createdBy;
        uint256 createdAt;
    }

    struct Vote {
        address voter;
        uint256 electionId;
        uint256 partyIndex;
        uint256 timestamp;
        string voterDid;
    }

    address public admin;
    uint256 private electionCounter;
    
    mapping(uint256 => Election) private elections;
    mapping(uint256 => mapping(address => bool)) private hasVoted;
    mapping(uint256 => Vote[]) private electionVotes;
    mapping(address => uint256[]) private userVotedElections;
    
    uint256[] private allElectionIds;

    event ElectionCreated(uint256 indexed electionId, string title, uint256 startDate, uint256 endDate);
    event VoteCasted(uint256 indexed electionId, address indexed voter, uint256 partyIndex, uint256 timestamp);
    event ElectionEnded(uint256 indexed electionId, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(_electionId < electionCounter, "Election does not exist");
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
        string memory _category,
        uint256 _startDate,
        uint256 _endDate,
        string[] memory _partyNames,
        string[] memory _partyLogos
    ) public onlyAdmin returns (uint256) {
        require(_partyNames.length > 0, "At least one party required");
        require(_partyNames.length == _partyLogos.length, "Party names and logos must match");
        require(_endDate > _startDate, "End date must be after start date");
        require(_startDate >= block.timestamp, "Start date must be in the future");

        uint256 electionId = electionCounter;
        Election storage newElection = elections[electionId];
        
        newElection.title = _title;
        newElection.description = _description;
        newElection.category = _category;
        newElection.startDate = _startDate;
        newElection.endDate = _endDate;
        newElection.isActive = true;
        newElection.totalVotes = 0;
        newElection.createdBy = msg.sender;
        newElection.createdAt = block.timestamp;

        // Add parties
        for (uint256 i = 0; i < _partyNames.length; i++) {
            newElection.parties.push(Party({
                name: _partyNames[i],
                logo: _partyLogos[i],
                voteCount: 0
            }));
        }

        allElectionIds.push(electionId);
        electionCounter++;

        emit ElectionCreated(electionId, _title, _startDate, _endDate);
        return electionId;
    }

    /**
     * @dev Cast a vote
     */
    function castVote(
        uint256 _electionId,
        uint256 _partyIndex,
        string memory _voterDid
    ) public electionExists(_electionId) returns (bool) {
        Election storage election = elections[_electionId];
        
        require(election.isActive, "Election is not active");
        require(block.timestamp >= election.startDate, "Election has not started");
        require(block.timestamp <= election.endDate, "Election has ended");
        require(!hasVoted[_electionId][msg.sender], "Already voted");
        require(_partyIndex < election.parties.length, "Invalid party index");

        // Record vote
        hasVoted[_electionId][msg.sender] = true;
        election.parties[_partyIndex].voteCount++;
        election.totalVotes++;

        // Store vote details
        electionVotes[_electionId].push(Vote({
            voter: msg.sender,
            electionId: _electionId,
            partyIndex: _partyIndex,
            timestamp: block.timestamp,
            voterDid: _voterDid
        }));

        userVotedElections[msg.sender].push(_electionId);

        emit VoteCasted(_electionId, msg.sender, _partyIndex, block.timestamp);
        return true;
    }

    /**
     * @dev End an election
     */
    function endElection(uint256 _electionId) 
        public 
        onlyAdmin 
        electionExists(_electionId) 
        returns (bool) 
    {
        elections[_electionId].isActive = false;
        emit ElectionEnded(_electionId, block.timestamp);
        return true;
    }

    /**
     * @dev Get election details
     */
    function getElection(uint256 _electionId) 
        public 
        view 
        electionExists(_electionId) 
        returns (
            string memory title,
            string memory description,
            string memory category,
            uint256 startDate,
            uint256 endDate,
            bool isActive,
            uint256 totalVotes,
            uint256 createdAt
        ) 
    {
        Election storage election = elections[_electionId];
        return (
            election.title,
            election.description,
            election.category,
            election.startDate,
            election.endDate,
            election.isActive,
            election.totalVotes,
            election.createdAt
        );
    }

    /**
     * @dev Get election parties and vote counts
     */
    function getElectionResults(uint256 _electionId) 
        public 
        view 
        electionExists(_electionId) 
        returns (
            string[] memory partyNames,
            string[] memory partyLogos,
            uint256[] memory voteCounts
        ) 
    {
        Election storage election = elections[_electionId];
        uint256 partyCount = election.parties.length;
        
        partyNames = new string[](partyCount);
        partyLogos = new string[](partyCount);
        voteCounts = new uint256[](partyCount);
        
        for (uint256 i = 0; i < partyCount; i++) {
            partyNames[i] = election.parties[i].name;
            partyLogos[i] = election.parties[i].logo;
            voteCounts[i] = election.parties[i].voteCount;
        }
        
        return (partyNames, partyLogos, voteCounts);
    }

    /**
     * @dev Check if user has voted in election
     */
    function hasUserVoted(uint256 _electionId, address _voter) 
        public 
        view 
        electionExists(_electionId) 
        returns (bool) 
    {
        return hasVoted[_electionId][_voter];
    }

    /**
     * @dev Get all elections user has voted in
     */
    function getUserVotedElections(address _voter) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return userVotedElections[_voter];
    }

    /**
     * @dev Get all election IDs
     */
    function getAllElectionIds() public view returns (uint256[] memory) {
        return allElectionIds;
    }

    /**
     * @dev Get active elections
     */
    function getActiveElections() public view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active elections
        for (uint256 i = 0; i < allElectionIds.length; i++) {
            if (elections[allElectionIds[i]].isActive && 
                block.timestamp >= elections[allElectionIds[i]].startDate &&
                block.timestamp <= elections[allElectionIds[i]].endDate) {
                activeCount++;
            }
        }
        
        // Create array of active election IDs
        uint256[] memory activeElections = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allElectionIds.length; i++) {
            if (elections[allElectionIds[i]].isActive && 
                block.timestamp >= elections[allElectionIds[i]].startDate &&
                block.timestamp <= elections[allElectionIds[i]].endDate) {
                activeElections[index] = allElectionIds[i];
                index++;
            }
        }
        
        return activeElections;
    }

    /**
     * @dev Get total election count
     */
    function getElectionCount() public view returns (uint256) {
        return electionCounter;
    }

    /**
     * @dev Get election votes (admin only)
     */
    function getElectionVotes(uint256 _electionId) 
        public 
        view 
        onlyAdmin 
        electionExists(_electionId) 
        returns (Vote[] memory) 
    {
        return electionVotes[_electionId];
    }

    /**
     * @dev Transfer admin rights
     */
    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}
