import * as DigitalBitsSdk from 'xdb-digitalbits-base';

const masterKey = DigitalBitsSdk.Keypair.master(DigitalBitsSdk.Networks.TESTNET); // $ExpectType Keypair
const sourceKey = DigitalBitsSdk.Keypair.random(); // $ExpectType Keypair
const destKey = DigitalBitsSdk.Keypair.random();
const usd = new DigitalBitsSdk.Asset('USD', 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'); // $ExpectType Asset
const account = new DigitalBitsSdk.Account(sourceKey.publicKey(), '1'); // $ExpectType Account
const muxedAccount = new DigitalBitsSdk.MuxedAccount(account, '123'); // $ExpectType MuxedAccount
const muxedConforms = muxedAccount as DigitalBitsSdk.Account; // $ExpectType Account

const transaction = new DigitalBitsSdk.TransactionBuilder(account, {
  fee: "100",
  networkPassphrase: DigitalBitsSdk.Networks.TESTNET
})
  .addOperation(
    DigitalBitsSdk.Operation.beginSponsoringFutureReserves({
      sponsoredId: account.accountId(),
      source: masterKey.publicKey()
    })
  ).addOperation(
    DigitalBitsSdk.Operation.accountMerge({ destination: destKey.publicKey() }),
  ).addOperation(
    DigitalBitsSdk.Operation.createClaimableBalance({
      amount: "10",
      asset: DigitalBitsSdk.Asset.native(),
      claimants: [
        new DigitalBitsSdk.Claimant(account.accountId())
      ]
    }),
  ).addOperation(
    DigitalBitsSdk.Operation.claimClaimableBalance({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    }),
  ).addOperation(
    DigitalBitsSdk.Operation.endSponsoringFutureReserves({
    })
  ).addOperation(
    DigitalBitsSdk.Operation.endSponsoringFutureReserves({})
  ).addOperation(
    DigitalBitsSdk.Operation.revokeAccountSponsorship({
      account: account.accountId(),
    })
  ).addOperation(
      DigitalBitsSdk.Operation.revokeTrustlineSponsorship({
        account: account.accountId(),
        asset: usd,
      })
  ).addOperation(
    DigitalBitsSdk.Operation.revokeOfferSponsorship({
      seller: account.accountId(),
      offerId: '12345'
    })
  ).addOperation(
    DigitalBitsSdk.Operation.revokeDataSponsorship({
      account: account.accountId(),
      name: 'foo'
    })
  ).addOperation(
    DigitalBitsSdk.Operation.revokeClaimableBalanceSponsorship({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    })
  ).addOperation(
    DigitalBitsSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        ed25519PublicKey: sourceKey.publicKey()
      }
    })
  ).addOperation(
    DigitalBitsSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        sha256Hash: "da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be"
      }
    })
  ).addOperation(
    DigitalBitsSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        preAuthTx: "da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be"
      }
    })
  ).addOperation(
    DigitalBitsSdk.Operation.clawback({
      from: account.accountId(),
      amount: "1000",
      asset: usd,
    })
  ).addOperation(
    DigitalBitsSdk.Operation.clawbackClaimableBalance({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    })
  ).addOperation(
    DigitalBitsSdk.Operation.setTrustLineFlags({
      trustor: account.accountId(),
      asset: usd,
      flags: {
        authorized: true,
        authorizedToMaintainLiabilities: true,
        clawbackEnabled: true,
      },
    })
  ).addOperation(
    DigitalBitsSdk.Operation.setTrustLineFlags({
      trustor: account.accountId(),
      asset: usd,
      flags: {
        authorized: true,
      },
    })
  ).addOperation(
    DigitalBitsSdk.Operation.setOptions({
      setFlags:   (DigitalBitsSdk.AuthImmutableFlag | DigitalBitsSdk.AuthRequiredFlag) as DigitalBitsSdk.AuthFlag,
      clearFlags: (DigitalBitsSdk.AuthRevocableFlag | DigitalBitsSdk.AuthClawbackEnabledFlag) as DigitalBitsSdk.AuthFlag,
    })
  ).addMemo(new DigitalBitsSdk.Memo(DigitalBitsSdk.MemoText, 'memo'))
  .setTimeout(5)
  .build(); // $ExpectType () => Transaction<Memo<MemoType>, Operation[]>

const transactionFromXDR = new DigitalBitsSdk.Transaction(transaction.toEnvelope(), DigitalBitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]>

transactionFromXDR.networkPassphrase; // $ExpectType string
transactionFromXDR.networkPassphrase = "SDF";

DigitalBitsSdk.TransactionBuilder.fromXDR(transaction.toXDR(), DigitalBitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction
DigitalBitsSdk.TransactionBuilder.fromXDR(transaction.toEnvelope(), DigitalBitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction

const sig = DigitalBitsSdk.xdr.DecoratedSignature.fromXDR(Buffer.of(1, 2)); // $ExpectType DecoratedSignature
sig.hint(); // $ExpectType Buffer
sig.signature(); // $ExpectType Buffer

DigitalBitsSdk.Memo.none(); // $ExpectType Memo<"none">
DigitalBitsSdk.Memo.text('asdf'); // $ExpectType Memo<"text">
DigitalBitsSdk.Memo.id('asdf'); // $ExpectType Memo<"id">
DigitalBitsSdk.Memo.return('asdf'); // $ExpectType Memo<"return">
DigitalBitsSdk.Memo.hash('asdf'); // $ExpectType Memo<"hash">
DigitalBitsSdk.Memo.none().value; // $ExpectType null
DigitalBitsSdk.Memo.id('asdf').value; // $ExpectType string
DigitalBitsSdk.Memo.text('asdf').value; // $ExpectType string | Buffer
DigitalBitsSdk.Memo.return('asdf').value; // $ExpectType Buffer
DigitalBitsSdk.Memo.hash('asdf').value; // $ExpectType Buffer

const feeBumptransaction = DigitalBitsSdk.TransactionBuilder.buildFeeBumpTransaction(masterKey, "120", transaction, DigitalBitsSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction

feeBumptransaction.feeSource; // $ExpectType string
feeBumptransaction.innerTransaction; // $ExpectType Transaction<Memo<MemoType>, Operation[]>
feeBumptransaction.fee; // $ExpectType string
feeBumptransaction.toXDR(); // $ExpectType string
feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
feeBumptransaction.hash(); // $ExpectType Buffer

DigitalBitsSdk.TransactionBuilder.fromXDR(feeBumptransaction.toXDR(), DigitalBitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction
DigitalBitsSdk.TransactionBuilder.fromXDR(feeBumptransaction.toEnvelope(), DigitalBitsSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction

// P.S. You shouldn't be using the Memo constructor
//
// Unfortunately, it appears that type aliases aren't unwrapped by the linter,
// causing the following lines to fail unnecessarily:
//
// new DigitalBitsSdk.Memo(DigitalBitsSdk.MemoHash, 'asdf').value; // $ExpectType MemoValue
// new DigitalBitsSdk.Memo(DigitalBitsSdk.MemoHash, 'asdf').type; // $ExpectType MemoType
//
// This is because the linter just does a raw string comparison on type names:
// https://github.com/Microsoft/dtslint/issues/57#issuecomment-451666294

const noSignerXDR = DigitalBitsSdk.Operation.setOptions({ lowThreshold: 1 });
DigitalBitsSdk.Operation.fromXDRObject(noSignerXDR).signer; // $ExpectType never

const newSignerXDR1 = DigitalBitsSdk.Operation.setOptions({
  signer: { ed25519PublicKey: sourceKey.publicKey(), weight: '1' }
});
DigitalBitsSdk.Operation.fromXDRObject(newSignerXDR1).signer; // $ExpectType Ed25519PublicKey

const newSignerXDR2 = DigitalBitsSdk.Operation.setOptions({
  signer: { sha256Hash: Buffer.from(''), weight: '1' }
});
DigitalBitsSdk.Operation.fromXDRObject(newSignerXDR2).signer; // $ExpectType Sha256Hash

const newSignerXDR3 = DigitalBitsSdk.Operation.setOptions({
  signer: { preAuthTx: '', weight: 1 }
});
DigitalBitsSdk.Operation.fromXDRObject(newSignerXDR3).signer; // $ExpectType PreAuthTx

DigitalBitsSdk.TimeoutInfinite; // $ExpectType 0

const envelope = feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
envelope.v0(); // $ExpectType TransactionV0Envelope
envelope.v1(); // $ExpectType TransactionV1Envelope
envelope.feeBump(); // $ExpectType FeeBumpTransactionEnvelope

const meta = DigitalBitsSdk.xdr.TransactionMeta.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAQAAAAIAAAADAcEsRAAAAAAAAAAArZu2SrdQ9krkyj7RBqTx1txDNZBfcS+wGjuEUizV9hkAAAAAAKXgdAGig34AADuDAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAcEsRAAAAAAAAAAArZu2SrdQ9krkyj7RBqTx1txDNZBfcS+wGjuEUizV9hkAAAAAAKXgdAGig34AADuEAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA==',
  'base64'
);
meta; // $ExpectType TransactionMeta
meta.v1().txChanges(); // $ExpectType LedgerEntryChange[]
const op = DigitalBitsSdk.xdr.AllowTrustOp.fromXDR(
  'AAAAAMNQvnFVCnBnEVzd8ZaKUvsI/mECPGV8cnBszuftCmWYAAAAAUNPUAAAAAAC',
  'base64'
);
op; // $ExpectType AllowTrustOp
op.authorize(); // $ExpectType number
op.trustor().ed25519(); // $ExpectType Buffer
op.trustor(); // $ExpectedType AccountId
const e = DigitalBitsSdk.xdr.LedgerEntry.fromXDR(
  "AAAAAAAAAAC2LgFRDBZ3J52nLm30kq2iMgrO7dYzYAN3hvjtf1IHWg==",
  'base64'
);
e; // $ExpectType LedgerEntry
const a = DigitalBitsSdk.xdr.AccountEntry.fromXDR(
  // tslint:disable:max-line-length
  'AAAAALYuAVEMFncnnacubfSSraIyCs7t1jNgA3eG+O1/UgdaAAAAAAAAA+gAAAAAGc1zDAAAAAIAAAABAAAAAEB9GCtIe8SCLk7LV3MzmlKN3U4M2JdktE7ofCKtTNaaAAAABAAAAAtzdGVsbGFyLm9yZwABAQEBAAAAAQAAAACEKm+WHjUQThNzoKx6WbU8no3NxzUrGtoSLmtxaBAM2AAAAAEAAAABAAAAAAAAAAoAAAAAAAAAFAAAAAA=',
  'base64'
);
a; // $ExpectType AccountEntry
a.homeDomain(); // $ExpectType string | Buffer
const t = DigitalBitsSdk.xdr.TransactionV0.fromXDR(
    // tslint:disable:max-line-length
    '1bzMAeuKubyXUug/Xnyj1KYkv+cSUtCSvAczI2b459kAAABkAS/5cwAAABMAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAsBL/lzAAAAFAAAAAA=',
    'base64'
);
t; // $ExpectType TransactionV0
t.timeBounds(); // $ExpectType TimeBounds | null

DigitalBitsSdk.xdr.Uint64.fromString("12"); // $ExpectType UnsignedHyper
DigitalBitsSdk.xdr.Int32.toXDR(-1); // $ExpectType Buffer
DigitalBitsSdk.xdr.Uint32.toXDR(1); // $ExpectType Buffer
DigitalBitsSdk.xdr.String32.toXDR("hellow world"); // $ExpectedType Buffer
DigitalBitsSdk.xdr.Hash.toXDR(Buffer.alloc(32)); // $ExpectedType Buffer
DigitalBitsSdk.xdr.Signature.toXDR(Buffer.alloc(9, 'a')); // $ExpectedType Buffer

const change = DigitalBitsSdk.xdr.LedgerEntryChange.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAwHBW0UAAAAAAAAAADwkQ23EX6ohsRsGoCynHl5R8D7RXcgVD4Y92uUigLooAAAAAIitVMABlM5gABTlLwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA',
  'base64'
);
change; // $ExpectType LedgerEntryChange
const raw = DigitalBitsSdk.xdr.LedgerEntryChanges.toXDR([change]); // $ExpectType Buffer
DigitalBitsSdk.xdr.LedgerEntryChanges.fromXDR(raw); // $ExpectType LedgerEntryChange[]

DigitalBitsSdk.xdr.Asset.assetTypeNative(); // $ExpectType Asset
DigitalBitsSdk.xdr.InnerTransactionResultResult.txInternalError(); // $ExpectType InnerTransactionResultResult
DigitalBitsSdk.xdr.TransactionV0Ext[0](); // $ExpectedType TransactionV0Ext

DigitalBitsSdk.Claimant.predicateUnconditional(); // $ExpectType ClaimPredicate
const claimant = new DigitalBitsSdk.Claimant(sourceKey.publicKey()); // $ExpectType Claimant
claimant.toXDRObject(); // $ExpectType Claimant
claimant.destination; // $ExpectType string
claimant.predicate; // $ExpectType ClaimPredicate

const claw = DigitalBitsSdk.xdr.ClawbackOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABMAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAADFTYDKyTn2O0DVUEycHKfvsnFWj91TVl0ut1kwg5nLigAAAAJUC+QA',
  'base64'
);
claw; // $ExpectType ClawbackOp

const clawCb = DigitalBitsSdk.xdr.ClawbackClaimableBalanceOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABUAAAAAxU2Aysk59jtA1VBMnByn77JxVo/dU1ZdLrdZMIOZy4oAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAAAAAAAH',
  'base64'
);
clawCb; // $ExpectType ClawbackClaimableBalanceOp

const trust = DigitalBitsSdk.xdr.SetTrustLineFlagsOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABUAAAAAF1frB6QZRDTYW4dheEA3ZZLCjSWs9eQgzsyvqdUy2rgAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAAAAAAAB',
  'base64'
);
trust; // $ExpectType SetTrustLineFlagsOp
