// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SoulboundToken
 * @dev Non-transferable identity token for verified citizens
 * Each citizen gets one SBT linked to their Decentralized ID (DID)
 */
contract SoulboundToken {
    // Token structure
    struct SBT {
        uint256 tokenId;
        address owner;
        string did; // Decentralized ID
        uint256 issuedAt;
        bool active;
    }

    // State variables
    uint256 private _tokenIdCounter;
    mapping(uint256 => SBT) private _tokens;
    mapping(address => uint256) private _ownerToTokenId;
    mapping(address => bool) private _hasToken;
    mapping(string => bool) private _didExists;
    
    address public admin;
    
    // Events
    event SBTMinted(address indexed to, uint256 indexed tokenId, string did);
    event SBTBurned(uint256 indexed tokenId);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier hasNoToken(address owner) {
        require(!_hasToken[owner], "Address already has a Soulbound Token");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        _tokenIdCounter = 1;
    }
    
    /**
     * @dev Mint a new Soulbound Token
     * @param to The address to mint the token to
     * @param did The Decentralized ID associated with this citizen
     */
    function mintSBT(address to, string memory did) 
        external 
        onlyAdmin 
        hasNoToken(to) 
        returns (uint256) 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(did).length > 0, "DID cannot be empty");
        require(!_didExists[did], "DID already exists");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _tokens[tokenId] = SBT({
            tokenId: tokenId,
            owner: to,
            did: did,
            issuedAt: block.timestamp,
            active: true
        });
        
        _ownerToTokenId[to] = tokenId;
        _hasToken[to] = true;
        _didExists[did] = true;
        
        emit SBTMinted(to, tokenId, did);
        
        return tokenId;
    }
    
    /**
     * @dev Burn/revoke a Soulbound Token (in case of fraud)
     * @param tokenId The token ID to burn
     */
    function burnSBT(uint256 tokenId) external onlyAdmin {
        require(_tokens[tokenId].active, "Token does not exist or already burned");
        
        address owner = _tokens[tokenId].owner;
        string memory did = _tokens[tokenId].did;
        
        _tokens[tokenId].active = false;
        _hasToken[owner] = false;
        _didExists[did] = false;
        delete _ownerToTokenId[owner];
        
        emit SBTBurned(tokenId);
    }
    
    /**
     * @dev Check if an address has a Soulbound Token
     */
    function hasSBT(address owner) external view returns (bool) {
        return _hasToken[owner];
    }
    
    /**
     * @dev Get the token ID for an address
     */
    function tokenIdOf(address owner) external view returns (uint256) {
        require(_hasToken[owner], "Address does not have a token");
        return _ownerToTokenId[owner];
    }
    
    /**
     * @dev Get the DID for an address
     */
    function getDID(address owner) external view returns (string memory) {
        require(_hasToken[owner], "Address does not have a token");
        uint256 tokenId = _ownerToTokenId[owner];
        return _tokens[tokenId].did;
    }
    
    /**
     * @dev Get token details
     */
    function getTokenDetails(uint256 tokenId) 
        external 
        view 
        returns (
            address owner,
            string memory did,
            uint256 issuedAt,
            bool active
        ) 
    {
        SBT memory token = _tokens[tokenId];
        return (token.owner, token.did, token.issuedAt, token.active);
    }
    
    /**
     * @dev Get the owner of a token
     */
    function getSBTOwner(uint256 tokenId) external view returns (address) {
        require(_tokens[tokenId].active, "Token does not exist");
        return _tokens[tokenId].owner;
    }
    
    /**
     * @dev Override transfer functions to make tokens non-transferable
     * This is what makes it "Soulbound"
     */
    function transfer(address, uint256) external pure {
        revert("Soulbound tokens cannot be transferred");
    }
    
    function transferFrom(address, address, uint256) external pure {
        revert("Soulbound tokens cannot be transferred");
    }
}
