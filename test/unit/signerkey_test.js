describe('SignerKey', function() {
  describe('encode/decode roundtrip', function() {
    const TEST_CASES = [
      {
        strkey: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
        type: DigitalBitsBase.xdr.SignerKeyType.signerKeyTypeEd25519()
      },
      {
        strkey: 'TBU2RRGLXH3E5CQHTD3ODLDF2BWDCYUSSBLLZ5GNW7JXHDIYKXZWHXL7',
        type: DigitalBitsBase.xdr.SignerKeyType.signerKeyTypePreAuthTx()
      },
      {
        strkey: 'XBU2RRGLXH3E5CQHTD3ODLDF2BWDCYUSSBLLZ5GNW7JXHDIYKXZWGTOG',
        type: DigitalBitsBase.xdr.SignerKeyType.signerKeyTypeHashX()
      },
      {
        strkey:
          'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAQACAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4DUPB6IBZGM',
        type: DigitalBitsBase.xdr.SignerKeyType.signerKeyTypeEd25519SignedPayload()
      }
    ];

    TEST_CASES.forEach((testCase) => {
      it(`works for ${testCase.strkey.substring(0, 5)}...`, function() {
        const skey = DigitalBitsBase.SignerKey.decodeAddress(testCase.strkey);
        expect(skey.switch()).to.eql(testCase.type);

        const rawXdr = skey.toXDR('raw');
        const rawSk = DigitalBitsBase.xdr.SignerKey.fromXDR(rawXdr, 'raw');
        expect(rawSk).to.eql(skey);

        const address = DigitalBitsBase.SignerKey.encodeSignerKey(skey);
        expect(address).to.equal(testCase.strkey);
      });
    });
  });

  describe('error cases', function() {
    [
      // these are valid strkeys, just not valid signers
      'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDY',
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK',
      // this is (literal) nonsense
      'NONSENSE'
    ].forEach((strkey) => {
      it(`fails on ${strkey.substring(0, 5)}...`, function() {
        expect(() => {
          DigitalBitsBase.SignerKey.decodeAddress(strkey);
        }).to.throw(/invalid signer key type/i);
      });
    });

    it('fails on invalid strkey', function() {
      expect(() =>
        // address taken from strkey_test.js#invalidStrKeys
        DigitalBitsBase.SignerKey.decodeAddress(
          'G47QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVP2I'
        )
      ).to.throw(/invalid version byte/i);
    });
  });
});
