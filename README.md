# Product Hunt

A decentralized product hunt.

### Actions
- List a new product (provide IPFS hash of the product details)
- Upvote a product
- Downvote a product
- Tip the maker
- Delete a product

The above operations obviously require gas.

### Development
```shell
ganache-cli

npm i
npm run compile
npm run migrate
npm test
```