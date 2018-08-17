describe("Network.current()", function() {
  it("defaults network is null", function() {
    expect(DigitalBitsBase.Network.current()).to.be.null;
  });
});

describe("Network.useTestNetwork()", function() {
  it("switches to the test network", function() {
    DigitalBitsBase.Network.useTestNetwork();
    expect(DigitalBitsBase.Network.current().networkPassphrase()).to.equal(DigitalBitsBase.Networks.TESTNET)
  });
});

describe("Network.usePublicNetwork()", function() {
  it("switches to the public network", function() {
    DigitalBitsBase.Network.usePublicNetwork();
    expect(DigitalBitsBase.Network.current().networkPassphrase()).to.equal(DigitalBitsBase.Networks.PUBLIC)
  });
});
