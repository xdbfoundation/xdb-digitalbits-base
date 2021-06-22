
- [Creating an account](#creating-an-account)
- [Assets](#assets)
- [Path payment](#path-payment)
- [Multi-signature account](#multi-signature-account)
  - [Set up multisig account](#set-up-multisig-account)

## Creating an account

In the example below a new account is created by the source account with secret 
`SCCCQQFNTF3RRIQYWIWLJUN6HEANTHASMIU57B6EESA2IBFYZFTN6Z3C`. The source account 
is giving the new account 25 XDB as its initial balance.

```javascript
const server = new DigitalBitsSdk.Server('https://frontier.testnet.digitalbits.io')
const source = DigitalBitsSdk.Keypair.fromSecret('SCCCQQFNTF3RRIQYWIWLJUN6HEANTHASMIU57B6EESA2IBFYZFTN6Z3C')
const destination = DigitalBitsSdk.Keypair.random()

server.accounts()
  .accountId(source.publicKey())
  .call()
  .then(({ sequence }) => {
    const account = new DigitalBitsSdk.Account(source.publicKey(), sequence)
    const transaction = new DigitalBitsSdk.TransactionBuilder(account, {
      fee: DigitalBitsSdk.BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(DigitalBitsSdk.Operation.createAccount({
        destination: destination.publicKey(),
        startingBalance: '100'
      }))
      .setTimeout(30)
      .build()
    transaction.sign(DigitalBitsSdk.Keypair.fromSecret(source.secret()))
    return server.submitTransaction(transaction)
  })
  .then(results => {
    console.log('Transaction', results._links.transaction.href)
    console.log('New Keypair', destination.publicKey(), destination.secret())
  })

```

## Assets
Object of the `Asset` class represents an asset in the DigitalBits network. Right now there are 3 possible types of assets in the DigitalBits network:

- native `XDB` asset (`ASSET_TYPE_NATIVE`),
- issued assets with asset code of maximum 4 characters (`ASSET_TYPE_CREDIT_ALPHANUM4`),
- issued assets with asset code of maximum 12 characters (`ASSET_TYPE_CREDIT_ALPHANUM12`).

To create a new native asset representation use static `native()` method:

```javascript
var nativeAsset = DigitalBitsSdk.Asset.native();
var isNative = nativeAsset.isNative(); // true
```

To represent an issued asset you need to create a new object of type `Asset` with an asset code and issuer:

```javascript
// Creates USD asset issued by GB4RZUSF3HZGCAKB3VBM2S7QOHHC5KTV3LLZXGBYR5ZO4B26CKHFZTSZ
var testAsset = new DigitalBitsSdk.Asset('USD', 'GB4RZUSF3HZGCAKB3VBM2S7QOHHC5KTV3LLZXGBYR5ZO4B26CKHFZTSZ');
var isNative = testAsset.isNative(); // false
// Creates EUR asset issued by GDCIQQY2UKVNLLWGIX74DMTEAFCMQKAKYUWPBO7PLTHIHRKSFZN7V2FC
var googleStockAsset = new DigitalBitsSdk.Asset('EUR', 'GDCIQQY2UKVNLLWGIX74DMTEAFCMQKAKYUWPBO7PLTHIHRKSFZN7V2FC');
```


## Path payment

In the example below we're sending 1000 XDB (at max) from `GDFOHLMYCXVZD2CDXZLMW6W6TMU4YO27XFF2IBAFAV66MSTPDDSK2LAY` to
`GCSYKECRGY6VEF4F4KBZEEPXLYDLUGNZFCCXWR7SNRADN3NYYK67GQKF`. Destination Asset will be `EUR` issued by
`GDCIQQY2UKVNLLWGIX74DMTEAFCMQKAKYUWPBO7PLTHIHRKSFZN7V2FC`. Assets will be exchanged using the following path:

- `USD` issued by `GB4RZUSF3HZGCAKB3VBM2S7QOHHC5KTV3LLZXGBYR5ZO4B26CKHFZTSZ`
- `UAH` issued by `GCKY3VKRJDSRORRMHRDHA6IKRXMGSBRZE42P64AHX4NHVGB3Y224WM3M`

The [path payment](https://github.com/xdbfoundation/docs/blob/master/guides/concepts/list-of-operations.md#path-payment) will cause the destination address to get 5.5 EUR. It will cost the sender no more than 1000 XDB. In this example there will be 2 exchanges, XDB -> USD, USD-> UAH, UAH->EUR.

```javascript
var keypair = DigitalBitsSdk.Keypair.fromSecret(secretString);

var source = new DigitalBitsSdk.Account(keypair.publicKey(), "4113023891406862");
var transaction = new DigitalBitsSdk.TransactionBuilder(source, {
    fee: DigitalBitsSdk.BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(DigitalBitsSdk.Operation.pathPayment({
      sendAsset: DigitalBitsSdk.Asset.native(),
      sendMax: "1000",
      destination: 'GCSYKECRGY6VEF4F4KBZEEPXLYDLUGNZFCCXWR7SNRADN3NYYK67GQKF',
      destAsset: new DigitalBitsSdk.Asset('EUR', 'GDCIQQY2UKVNLLWGIX74DMTEAFCMQKAKYUWPBO7PLTHIHRKSFZN7V2FC'),
      destAmount: "5.50",
      path: [
        new DigitalBitsSdk.Asset('USD', 'GB4RZUSF3HZGCAKB3VBM2S7QOHHC5KTV3LLZXGBYR5ZO4B26CKHFZTSZ'),
        new DigitalBitsSdk.Asset('UAH', 'GCKY3VKRJDSRORRMHRDHA6IKRXMGSBRZE42P64AHX4NHVGB3Y224WM3M')
      ]
  }))
  .setTimeout(30)
  .build();

transaction.sign(keypair);
```

## Multi-signature account

[Multi-signature accounts](https://github.com/xdbfoundation/docs/blob/master/guides/concepts/multi-sig.md) can be used to require that transactions require multiple public keys to sign before they are considered valid.
This is done by first configuring your account's "threshold" levels. Each operation has a threshold level of either low, medium,
or high. You give each threshold level a number between 1-255 in your account. Then, for each key in your account, you
assign it a weight (1-255, setting a 0 weight deletes the key). Any transaction must be signed with enough keys to meet the threshold.

For example, let's say you set your threshold levels; low = 1, medium = 2, high = 3. You want to send a payment operation,
which is a medium threshold operation. Your master key has weight 1. Additionally, you have a secondary key associated with your account which has a weight of 1.
Now, the transaction you submit for this payment must include both signatures of your master key and secondary key since their combined weight is 2 which is enough to authorize the payment operation.

In this example, we will:

- Add a second signer to the account
- Set our account's masterkey weight and threshold levels
- Create a multi signature transaction that sends a payment

In each example, we'll use the root account.

### Set up multisig account


```javascript
var rootKeypair = DigitalBitsSdk.Keypair.fromSecret("SAWJP22ANOBDCY2BYVGXZRNHYXDNGAVDCCU4ULONKJI3J4LVYTCJTRWI")
var account = new DigitalBitsSdk.Account(rootkeypair.publicKey(), "46316927324160");

var secondaryAddress = "GCKY3VKRJDSRORRMHRDHA6IKRXMGSBRZE42P64AHX4NHVGB3Y224WM3M";

var transaction = new DigitalBitsSdk.TransactionBuilder(account, {
    fee: DigitalBitsSdk.BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(DigitalBitsSdk.Operation.setOptions({
    signer: {
      ed25519PublicKey: secondaryAddress,
      weight: 1
    }
  }))
  .addOperation(DigitalBitsSdk.Operation.setOptions({
    masterWeight: 1, // set master key weight
    lowThreshold: 1,
    medThreshold: 2, // a payment is medium threshold
    highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
  }))
  .setTimeout(30)
  .build();

transaction.sign(rootKeypair); // only need to sign with the root signer as the 2nd signer won't be added to the account till after this transaction completes

// now create a payment with the account that has two signers

var transaction = new DigitalBitsSdk.TransactionBuilder(account, {
      fee: DigitalBitsSdk.BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(DigitalBitsSdk.Operation.payment({
        destination: "GCSYKECRGY6VEF4F4KBZEEPXLYDLUGNZFCCXWR7SNRADN3NYYK67GQKF",
        asset: DigitalBitsSdk.Asset.native(),
        amount: "1000" // 2000 XDB
    }))
    .setTimeout(30)
    .build();

var secondKeypair = DigitalBitsSdk.Keypair.fromSecret("SCXVSZRGGKH3ZTWJWDRF2OPXSKSSYJ7LLZ7RJA4JHO2XEVSDE5HKRP7F");

// now we need to sign the transaction with both the root and the secondaryAddress
transaction.sign(rootKeypair);
transaction.sign(secondKeypair);
```


