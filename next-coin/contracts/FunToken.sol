// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function claimReward() external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}

contract FunToken is AutomationCompatibleInterface, IERC20 {
    using SafeMath for uint256;

    string public name = "NextCoin";
    string public symbol = "NXT";
    uint8 public decimals = 18;


    uint public DECIMALS = (10 ** decimals);
    uint256 public totalSupply = 1000000 * DECIMALS;
    uint256 public rewardDistribution = 10000 * DECIMALS;
    uint256 public depositCount;

    

    mapping (address => uint256) public balanceOf;
    mapping (address => uint256) public Assets;
    mapping(address => uint256) public Rewards;

    mapping(address => bool) public OwnsAsset;

    address[] public AssetOwners;

    uint public immutable interval;
    uint public lastTimeStamp;

    constructor(uint updateInterval) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;

        depositCount = 0;
        balanceOf[msg.sender] = totalSupply;
    }

    

    function deposit(uint _value) public payable {
        uint divisor = 10 * DECIMALS;
        require(_value % divisor == 0, "Deposit must be in multiples of 10");
        require(balanceOf[msg.sender] >= _value, "Not enough token provided");

        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        depositCount = depositCount.add(_value);
        Assets[msg.sender] = Assets[msg.sender].add(_value / divisor);

        if(OwnsAsset[msg.sender] != true) {
            AssetOwners.push(msg.sender);
            OwnsAsset[msg.sender] = true;
        }
    }

    function transfer(address _to, uint256 _value) public override returns (bool) {
        require(_value <= balanceOf[msg.sender], "Insufficient balance");
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function claimReward() public override returns (bool) {
        balanceOf[msg.sender] = balanceOf[msg.sender].add(Rewards[msg.sender]);
        Rewards[msg.sender] = 0;

        uint tokenBack = (Assets[msg.sender] * 10) * DECIMALS;
        depositCount = depositCount.sub(tokenBack);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(tokenBack);
        Assets[msg.sender] = 0;
        OwnsAsset[msg.sender] = false;
        return true;
    }


    function distributeRewards() public {
        for (uint256 i = 0; i < AssetOwners.length; i++){
            uint reward = (DECIMALS * 1 / 10) * Assets[AssetOwners[i]];
            
            if(rewardDistribution <= reward) {
                Rewards[AssetOwners[i]] = Rewards[AssetOwners[i]].add(rewardDistribution);
                rewardDistribution = rewardDistribution.sub(rewardDistribution);
                break;
            } else {
                Rewards[AssetOwners[i]] = Rewards[AssetOwners[i]].add(reward);
                rewardDistribution = rewardDistribution.sub(reward);
            }
        }
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            distributeRewards();
        }
    }
}
