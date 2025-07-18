 //SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
address public admin;
struct Land {
    uint256 landId;
    address owner;
    string location;
    string documentCID; // IPFS hash or any document reference
    bool isVerified;
}

// Mapping of land ID to Land data
mapping(uint256 => Land) public lands;

// Events
event LandRegistered(uint256 landId, address indexed owner);
event LandTransferred(uint256 landId, address indexed newOwner);
event LandVerified(uint256 landId);

// Modifiers
modifier onlyAdmin() {
    require(msg.sender == admin, "Not an admin");
    _;
}

modifier onlyLandOwner(uint256 landId) {
    require(msg.sender == lands[landId].owner, "Not the land owner");
    _;
}

// Constructor
constructor() {
    admin = msg.sender;
}

// Register new land (admin only)
function registerLand(
    uint256 landId,
    address owner,
    string memory location,
    string memory documentCID
) public onlyAdmin {
    require(lands[landId].owner == address(0), "Land already registered");
    lands[landId] = Land(landId, owner, location, documentCID, false);
    emit LandRegistered(landId, owner);
}

// Transfer land to a new owner
function transferLand(uint256 landId, address newOwner)
    public
    onlyLandOwner(landId)
{
    lands[landId].owner = newOwner;
    emit LandTransferred(landId, newOwner);
}

// Admin verifies land
function verifyLand(uint256 landId) public onlyAdmin {
    lands[landId].isVerified = true;
    emit LandVerified(landId);
}

// Get land details
function getLand(uint256 landId) public view returns (
    uint256,
    address,
    string memory,
    string memory,
    bool
) {
    Land memory land = lands[landId];
    return (
        land.landId,
        land.owner,
        land.location,
        land.documentCID,
        land.isVerified
    );
}
}