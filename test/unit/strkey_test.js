const { ENGINE_METHOD_PKEY_METHS } = require('constants');

describe('StrKey', function() {
  beforeEach(function() {
    var keypair = DigitalBitsBase.Keypair.master(
      'TestNet Global DigitalBits Network ; December 2020'
    );
    this.unencodedBuffer = keypair.rawPublicKey();
    this.unencoded = this.unencodedBuffer.toString();
    this.accountIdEncoded = keypair.publicKey();
    this.seedEncoded = DigitalBitsBase.StrKey.encodeEd25519SecretSeed(
      this.unencodedBuffer
    );
  });
  describe('#decodeCheck', function() {
    it('decodes correctly', function() {
      expect(
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(this.accountIdEncoded)
      ).to.eql(this.unencodedBuffer);
      expect(
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(this.seedEncoded)
      ).to.eql(this.unencodedBuffer);
    });

    it('throws an error when the version byte is wrong', function() {
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL'
        )
      ).to.throw(/invalid version/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCU'
        )
      ).to.throw(/invalid version/);
    });

    it('throws an error when decoded data encodes to other string', function() {
      // accountId
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T'
        )
      ).to.throw(/invalid encoded string/);
      // seed
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYW'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYWMEGB2W2'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYWMEGB2W2T'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'SCMB30FQCIQAWZ4WQTS6SVK37LGMAFJGXOZIHTH2PY6EXLP37G46H6DT'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'SAYC2LQ322EEHZYWNSKBEW6N66IRTDREEBUXXU5HPVZGMAXKLIZNM45H++'
        )
      ).to.throw(/invalid encoded string/);
    });

    it('throws an error when the checksum is wrong', function() {
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVT'
        )
      ).to.throw(/invalid checksum/);
      expect(() =>
        DigitalBitsBase.StrKey.decodeEd25519SecretSeed(
          'SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCX'
        )
      ).to.throw(/invalid checksum/);
    });
  });

  describe('#encodeCheck', function() {
    it('encodes a buffer correctly', function() {
      expect(
        DigitalBitsBase.StrKey.encodeEd25519PublicKey(this.unencodedBuffer)
      ).to.eql(this.accountIdEncoded);
      expect(
        DigitalBitsBase.StrKey.encodeEd25519PublicKey(this.unencodedBuffer)
      ).to.match(/^G/);
      expect(
        DigitalBitsBase.StrKey.encodeEd25519SecretSeed(this.unencodedBuffer)
      ).to.eql(this.seedEncoded);
      expect(
        DigitalBitsBase.StrKey.encodeEd25519SecretSeed(this.unencodedBuffer)
      ).to.match(/^S/);

      var strkeyEncoded;

      strkeyEncoded = DigitalBitsBase.StrKey.encodePreAuthTx(
        this.unencodedBuffer
      );
      expect(strkeyEncoded).to.match(/^T/);
      expect(DigitalBitsBase.StrKey.decodePreAuthTx(strkeyEncoded)).to.eql(
        this.unencodedBuffer
      );

      strkeyEncoded = DigitalBitsBase.StrKey.encodeSha256Hash(
        this.unencodedBuffer
      );
      expect(strkeyEncoded).to.match(/^X/);
      expect(DigitalBitsBase.StrKey.decodeSha256Hash(strkeyEncoded)).to.eql(
        this.unencodedBuffer
      );
    });

    it('encodes a buffer correctly', function() {
      expect(
        DigitalBitsBase.StrKey.encodeEd25519PublicKey(this.unencodedBuffer)
      ).to.eql(this.accountIdEncoded);
      expect(
        DigitalBitsBase.StrKey.encodeEd25519SecretSeed(this.unencodedBuffer)
      ).to.eql(this.seedEncoded);
    });

    it('throws an error when the data is null', function() {
      expect(() =>
        DigitalBitsBase.StrKey.encodeEd25519SecretSeed(null)
      ).to.throw(/null data/);
      expect(() =>
        DigitalBitsBase.StrKey.encodeEd25519PublicKey(null)
      ).to.throw(/null data/);
    });
  });

  describe('#isValidEd25519PublicKey', function() {
    it('returns true for valid public key', function() {
      var keys = [
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        'GB7KKHHVYLDIZEKYJPAJUOTBE5E3NJAXPSDZK7O6O44WR3EBRO5HRPVT',
        'GD6WVYRVID442Y4JVWFWKWCZKB45UGHJAABBJRS22TUSTWGJYXIUR7N2',
        'GBCG42WTVWPO4Q6OZCYI3D6ZSTFSJIXIS6INCIUF23L6VN3ADE4337AP',
        'GDFX463YPLCO2EY7NGFMI7SXWWDQAMASGYZXCG2LATOF3PP5NQIUKBPT',
        'GBXEODUMM3SJ3QSX2VYUWFU3NRP7BQRC2ERWS7E2LZXDJXL2N66ZQ5PT',
        'GAJHORKJKDDEPYCD6URDFODV7CVLJ5AAOJKR6PG2VQOLWFQOF3X7XLOG',
        'GACXQEAXYBEZLBMQ2XETOBRO4P66FZAJENDHOQRYPUIXZIIXLKMZEXBJ',
        'GDD3XRXU3G4DXHVRUDH7LJM4CD4PDZTVP4QHOO4Q6DELKXUATR657OZV',
        'GDTYVCTAUQVPKEDZIBWEJGKBQHB4UGGXI2SXXUEW7LXMD4B7MK37CWLJ'
      ];

      for (var i in keys) {
        expect(DigitalBitsBase.StrKey.isValidEd25519PublicKey(keys[i])).to.be
          .true;
      }
    });

    it('returns false for invalid public key', function() {
      var keys = [
        'GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL',
        'GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++',
        'GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA',
        'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2',
        'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T',
        'GDXIIZTKTLVYCBHURXL2UPMTYXOVNI7BRAEFQCP6EZCY4JLKY4VKFNLT',
        'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDY',
        'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wt',
        'test',
        null,
        'g4VPBPrHZkfE8CsjuG2S4yBQNd455UWmk' // Old network key
      ];

      for (var i in keys) {
        expect(DigitalBitsBase.StrKey.isValidEd25519PublicKey(keys[i])).to.be
          .false;
      }
    });
  });

  describe('#isValidSecretKey', function() {
    it('returns true for valid secret key', function() {
      var keys = [
        'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDY',
        'SCZTUEKSEH2VYZQC6VLOTOM4ZDLMAGV4LUMH4AASZ4ORF27V2X64F2S2',
        'SCGNLQKTZ4XCDUGVIADRVOD4DEVNYZ5A7PGLIIZQGH7QEHK6DYODTFEH',
        'SDH6R7PMU4WIUEXSM66LFE4JCUHGYRTLTOXVUV5GUEPITQEO3INRLHER',
        'SC2RDTRNSHXJNCWEUVO7VGUSPNRAWFCQDPP6BGN4JFMWDSEZBRAPANYW',
        'SCEMFYOSFZ5MUXDKTLZ2GC5RTOJO6FGTAJCF3CCPZXSLXA2GX6QUYOA7'
      ];

      for (var i in keys) {
        expect(DigitalBitsBase.StrKey.isValidEd25519SecretSeed(keys[i])).to.be
          .true;
      }
    });

    it('returns false for invalid secret key', function() {
      var keys = [
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDYT', // Too long
        'SAFGAMN5Z6IHVI3IVEPIILS7ITZDYSCEPLN4FN5Z3IY63DRH4CIYEV', // To short
        'SAFGAMN5Z6IHVI3IVEPIILS7ITZDYSCEPLN4FN5Z3IY63DRH4CIYEVIT', // Checksum
        'test',
        null
      ];

      for (var i in keys) {
        expect(DigitalBitsBase.StrKey.isValidEd25519SecretSeed(keys[i])).to.be
          .false;
      }
    });
  });

  const PUBKEY = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
  const MPUBKEY =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK';
  const RAW_MPUBKEY = Buffer.from(
    '3f0c34bf93ad0d9971d04ccc90f705511c838aad9734a4a2fb0d7a03fc7fe89a8000000000000000',
    'hex'
  );

  describe('#muxedAccounts', function() {
    it('encodes & decodes M... addresses correctly', function() {
      expect(
        DigitalBitsBase.StrKey.encodeMed25519PublicKey(RAW_MPUBKEY)
      ).to.equal(MPUBKEY);
      expect(
        DigitalBitsBase.StrKey.decodeMed25519PublicKey(MPUBKEY).equals(
          RAW_MPUBKEY
        )
      ).to.be.true;
    });

    it('lets G... accounts pass through (unmuxed)', function() {
      const unmuxed = DigitalBitsBase.decodeAddressToMuxedAccount(PUBKEY);

      expect(DigitalBitsBase.xdr.MuxedAccount.isValid(unmuxed)).to.be.true;
      expect(unmuxed.switch()).to.equal(
        DigitalBitsBase.xdr.CryptoKeyType.keyTypeEd25519()
      );
      expect(
        unmuxed
          .ed25519()
          .equals(DigitalBitsBase.StrKey.decodeEd25519PublicKey(PUBKEY))
      ).to.be.true;
      expect(DigitalBitsBase.encodeMuxedAccountToAddress(unmuxed)).to.equal(
        PUBKEY
      );
    });

    it('decodes underlying G... address correctly', function() {
      expect(DigitalBitsBase.extractBaseAddress(MPUBKEY)).to.equal(PUBKEY);
      expect(DigitalBitsBase.extractBaseAddress(PUBKEY)).to.equal(PUBKEY);
    });

    const RAW_PUBKEY = DigitalBitsBase.StrKey.decodeEd25519PublicKey(PUBKEY);
    const unmuxed = DigitalBitsBase.xdr.MuxedAccount.keyTypeEd25519(RAW_PUBKEY);

    it('encodes & decodes unmuxed keys', function() {
      expect(DigitalBitsBase.xdr.MuxedAccount.isValid(unmuxed)).to.be.true;
      expect(unmuxed.switch()).to.equal(
        DigitalBitsBase.xdr.CryptoKeyType.keyTypeEd25519()
      );
      expect(unmuxed.ed25519().equals(RAW_PUBKEY)).to.be.true;

      const pubkey = DigitalBitsBase.encodeMuxedAccountToAddress(unmuxed);
      expect(pubkey).to.equal(PUBKEY);
    });

    const CASES = [
      {
        strkey:
          'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK',
        id: '9223372036854775808' // 0x8000...
      },
      {
        strkey:
          'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAFB4CJJBRKA',
        id: '1357924680'
      },
      {
        strkey:
          'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAE2JUG6',
        id: '1234'
      },
      {
        strkey:
          'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ',
        id: '0'
      }
    ];

    CASES.forEach((testCase) => {
      it(`encodes & decodes muxed key w/ ID=${testCase.id}`, function() {
        const muxed = DigitalBitsBase.decodeAddressToMuxedAccount(
          testCase.strkey
        );
        expect(DigitalBitsBase.xdr.MuxedAccount.isValid(muxed)).to.be.true;
        expect(muxed.switch()).to.equal(
          DigitalBitsBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
        );

        const innerMux = muxed.med25519();
        const id = DigitalBitsBase.xdr.Uint64.fromString(testCase.id);
        expect(innerMux.ed25519().equals(unmuxed.ed25519())).to.be.true;
        expect(innerMux.id()).to.eql(id);

        const mpubkey = DigitalBitsBase.encodeMuxedAccountToAddress(muxed);
        expect(mpubkey).to.equal(testCase.strkey);
      });
    });
  });

  describe('#signedPayloads', function() {
    const HAPPY_PATHS = [
      {
        desc: 'valid w/ 32-byte payload',
        strkey:
          'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAQACAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4DUPB6IBZGM',
        ed25519: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
        payload:
          '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20'
      },
      {
        desc: 'valid w/ 29-byte payload',
        strkey:
          'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAOQCAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4DUAAAAFGBU',
        ed25519: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
        payload: '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d'
      }
    ];

    HAPPY_PATHS.forEach((testCase) => {
      it(testCase.desc, function() {
        const spBuf = DigitalBitsBase.StrKey.decodeSignedPayload(
          testCase.strkey
        );
        const sp = DigitalBitsBase.xdr.SignerKeyEd25519SignedPayload.fromXDR(
          spBuf,
          'raw'
        );

        const signer = DigitalBitsBase.StrKey.encodeEd25519PublicKey(
          sp.ed25519()
        );
        expect(signer).to.equal(testCase.ed25519);

        const payload = sp.payload().toString('hex');
        expect(payload).to.equal(testCase.payload);

        const str = DigitalBitsBase.StrKey.encodeSignedPayload(sp.toXDR('raw'));
        expect(str).to.equal(testCase.strkey);
      });
    });

    describe('payload bounds', function() {
      let sp = new DigitalBitsBase.xdr.SignerKeyEd25519SignedPayload({
        ed25519: DigitalBitsBase.StrKey.decodeEd25519PublicKey(
          'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ'
        ),
        payload: Buffer.alloc(0)
      });
      const isValid = (sp) => {
        return DigitalBitsBase.StrKey.isValidSignedPayload(
          DigitalBitsBase.StrKey.encodeSignedPayload(sp.toXDR('raw'))
        );
      };

      it('invalid with no payload', function() {
        sp.payload(Buffer.alloc(0));
        expect(isValid(sp)).to.be.false;
      });

      it('valid with 1-byte payload', function() {
        sp.payload(Buffer.alloc(1));
        expect(isValid(sp)).to.be.true;
      });

      it('throws with 65-byte payload', function() {
        sp.payload(Buffer.alloc(65));
        expect(() => isValid(sp)).to.throw(/XDR Write Error/);
      });

      it('valid with 64-byte payload (max)', function() {
        sp.payload(Buffer.alloc(64));
        expect(isValid(sp)).to.be.true;
      });
    });
  });

  describe('#invalidStrKeys', function() {
    // From https://digitalbits.io/protocol/sep-23#invalid-test-cases
    const BAD_STRKEYS = [
      // The unused trailing bit must be zero in the encoding of the last three
      // bytes (24 bits) as five base-32 symbols (25 bits)
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUR',
      // Invalid length (congruent to 1 mod 8)
      'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZA',
      // Invalid algorithm (low 3 bits of version byte are 7)
      'G47QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVP2I',
      // Invalid length (congruent to 6 mod 8)
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLKA',
      // Invalid algorithm (low 3 bits of version byte are 7)
      'M47QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ',
      // Padding bytes are not allowed
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUK===',
      // Invalid checksum
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUO'

      //
      // FIXME: The following test cases don't pass (i.e. don't throw).
      //        Fixing this would require a larger refactoring to the way strkey
      //        decoding works (strkey.js:decodeCheck), because the decoder
      //        doesn't perform length validation.
      //
      //        It also does not involve the XDR (un)marshalling mechanisms
      //        whatsoever, meaning something like a signed payload with an
      //        invalid payload length cannot be caught, since that's an
      //        internal detail to how XDR encodes variable-length buffers.
      //

      // Invalid length (Ed25519 should be 32 bytes, not 5)
      // 'GAAAAAAAACGC6',
      // Invalid length (base-32 decoding should yield 35 bytes, not 36)
      // 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUACUSI',
      // Invalid length (base-32 decoding should yield 43 bytes, not 44)
      // 'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAAV75I',
      // Length prefix specifies length that is shorter than payload in signed payload
      // 'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAQACAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4DUPB6IAAAAAAAAPM',
      // Length prefix specifies length that is longer than payload in signed payload
      // 'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAOQCAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4Z2PQ',
      // No zero padding in signed payload
      // 'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAOQCAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4DXFH6'
    ];

    BAD_STRKEYS.forEach((address) => {
      it(`fails in expected case ${address}`, function() {
        const vb = DigitalBitsBase.StrKey.getVersionByteForPrefix(address);
        expect(() =>
          DigitalBitsBase.StrKey.decodeCheck(vb, address)
        ).to.throw();
      });
    });
  });
});
