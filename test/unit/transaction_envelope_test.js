describe('TransactionEnvelope', function() {
  it('can successfully decode an envelope', function(done) {
    let xdr =
      'AAAAAPQQv+uPYrlCDnjgPyPRgIjB6T8Zb8ANmL8YGAXC2IAgAAAAZAAIteYAAAAHAAAAAAAAAAAAAAABAAAAAAAAAAMAAAAAAAAAAUVVUgAAAAAAUtYuFczBLlsXyEp3q8BbTBpEGINWahqkFbnTPd93YUUAAAAXSHboAAAAABEAACcQAAAAAAAAAKIAAAAAAAAAAcLYgCAAAABAo2tU6n0Bb7bbbpaXacVeaTVbxNMBtnrrXVk2QAOje2Flllk/ORlmQdFU/9c8z43eWh1RNMpI3PscY+yDCnJPBQ==';

    let txe = DigitalBitsBase.xdr.TransactionEnvelope.fromXDR(
      xdr,
      'base64'
    ).value();
    let sourceAccount = txe.tx().sourceAccountEd25519();

    expect(sourceAccount.length).to.be.equal(32);
    done();
  });

  it('calculates correct hash with non-utf8 strings', function(done) {
    // 6bcd7030f808e02e1abc2be30ef1582c2e4ea76bcf0c05959221dfb1a971def6
    let xdr =
      'AAAAAAtjwtJadppTmm0NtAU99BFxXXfzPO1N/SqR43Z8aXqXAAAAZAAIj6YAAAACAAAAAAAAAAEAAAAB0QAAAAAAAAEAAAAAAAAAAQAAAADLa6390PDAqg3qDLpshQxS+uVw3ytSgKRirQcInPWt1QAAAAAAAAAAA1Z+AAAAAAAAAAABfGl6lwAAAEBC655+8Izq54MIZrXTVF/E1ycHgQWpVcBD+LFkuOjjJd995u/7wM8sFqQqambL0/ME2FTOtxMO65B9i3eAIu4P';
    var tx = new DigitalBitsBase.Transaction(xdr, DigitalBitsBase.Networks.PUBLIC);
    expect(tx.hash().toString('hex')).to.be.equal(
      '6bcd7030f808e02e1abc2be30ef1582c2e4ea76bcf0c05959221dfb1a971def6'
    );
    done();
  });
});
