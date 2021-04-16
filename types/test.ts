import * as DigitalbitsSdk from 'digitalbits-base';

const masterKey = DigitalbitsSdk.Keypair.master(DigitalbitsSdk.Networks.TESTNET); // $ExpectType Keypair
const sourceKey = DigitalbitsSdk.Keypair.random(); // $ExpectType Keypair
const destKey = DigitalbitsSdk.Keypair.random();
const usd = new DigitalbitsSdk.Asset('USD', 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'); // $ExpectType Asset
const account = new DigitalbitsSdk.Account(sourceKey.publicKey(), '1');
const transaction = new DigitalbitsSdk.TransactionBuilder(account, {
  fee: "100",
  networkPassphrase: DigitalbitsSdk.Networks.TESTNET
})
  .addOperation(
    DigitalbitsSdk.Operation.beginSponsoringFutureReserves({
      sponsoredId: account.accountId(),
      source: masterKey.publicKey()
    })
  )
  .addOperation(
    DigitalbitsSdk.Operation.accountMerge({ destination: destKey.publicKey() }),
  ).addOperation(
    DigitalbitsSdk.Operation.createClaimableBalance({
      amount: "10",
      asset: DigitalbitsSdk.Asset.native(),
      claimants: [
        new DigitalbitsSdk.Claimant(account.accountId())
      ]
    }),
  ).addOperation(
    DigitalbitsSdk.Operation.claimClaimableBalance({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    }),
  ).addOperation(
    DigitalbitsSdk.Operation.endSponsoringFutureReserves({
    })
  ).addOperation(
    DigitalbitsSdk.Operation.endSponsoringFutureReserves({})
  ).addOperation(
    DigitalbitsSdk.Operation.revokeAccountSponsorship({
      account: account.accountId(),
    })
  ).addOperation(
      DigitalbitsSdk.Operation.revokeTrustlineSponsorship({
        account: account.accountId(),
        asset: usd,
      })
  ).addOperation(
    DigitalbitsSdk.Operation.revokeOfferSponsorship({
      seller: account.accountId(),
      offerId: '12345'
    })
  ).addOperation(
    DigitalbitsSdk.Operation.revokeDataSponsorship({
      account: account.accountId(),
      name: 'foo'
    })
  ).addOperation(
    DigitalbitsSdk.Operation.revokeClaimableBalanceSponsorship({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    })
  ).addOperation(
    DigitalbitsSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        ed25519PublicKey: sourceKey.publicKey()
      }
    })
  ).addOperation(
    DigitalbitsSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        sha256Hash: "da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be"
      }
    })
  ).addOperation(
    DigitalbitsSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        preAuthTx: "da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be"
      }
    })
  ).addOperation(
    DigitalbitsSdk.Operation.clawback({
      from: account.accountId(),
      amount: "1000",
      asset: usd,
    })
  ).addOperation(
    DigitalbitsSdk.Operation.clawbackClaimableBalance({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    })
  ).addOperation(
    DigitalbitsSdk.Operation.setTrustLineFlags({
      trustor: account.accountId(),
      asset: usd,
      flags: {
        authorized: true,
        authorizedToMaintainLiabilities: true,
        clawbackEnabled: true,
      },
    })
  ).addOperation(
    DigitalbitsSdk.Operation.setTrustLineFlags({
      trustor: account.accountId(),
      asset: usd,
      flags: {
        authorized: true,
      },
    })
  ).addMemo(new DigitalbitsSdk.Memo(DigitalbitsSdk.MemoText, 'memo'))
  .setTimeout(5)
  .build(); // $ExpectType () => Transaction<Memo<MemoType>, Operation[]>

const transactionFromXDR = new DigitalbitsSdk.Transaction(transaction.toEnvelope(), DigitalbitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]>

transactionFromXDR.networkPassphrase; // $ExpectType string
transactionFromXDR.networkPassphrase = "SDF";

DigitalbitsSdk.TransactionBuilder.fromXDR(transaction.toXDR(), DigitalbitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction
DigitalbitsSdk.TransactionBuilder.fromXDR(transaction.toEnvelope(), DigitalbitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction

const sig = DigitalbitsSdk.xdr.DecoratedSignature.fromXDR(Buffer.of(1, 2)); // $ExpectType DecoratedSignature
sig.hint(); // $ExpectType Buffer
sig.signature(); // $ExpectType Buffer

DigitalbitsSdk.Memo.none(); // $ExpectType Memo<"none">
DigitalbitsSdk.Memo.text('asdf'); // $ExpectType Memo<"text">
DigitalbitsSdk.Memo.id('asdf'); // $ExpectType Memo<"id">
DigitalbitsSdk.Memo.return('asdf'); // $ExpectType Memo<"return">
DigitalbitsSdk.Memo.hash('asdf'); // $ExpectType Memo<"hash">
DigitalbitsSdk.Memo.none().value; // $ExpectType null
DigitalbitsSdk.Memo.id('asdf').value; // $ExpectType string
DigitalbitsSdk.Memo.text('asdf').value; // $ExpectType string | Buffer
DigitalbitsSdk.Memo.return('asdf').value; // $ExpectType Buffer
DigitalbitsSdk.Memo.hash('asdf').value; // $ExpectType Buffer

const feeBumptransaction = DigitalbitsSdk.TransactionBuilder.buildFeeBumpTransaction(masterKey, "120", transaction, DigitalbitsSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction

feeBumptransaction.feeSource; // $ExpectType string
feeBumptransaction.innerTransaction; // $ExpectType Transaction<Memo<MemoType>, Operation[]>
feeBumptransaction.fee; // $ExpectType string
feeBumptransaction.toXDR(); // $ExpectType string
feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
feeBumptransaction.hash(); // $ExpectType Buffer

DigitalbitsSdk.TransactionBuilder.fromXDR(feeBumptransaction.toXDR(), DigitalbitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction
DigitalbitsSdk.TransactionBuilder.fromXDR(feeBumptransaction.toEnvelope(), DigitalbitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction

// P.S. You shouldn't be using the Memo constructor
//
// Unfortunately, it appears that type aliases aren't unwrapped by the linter,
// causing the following lines to fail unnecessarily:
//
// new DigitalbitsSdk.Memo(DigitalbitsSdk.MemoHash, 'asdf').value; // $ExpectType MemoValue
// new DigitalbitsSdk.Memo(DigitalbitsSdk.MemoHash, 'asdf').type; // $ExpectType MemoType
//
// This is because the linter just does a raw string comparison on type names:
// https://github.com/Microsoft/dtslint/issues/57#issuecomment-451666294

const noSignerXDR = DigitalbitsSdk.Operation.setOptions({ lowThreshold: 1 });
DigitalbitsSdk.Operation.fromXDRObject(noSignerXDR).signer; // $ExpectType never

const newSignerXDR1 = DigitalbitsSdk.Operation.setOptions({
  signer: { ed25519PublicKey: sourceKey.publicKey(), weight: '1' }
});
DigitalbitsSdk.Operation.fromXDRObject(newSignerXDR1).signer; // $ExpectType Ed25519PublicKey

const newSignerXDR2 = DigitalbitsSdk.Operation.setOptions({
  signer: { sha256Hash: Buffer.from(''), weight: '1' }
});
DigitalbitsSdk.Operation.fromXDRObject(newSignerXDR2).signer; // $ExpectType Sha256Hash

const newSignerXDR3 = DigitalbitsSdk.Operation.setOptions({
  signer: { preAuthTx: '', weight: 1 }
});
DigitalbitsSdk.Operation.fromXDRObject(newSignerXDR3).signer; // $ExpectType PreAuthTx

DigitalbitsSdk.TimeoutInfinite; // $ExpectType 0

const envelope = feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
envelope.v0(); // $ExpectType TransactionV0Envelope
envelope.v1(); // $ExpectType TransactionV1Envelope
envelope.feeBump(); // $ExpectType FeeBumpTransactionEnvelope

const meta = DigitalbitsSdk.xdr.TransactionMeta.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAQAAAAIAAAADAcEsRAAAAAAAAAAArZu2SrdQ9krkyj7RBqTx1txDNZBfcS+wGjuEUizV9hkAAAAAAKXgdAGig34AADuDAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAcEsRAAAAAAAAAAArZu2SrdQ9krkyj7RBqTx1txDNZBfcS+wGjuEUizV9hkAAAAAAKXgdAGig34AADuEAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA==',
  'base64'
);
meta; // $ExpectType TransactionMeta
meta.v1().txChanges(); // $ExpectType LedgerEntryChange[]
const op = DigitalbitsSdk.xdr.AllowTrustOp.fromXDR(
  'AAAAAMNQvnFVCnBnEVzd8ZaKUvsI/mECPGV8cnBszuftCmWYAAAAAUNPUAAAAAAC',
  'base64'
);
op; // $ExpectType AllowTrustOp
op.authorize(); // $ExpectType number
op.trustor().ed25519(); // $ExpectType Buffer
op.trustor(); // $ExpectedType AccountId
const e = DigitalbitsSdk.xdr.LedgerEntry.fromXDR(
  "AAAAAAAAAAC2LgFRDBZ3J52nLm30kq2iMgrO7dYzYAN3hvjtf1IHWg==",
  'base64'
);
e; // $ExpectType LedgerEntry
const a = DigitalbitsSdk.xdr.AccountEntry.fromXDR(
  // tslint:disable:max-line-length
  'AAAAALYuAVEMFncnnacubfSSraIyCs7t1jNgA3eG+O1/UgdaAAAAAAAAA+gAAAAAGc1zDAAAAAIAAAABAAAAAEB9GCtIe8SCLk7LV3MzmlKN3U4M2JdktE7ofCKtTNaaAAAABAAAAAtzdGVsbGFyLm9yZwABAQEBAAAAAQAAAACEKm+WHjUQThNzoKx6WbU8no3NxzUrGtoSLmtxaBAM2AAAAAEAAAABAAAAAAAAAAoAAAAAAAAAFAAAAAA=',
  'base64'
);
a; // $ExpectType AccountEntry
a.homeDomain(); // $ExpectType string | Buffer
const t = DigitalbitsSdk.xdr.TransactionV0.fromXDR(
    // tslint:disable:max-line-length
    '1bzMAeuKubyXUug/Xnyj1KYkv+cSUtCSvAczI2b459kAAABkAS/5cwAAABMAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAsBL/lzAAAAFAAAAAA=',
    'base64'
);
t; // $ExpectType TransactionV0
t.timeBounds(); // $ExpectType TimeBounds | null

DigitalbitsSdk.xdr.Uint64.fromString("12"); // $ExpectType UnsignedHyper
DigitalbitsSdk.xdr.Int32.toXDR(-1); // $ExpectType Buffer
DigitalbitsSdk.xdr.Uint32.toXDR(1); // $ExpectType Buffer
DigitalbitsSdk.xdr.String32.toXDR("hellow world"); // $ExpectedType Buffer
DigitalbitsSdk.xdr.Hash.toXDR(Buffer.alloc(32)); // $ExpectedType Buffer
DigitalbitsSdk.xdr.Signature.toXDR(Buffer.alloc(9, 'a')); // $ExpectedType Buffer

const change = DigitalbitsSdk.xdr.LedgerEntryChange.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAwHBW0UAAAAAAAAAADwkQ23EX6ohsRsGoCynHl5R8D7RXcgVD4Y92uUigLooAAAAAIitVMABlM5gABTlLwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA',
  'base64'
);
change; // $ExpectType LedgerEntryChange
const raw = DigitalbitsSdk.xdr.LedgerEntryChanges.toXDR([change]); // $ExpectType Buffer
DigitalbitsSdk.xdr.LedgerEntryChanges.fromXDR(raw); // $ExpectType LedgerEntryChange[]

DigitalbitsSdk.xdr.Asset.assetTypeNative(); // $ExpectType Asset
DigitalbitsSdk.xdr.InnerTransactionResultResult.txInternalError(); // $ExpectType InnerTransactionResultResult
DigitalbitsSdk.xdr.TransactionV0Ext[0](); // $ExpectedType TransactionV0Ext

DigitalbitsSdk.Claimant.predicateUnconditional(); // $ExpectType ClaimPredicate
const claimant = new DigitalbitsSdk.Claimant(sourceKey.publicKey()); // $ExpectType Claimant
claimant.toXDRObject(); // $ExpectType Claimant
claimant.destination; // $ExpectType string
claimant.predicate; // $ExpectType ClaimPredicate

const claw = DigitalbitsSdk.xdr.ClawbackOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABMAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAADFTYDKyTn2O0DVUEycHKfvsnFWj91TVl0ut1kwg5nLigAAAAJUC+QA',
  'base64'
);
claw; // $ExpectType ClawbackOp

const clawCb = DigitalbitsSdk.xdr.ClawbackClaimableBalanceOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABUAAAAAxU2Aysk59jtA1VBMnByn77JxVo/dU1ZdLrdZMIOZy4oAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAAAAAAAH',
  'base64'
);
clawCb; // $ExpectType ClawbackClaimableBalanceOp

const trust = DigitalbitsSdk.xdr.SetTrustLineFlagsOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABUAAAAAF1frB6QZRDTYW4dheEA3ZZLCjSWs9eQgzsyvqdUy2rgAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAAAAAAAB',
  'base64'
);
trust; // $ExpectType SetTrustLineFlagsOp
