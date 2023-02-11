
# NextCoin Smartcontract 

NextCoin Smart Contract allows for deposit of multiples of 10 tokens that convert to assets associated with the depositing wallet. Asset owners receive a 0.1 token reward every 24 hours and can claim rewards based on assets. There's a reward pool of 10,000 tokens for distribution to asset owners.


## Smartcontract file

 [Funtoken.sol](https://github.com/olivierhabi/next-coin/blob/main/next-coin/contracts/FunToken.sol)


 [Fontend WebApp](https://next-coin.vercel.app)
 

## Contract Variables,

```javascript
string public name = "NextCoin";
string public symbol = "NXT";
uint8 public decimals = 18;
```

```javascript
uint public DECIMALS = (10 ** decimals);
uint256 public totalSupply = 1000000 * DECIMALS;
uint256 public rewardDistribution; 
uint256 public depositCount = 0;
```
```javascript
mapping (address => uint256) public balanceOf;
mapping (address => uint256) public Assets;
mapping(address => uint256) public Rewards;
address[] public AssetOwners;
```

This contructor create Totalsupply of `1 Million Tokens` and assign `10,000 tokens` to `rewardDistribution` to be distributed as a reword to asset owners.

```javascript
constructor() {
  rewardDistribution += 10000 * DECIMALS;
  totalSupply -= 10000 * DECIMALS;
  balanceOf[msg.sender] = totalSupply;
}
```
## `deposit(uint _value)` 
This function allows the user to deposit tokens into the contract. The deposit must be in multiples of 10 and the user must have enough tokens to make the deposit. This function updates the `balanceOf`, `Assets`, and `AssetOwners` of the sender.

```javascript
function deposit(uint _value) public payable {
  uint divisor = 10 * DECIMALS;
  require(_value % divisor == 0, "Deposit must be in multiples of 10");
  require(balanceOf[msg.sender] >= _value, "Not enough token provided");

  balanceOf[msg.sender] -= _value;
  depositCount += _value;
  Assets[msg.sender] += _value / divisor;
  AssetOwners.push(msg.sender);
}
```

## `transfer(address _to, uint256 _value)`
This function allows the user to transfer tokens to another address. The user must have enough tokens to make the transfer. This function updates the balanceOf of the sender and the recipient.

```javascript
function transfer(address _to, uint256 _value) public {
  uint256 value = _value;
  uint256 balance = balanceOf[msg.sender];
  require(balance >= value, "Insufficient balance");
  balanceOf[msg.sender] -= value;
  balanceOf[_to] += value;
}
```


## `claimReward()`
This function allows the user to claim their rewards. The function updates the balanceOf and Rewards of the sender and resets the Assets of the sender to 0.

```javascript
 function claimReward() public {
    balanceOf[msg.sender] += Rewards[msg.sender];
    Rewards[msg.sender] = 0;

    uint tokenBack =  (Assets[msg.sender] * 10) * DECIMALS;
    depositCount -= tokenBack;
    balanceOf[msg.sender] += tokenBack;
    Assets[msg.sender] = 0;
}
```
## `distributeRewards()`
This function distributes rewards to all asset owners. The function calculates the rewards for each asset owner, updates the Rewards of each asset owner, and subtracts the total rewards from rewardDistribution.

```javascript
function distributeRewards() public {
    for (uint256 i = 0; i < AssetOwners.length; i++){
        uint reward = (DECIMALS * 1 / 10) * Assets[AssetOwners[i]];
        Rewards[AssetOwners[i]] = reward;
        rewardDistribution -= reward;
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


## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?

