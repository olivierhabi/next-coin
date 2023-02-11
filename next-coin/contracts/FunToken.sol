// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "hardhat/console.sol";


contract FunToken {
    string public name = "NextCoin";
    string public symbol = "NXT";
    uint8 public decimals = 18;


    uint public DECIMALS = (10 ** decimals);
    uint256 public totalSupply = 1000000 * DECIMALS;
    uint256 public rewardDistribution; 
    uint256 public depositCount = 0;

    

    mapping (address => uint256) public balanceOf;
    mapping (address => uint256) public Assets;
    mapping(address => uint256) public Rewards;

    address[] public AssetOwners;


    constructor() {
        rewardDistribution += 10000 * DECIMALS;
        totalSupply -= 10000 * DECIMALS;
        balanceOf[msg.sender] = totalSupply;
    }

    function deposit(uint _value) public payable {
        uint divisor = 10 * DECIMALS;
        require(_value % divisor == 0, "Deposit must be in multiples of 10");
        require(balanceOf[msg.sender] >= _value, "Not enough token provided");
        balanceOf[msg.sender] -= _value;
        depositCount += _value;
        Assets[msg.sender] += _value / divisor;
        AssetOwners.push(msg.sender);
    }

    function transfer(address _to, uint256 _value) public {
        uint256 value = _value;
        uint256 balance = balanceOf[msg.sender];
        require(balance >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[_to] += value;
    }

    function claimReward() public {
        balanceOf[msg.sender] += Rewards[msg.sender];
        Rewards[msg.sender] = 0;
        uint tokenBack =  (Assets[msg.sender] * 10) * DECIMALS;
        depositCount -= tokenBack;
        balanceOf[msg.sender] += tokenBack;
        Assets[msg.sender] = 0;
    }


    function distributeRewards() public {
        for (uint256 i = 0; i < AssetOwners.length; i++){
            uint reward = (DECIMALS * 1 / 10) * Assets[AssetOwners[i]];
            Rewards[AssetOwners[i]] = reward;
            rewardDistribution -= reward;
        }
    }
}