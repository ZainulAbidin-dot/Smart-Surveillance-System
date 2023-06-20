from web3 import Web3
from web3.contract import Contract
from web3.middleware import geth_poa_middleware
import json

import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

room_no = os.getenv('ROOM_NO')
counter = 0

with open('abi.json', 'r') as f:
    abi = json.load(f)

w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

contract_address = '0xA4Cd56f946DEB0cC9797E81A6F627fc4754A46d1'
contract_abi = abi

contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Create an account or use an existing one
private_key = 'ac498fdeba26cd2ee5dff646f325468dd1502c97a106aea0780c94ffaddbd034'
from_address = w3.eth.account.from_key(private_key).address

class Consensus:
    def submit():
        
        # Enable unaudited HD wallet features
        w3.eth.account.enable_unaudited_hdwallet_features()

        # Call a write function that requires Metamask confirmation
        nonce = w3.eth.getTransactionCount(from_address)
        gas_price = w3.toWei('50', 'gwei')  # Set the gas price to 50 Gwei
        gas_limit = 220000  # Set the gas limit to 1,000,000
        print(room_no)
        tx = contract.functions.submit(int(room_no)).buildTransaction({
            'nonce': nonce,
            'from': from_address,
            'gasPrice': gas_price,
            'gas': gas_limit
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        print('Transaction Hash:', tx_hash.hex())

    def approve(tx_id):
        tx_hash = contract.functions.approve(tx_id).transact({'from': w3.eth.accounts[1], 'gas': 1000000})
        receipt = w3.eth.waitForTransactionReceipt(tx_hash)
        print("Transaction approved successfully")

    def execute(tx_id):
        tx_count = contract.functions._getApprovalCount(tx_id).call()  # Count the number of approvals for the transaction
        if tx_count < contract.functions.required().call():
            print("Transaction is not fully approved")
            return
        
        tx = contract.functions.transactions(tx_id).call()  # Get transaction details
        if tx[0]:  # If the transaction is already executed
            print("Transaction already executed")
            return
        
        tx_hash = contract.functions.execute(tx_id).transact({'from': w3.eth.accounts[1], 'gas': 1000000})
        receipt = w3.eth.waitForTransactionReceipt(tx_hash)
        print("Transaction executed successfully")

    # Wait for the transaction to be mined
    # receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    # print('Transaction Receipt:', receipt)

    # Call a function
    def consensus_algo():
        try:
            latest_transaction = contract.functions.getLatestTransaction().call()
            a = int(latest_transaction)
            print("Function called : ",a, latest_transaction)
            # result4 = contract.functions.getTx(a).call()
            approval_count = contract.functions._getApprovalCount(a).call()

            # print("Function called final : ",result4)
            if(approval_count == 1 ):
                Consensus.submit()
                latest_transaction = contract.functions.getLatestTransaction().call()
                a = int(latest_transaction)
                Consensus.approve(a)
                # print("Function called : ",result2)
                Consensus.execute(a)
                checking = contract.functions.getAllTransactions().call()
                print("Checking",checking)
                
                result4 = contract.functions.getTx(a).call()
                if(result4 == [True, int(room_no)]):
                    return "true"
                else:
                    return "false"  
            elif approval_count != 1:
                # Consensus.submit()
                latest_transaction = contract.functions.getLatestTransaction().call()
                a = int(latest_transaction)
                Consensus.approve(a)
                # print("Function called : ",result2)
                Consensus.execute(a)
                checking = contract.functions.getAllTransactions().call()
                print("Checking",checking)
                result4 = contract.functions.getTx(a).call()
                if(result4 == [True, room_no]):
                    return "true"
                else:
                    return "false"  

                
        except Exception as e:
            print(f"Error in consensus_algo: {e}")


    ###################################################################################################

__all__ = ['Consensus']
