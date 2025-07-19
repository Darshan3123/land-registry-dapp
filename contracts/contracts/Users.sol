//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Users is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    
    struct User {
        address userAddress;
        string name;
        string email;
        string role; // "admin", "inspector", "user"
        bool isActive;
        uint256 registrationDate;
    }
    
    mapping(address => User) public users;
    mapping(address => bool) public registeredUsers;
    
    event UserRegistered(address indexed userAddress, string name, string role);
    event UserStatusChanged(address indexed userAddress, bool isActive);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        // Register admin user
        users[msg.sender] = User({
            userAddress: msg.sender,
            name: "System Admin",
            email: "admin@landregistry.com",
            role: "admin",
            isActive: true,
            registrationDate: block.timestamp
        });
        registeredUsers[msg.sender] = true;
    }
    
    function registerUser(
        address userAddress,
        string memory name,
        string memory email,
        string memory role
    ) public onlyRole(ADMIN_ROLE) {
        require(!registeredUsers[userAddress], "User already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        
        users[userAddress] = User({
            userAddress: userAddress,
            name: name,
            email: email,
            role: role,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        registeredUsers[userAddress] = true;
        
        // Grant role based on user type
        if (keccak256(bytes(role)) == keccak256(bytes("inspector"))) {
            _grantRole(INSPECTOR_ROLE, userAddress);
        }
        
        emit UserRegistered(userAddress, name, role);
    }
    
    function toggleUserStatus(address userAddress) public onlyRole(ADMIN_ROLE) {
        require(registeredUsers[userAddress], "User not registered");
        users[userAddress].isActive = !users[userAddress].isActive;
        emit UserStatusChanged(userAddress, users[userAddress].isActive);
    }
    
    function getUser(address userAddress) public view returns (User memory) {
        require(registeredUsers[userAddress], "User not registered");
        return users[userAddress];
    }
    
    function isUserActive(address userAddress) public view returns (bool) {
        return registeredUsers[userAddress] && users[userAddress].isActive;
    }
}