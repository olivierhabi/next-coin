# NextCoin Smartcontract

NextCoin Smart Contract allows for deposit of multiples of 10 tokens that convert to assets associated with the depositing wallet. Asset owners receive a 0.1 token reward every 24 hours and can claim rewards based on assets. There's a reward pool of 10,000 tokens for distribution to asset owners.

## Smartcontract file

[Funtoken.sol](https://github.com/olivierhabi/next-coin/blob/main/next-coin/contracts/FunToken.sol)

[Fontend WebApp](https://next-coin.vercel.app)

## interface `IERC20`

This is an interface for an ERC-20 token with two functions to transfer tokens and claim rewards, and an event that is triggered when tokens are transferred. It helps ensure a standardized way to interact with ERC-20 tokens.

```javascript
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function claimReward() external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
}
```

## `SafeMath`

This is SafeMath library that prevents arithmetic bugs in Solidity contracts by checking for overflow and underflow when adding or subtracting unsigned integers.

```javascript
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
```

## Contract Variables,

```javascript
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
```

This contructor get `updateInterval` input during deployment to set time interval asset owner will be rewarded, `updateInterval` should be in seconds. and set `lastTimeStamp`, `depositCount` to 0 and assign all tokens to deployment wallet address.

```javascript
constructor(uint updateInterval) {
    interval = updateInterval;
    lastTimeStamp = block.timestamp;

    depositCount = 0;
    balanceOf[msg.sender] = totalSupply;
}
```

## `deposit(uint _value)`

This function allows the user to deposit tokens into the contract. The deposit must be in multiples of 10 and the user must have enough tokens to make the deposit. This function updates the `balanceOf`, `Assets`, and `AssetOwners` of the sender and update reference of assetOwner in `OwnsAsset` to avoid multiple reference in `AssetOwners`.

```javascript
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
```

## `transfer(address _to, uint256 _value)`

This function allows the user to transfer tokens to another address. The user must have enough tokens to make the transfer. This function updates the balanceOf of the sender and the recipient.

```javascript
function transfer(address _to, uint256 _value) public override returns (bool) {
    require(_value <= balanceOf[msg.sender], "Insufficient balance");
    balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);

    emit Transfer(msg.sender, _to, _value);
    return true;
}
```

## `claimReward()`

This function allows the user to claim their rewards. The function updates the balanceOf and Rewards of the sender and resets the Assets of the sender to 0.

```javascript
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
```

## `distributeRewards()`

This function distributes rewards to all asset owners. The function calculates the rewards for each asset owner, updates the Rewards of each asset owner, and subtracts the total rewards from rewardDistribution but it checks if rewardDistribution still has the token to distribute if exhausted it will break the loop.

```javascript
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
```

## Using the Contract

- Deploy the contract to the Avalanche network.
- Call the `deposit` function to deposit tokens into the contract.
- Call the `claimReward` function to claim rewards.
- Call the `distributeRewards` function to distribute rewards to all asset owners.
- Call the `transfer` function to transfer tokens to another address.

## Running test with `Hardhat`

To run tests, run the following command

```bash
  git clone https://github.com/olivierhabi/next-coin.git
```

```bash
  cd next-coin/next-coin
```

```bash
  hardhat test
```
