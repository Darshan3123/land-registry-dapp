//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Users.sol";

contract Inspection {
    Users public usersContract;
    
    struct InspectionReport {
        uint256 landId;
        address inspector;
        string reportHash; // IPFS hash
        string status; // "pending", "approved", "rejected"
        string remarks;
        uint256 inspectionDate;
        bool isCompleted;
    }
    
    mapping(uint256 => InspectionReport[]) public landInspections;
    mapping(uint256 => uint256) public inspectionCounts;
    
    event InspectionRequested(uint256 indexed landId, address indexed inspector);
    event InspectionCompleted(uint256 indexed landId, address indexed inspector, string status);
    
    constructor(address _usersContract) {
        usersContract = Users(_usersContract);
    }
    
    modifier onlyInspector() {
        require(
            usersContract.hasRole(usersContract.INSPECTOR_ROLE(), msg.sender) ||
            usersContract.hasRole(usersContract.ADMIN_ROLE(), msg.sender),
            "Not authorized inspector"
        );
        _;
    }
    
    function requestInspection(uint256 landId) public onlyInspector {
        require(usersContract.isUserActive(msg.sender), "Inspector not active");
        
        InspectionReport memory newInspection = InspectionReport({
            landId: landId,
            inspector: msg.sender,
            reportHash: "",
            status: "pending",
            remarks: "",
            inspectionDate: block.timestamp,
            isCompleted: false
        });
        
        landInspections[landId].push(newInspection);
        inspectionCounts[landId]++;
        
        emit InspectionRequested(landId, msg.sender);
    }
    
    function completeInspection(
        uint256 landId,
        uint256 inspectionIndex,
        string memory reportHash,
        string memory status,
        string memory remarks
    ) public onlyInspector {
        require(inspectionIndex < landInspections[landId].length, "Invalid inspection index");
        require(
            landInspections[landId][inspectionIndex].inspector == msg.sender,
            "Not your inspection"
        );
        require(!landInspections[landId][inspectionIndex].isCompleted, "Already completed");
        
        landInspections[landId][inspectionIndex].reportHash = reportHash;
        landInspections[landId][inspectionIndex].status = status;
        landInspections[landId][inspectionIndex].remarks = remarks;
        landInspections[landId][inspectionIndex].isCompleted = true;
        
        emit InspectionCompleted(landId, msg.sender, status);
    }
    
    function getLandInspections(uint256 landId) public view returns (InspectionReport[] memory) {
        return landInspections[landId];
    }
    
    function getLatestInspectionStatus(uint256 landId) public view returns (string memory) {
        if (inspectionCounts[landId] == 0) {
            return "no_inspection";
        }
        
        uint256 latestIndex = inspectionCounts[landId] - 1;
        return landInspections[landId][latestIndex].status;
    }
}