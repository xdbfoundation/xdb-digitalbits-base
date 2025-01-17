describe('Keypair.contructor', function() {
  it('fails when passes secret key does not match public key', function() {
    let secret = 'SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36';
    let kp = DigitalBitsBase.Keypair.fromSecret(secret);

    let secretKey = kp.rawSecretKey();
    let publicKey = DigitalBitsBase.StrKey.decodeEd25519PublicKey(kp.publicKey());
    publicKey[0] = 0; // Make public key invalid

    expect(
      () => new DigitalBitsBase.Keypair({ type: 'ed25519', secretKey, publicKey })
    ).to.throw(/secretKey does not match publicKey/);
  });

  it('fails when secretKey length is invalid', function() {
    let secretKey = Buffer.alloc(33);
    expect(
      () => new DigitalBitsBase.Keypair({ type: 'ed25519', secretKey })
    ).to.throw(/secretKey length is invalid/);
  });

  it('fails when publicKey length is invalid', function() {
    let publicKey = Buffer.alloc(33);
    expect(
      () => new DigitalBitsBase.Keypair({ type: 'ed25519', publicKey })
    ).to.throw(/publicKey length is invalid/);
  });
});

describe('Keypair.fromSecret', function() {
  it('creates a keypair correctly', function() {
    let secret = 'SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36';
    let kp = DigitalBitsBase.Keypair.fromSecret(secret);

    expect(kp).to.be.instanceof(DigitalBitsBase.Keypair);
    expect(kp.publicKey()).to.eql(
      'GDFQVQCYYB7GKCGSCUSIQYXTPLV5YJ3XWDMWGQMDNM4EAXAL7LITIBQ7'
    );
    expect(kp.secret()).to.eql(secret);
  });

  it("throw an error if the arg isn't strkey encoded as a seed", function() {
    expect(() => DigitalBitsBase.Keypair.fromSecret('hel0')).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromSecret(
        'SBWUBZ3SIPLLF5CCXLWUB2Z6UBTYAW34KVXOLRQ5HDAZG4ZY7MHNBWJ1'
      )
    ).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromSecret('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromSecret(
        'gsYRSEQhTffqA9opPepAENCr2WG6z5iBHHubxxbRzWaHf8FBWcu'
      )
    ).to.throw();
  });
});

describe('Keypair.fromRawEd25519Seed', function() {
  it('creates a keypair correctly', function() {
    let seed = 'masterpassphrasemasterpassphrase';
    let kp = DigitalBitsBase.Keypair.fromRawEd25519Seed(seed);

    expect(kp).to.be.instanceof(DigitalBitsBase.Keypair);
    expect(kp.publicKey()).to.eql(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    expect(kp.secret()).to.eql(
      'SBWWC43UMVZHAYLTONYGQ4TBONSW2YLTORSXE4DBONZXA2DSMFZWLP2R'
    );
    expect(kp.rawPublicKey().toString('hex')).to.eql(
      '2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432'
    );
  });

  it("throws an error if the arg isn't 32 bytes", function() {
    expect(() =>
      DigitalBitsBase.Keypair.fromRawEd25519Seed('masterpassphrasemasterpassphras')
    ).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromRawEd25519Seed(
        'masterpassphrasemasterpassphrase1'
      )
    ).to.throw();
    expect(() => DigitalBitsBase.Keypair.fromRawEd25519Seed(null)).to.throw();
    expect(() => DigitalBitsBase.Keypair.fromRawEd25519Seed()).to.throw();
  });
});

describe('Keypair.fromPublicKey', function() {
  it('creates a keypair correctly', function() {
    let kp = DigitalBitsBase.Keypair.fromPublicKey(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    expect(kp).to.be.instanceof(DigitalBitsBase.Keypair);
    expect(kp.publicKey()).to.eql(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    expect(kp.rawPublicKey().toString('hex')).to.eql(
      '2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432'
    );
  });

  it("throw an error if the arg isn't strkey encoded as a accountid", function() {
    expect(() => DigitalBitsBase.Keypair.fromPublicKey('hel0')).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromPublicKey('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromPublicKey(
        'sfyjodTxbwLtRToZvi6yQ1KnpZriwTJ7n6nrASFR6goRviCU3Ff'
      )
    ).to.throw();
  });

  it("throws an error if the address isn't 32 bytes", function() {
    expect(() =>
      DigitalBitsBase.Keypair.fromPublicKey('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() =>
      DigitalBitsBase.Keypair.fromPublicKey('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() => DigitalBitsBase.Keypair.fromPublicKey(null)).to.throw();
    expect(() => DigitalBitsBase.Keypair.fromPublicKey()).to.throw();
  });
});

describe('Keypair.random', function() {
  it('creates a keypair correctly', function() {
    let kp = DigitalBitsBase.Keypair.random();
    expect(kp).to.be.instanceof(DigitalBitsBase.Keypair);
  });
});

describe('Keypair.xdrMuxedAccount', function() {
  it('returns a valid MuxedAccount with a Ed25519 key type', function() {
    const kp = DigitalBitsBase.Keypair.fromPublicKey(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    const muxed = kp.xdrMuxedAccount();
    expect(muxed).to.be.instanceof(DigitalBitsBase.xdr.MuxedAccount);
    expect(muxed.switch()).to.be.equal(
      DigitalBitsBase.xdr.CryptoKeyType.keyTypeEd25519()
    );
  });
});

describe('Keypair.sign*Decorated', function() {
  describe('returning the correct hints', function() {
    const secret = 'SDVSYBKP7ESCODJSNGVDNXAJB63NPS5GQXSBZXLNT2Y4YVUJCFZWODGJ';
    const kp = DigitalBitsBase.Keypair.fromSecret(secret);

    // Note: these were generated using the Go SDK as a source of truth
    const CASES = [
      {
        data: [1, 2, 3, 4, 5, 6],
        regular: [8, 170, 203, 16],
        payload: [11, 174, 206, 22]
      },
      {
        data: [1, 2],
        regular: [8, 170, 203, 16],
        payload: [9, 168, 203, 16]
      },
      {
        data: [],
        regular: [8, 170, 203, 16],
        payload: [8, 170, 203, 16]
      }
    ];

    CASES.forEach((testCase) => {
      const data = testCase.data;
      const sig = kp.sign(data);

      it(`signedPayloads#${data.length}`, function() {
        const expectedXdr = new DigitalBitsBase.xdr.DecoratedSignature({
          hint: testCase.payload,
          signature: sig
        });

        const decoSig = kp.signPayloadDecorated(data);
        expect(decoSig.toXDR('hex')).to.eql(expectedXdr.toXDR('hex'));
      });

      it(`regular#${data.length}`, function() {
        const expectedXdr = new DigitalBitsBase.xdr.DecoratedSignature({
          hint: testCase.regular,
          signature: sig
        });

        const decoSig = kp.signDecorated(data);
        expect(decoSig.toXDR('hex')).to.eql(expectedXdr.toXDR('hex'));
      });
    });
  });
});
