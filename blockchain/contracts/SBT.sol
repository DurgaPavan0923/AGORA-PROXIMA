// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SBT (Soulbound Token)
 * @dev Non-transferable identity token for verified voters
 */
contract SBT {
    struct Token {
        uint256 tokenId;
        address owner;
        string uniqueId;
        string fullName;
        bool isActive;
        uint256 issuedAt;
    }

    uint256 private tokenCounter;
    mapping(uint256 => Token) public tokens;
    mapping(address => uint256) public ownerToToken;
    mapping(string => uint256) public uniqueIdToToken;
    address public admin;

    event TokenIssued(
        uint256 indexed tokenId,
        address indexed owner,
        string uniqueId,
        uint256 timestamp
    );

    event TokenRevoked(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier tokenExists(uint256 _tokenId) {
        require(tokens[_tokenId].owner != address(0), "Token does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        tokenCounter = 1; // Start from 1
    }

    /**
     * @dev Issue a new SBT to a verified user
     */
    function issueSBT(
        address _to,
        string memory _uniqueId,
        string memory _fullName
    ) external onlyAdmin returns (uint256) {
        require(_to != address(0), "Invalid address");
        require(ownerToToken[_to] == 0, "User already has a token");
        require(uniqueIdToToken[_uniqueId] == 0, "Unique ID already registered");

        uint256 tokenId = tokenCounter++;
        
        tokens[tokenId] = Token({
            tokenId: tokenId,
            owner: _to,
            uniqueId: _uniqueId,
            fullName: _fullName,
            isActive: true,
            issuedAt: block.timestamp
        });

        ownerToToken[_to] = tokenId;
        uniqueIdToToken[_uniqueId] = tokenId;

        emit TokenIssued(tokenId, _to, _uniqueId, block.timestamp);
        return tokenId;
    }

    /**
     * @dev Revoke a token (deactivate user)
     */
    function revokeSBT(uint256 _tokenId) external onlyAdmin tokenExists(_tokenId) {
        Token storage token = tokens[_tokenId];
        require(token.isActive, "Token already revoked");

        token.isActive = false;
        emit TokenRevoked(_tokenId, token.owner, block.timestamp);
    }

    /**
     * @dev Reactivate a revoked token
     */
    function reactivateSBT(uint256 _tokenId) external onlyAdmin tokenExists(_tokenId) {
        Token storage token = tokens[_tokenId];
        require(!token.isActive, "Token is already active");

        token.isActive = true;
    }

    /**
     * @dev Get token ID by owner address
     */
    function getTokenByOwner(address _owner) external view returns (uint256) {
        return ownerToToken[_owner];
    }

    /**
     * @dev Get token ID by unique ID
     */
    function getTokenByUniqueId(string memory _uniqueId) external view returns (uint256) {
        return uniqueIdToToken[_uniqueId];
    }

    /**
     * @dev Get token details
     */
    function getToken(uint256 _tokenId)
        external
        view
        tokenExists(_tokenId)
        returns (
            address owner,
            string memory uniqueId,
            string memory fullName,
            bool isActive,
            uint256 issuedAt
        )
    {
        Token storage token = tokens[_tokenId];
        return (
            token.owner,
            token.uniqueId,
            token.fullName,
            token.isActive,
            token.issuedAt
        );
    }

    /**
     * @dev Check if an address has an active SBT
     */
    function hasActiveSBT(address _owner) external view returns (bool) {
        uint256 tokenId = ownerToToken[_owner];
        if (tokenId == 0) return false;
        return tokens[tokenId].isActive;
    }

    /**
     * @dev Check if a unique ID has an active SBT
     */
    function isUniqueIdRegistered(string memory _uniqueId) external view returns (bool) {
        uint256 tokenId = uniqueIdToToken[_uniqueId];
        if (tokenId == 0) return false;
        return tokens[tokenId].isActive;
    }

    /**
     * @dev Get total number of tokens issued
     */
    function getTotalSupply() external view returns (uint256) {
        return tokenCounter - 1;
    }

    /**
     * @dev Override transfer functions to make token non-transferable (Soulbound)
     */
    function transfer(address, uint256) external pure returns (bool) {
        revert("SBT: tokens are non-transferable");
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert("SBT: tokens are non-transferable");
    }

    function approve(address, uint256) external pure returns (bool) {
        revert("SBT: tokens are non-transferable");
    }
}
