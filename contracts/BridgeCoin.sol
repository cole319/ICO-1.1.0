//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BridgeCoin {
    uint256 public totalSupply = 10000000 * 10 ** 18;
    string public name = "BridgeCoin";
    string public symbol = "BGC";
    uint256 public decimal = 18;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approve(address indexed owner, address indexed spender, uint256 value);

    constructor(){
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) external returns(bool){
        require(balanceOf[msg.sender] >= value, "insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    } 

    function trnasferFrom(address from, address to, uint256 value) external returns(bool){
        require(balanceOf[from] >= value, "insufficient balance");
        require(allowance[from][msg.sender] >= value, "insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns(bool){
        require(balanceOf[msg.sender] >= value, "insufficient balance");
        allowance[msg.sender][spender] = value;
        emit Approve(msg.sender, spender, value);
        return true;
    } 
} 

// deployed at : 0x3358a9cC0fe1dC3D36Ba922112ccb66A581f2aEC

