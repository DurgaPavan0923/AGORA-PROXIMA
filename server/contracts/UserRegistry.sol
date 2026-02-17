// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title UserRegistry
 * @dev Stores immutable user data on blockchain. Only admin can modify after verification.
 */
contract UserRegistry {
    struct User {
        string uniqueIdProof; // Encrypted Aadhaar number
        string name;
        string email;
        string phoneNumber;
        address walletAddress;
        string did; // Decentralized Identifier
        uint256 sbtTokenId;
        bool isVerified;
        bool isActive;
        uint8 role; // 0: user, 1: admin, 2: election_commission
        uint256 registrationTimestamp;
        uint256 verificationTimestamp;
        string verifiedBy; // Admin who verified
    }

    struct UserHistory {
        uint256 timestamp;
        string action; // "registered", "verified", "rejected", "deactivated"
        string performedBy;
        string reason;
    }

    address public admin;
    mapping(address => User) private users;
    mapping(address => bool) private userExists;
    mapping(address => UserHistory[]) private userHistories;
    mapping(string => address) private phoneToAddress; // Phone number to wallet address
    
    address[] private allUsers;

    event UserRegistered(address indexed userAddress, string phoneNumber, uint256 timestamp);
    event UserVerified(address indexed userAddress, string verifiedBy, uint256 timestamp);
    event UserRejected(address indexed userAddress, string rejectedBy, string reason, uint256 timestamp);
    event UserDeactivated(address indexed userAddress, string deactivatedBy, string reason, uint256 timestamp);
    event UserReactivated(address indexed userAddress, string reactivatedBy, uint256 timestamp);
    event UserUpdated(address indexed userAddress, string updatedBy, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier userExistsCheck(address _userAddress) {
        require(userExists[_userAddress], "User does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Register a new user (called during signup)
     */
    function registerUser(
        address _userAddress,
        string memory _uniqueIdProof,
        string memory _name,
        string memory _email,
        string memory _phoneNumber,
        string memory _did,
        uint256 _sbtTokenId
    ) public returns (bool) {
        require(!userExists[_userAddress], "User already registered");
        require(phoneToAddress[_phoneNumber] == address(0), "Phone number already registered");

        users[_userAddress] = User({
            uniqueIdProof: _uniqueIdProof,
            name: _name,
            email: _email,
            phoneNumber: _phoneNumber,
            walletAddress: _userAddress,
            did: _did,
            sbtTokenId: _sbtTokenId,
            isVerified: false,
            isActive: false,
            role: 0, // Default user role
            registrationTimestamp: block.timestamp,
            verificationTimestamp: 0,
            verifiedBy: ""
        });

        userExists[_userAddress] = true;
        phoneToAddress[_phoneNumber] = _userAddress;
        allUsers.push(_userAddress);

        // Add to history
        userHistories[_userAddress].push(UserHistory({
            timestamp: block.timestamp,
            action: "registered",
            performedBy: "system",
            reason: "User self-registration"
        }));

        emit UserRegistered(_userAddress, _phoneNumber, block.timestamp);
        return true;
    }

    /**
     * @dev Verify user (only admin)
     */
    function verifyUser(address _userAddress, string memory _adminName) 
        public 
        onlyAdmin 
        userExistsCheck(_userAddress) 
        returns (bool) 
    {
        require(!users[_userAddress].isVerified, "User already verified");

        users[_userAddress].isVerified = true;
        users[_userAddress].isActive = true;
        users[_userAddress].verificationTimestamp = block.timestamp;
        users[_userAddress].verifiedBy = _adminName;

        // Add to history
        userHistories[_userAddress].push(UserHistory({
            timestamp: block.timestamp,
            action: "verified",
            performedBy: _adminName,
            reason: "Admin verification successful"
        }));

        emit UserVerified(_userAddress, _adminName, block.timestamp);
        return true;
    }

    /**
     * @dev Reject user verification (only admin)
     */
    function rejectUser(address _userAddress, string memory _adminName, string memory _reason) 
        public 
        onlyAdmin 
        userExistsCheck(_userAddress) 
        returns (bool) 
    {
        users[_userAddress].isActive = false;

        // Add to history
        userHistories[_userAddress].push(UserHistory({
            timestamp: block.timestamp,
            action: "rejected",
            performedBy: _adminName,
            reason: _reason
        }));

        emit UserRejected(_userAddress, _adminName, _reason, block.timestamp);
        return true;
    }

    /**
     * @dev Deactivate user (only admin)
     */
    function deactivateUser(address _userAddress, string memory _adminName, string memory _reason) 
        public 
        onlyAdmin 
        userExistsCheck(_userAddress) 
        returns (bool) 
    {
        users[_userAddress].isActive = false;

        // Add to history
        userHistories[_userAddress].push(UserHistory({
            timestamp: block.timestamp,
            action: "deactivated",
            performedBy: _adminName,
            reason: _reason
        }));

        emit UserDeactivated(_userAddress, _adminName, _reason, block.timestamp);
        return true;
    }

    /**
     * @dev Reactivate user (only admin)
     */
    function reactivateUser(address _userAddress, string memory _adminName) 
        public 
        onlyAdmin 
        userExistsCheck(_userAddress) 
        returns (bool) 
    {
        users[_userAddress].isActive = true;

        // Add to history
        userHistories[_userAddress].push(UserHistory({
            timestamp: block.timestamp,
            action: "reactivated",
            performedBy: _adminName,
            reason: "User reactivated by admin"
        }));

        emit UserReactivated(_userAddress, _adminName, block.timestamp);
        return true;
    }

    /**
     * @dev Update user role (only admin)
     */
    function updateUserRole(address _userAddress, uint8 _newRole, string memory _adminName) 
        public 
        onlyAdmin 
        userExistsCheck(_userAddress) 
        returns (bool) 
    {
        require(_newRole <= 2, "Invalid role");
        users[_userAddress].role = _newRole;

        string memory roleStr;
        if (_newRole == 0) roleStr = "user";
        else if (_newRole == 1) roleStr = "admin";
        else roleStr = "election_commission";

        // Add to history
        userHistories[_userAddress].push(UserHistory({
            timestamp: block.timestamp,
            action: "role_updated",
            performedBy: _adminName,
            reason: string(abi.encodePacked("Role updated to ", roleStr))
        }));

        emit UserUpdated(_userAddress, _adminName, block.timestamp);
        return true;
    }

    /**
     * @dev Get user data
     */
    function getUser(address _userAddress) 
        public 
        view 
        userExistsCheck(_userAddress) 
        returns (
            string memory name,
            string memory email,
            string memory phoneNumber,
            string memory did,
            uint256 sbtTokenId,
            bool isVerified,
            bool isActive,
            uint8 role,
            uint256 registrationTimestamp,
            string memory verifiedBy
        ) 
    {
        User memory user = users[_userAddress];
        return (
            user.name,
            user.email,
            user.phoneNumber,
            user.did,
            user.sbtTokenId,
            user.isVerified,
            user.isActive,
            user.role,
            user.registrationTimestamp,
            user.verifiedBy
        );
    }

    /**
     * @dev Get user history
     */
    function getUserHistory(address _userAddress) 
        public 
        view 
        userExistsCheck(_userAddress) 
        returns (UserHistory[] memory) 
    {
        return userHistories[_userAddress];
    }

    /**
     * @dev Check if user is verified
     */
    function isUserVerified(address _userAddress) public view returns (bool) {
        return userExists[_userAddress] && users[_userAddress].isVerified;
    }

    /**
     * @dev Get wallet address by phone number
     */
    function getAddressByPhone(string memory _phoneNumber) public view returns (address) {
        return phoneToAddress[_phoneNumber];
    }

    /**
     * @dev Get all users (admin only)
     */
    function getAllUsers() public view onlyAdmin returns (address[] memory) {
        return allUsers;
    }

    /**
     * @dev Get total user count
     */
    function getUserCount() public view returns (uint256) {
        return allUsers.length;
    }

    /**
     * @dev Transfer admin rights (only current admin)
     */
    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}
