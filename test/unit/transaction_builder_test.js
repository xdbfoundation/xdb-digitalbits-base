import { isValidDate } from '../../src/transaction_builder.js';
import { encodeMuxedAccountToAddress } from '../../src/util/decode_encode_muxed_account.js';

describe('TransactionBuilder', function() {
  describe('constructs a native payment transaction with one operation', function() {
    var source;
    var destination;
    var amount;
    var asset;
    var transaction;
    var memo;
    beforeEach(function() {
      source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      destination = 'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      amount = '1000';
      asset = DigitalBitsBase.Asset.native();
      memo = DigitalBitsBase.Memo.id('100');

      transaction = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination: destination,
            asset: asset,
            amount: amount
          })
        )
        .addMemo(memo)
        .setTimeout(DigitalBitsBase.TimeoutInfinite)
        .build();
    });

    it('should have the same source account', function(done) {
      expect(transaction.source).to.be.equal(source.accountId());
      done();
    });

    it('should have the incremented sequence number', function(done) {
      expect(transaction.sequence).to.be.equal('1');
      done();
    });

    it("should increment the account's sequence number", function(done) {
      expect(source.sequenceNumber()).to.be.equal('1');
      done();
    });

    it('should have one payment operation', function(done) {
      expect(transaction.operations.length).to.be.equal(1);
      expect(transaction.operations[0].type).to.be.equal('payment');
      done();
    });

    it('should have 100 nibbs fee', function(done) {
      expect(transaction.fee).to.be.equal('100');
      done();
    });
  });

  describe('constructs a native payment transaction with two operations', function() {
    var source;
    var destination1;
    var amount1;
    var destination2;
    var amount2;
    var asset;
    var transaction;
    beforeEach(function() {
      asset = DigitalBitsBase.Asset.native();
      source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );

      destination1 = 'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      amount1 = '1000';
      destination2 = 'GC6ACGSA2NJGD6YWUNX2BYBL3VM4MZRSEU2RLIUZZL35NLV5IAHAX2E2';
      amount2 = '2000';

      transaction = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination: destination1,
            asset: asset,
            amount: amount1
          })
        )
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination: destination2,
            asset: asset,
            amount: amount2
          })
        )
        .setTimeout(DigitalBitsBase.TimeoutInfinite)
        .build();
    });

    it('should have the same source account', function(done) {
      expect(transaction.source).to.be.equal(source.accountId());
      done();
    });

    it('should have the incremented sequence number', function(done) {
      expect(transaction.sequence).to.be.equal('1');
      done();
    });

    it("should increment the account's sequence number", function(done) {
      expect(source.sequenceNumber()).to.be.equal('1');
      done();
    });

    it('should have two payment operation', function(done) {
      expect(transaction.operations.length).to.be.equal(2);
      expect(transaction.operations[0].type).to.be.equal('payment');
      expect(transaction.operations[1].type).to.be.equal('payment');
      done();
    });

    it('should have 200 nibbs fee', function(done) {
      expect(transaction.fee).to.be.equal('200');
      done();
    });
  });

  describe('constructs a native payment transaction with custom base fee', function() {
    var source;
    var destination1;
    var amount1;
    var destination2;
    var amount2;
    var asset;
    var transaction;
    beforeEach(function() {
      asset = DigitalBitsBase.Asset.native();
      source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );

      destination1 = 'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      amount1 = '1000';
      destination2 = 'GC6ACGSA2NJGD6YWUNX2BYBL3VM4MZRSEU2RLIUZZL35NLV5IAHAX2E2';
      amount2 = '2000';

      transaction = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 1000,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination: destination1,
            asset: asset,
            amount: amount1
          })
        )
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination: destination2,
            asset: asset,
            amount: amount2
          })
        )
        .setTimeout(DigitalBitsBase.TimeoutInfinite)
        .build();
    });

    it('should have 2000 nibbs fee', function(done) {
      expect(transaction.fee).to.be.equal('2000');
      done();
    });
  });

  describe('constructs a native payment transaction with integer timebounds', function() {
    it('should have have timebounds', function(done) {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let timebounds = {
        minTime: '1455287522',
        maxTime: '1455297545'
      };
      let transaction = new DigitalBitsBase.TransactionBuilder(source, {
        timebounds,
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: DigitalBitsBase.Asset.native(),
            amount: '1000'
          })
        )
        .build();

      expect(transaction.timeBounds.minTime).to.be.equal(timebounds.minTime);
      expect(transaction.timeBounds.maxTime).to.be.equal(timebounds.maxTime);
      done();
    });
  });

  describe('distinguishes whether a provided Date is valid or invalid', function() {
    it('should accept empty Date objects', function(done) {
      let d = new Date();
      expect(isValidDate(d)).to.be.true;
      done();
    });
    it('should accept configured Date objects', function(done) {
      let d = new Date(1455287522000);
      expect(isValidDate(d)).to.be.true;
      done();
    });
    it('should reject mis-configured Date objects', function(done) {
      let d = new Date('bad string here');
      expect(isValidDate(d)).to.be.false;
      done();
    });
    it('should reject objects that are not Dates', function(done) {
      let d = [1455287522000];
      expect(isValidDate(d)).to.be.false;
      done();
    });
  });

  describe('constructs a native payment transaction with date timebounds', function() {
    it('should have expected timebounds', function(done) {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let timebounds = {
        minTime: new Date(1528145519000),
        maxTime: new Date(1528231982000)
      };

      let transaction = new DigitalBitsBase.TransactionBuilder(source, {
        timebounds,
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: DigitalBitsBase.Asset.native(),
            amount: '1000'
          })
        )
        .build();

      // getTime returns milliseconds, but we store seconds internally
      let expectedMinTime = timebounds.minTime.getTime() / 1000;
      let expectedMaxTime = timebounds.maxTime.getTime() / 1000;
      expect(transaction.timeBounds.minTime).to.be.equal(
        expectedMinTime.toString()
      );
      expect(transaction.timeBounds.maxTime).to.be.equal(
        expectedMaxTime.toString()
      );
      done();
    });
  });
  describe('timebounds', function() {
    it('requires maxTime', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new DigitalBitsBase.TransactionBuilder(source, {
          timebounds: {
            minTime: '0'
          },
          fee: 100
        }).build();
      }).to.throw(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    });
    it('requires minTime', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new DigitalBitsBase.TransactionBuilder(source, {
          timebounds: {
            maxTime: '10'
          },
          fee: 100
        }).build();
      }).to.throw(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    });
    it('works with timebounds defined', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new DigitalBitsBase.TransactionBuilder(source, {
          timebounds: {
            minTime: '1',
            maxTime: '10'
          },
          fee: 100,
          networkPassphrase: DigitalBitsBase.Networks.TESTNET
        }).build();
      }).to.not.throw();
    });
    it('fails with empty timebounds', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new DigitalBitsBase.TransactionBuilder(source, {
          timebounds: {},
          fee: 100
        }).build();
      }).to.throw(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    });
  });
  describe('setTimeout', function() {
    it('not called', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transactionBuilder = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 100
      }).addOperation(
        DigitalBitsBase.Operation.payment({
          destination:
            'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
          asset: DigitalBitsBase.Asset.native(),
          amount: '1000'
        })
      );

      expect(() => transactionBuilder.build()).to.throw(
        /TimeBounds has to be set/
      );
      expect(source.sequenceNumber()).to.be.equal('0');
    });

    it('timeout negative', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transactionBuilder = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 100
      }).addOperation(
        DigitalBitsBase.Operation.payment({
          destination:
            'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
          asset: DigitalBitsBase.Asset.native(),
          amount: '1000'
        })
      );

      expect(() => transactionBuilder.setTimeout(-1)).to.throw(
        /timeout cannot be negative/
      );
      expect(source.sequenceNumber()).to.be.equal('0');
    });

    it('sets timebounds', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transaction = new DigitalBitsBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: DigitalBitsBase.Asset.native(),
            amount: '1000'
          })
        )
        .setTimeout(10)
        .build();

      let timeoutTimestamp = Math.floor(Date.now() / 1000) + 10;
      expect(transaction.timeBounds.maxTime).to.be.equal(
        timeoutTimestamp.toString()
      );
    });

    it('fails when maxTime already set', function() {
      let timebounds = {
        minTime: '1455287522',
        maxTime: '1455297545'
      };
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transactionBuilder = new DigitalBitsBase.TransactionBuilder(source, {
        timebounds,
        fee: 100
      }).addOperation(
        DigitalBitsBase.Operation.payment({
          destination:
            'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
          asset: DigitalBitsBase.Asset.native(),
          amount: '1000'
        })
      );

      expect(() => transactionBuilder.setTimeout(10)).to.throw(
        /TimeBounds.max_time has been already set/
      );
    });

    it('sets timebounds.maxTime when minTime already set', function() {
      let timebounds = {
        minTime: '1455287522',
        maxTime: '0'
      };
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transaction = new DigitalBitsBase.TransactionBuilder(source, {
        timebounds,
        fee: 100,
        networkPassphrase: DigitalBitsBase.Networks.TESTNET
      })
        .addOperation(
          DigitalBitsBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: DigitalBitsBase.Asset.native(),
            amount: '1000'
          })
        )
        .setTimeout(10)
        .build();

      let timeoutTimestamp = Math.floor(Date.now() / 1000) + 10;
      expect(transaction.timeBounds.maxTime).to.be.equal(
        timeoutTimestamp.toString()
      );
    });
    it('works with TimeoutInfinite', function() {
      let source = new DigitalBitsBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new DigitalBitsBase.TransactionBuilder(source, {
          fee: 100,
          networkPassphrase: DigitalBitsBase.Networks.TESTNET
        })
          .setTimeout(0)
          .build();
      }).to.not.throw();
    });
  });
  describe('.buildFeeBumpTransaction', function() {
    it('builds a fee bump transaction', function(done) {
      const networkPassphrase = 'Standalone Network ; February 2017';
      const innerSource = DigitalBitsBase.Keypair.master(networkPassphrase);
      const innerAccount = new DigitalBitsBase.Account(
        innerSource.publicKey(),
        '7'
      );
      const destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      const amount = '2000.0000000';
      const asset = DigitalBitsBase.Asset.native();

      let innerTx = new DigitalBitsBase.TransactionBuilder(innerAccount, {
        fee: '200',
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
        .build();

      let feeSource = DigitalBitsBase.Keypair.fromSecret(
        'SB7ZMPZB3YMMK5CUWENXVLZWBK4KYX4YU5JBXQNZSK2DP2Q7V3LVTO5V'
      );
      let transaction = DigitalBitsBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '200',
        innerTx,
        networkPassphrase
      );

      expect(transaction).to.be.an.instanceof(
        DigitalBitsBase.FeeBumpTransaction
      );

      // The fee rate for fee bump is at least the fee rate of the inner transaction
      expect(() => {
        DigitalBitsBase.TransactionBuilder.buildFeeBumpTransaction(
          feeSource,
          '100',
          innerTx,
          networkPassphrase
        );
      }).to.throw(/Invalid baseFee, it should be at least 200 nibbs./);

      innerTx = new DigitalBitsBase.TransactionBuilder(innerAccount, {
        fee: '80',
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

      // The fee rate for fee bump is at least the minimum fee
      expect(() => {
        DigitalBitsBase.TransactionBuilder.buildFeeBumpTransaction(
          feeSource,
          '90',
          innerTx,
          networkPassphrase
        );
      }).to.throw(/Invalid baseFee, it should be at least 100 nibbs./);

      innerTx = new DigitalBitsBase.TransactionBuilder(innerAccount, {
        fee: '100',
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
        .build();

      const signer = DigitalBitsBase.Keypair.master(
        DigitalBitsBase.Networks.TESTNET
      );
      innerTx.sign(signer);

      const feeBumpTx = DigitalBitsBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '200',
        innerTx,
        networkPassphrase
      );

      const innerTxEnvelope = innerTx.toEnvelope();
      expect(innerTxEnvelope.arm()).to.equal('v1');
      expect(innerTxEnvelope.v1().signatures()).to.have.length(1);

      const v1Tx = innerTxEnvelope.v1().tx();
      const sourceAccountEd25519 = DigitalBitsBase.Keypair.fromPublicKey(
        DigitalBitsBase.StrKey.encodeEd25519PublicKey(
          v1Tx.sourceAccount().ed25519()
        )
      )
        .xdrAccountId()
        .value();
      const v0Tx = new DigitalBitsBase.xdr.TransactionV0({
        sourceAccountEd25519: sourceAccountEd25519,
        fee: v1Tx.fee(),
        seqNum: v1Tx.seqNum(),
        timeBounds: v1Tx.cond().timeBounds(),
        memo: v1Tx.memo(),
        operations: v1Tx.operations(),
        ext: new DigitalBitsBase.xdr.TransactionV0Ext(0)
      });
      const innerV0TxEnvelope = new DigitalBitsBase.xdr.TransactionEnvelope.envelopeTypeTxV0(
        new DigitalBitsBase.xdr.TransactionV0Envelope({
          tx: v0Tx,
          signatures: innerTxEnvelope.v1().signatures()
        })
      );
      expect(innerV0TxEnvelope.v0().signatures()).to.have.length(1);

      const feeBumpV0Tx = DigitalBitsBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '200',
        new DigitalBitsBase.Transaction(innerV0TxEnvelope, networkPassphrase),
        networkPassphrase
      );

      expect(feeBumpTx.toXDR()).to.equal(feeBumpV0Tx.toXDR());

      done();
    });
  });

  describe('.fromXDR', function() {
    it('builds a fee bump transaction', function() {
      const xdr =
        'AAAABQAAAADgSJG2GOUMy/H9lHyjYZOwyuyytH8y0wWaoc596L+bEgAAAAAAAADIAAAAAgAAAABzdv3ojkzWHMD7KUoXhrPx0GH18vHKV0ZfqpMiEblG1gAAAGQAAAAAAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAA9IYXBweSBiaXJ0aGRheSEAAAAAAQAAAAAAAAABAAAAAOBIkbYY5QzL8f2UfKNhk7DK7LK0fzLTBZqhzn3ov5sSAAAAAAAAAASoF8gAAAAAAAAAAAERuUbWAAAAQK933Dnt1pxXlsf1B5CYn81PLxeYsx+MiV9EGbMdUfEcdDWUySyIkdzJefjpR5ejdXVp/KXosGmNUQ+DrIBlzg0AAAAAAAAAAei/mxIAAABAijIIQpL6KlFefiL4FP8UWQktWEz4wFgGNSaXe7mZdVMuiREntehi1b7MRqZ1h+W+Y0y+Z2HtMunsilT2yS5mAA==';
      let tx = DigitalBitsBase.TransactionBuilder.fromXDR(
        xdr,
        DigitalBitsBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(DigitalBitsBase.FeeBumpTransaction);
      expect(tx.toXDR()).to.equal(xdr);

      tx = DigitalBitsBase.TransactionBuilder.fromXDR(
        tx.toEnvelope(), // xdr object
        DigitalBitsBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(DigitalBitsBase.FeeBumpTransaction);
      expect(tx.toXDR()).to.equal(xdr);
    });
    it('builds a transaction', function() {
      const xdr =
        'AAAAAAW8Dk9idFR5Le+xi0/h/tU47bgC1YWjtPH1vIVO3BklAAAAZACoKlYAAAABAAAAAAAAAAEAAAALdmlhIGtleWJhc2UAAAAAAQAAAAAAAAAIAAAAAN7aGcXNPO36J1I8MR8S4QFhO79T5JGG2ZeS5Ka1m4mJAAAAAAAAAAFO3BklAAAAQP0ccCoeHdm3S7bOhMjXRMn3EbmETJ9glxpKUZjPSPIxpqZ7EkyTgl3FruieqpZd9LYOzdJrNik1GNBLhgTh/AU=';
      let tx = DigitalBitsBase.TransactionBuilder.fromXDR(
        xdr,
        DigitalBitsBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(DigitalBitsBase.Transaction);
      expect(tx.toXDR()).to.equal(xdr);

      tx = DigitalBitsBase.TransactionBuilder.fromXDR(
        tx.toEnvelope(), // xdr object
        DigitalBitsBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(DigitalBitsBase.Transaction);
      expect(tx.toXDR()).to.equal(xdr);
    });
  });

  describe('muxed account support', function() {
    // Simultaneously, let's test some of the operations that should support
    // muxed accounts.
    const asset = DigitalBitsBase.Asset.native();
    const amount = '1000.0000000';

    const base = new DigitalBitsBase.Account(
      'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
      '1234'
    );
    const source = new DigitalBitsBase.MuxedAccount(base, '2');
    const destination = new DigitalBitsBase.MuxedAccount(base, '3').accountId();

    const PUBKEY_SRC = DigitalBitsBase.StrKey.decodeEd25519PublicKey(
      source.baseAccount().accountId()
    );
    const MUXED_SRC_ID = DigitalBitsBase.xdr.Uint64.fromString(source.id());
    const networkPassphrase = 'Standalone Network ; February 2017';
    const signer = DigitalBitsBase.Keypair.master(
      DigitalBitsBase.Networks.TESTNET
    );

    it('works with muxed accounts by default', function() {
      const operations = [
        DigitalBitsBase.Operation.payment({
          source: source.accountId(),
          destination: destination,
          amount: amount,
          asset: asset
        }),
        DigitalBitsBase.Operation.clawback({
          source: source.baseAccount().accountId(),
          from: destination,
          amount: amount,
          asset: asset
        })
      ];

      let builder = new DigitalBitsBase.TransactionBuilder(source, {
        fee: '100',
        timebounds: { minTime: 0, maxTime: 0 },
        memo: new DigitalBitsBase.Memo(
          DigitalBitsBase.MemoText,
          'Testing muxed accounts'
        ),
        networkPassphrase: networkPassphrase
      });

      operations.forEach((op) => builder.addOperation(op));

      let tx = builder.build();
      tx.sign(signer);

      const envelope = tx.toEnvelope();
      const xdrTx = envelope.value().tx();

      const rawMuxedSourceAccount = xdrTx.sourceAccount();

      expect(rawMuxedSourceAccount.switch()).to.equal(
        DigitalBitsBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
      );

      const innerMux = rawMuxedSourceAccount.med25519();
      expect(innerMux.ed25519()).to.eql(PUBKEY_SRC);
      expect(encodeMuxedAccountToAddress(rawMuxedSourceAccount)).to.equal(
        source.accountId()
      );
      expect(innerMux.id()).to.eql(MUXED_SRC_ID);

      expect(source.sequenceNumber()).to.equal('1235');
      expect(source.baseAccount().sequenceNumber()).to.equal('1235');

      // it should decode muxed properties by default
      let decodedTx = DigitalBitsBase.TransactionBuilder.fromXDR(
        tx.toXDR('base64'),
        networkPassphrase
      );
      expect(decodedTx.source).to.equal(source.accountId());

      let paymentOp = decodedTx.operations[0];
      expect(paymentOp.destination).to.equal(destination);
      expect(paymentOp.source).to.equal(source.accountId());

      // and unmuxed where appropriate
      let clawbackOp = decodedTx.operations[1];
      expect(clawbackOp.source).to.equal(source.baseAccount().accountId());
      expect(clawbackOp.from).to.equal(destination);
    });

    it('does not regress @digitalbits-blockchain/xdb-digitalbits-sdk#646', function() {
      expect(() => {
        DigitalBitsBase.TransactionBuilder.fromXDR(
          'AAAAAgAAAABg/GhKJU5ut52ih6Klx0ymGvsac1FPJig1CHYqyesIHQAAJxACBmMCAAAADgAAAAAAAAABAAAAATMAAAAAAAABAAAAAQAAAABg/GhKJU5ut52ih6Klx0ymGvsac1FPJig1CHYqyesIHQAAAAAAAAAAqdkSiA5dzNXstOtkPkHd6dAMPMA+MSXwK8OlrAGCKasAAAAAAcnDgAAAAAAAAAAByesIHQAAAEAuLrTfW6D+HYlUD9y+JolF1qrb40hIRATzsQaQjchKJuhOZJjLO0d7oaTD3JZ4UL4vVKtV7TvV17rQgCQnuz8F',
          'LiveNet Global DigitalBits Network ; February 2021'
        );
      }).to.not.throw();
    });

    it('works with fee-bump transactions', function() {
      // We create a non-muxed transaction, then fee-bump with a muxed source.
      let builder = new DigitalBitsBase.TransactionBuilder(
        source.baseAccount(),
        {
          fee: '100',
          timebounds: { minTime: 0, maxTime: 0 },
          networkPassphrase: networkPassphrase
        }
      );

      const muxed = new DigitalBitsBase.MuxedAccount.fromAddress(
        destination,
        '0'
      );
      const gAddress = muxed.baseAccount().accountId();
      builder.addOperation(
        DigitalBitsBase.Operation.payment({
          source: source.baseAccount().accountId(),
          destination: gAddress,
          amount: amount,
          asset: asset
        })
      );

      let tx = builder.build();
      tx.sign(signer);

      const feeTx = DigitalBitsBase.TransactionBuilder.buildFeeBumpTransaction(
        source.accountId(),
        '1000',
        tx,
        networkPassphrase
      );

      expect(feeTx).to.be.an.instanceof(DigitalBitsBase.FeeBumpTransaction);
      const envelope = feeTx.toEnvelope();
      const xdrTx = envelope.value().tx();

      const rawFeeSource = xdrTx.feeSource();

      expect(rawFeeSource.switch()).to.equal(
        DigitalBitsBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
      );

      const innerMux = rawFeeSource.med25519();
      expect(innerMux.ed25519()).to.eql(PUBKEY_SRC);
      expect(encodeMuxedAccountToAddress(rawFeeSource)).to.equal(
        source.accountId()
      );
      expect(innerMux.id()).to.eql(MUXED_SRC_ID);

      const decodedTx = DigitalBitsBase.TransactionBuilder.fromXDR(
        feeTx.toXDR('base64'),
        networkPassphrase
      );
      expect(decodedTx.feeSource).to.equal(source.accountId());
      expect(decodedTx.innerTransaction.operations[0].source).to.equal(
        source.baseAccount().accountId()
      );
    });
  });
});
