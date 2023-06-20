//SPDX-License-Identifier:MIT

/// @title Multi-Signature-Wallet
/// @notice In this program we have designed a Multi Signature Wallet , It is a special wallet where a transaction is only 
   // executed when a relevant number of stakeholders , have approved the transaction.

pragma solidity ^0.8.10;

contract MultiSigWallet{

    event Deposit(address indexed sender, uint amount);
    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Revoke(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);
    
    struct Transaction{
        bool executed;
        uint room;
    }

    address[] public actuators;
    mapping (address => bool) public isActuator;
    uint public required;

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approved; // The mapping will keep a track, if a certain tx_Id has been apprioved by a certain Owner  

    modifier onlyOwner {
        require(isActuator[msg.sender],"Not an owner");
        _;
    }

    // This modifier will check if The transaction exists.
    modifier txExists(uint _txId){
        require(_txId < transactions.length,"This transaction doesn't exist");
        _;
    } 

    
    modifier notApproved(uint _txId){
        require(!approved[_txId][msg.sender],"This tx is already approved");
        _;
    }

    modifier notExecuted(uint _txId){
        require(!transactions[_txId].executed,"tx already executed");
        _;
    }
    //  
    constructor(address[] memory _actuators,uint  _required) payable{ // the _required here represents the required number of approvals for a transaction to be executed
        require(_actuators.length > 0,"actuators required"); 
        require(_required>0 && _required<= _actuators.length,"invalid required number of actuators");

        for(uint i;i<_actuators.length;i++){
            address owner = _actuators[i]; 

            require(owner!= address(0),"invalid owner");
            require(!isActuator[owner],"owner is not unique");

            isActuator[owner]=true;
            actuators.push(owner);
        }
        required = _required; // here we assign the number of required approvals for the particular owner registered right above 
    }

    // fallback () external payable{
    //     emit Deposit(msg.sender,msg.value);
    // }
// First Function
    function submit(uint _roomNo)external onlyOwner{ // when an owner submits a transaction
        transactions.push(Transaction({
            executed : false,
            room:_roomNo 
        }));
        emit Submit(transactions.length-1); 
    }
// Second Function
    function approve(uint _txId) external onlyOwner txExists(_txId) notApproved(_txId) notExecuted(_txId){
        approved[_txId][msg.sender]= true;
        emit Approve(msg.sender,_txId);
    }

    function _getApprovalCount(uint _txId) public  view returns(uint count){ // count the number of approvals for certain Tx
        for(uint i;i<actuators.length;i++){
            if(approved[_txId][actuators[i]]){
                count+=1;
            }
        }
    }

    function execute(uint _txId) external txExists(_txId) notExecuted(_txId){  
        require(_getApprovalCount(_txId)>= required,"This transaction is not fully approved"); 
        Transaction storage transaction = transactions[_txId];
        transaction.executed = true;
        emit Execute(_txId);
    }

    function revoke(uint _txId) external onlyOwner txExists(_txId) notExecuted(_txId){ // A transaction can only be revoked if it has not been executed
        require(approved[_txId][msg.sender],"tx not approved");
        approved[_txId][msg.sender] = false;
        emit Revoke(msg.sender,_txId);
    }

    function getTx(uint _txId) public view returns( bool executed,uint roomNo ){
        Transaction storage transaction = transactions[_txId];
        return (transaction.executed,transaction.room);
    }
    
    function getLatestTransaction()public view returns(uint txId){
        return transactions.length-1;
    }

    function getAllTransactions()public view returns(Transaction[] memory){
        return transactions;
    }


} 