const ProductHunt = artifacts.require("ProductHunt");
const chai = require('chai');

chai.should();
const expect = chai.expect;
const assert = chai.assert;

contract('ProductHunt', function(accounts) {
  it('newProduct', async function() {
    const instance = await ProductHunt.deployed();
    // console.log(instance, accounts);
    const newProductTx = await createNewProduct(instance, 'ipfsHash');
    // printVerbose(newProductTx);
    expect(newProductTx).to.have.property('tx');
    expect(newProductTx).to.have.property('receipt');
    expect(newProductTx.logs).to.have.lengthOf(1);
    const log = newProductTx.logs[0];
    expect(log.event).to.equal('NewProduct');
    expect(log.args).to.include({maker: accounts[0], ipfsHash: 'ipfsHash'});
    expect(log.args).to.have.property('id');
  });

  it('vote', async function() {
    const instance = await ProductHunt.deployed();
    // console.log(instance, accounts);
    const newProductTx = await createNewProduct(instance, 'ipfsHash');
    // printVerbose(newProductTx);
    const productId = newProductTx.logs[0].args.id;
    const voteTx = await instance.vote(productId);
    // printVerbose(voteTx);
    expect(voteTx).to.have.property('tx');
    expect(voteTx).to.have.property('receipt');
    expect(voteTx.logs).to.have.lengthOf(1);
    const log = voteTx.logs[0];
    expect(log.event).to.equal('Voted');
    expect(log.args.id).to.deep.equal(productId);

    // voting again from the same account should fail
    try {
      await instance.vote(productId);
      expect.fail(1, 0, 'voting again from the same account should have failed');
    } catch(e) {
      // printVerbose(e);
      // success
    }
  });

  it('downVote', async function() {
    const instance = await ProductHunt.deployed();
    // console.log(instance, accounts);
    const newProductTx = await createNewProduct(instance, 'ipfsHash');
    // printVerbose(newProductTx);
    const productId = newProductTx.logs[0].args.id;
    const downVoteTx = await instance.downVote(productId);
    // printVerbose(voteTx);
    expect(downVoteTx).to.have.property('tx');
    expect(downVoteTx).to.have.property('receipt');
    expect(downVoteTx.logs).to.have.lengthOf(1);
    const log = downVoteTx.logs[0];
    expect(log.event).to.equal('DownVoted');
    expect(log.args.id).to.deep.equal(productId);

    // voting from the account which you downvoted from should fail
    try {
      await instance.vote(productId);
      expect.fail(1, 0, 'voting from the account which you downvoted from should fail');
    } catch(e) {}

    // downvoting again from the same account should fail
    try {
      await instance.downVote(productId);
      expect.fail(1, 0, 'downvoting again from the same account should fail');
    } catch(e) {}
  });

  it('deleteProduct', async function() {
    const instance = await ProductHunt.deployed();
    // console.log(instance, accounts);
    const newProductTx = await createNewProduct(instance, 'ipfsHash');
    const productId = newProductTx.logs[0].args.id;
    const deleteProductTx = await instance.deleteProduct(productId);
    // printVerbose(deleteProductTx);
    expect(deleteProductTx).to.have.property('tx');
    expect(deleteProductTx).to.have.property('receipt');
    expect(deleteProductTx.logs).to.have.lengthOf(1);
    const log = deleteProductTx.logs[0];
    expect(log.event).to.equal('DeleteProduct');
    expect(log.args.id).to.deep.equal(productId);

    // deleting a non existent product should throw
    try {
      await instance.deleteProduct(productId);
      expect.fail(1, 0, 'deleting a non existent product should throw');
    } catch(e) {}
  });
})

async function createNewProduct(instance, ipfsHash) {
  const newProductTx = await instance.newProduct(ipfsHash);
  return newProductTx;
}

function printVerbose(obj) {
  console.dir(obj, {depth: null});
}