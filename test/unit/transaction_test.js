import randomBytes from 'randombytes';

describe('Transaction', function() {
  it('constructs Transaction object from a TransactionEnvelope', function(done) {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000.0000000';

    let input = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalBitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new DigitalBitsBase.Transaction(
      input,
      DigitalBitsBase.Networks.TESTNET
    );
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal(source.accountId());
    expect(transaction.fee).to.be.equal('100');
    expect(transaction.memo.type).to.be.equal(DigitalBitsBase.MemoText);
    expect(transaction.memo.value.toString('ascii')).to.be.equal(
      'Happy birthday!'
    );
    expect(operation.type).to.be.equal('payment');
    expect(operation.destination).to.be.equal(destination);
    expect(operation.amount).to.be.equal(amount);

    done();
  });

  describe('toEnvelope', function() {
    beforeEach(function() {
      let source = new DigitalBitsBase.Account(
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        '0'
      );
      let destination =
        'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      let asset = DigitalBitsBase.Asset.native();
      let amount = '2000.0000000';

      this.transaction = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({ destination, asset, amount })
        )
        .addMemo(DigitalBitsBase.Memo.text('Happy birthday!'))
        .setTimeout(DigitalBitsBase.TimeoutInfinite)
        .build();
    });

    it('does not return a reference to source signatures', function() {
      const transaction = this.transaction;
      const envelope = transaction.toEnvelope().value();
      envelope.signatures().push({});

      expect(transaction.signatures.length).to.equal(0);
    });
    it('does not return a reference to the source transaction', function() {
      const transaction = this.transaction;
      const envelope = transaction.toEnvelope().value();
      envelope.tx().fee(DigitalBitsBase.xdr.Int64.fromString('300'));

      expect(transaction.tx.fee().toString()).to.equal('100');
    });
  });

  it('throws when a garbage Network is selected', () => {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000.0000000';

    let input = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalBitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    expect(() => {
      new DigitalBitsBase.Transaction(input, { garbage: 'yes' });
    }).to.throw(/expected a string/);

    expect(() => {
      new DigitalBitsBase.Transaction(input, 1234);
    }).to.throw(/expected a string/);
  });

  it('throws when a Network is not passed', () => {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000.0000000';

    let input = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalBitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    expect(() => {
      new DigitalBitsBase.Transaction(input);
    }).to.throw(/expected a string/);
  });

  it('throws when no fee is provided', function() {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000';

    expect(() =>
      new DigitalBitsBase.TransactionBuilder(source, {
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({ destination, asset, amount })
        )
        .setTimeout(DigitalBitsBase.TimeoutInfinite)
        .build()
    ).to.throw(/must specify fee/);
  });

  it('signs correctly', function() {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000';
    let signer = DigitalBitsBase.Keypair.master(DigitalBitsBase.Networks.TESTNET);

    let tx = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build();
    tx.sign(signer);

    let env = tx.toEnvelope().value();

    let rawSig = env.signatures()[0].signature();
    let verified = signer.verify(tx.hash(), rawSig);
    expect(verified).to.equal(true);
  });

  it('signs using hash preimage', function() {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000';

    let preimage = randomBytes(64);
    let hash = DigitalBitsBase.hash(preimage);

    let tx = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build();
    tx.signHashX(preimage);

    let env = tx.toEnvelope().value();
    expectBuffersToBeEqual(env.signatures()[0].signature(), preimage);
    expectBuffersToBeEqual(
      env.signatures()[0].hint(),
      hash.slice(hash.length - 4)
    );
  });

  it('returns error when signing using hash preimage that is too long', function() {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000';

    let preimage = randomBytes(2 * 64);

    let tx = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build();

    expect(() => tx.signHashX(preimage)).to.throw(
      /preimage cannnot be longer than 64 bytes/
    );
  });

  it('adds signature correctly', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const signedSource = new DigitalBitsBase.Account(sourceKey, '20');
    const addedSignatureSource = new DigitalBitsBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = DigitalBitsBase.Asset.native();
    const amount = '2000';
    const signer = DigitalBitsBase.Keypair.master(DigitalBitsBase.Networks.TESTNET);

    const signedTx = new DigitalBitsBase.TransactionBuilder(signedSource, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const presignHash = signedTx.hash();
    signedTx.sign(signer);

    const envelopeSigned = signedTx.toEnvelope().value();

    const addedSignatureTx = new DigitalBitsBase.TransactionBuilder(
      addedSignatureSource,
      {
        timebounds: {
          minTime: 0,
          maxTime: 1739392569
        },
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      }
    )
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const signature = signer.sign(presignHash).toString('base64');

    addedSignatureTx.addSignature(signer.publicKey(), signature);

    const envelopeAddedSignature = addedSignatureTx.toEnvelope().value();

    expect(
      signer.verify(
        addedSignatureTx.hash(),
        envelopeAddedSignature.signatures()[0].signature()
      )
    ).to.equal(true);

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].signature(),
      envelopeAddedSignature.signatures()[0].signature()
    );

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].hint(),
      envelopeAddedSignature.signatures()[0].hint()
    );

    expectBuffersToBeEqual(addedSignatureTx.hash(), signedTx.hash());
  });

  it('adds signature generated by getKeypairSignature', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const signedSource = new DigitalBitsBase.Account(sourceKey, '20');
    const addedSignatureSource = new DigitalBitsBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = DigitalBitsBase.Asset.native();
    const amount = '2000';
    const signer = DigitalBitsBase.Keypair.master(DigitalBitsBase.Networks.TESTNET);

    const signedTx = new DigitalBitsBase.TransactionBuilder(signedSource, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const presignHash = signedTx.hash();
    signedTx.sign(signer);

    const envelopeSigned = signedTx.toEnvelope().value();

    const signature = new DigitalBitsBase.Transaction(
      signedTx.toXDR(),
      DigitalBitsBase.Networks.TESTNET
    ).getKeypairSignature(signer);

    expect(signer.sign(presignHash).toString('base64')).to.equal(signature);

    const addedSignatureTx = new DigitalBitsBase.TransactionBuilder(
      addedSignatureSource,
      {
        timebounds: {
          minTime: 0,
          maxTime: 1739392569
        },
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      }
    )
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    addedSignatureTx.addSignature(signer.publicKey(), signature);

    const envelopeAddedSignature = addedSignatureTx.toEnvelope().value();

    expect(
      signer.verify(
        addedSignatureTx.hash(),
        envelopeAddedSignature.signatures()[0].signature()
      )
    ).to.equal(true);

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].signature(),
      envelopeAddedSignature.signatures()[0].signature()
    );

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].hint(),
      envelopeAddedSignature.signatures()[0].hint()
    );

    expectBuffersToBeEqual(addedSignatureTx.hash(), signedTx.hash());
  });

  it('does not add invalid signature', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const source = new DigitalBitsBase.Account(sourceKey, '20');
    const sourceCopy = new DigitalBitsBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = DigitalBitsBase.Asset.native();
    const originalAmount = '2000';
    const alteredAmount = '1000';
    const signer = DigitalBitsBase.Keypair.master(DigitalBitsBase.Networks.TESTNET);

    const originalTx = new DigitalBitsBase.TransactionBuilder(source, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({
          destination,
          asset,
          amount: originalAmount
        })
      )
      .build();

    const signature = new DigitalBitsBase.Transaction(
      originalTx.toXDR(),
      DigitalBitsBase.Networks.TESTNET
    ).getKeypairSignature(signer);

    const alteredTx = new DigitalBitsBase.TransactionBuilder(sourceCopy, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({
          destination,
          asset,
          amount: alteredAmount
        })
      )
      .build();

    function addSignature() {
      alteredTx.addSignature(signer.publicKey(), signature);
    }
    expect(addSignature).to.throw('Invalid signature');
  });

  it('accepts 0 as a valid transaction fee', function(done) {
    let source = new DigitalBitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalBitsBase.Asset.native();
    let amount = '2000';

    let input = new DigitalBitsBase.TransactionBuilder(source, {
      fee: 0,
      networkPassphrase: DigitalBitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalBitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalBitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalBitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new DigitalBitsBase.Transaction(
      input,
      DigitalBitsBase.Networks.TESTNET
    );
    var operation = transaction.operations[0];

    expect(transaction.fee).to.be.equal('0');

    done();
  });

  it('outputs xdr as a string', () => {
    const xdrString =
      'AAAAAAW8Dk9idFR5Le+xi0/h/tU47bgC1YWjtPH1vIVO3BklAAAAZACoKlYAAAABAAAAAAAAAAEAAAALdmlhIGtleWJhc2UAAAAAAQAAAAAAAAAIAAAAAN7aGcXNPO36J1I8MR8S4QFhO79T5JGG2ZeS5Ka1m4mJAAAAAAAAAAFO3BklAAAAQP0ccCoeHdm3S7bOhMjXRMn3EbmETJ9glxpKUZjPSPIxpqZ7EkyTgl3FruieqpZd9LYOzdJrNik1GNBLhgTh/AU=';
    const transaction = new DigitalBitsBase.Transaction(
      xdrString,
      DigitalBitsBase.Networks.TESTNET
    );
    expect(typeof transaction).to.be.equal('object');
    expect(typeof transaction.toXDR).to.be.equal('function');
    expect(transaction.toXDR()).to.be.equal(xdrString);
  });

  describe('TransactionEnvelope with MuxedAccount', function() {
    it('handles muxed accounts', function() {
      let baseFee = '100';
      const networkPassphrase = 'Standalone Network ; February 2017';
      const source = DigitalBitsBase.Keypair.master(networkPassphrase);
      const account = new DigitalBitsBase.Account(source.publicKey(), '7');
      const destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      const amount = '2000.0000000';
      const asset = DigitalBitsBase.Asset.native();
      let tx = new DigitalBitsBase.TransactionBuilder(account, {
        fee: baseFee,
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        }
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination,
            asset,
            amount
          })
        )
        .addMemo(DigitalBitsBase.Memo.text('Happy birthday!'))
        .build();
      let med25519 = new DigitalBitsBase.xdr.MuxedAccountMed25519({
        id: DigitalBitsBase.xdr.Uint64.fromString('0'),
        ed25519: source.rawPublicKey()
      });
      let muxedAccount = DigitalBitsBase.xdr.MuxedAccount.keyTypeMuxedEd25519(
        med25519
      );
      const envelope = tx.toEnvelope();
      envelope
        .v1()
        .tx()
        .sourceAccount(muxedAccount);

      let destMed25519 = new DigitalBitsBase.xdr.MuxedAccountMed25519({
        id: DigitalBitsBase.xdr.Uint64.fromString('0'),
        ed25519: DigitalBitsBase.StrKey.decodeEd25519PublicKey(destination)
      });
      let destMuxedAccount = DigitalBitsBase.xdr.MuxedAccount.keyTypeMuxedEd25519(
        destMed25519
      );
      envelope
        .v1()
        .tx()
        .operations()[0]
        .body()
        .value()
        .destination(destMuxedAccount);

      const txWithMuxedAccount = new DigitalBitsBase.Transaction(
        envelope,
        networkPassphrase
      );
      expect(txWithMuxedAccount.source).to.equal(source.publicKey());
      expect(tx.source).to.equal(source.publicKey());
      var operation = txWithMuxedAccount.operations[0];
      expect(operation.destination).to.be.equal(destination);
    });
  });
});

function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');
  expect(leftHex).to.eql(rightHex);
}
