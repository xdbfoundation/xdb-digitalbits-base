import randomBytes from 'randombytes';

describe('Transaction', function() {
  it('constructs Transaction object from a TransactionEnvelope', function(done) {
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000.0000000';

    let input = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalbitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new DigitalbitsBase.Transaction(
      input,
      DigitalbitsBase.Networks.TESTNET
    );
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal(source.accountId());
    expect(transaction.fee).to.be.equal('100');
    expect(transaction.memo.type).to.be.equal(DigitalbitsBase.MemoText);
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
      let source = new DigitalbitsBase.Account(
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        '0'
      );
      let destination =
        'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      let asset = DigitalbitsBase.Asset.native();
      let amount = '2000.0000000';

      this.transaction = new DigitalbitsBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: DigitalbitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalbitsBase.Operation.payment({ destination, asset, amount })
        )
        .addMemo(DigitalbitsBase.Memo.text('Happy birthday!'))
        .setTimeout(DigitalbitsBase.TimeoutInfinite)
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
      envelope.tx().fee(DigitalbitsBase.xdr.Int64.fromString('300'));

      expect(transaction.tx.fee().toString()).to.equal('100');
    });
  });

  it('throws when a garbage Network is selected', () => {
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000.0000000';

    let input = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalbitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    expect(() => {
      new DigitalbitsBase.Transaction(input, { garbage: 'yes' });
    }).to.throw(/expected a string/);

    expect(() => {
      new DigitalbitsBase.Transaction(input, 1234);
    }).to.throw(/expected a string/);
  });

  it('throws when a Network is not passed', () => {
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000.0000000';

    let input = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalbitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    expect(() => {
      new DigitalbitsBase.Transaction(input);
    }).to.throw(/expected a string/);
  });

  it('throws when no fee is provided', function() {
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000';

    expect(() =>
      new DigitalbitsBase.TransactionBuilder(source, {
        networkPassphrase: DigitalbitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalbitsBase.Operation.payment({ destination, asset, amount })
        )
        .setTimeout(DigitalbitsBase.TimeoutInfinite)
        .build()
    ).to.throw(/must specify fee/);
  });

  it('signs correctly', function() {
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000';
    let signer = DigitalbitsBase.Keypair.master(
      DigitalbitsBase.Networks.TESTNET
    );

    let tx = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
      .build();
    tx.sign(signer);

    let env = tx.toEnvelope().value();

    let rawSig = env.signatures()[0].signature();
    let verified = signer.verify(tx.hash(), rawSig);
    expect(verified).to.equal(true);
  });

  it('signs using hash preimage', function() {
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000';

    let preimage = randomBytes(64);
    let hash = DigitalbitsBase.hash(preimage);

    let tx = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
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
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000';

    let preimage = randomBytes(2 * 64);

    let tx = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
      .build();

    expect(() => tx.signHashX(preimage)).to.throw(
      /preimage cannnot be longer than 64 bytes/
    );
  });

  it('adds signature correctly', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const signedSource = new DigitalbitsBase.Account(sourceKey, '20');
    const addedSignatureSource = new DigitalbitsBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = DigitalbitsBase.Asset.native();
    const amount = '2000';
    const signer = DigitalbitsBase.Keypair.master(
      DigitalbitsBase.Networks.TESTNET
    );

    const signedTx = new DigitalbitsBase.TransactionBuilder(signedSource, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const presignHash = signedTx.hash();
    signedTx.sign(signer);

    const envelopeSigned = signedTx.toEnvelope().value();

    const addedSignatureTx = new DigitalbitsBase.TransactionBuilder(
      addedSignatureSource,
      {
        timebounds: {
          minTime: 0,
          maxTime: 1739392569
        },
        fee: 100,
        networkPassphrase: DigitalbitsBase.Networks.TESTNET
      }
    )
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
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
    const signedSource = new DigitalbitsBase.Account(sourceKey, '20');
    const addedSignatureSource = new DigitalbitsBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = DigitalbitsBase.Asset.native();
    const amount = '2000';
    const signer = DigitalbitsBase.Keypair.master(
      DigitalbitsBase.Networks.TESTNET
    );

    const signedTx = new DigitalbitsBase.TransactionBuilder(signedSource, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const presignHash = signedTx.hash();
    signedTx.sign(signer);

    const envelopeSigned = signedTx.toEnvelope().value();

    const signature = new DigitalbitsBase.Transaction(
      signedTx.toXDR(),
      DigitalbitsBase.Networks.TESTNET
    ).getKeypairSignature(signer);

    expect(signer.sign(presignHash).toString('base64')).to.equal(signature);

    const addedSignatureTx = new DigitalbitsBase.TransactionBuilder(
      addedSignatureSource,
      {
        timebounds: {
          minTime: 0,
          maxTime: 1739392569
        },
        fee: 100,
        networkPassphrase: DigitalbitsBase.Networks.TESTNET
      }
    )
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
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
    const source = new DigitalbitsBase.Account(sourceKey, '20');
    const sourceCopy = new DigitalbitsBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = DigitalbitsBase.Asset.native();
    const originalAmount = '2000';
    const alteredAmount = '1000';
    const signer = DigitalbitsBase.Keypair.master(
      DigitalbitsBase.Networks.TESTNET
    );

    const originalTx = new DigitalbitsBase.TransactionBuilder(source, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({
          destination,
          asset,
          amount: originalAmount
        })
      )
      .build();

    const signature = new DigitalbitsBase.Transaction(
      originalTx.toXDR(),
      DigitalbitsBase.Networks.TESTNET
    ).getKeypairSignature(signer);

    const alteredTx = new DigitalbitsBase.TransactionBuilder(sourceCopy, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({
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
    let source = new DigitalbitsBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = DigitalbitsBase.Asset.native();
    let amount = '2000';

    let input = new DigitalbitsBase.TransactionBuilder(source, {
      fee: 0,
      networkPassphrase: DigitalbitsBase.Networks.TESTNET
    })
      .addOperation(
        DigitalbitsBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(DigitalbitsBase.Memo.text('Happy birthday!'))
      .setTimeout(DigitalbitsBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new DigitalbitsBase.Transaction(
      input,
      DigitalbitsBase.Networks.TESTNET
    );
    var operation = transaction.operations[0];

    expect(transaction.fee).to.be.equal('0');

    done();
  });

  it('outputs xdr as a string', () => {
    const xdrString =
      'AAAAAAW8Dk9idFR5Le+xi0/h/tU47bgC1YWjtPH1vIVO3BklAAAAZACoKlYAAAABAAAAAAAAAAEAAAALdmlhIGtleWJhc2UAAAAAAQAAAAAAAAAIAAAAAN7aGcXNPO36J1I8MR8S4QFhO79T5JGG2ZeS5Ka1m4mJAAAAAAAAAAFO3BklAAAAQP0ccCoeHdm3S7bOhMjXRMn3EbmETJ9glxpKUZjPSPIxpqZ7EkyTgl3FruieqpZd9LYOzdJrNik1GNBLhgTh/AU=';
    const transaction = new DigitalbitsBase.Transaction(
      xdrString,
      DigitalbitsBase.Networks.TESTNET
    );
    expect(typeof transaction).to.be.equal('object');
    expect(typeof transaction.toXDR).to.be.equal('function');
    expect(transaction.toXDR()).to.be.equal(xdrString);
  });

  describe('TransactionEnvelope with MuxedAccount', function() {
    it('handles muxed accounts', function() {
      let baseFee = '100';
      const networkPassphrase = 'Standalone Network ; February 2017';
      const source = DigitalbitsBase.Keypair.master(networkPassphrase);
      const account = new DigitalbitsBase.Account(source.publicKey(), '7');
      const destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      const amount = '2000.0000000';
      const asset = DigitalbitsBase.Asset.native();
      let tx = new DigitalbitsBase.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        }
      })
        .addOperation(
          DigitalbitsBase.Operation.payment({
            destination,
            asset,
            amount
          })
        )
        .addMemo(DigitalbitsBase.Memo.text('Happy birthday!'))
        .build();
      let med25519 = new DigitalbitsBase.xdr.MuxedAccountMed25519({
        id: DigitalbitsBase.xdr.Uint64.fromString('0'),
        ed25519: source.rawPublicKey()
      });
      let muxedAccount = DigitalbitsBase.xdr.MuxedAccount.keyTypeMuxedEd25519(
        med25519
      );
      const envelope = tx.toEnvelope();
      envelope
        .v1()
        .tx()
        .sourceAccount(muxedAccount);

      let destMed25519 = new DigitalbitsBase.xdr.MuxedAccountMed25519({
        id: DigitalbitsBase.xdr.Uint64.fromString('0'),
        ed25519: DigitalbitsBase.StrKey.decodeEd25519PublicKey(destination)
      });
      let destMuxedAccount = DigitalbitsBase.xdr.MuxedAccount.keyTypeMuxedEd25519(
        destMed25519
      );
      envelope
        .v1()
        .tx()
        .operations()[0]
        .body()
        .value()
        .destination(destMuxedAccount);

      const txWithMuxedAccount = new DigitalbitsBase.Transaction(
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
