pragma solidity ^0.4.24;

contract ProductHunt {
  address public owner;
  uint256 counter;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOnwer() {
    if (msg.sender == owner) _;
  }

  struct Product {
    address maker;
    string ipfsHash;
    address[] votes;
  }

  mapping(bytes32 => Product) public productMapping;

  function newProduct(string ipfsHash) public {
    bytes32 id = generateProductId();
    Product memory p = Product(
      msg.sender,
      ipfsHash,
      new address[](0));
    productMapping[id] = p;
  }

  function vote(bytes32 id) public {
    Product storage product = productMapping[id];
    require(product.maker != 0);
    // @todo require, not already voted
    product.votes.push(msg.sender);
  }

  function generateProductId() internal returns (bytes32) {
    // @todo use safemath
    return bytes32(counter++);
  }
}
