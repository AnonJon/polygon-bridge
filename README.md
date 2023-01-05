# polygon-bridge

## About

A rough draft of using Polygon StateSync. Contracts have been created to bridge ERC677 tokens from Ethereum -> Polygon & Polygon -> Ethereum.
Compared to L2 bridges (arb/optim) the bridging time is a fraction when coming back to Ethereum.

- 30 min (Polygon -> Ethereum Mainnet)
- 7 days (arb/optim -> Ethereum Mainnet)

### Hardhat

Scripts are in the hardhat directory since deploying Mumbai contracts on Foundry was not possible. (Added an issue on Github and is now fixed)
