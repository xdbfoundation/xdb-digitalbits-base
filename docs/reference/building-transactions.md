[Transactions](https://github.com/xdbfoundation/docs/blob/master/guides/concepts/transactions.md) are the commands that modify the state of the ledger.
They include sending payments, creating offers, making account configuration changes, etc.

Every transaction has a source [account](https://github.com/xdbfoundation/docs/blob/master/guides/concepts/accounts.md). This is the account
that pays the [fee](https://github.com/xdbfoundation/docs/blob/master/guides/concepts/fees.md) and uses up a sequence number for the transaction.

Transactions are made up of one or more [operations](https://github.com/xdbfoundation/docs/blob/master/guides/concepts/operations.md). Each operation also has a source account, which defaults to the transaction's source account.


## [TransactionBuilder](https://github.com/xdbfoundation/js-digitalbits-base/blob/master/src/transaction_builder.js)

The `TransactionBuilder` class is used to construct new transactions. TransactionBuilder is given an account that is used as transaction's "source account".
The transaction will use the current sequence number of the given [Account](https://github.com/xdbfoundation/js-digitalbits-base/blob/master/src/account.js) object as its sequence number and increments
the given account's sequence number when `build()` is called on the `TransactionBuilder`.

Operations can be added to the transaction calling `addOperation(operation)` for each operation you wish to add to the transaction.
See [operation.js](https://github.com/xdbfoundation/js-digitalbits-base/blob/master/src/operation.js) for a list of possible operations you can add.
`addOperation(operation)` returns the current `TransactionBuilder` object so you can chain multiple calls.

After adding the desired operations, call the `build()` method on the `TransactionBuilder`.
This will return a fully constructed [Transaction](https://github.com/xdbfoundation/js-digitalbits-base/blob/master/src/transaction.js).
The returned transaction will contain the sequence number of the source account. This transaction is unsigned. You must sign it before it will be accepted by the DigitalBits network.


```javascript
// DigitalBitsBase.Network.usePublicNetwork(); if this transaction is for the public network
// Create an Account object from an address and sequence number.
var account=new DigitalBitsBase.Account("GDFOHLMYCXVZD2CDXZLMW6W6TMU4YO27XFF2IBAFAV66MSTPDDSK2LAY","4113023891406862");

var transaction = new DigitalBitsBase.TransactionBuilder(account, {
        fee: DigitalBitsBase.BASE_FEE,
        networkPassphrase: Networks.TESTNET
    })
        // add a payment operation to the transaction
        .addOperation(DigitalBitsBase.Operation.payment({
                destination: "GBIJCW2HLOHWES26FWTYWFIEMTOLXGC3JVYSZGL2IDVMJ5VCFKAV6DJM",
                asset: DigitalBitsBase.Asset.native(),
                amount: "100.50"  // 100.50 XDB
            }))
        // add a set options operation to the transaction
        .addOperation(DigitalBitsBase.Operation.setOptions({
                signer: {
                    ed25519PublicKey: secondAccountAddress,
                    weight: 1
                }
            }))
        // mark this transaction as valid only for the next 30 seconds
        .setTimeout(30)
        .build();
```



## Sequence Numbers

The sequence number of a transaction has to match the sequence number stored by the source account or else the transaction is invalid.
After the transaction is submitted and applied to the ledger, the source account's sequence number increases by 1.

There are two ways to ensure correct sequence numbers:

1. Read the source account's sequence number before submitting a transaction
2. Manage the sequence number locally

During periods of high transaction throughput, fetching a source account's sequence number from the network may not return
the correct value.  So, if you're submitting many transactions quickly, you will want to keep track of the sequence number locally.

## Adding Memos
Transactions can contain a "memo" field you can use to attach additional information to the transaction. You can do this
by passing a [memo](https://github.com/xdbfoundation/js-digitalbits-base/blob/master/src/memo.js) object when you construct the TransactionBuilder.
There are 5 types of memos:

- `Memo.none` - empty memo,
- `Memo.text` - 28-byte ascii encoded string memo,
- `Memo.id` - 64-bit number memo,
- `Memo.hash` - 32-byte hash - ex. hash of an item in a content server,
- `Memo.returnHash` - 32-byte hash used for returning payments - contains hash of the transaction being rejected.

```javascript
var memo = Memo.text('Hello World!');
var transaction = new DigitalBitsBase.TransactionBuilder(account, {
    memo: memo,
    fee: DigitalBitsBase.BASE_FEE,
    networkPassphrase: Networks.TESTNET
})
        .addOperation(DigitalBitsBase.Operation.payment({
                destination: "GBIJCW2HLOHWES26FWTYWFIEMTOLXGC3JVYSZGL2IDVMJ5VCFKAV6DJM",
                asset: DigitalBitsBase.Asset.native(),
                amount: "2000"
            }))
        .setTimeout(30)
        .build();
```


## [Transaction](https://github.com/xdbfoundation/js-digitalbits-base/blob/master/src/transaction.js)

You probably won't instantiate `Transaction` objects directly. Objects of this class are returned after `TransactionBuilder`
builds a transaction. However, you can create a new `Transaction` object from a base64 representation of a transaction envelope.

```javascript
var transaction = new Transaction(envelope);
```

> Once a Transaction has been created from an envelope, its attributes and operations should not be changed. You should only add signatures to a Transaction object before submitting to the network or forwarding on for others to also sign.

Most importantly, you can sign a transaction using `sign()` method. See below...


## Signing and Multi-sig
Transactions require signatures for authorization, and generally they only require one.  However, you can exercise more
control over authorization and set up complex schemes by increasing the number of signatures a transaction requires.  For
more, please consult the [multi-sig documentation](https://developer.digitalbits.io/guides/docs/guides/concepts/multi-sig).

You add signatures to a transaction with the `Transaction.sign()` function. You can chain multiple `sign()` calls together.

## `Keypair` class

`Keypair` object represents key pair used to sign transactions in DigitalBits network. `Keypair` object can contain both a public and private key, or only a public key.

If `Keypair` object does not contain private key it can't be used to sign transactions. The most convenient method of creating new keypair is by passing the account's secret seed:

```javascript
var keypair = Keypair.fromSecret('SCCCQQFNTF3RRIQYWIWLJUN6HEANTHASMIU57B6EESA2IBFYZFTN6Z3C');
var address = keypair.publicKey(); // GBIJCW2HLOHWES26FWTYWFIEMTOLXGC3JVYSZGL2IDVMJ5VCFKAV6DJM
var canSign = keypair.canSign(); // true
```

You can create `Keypair` object from secret seed raw bytes:

```js
var keypair = Keypair.fromRawSeed([0xdc, 0x9c, 0xaf, 0xbc, 0xa7, 0x42, 0x83, 0xaa, 0xbb, 0x76, 0x5d, 0xd8, 0xc4, 0xc4, 0x3e, 0x8a, 0xb7, 0x11, 0x85, 0xf1, 0x7b, 0x18, 0x0e, 0xab, 0x59, 0x5d, 0x62, 0x65, 0x52, 0xa8, 0xcb, 0xc2]);
var address = keypair.publicKey(); // GBIJCW2HLOHWES26FWTYWFIEMTOLXGC3JVYSZGL2IDVMJ5VCFKAV6DJM
var canSign = keypair.canSign(); // true
```

You can also create a randomly generated keypair:

```js
var keypair = Keypair.random();
```


```js
var key1 = Keypair.fromSecret('SCCCQQFNTF3RRIQYWIWLJUN6HEANTHASMIU57B6EESA2IBFYZFTN6Z3C');
var key2 = Keypair.fromSecret('SD3BAE2CI7YYYLE46PI2JTGLVVBLZQYGXKOMJ7RS4OWDKASTYVNY7HMT');

// Create an Account object from an address and sequence number.
var account=new DigitalBitsBase.Account("GDFOHLMYCXVZD2CDXZLMW6W6TMU4YO27XFF2IBAFAV66MSTPDDSK2LAY","4113023891406862");

var transaction = new DigitalBitsBase.TransactionBuilder(account, {
    fee: DigitalBitsBase.BASE_FEE,
    networkPassphrase: Networks.TESTNET
})
        .addOperation(DigitalBitsBase.Operation.payment({
                destination: "GDPTTMKY7BQDV346TY34Q535SOBNBII6ROUIOOUX34LRJ3EBV5OTB3BZ",
                asset: DigitalBitsBase.Asset.native(),
                amount: "2000"  // 2000 XDB
            }))
        .setTimeout(30)
        .build();

transaction.sign(key1);
transaction.sign(key2);
// submit tx to Frontier...
```


