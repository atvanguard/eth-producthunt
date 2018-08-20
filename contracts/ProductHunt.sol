pragma solidity ^0.4.24;

contract ProductHunt {
  address public owner;
  uint256 counter;

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender == owner) _;
  }

  modifier validProduct(uint256 id) {
    Product storage product = productMapping[id];
    require(product.maker != 0, 'Invalid product id');
    _;
  }

  modifier hasNotVoted(uint256 id, address voter) {
    require(!hasVoted(id, voter), 'Already voted for this product');
    require(!hasDownVoted(id, voter), 'Already downvoted this product');
    _;
  }

  struct Product {
    address maker;
    string ipfsHash;
    address[] votes;
    address[] downVotes;
  }

  mapping(uint256 => Product) public productMapping;

  function newProduct(string ipfsHash) public {
    uint256 id = generateProductId();
    Product memory p = Product(
      msg.sender,
      ipfsHash,
      new address[](0),
      new address[](0));
    productMapping[id] = p;
  }

  function vote(uint256 id) public validProduct(id) hasNotVoted(id, msg.sender) {
    Product storage product = productMapping[id];
    product.votes.push(msg.sender);
  }

  function downVote(uint256 id) public validProduct(id) hasNotVoted(id, msg.sender) {
    Product storage product = productMapping[id];
    product.downVotes.push(msg.sender);
  }

  function getProduct(uint256 id) public view validProduct(id) returns(
      address maker,
      string ipfsHash,
      uint256 numVotes,
      uint256 numDownVotes) {
    Product storage product = productMapping[id];
    return (product.maker, product.ipfsHash, product.votes.length, product.downVotes.length);
  }

  function deleteProduct(uint256 id) public validProduct(id) {
    Product storage product = productMapping[id];
    require(product.maker == msg.sender);
    delete productMapping[id];
  }

  // internal functions
  function generateProductId() internal returns (uint256) {
    // @todo use safemath
    return counter++;
  }

  // internal view functions
  function hasVoted(uint256 id, address voter) internal view returns (bool) {
    Product storage product = productMapping[id];
    bool _hasVoted = false;
    for(uint256 i = 0; i < product.votes.length; i++) {
      if (product.votes[i] == voter) {
        _hasVoted = true;
        break;
      }
    }
    return _hasVoted;
  }

  function hasDownVoted(uint256 id, address voter) internal view returns (bool) {
    Product storage product = productMapping[id];
    bool _hasDownVoted = false;
    for(uint256 i = 0; i < product.downVotes.length; i++) {
      if (product.downVotes[i] == voter) {
        _hasDownVoted = true;
        break;
      }
    }
    return _hasDownVoted;
  }
}
