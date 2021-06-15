describe('muxed account abstraction works', function() {
  const PUBKEY = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
  const MPUBKEY_ZERO =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ';
  const MPUBKEY_ID =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAABUTGI4';

  it('generates addresses correctly', function() {
    let baseAccount = new DigitalBitsBase.Account(PUBKEY, '1');
    const mux = new DigitalBitsBase.MuxedAccount(baseAccount, '0');
    expect(mux.baseAccount().accountId()).to.equal(PUBKEY);
    expect(mux.accountId()).to.equal(MPUBKEY_ZERO);
    expect(mux.id()).to.equal('0');

    expect(mux.setId('420').id()).to.equal('420');
    expect(mux.accountId()).to.equal(MPUBKEY_ID);

    const muxXdr = mux.toXDRObject();
    expect(muxXdr.switch()).to.equal(
      DigitalBitsBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
    );

    const innerMux = muxXdr.med25519();
    expect(
      innerMux
        .ed25519()
        .equals(DigitalBitsBase.StrKey.decodeEd25519PublicKey(PUBKEY))
    ).to.be.true;
    expect(innerMux.id()).to.eql(DigitalBitsBase.xdr.Uint64.fromString('420'));

    expect(DigitalBitsBase.encodeMuxedAccountToAddress(muxXdr, true)).to.equal(
      mux.accountId()
    );
  });

  it('tracks sequence numbers correctly', function() {
    let baseAccount = new DigitalBitsBase.Account(PUBKEY, '12345');
    const mux1 = new DigitalBitsBase.MuxedAccount(baseAccount, '1');
    const mux2 = new DigitalBitsBase.MuxedAccount(baseAccount, '2');

    expect(baseAccount.sequenceNumber()).to.equal('12345');
    expect(mux1.sequenceNumber()).to.equal('12345');
    expect(mux2.sequenceNumber()).to.equal('12345');

    mux1.incrementSequenceNumber();

    expect(baseAccount.sequenceNumber()).to.equal('12346');
    expect(mux1.sequenceNumber()).to.equal('12346');
    expect(mux2.sequenceNumber()).to.equal('12346');

    mux2.incrementSequenceNumber();

    expect(baseAccount.sequenceNumber()).to.equal('12347');
    expect(mux1.sequenceNumber()).to.equal('12347');
    expect(mux2.sequenceNumber()).to.equal('12347');

    baseAccount.incrementSequenceNumber();

    expect(baseAccount.sequenceNumber()).to.equal('12348');
    expect(mux1.sequenceNumber()).to.equal('12348');
    expect(mux2.sequenceNumber()).to.equal('12348');
  });

  it('lets subaccounts be created', function() {
    let baseAccount = new DigitalBitsBase.Account(PUBKEY, '12345');
    const mux1 = new DigitalBitsBase.MuxedAccount(baseAccount, '1');

    const mux2 = mux1.baseAccount().createSubaccount('420');
    expect(mux2.id()).to.equal('420');
    expect(mux2.accountId()).to.equal(MPUBKEY_ID);
    expect(mux2.sequenceNumber()).to.equal('12345');

    const mux3 = new DigitalBitsBase.MuxedAccount(mux2.baseAccount(), '3');

    mux2.incrementSequenceNumber();
    expect(mux1.sequenceNumber()).to.equal('12346');
    expect(mux2.sequenceNumber()).to.equal('12346');
    expect(mux3.sequenceNumber()).to.equal('12346');
  });

  it('parses M-addresses', function() {
    const mux1 = new DigitalBitsBase.MuxedAccount.fromAddress(MPUBKEY_ZERO, '123');
    expect(mux1.id()).to.equal('0');
    expect(mux1.accountId()).to.equal(MPUBKEY_ZERO);
    expect(mux1.baseAccount().accountId()).to.equal(
      'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ'
    );
    expect(mux1.sequenceNumber()).to.equal('123');
  });
});
