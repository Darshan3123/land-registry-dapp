//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LandRegistry.sol";
import "./Users.sol";

contract Transactions {
    LandRegistry public landRegistry;
    Users public usersContract;
    
    struct Transaction {
        uint256 transactionId;
        uint256 landId;
        address seller;
        address buyer;
        uint256 price;
        string status; // "pending", "completed", "cancelled"
        uint256 createdAt;
        uint256 completedAt;
        string documentHash; // IPFS hash for transaction documents
    }
    
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => uint256[]) public landTransactions; // landId => transactionIds
    mapping(address => uint256[]) public userTransactions; // user => transactionIds
    
    uint256 public transactionCounter;
    
    event TransactionCreated(uint256 indexed transactionId, uint256 indexed landId, address seller, address buyer);
    event TransactionCompleted(uint256 indexed transactionId);
    event TransactionCancelled(uint256 indexed transactionId);
    
    constructor(address _landRegistry, address _usersContract) {
        landRegistry = LandRegistry(_landRegistry);
        usersContract = Users(_usersContract);
        transactionCounter = 1;
    }
    
    modifier onlyActiveLandOwner(uint256 landId) {
        (, address owner, , , ) = landRegistry.getLand(landId);
        require(owner == msg.sender, "Not the land owner");
        require(usersContract.isUserActive(msg.sender), "User not active");
        _;
    }
    
    function createTransaction(
        uint256 landId,
        address buyer,
        uint256 price,
        string memory documentHash
    ) public onlyActiveLandOwner(landId) {
        require(usersContract.isUserActive(buyer), "Buyer not active");
        require(price > 0, "Price must be greater than 0");
        
        Transaction memory newTransaction = Transaction({
            transactionId: transactionCounter,
            landId: landId,
            seller: msg.sender,
            buyer: buyer,
            price: price,
            status: "pending",
            createdAt: block.timestamp,
            completedAt: 0,
            documentHash: documentHash
        });
        
        transactions[transactionCounter] = newTransaction;
        landTransactions[landId].push(transactionCounter);
        userTransactions[msg.sender].push(transactionCounter);
        userTransactions[buyer].push(transactionCounter);
        
        emit TransactionCreated(transactionCounter, landId, msg.sender, buyer);
        transactionCounter++;
    }
    
    function completeTransaction(uint256 transactionId) public payable {
        Transaction storage txn = transactions[transactionId];
        require(txn.buyer == msg.sender, "Not the buyer");
        require(keccak256(bytes(txn.status)) == keccak256(bytes("pending")), "Transaction not pending");
        require(msg.value >= txn.price, "Insufficient payment");
        
        // Transfer land ownership
        landRegistry.transferLand(txn.landId, txn.buyer);
        
        // Update transaction status
        txn.status = "completed";
        txn.completedAt = block.timestamp;
        
        // Transfer payment to seller
        payable(txn.seller).transfer(txn.price);
        
        // Refund excess payment
        if (msg.value > txn.price) {
            payable(msg.sender).transfer(msg.value - txn.price);
        }
        
        emit TransactionCompleted(transactionId);
    }
    
    function cancelTransaction(uint256 transactionId) public {
        Transaction storage txn = transactions[transactionId];
        require(
            txn.seller == msg.sender || txn.buyer == msg.sender,
            "Not authorized to cancel"
        );
        require(keccak256(bytes(txn.status)) == keccak256(bytes("pending")), "Transaction not pending");
        
        txn.status = "cancelled";
        emit TransactionCancelled(transactionId);
    }
    
    function getLandTransactions(uint256 landId) public view returns (uint256[] memory) {
        return landTransactions[landId];
    }
    
    function getUserTransactions(address user) public view returns (uint256[] memory) {
        return userTransactions[user];
    }
    
    function getTransaction(uint256 transactionId) public view returns (Transaction memory) {
        return transactions[transactionId];
    }
}