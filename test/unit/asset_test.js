describe('Asset', function() {
  describe('constructor', function() {
    it("throws an error when there's no issuer for non XDB type asset", function() {
      expect(() => new DigitalBitsBase.Asset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when code is invalid', function() {
      expect(
        () =>
          new DigitalBitsBase.Asset(
            '',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new DigitalBitsBase.Asset(
            '1234567890123',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new DigitalBitsBase.Asset(
            'ab_',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
    });

    it('throws an error when issuer is invalid', function() {
      expect(() => new DigitalBitsBase.Asset('USD', 'GCEZWKCA5')).to.throw(
        /Issuer is invalid/
      );
    });
  });

  describe('getCode()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new DigitalBitsBase.Asset.native();
      expect(asset.getCode()).to.be.equal('XDB');
    });

    it('returns a code for a non-native asset', function() {
      var asset = new DigitalBitsBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getCode()).to.be.equal('USD');
    });
  });

  describe('getIssuer()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new DigitalBitsBase.Asset.native();
      expect(asset.getIssuer()).to.be.undefined;
    });

    it('returns a code for a non-native asset', function() {
      var asset = new DigitalBitsBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getIssuer()).to.be.equal(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });
  });

  describe('getAssetType()', function() {
    it('returns native for native assets', function() {
      var asset = DigitalBitsBase.Asset.native();
      expect(asset.getAssetType()).to.eq('native');
    });

    it('returns credit_alphanum4 if the asset code length is between 1 and 4', function() {
      var asset = new DigitalBitsBase.Asset(
        'ABCD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('returns credit_alphanum12 if the asset code length is between 5 and 12', function() {
      var asset = new DigitalBitsBase.Asset(
        'ABCDEF',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });
  });

  describe('toXDRObject(), toChangeTrustXDRObject(), toTrustLineXDRObject', function() {
    it('parses a native asset object', function() {
      const asset = new DigitalBitsBase.Asset.native();

      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.Asset);
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.ChangeTrustAsset);
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.TrustLineAsset);
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );
    });

    it('parses a 3-alphanum asset object', function() {
      const asset = new DigitalBitsBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );

      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');
    });

    it('parses a 4-alphanum asset object', function() {
      const asset = new DigitalBitsBase.Asset(
        'BART',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');
    });

    it('parses a 5-alphanum asset object', function() {
      const asset = new DigitalBitsBase.Asset(
        '12345',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');
    });

    it('parses a 12-alphanum asset object', function() {
      const asset = new DigitalBitsBase.Asset(
        '123456789012',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(DigitalBitsBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');
    });
  });

  describe('fromOperation()', function() {
    it('parses a native asset XDR', function() {
      var xdr = new DigitalBitsBase.xdr.Asset.assetTypeNative();
      var asset = DigitalBitsBase.Asset.fromOperation(xdr);

      expect(asset).to.be.instanceof(DigitalBitsBase.Asset);
      expect(asset.isNative()).to.equal(true);
    });

    it('parses a 4-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHL';
      var assetType = new DigitalBitsBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: DigitalBitsBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new DigitalBitsBase.xdr.Asset(
        'assetTypeCreditAlphanum4',
        assetType
      );

      var asset = DigitalBitsBase.Asset.fromOperation(xdr);

      expect(asset).to.be.instanceof(DigitalBitsBase.Asset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
    });

    it('parses a 12-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHLTOKEN';
      var assetType = new DigitalBitsBase.xdr.AlphaNum12({
        assetCode: assetCode + '\0\0\0\0',
        issuer: DigitalBitsBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new DigitalBitsBase.xdr.Asset(
        'assetTypeCreditAlphanum12',
        assetType
      );

      var asset = DigitalBitsBase.Asset.fromOperation(xdr);

      expect(asset).to.be.instanceof(DigitalBitsBase.Asset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
    });
  });

  describe('toString()', function() {
    it("returns 'native' for native asset", function() {
      var asset = DigitalBitsBase.Asset.native();
      expect(asset.toString()).to.be.equal('native');
    });

    it("returns 'code:issuer' for non-native asset", function() {
      var asset = new DigitalBitsBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.toString()).to.be.equal(
        'USD:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });
  });

  describe('compare()', function() {
    const assetA = new DigitalBitsBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetB = new DigitalBitsBase.Asset(
      'USD',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );

    it('throws an error if the input assets are invalid', function() {
      expect(() => DigitalBitsBase.Asset.compare()).to.throw(/assetA is invalid/);

      expect(() => DigitalBitsBase.Asset.compare(assetA)).to.throw(
        /assetB is invalid/
      );

      expect(() => DigitalBitsBase.Asset.compare(assetA, assetB)).to.not.throw;
    });

    it('returns false if assets are equal', function() {
      const XDB = new DigitalBitsBase.Asset.native();
      expect(DigitalBitsBase.Asset.compare(XDB, XDB)).to.eq(0);
      expect(DigitalBitsBase.Asset.compare(assetA, assetA)).to.eq(0);
      expect(DigitalBitsBase.Asset.compare(assetB, assetB)).to.eq(0);
    });

    it('test if asset types are being validated as native < anum4 < anum12', function() {
      const XDB = new DigitalBitsBase.Asset.native();
      const anum4 = new DigitalBitsBase.Asset(
        'ARST',
        'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
      );
      const anum12 = new DigitalBitsBase.Asset(
        'ARSTANUM12',
        'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
      );

      expect(DigitalBitsBase.Asset.compare(XDB, XDB)).to.eq(0);
      expect(DigitalBitsBase.Asset.compare(XDB, anum4)).to.eq(-1);
      expect(DigitalBitsBase.Asset.compare(XDB, anum12)).to.eq(-1);

      expect(DigitalBitsBase.Asset.compare(anum4, XDB)).to.eq(1);
      expect(DigitalBitsBase.Asset.compare(anum4, anum4)).to.eq(0);
      expect(DigitalBitsBase.Asset.compare(anum4, anum12)).to.eq(-1);

      expect(DigitalBitsBase.Asset.compare(anum12, XDB)).to.eq(1);
      expect(DigitalBitsBase.Asset.compare(anum12, anum4)).to.eq(1);
      expect(DigitalBitsBase.Asset.compare(anum12, anum12)).to.eq(0);
    });

    it('test if asset codes are being validated as assetCodeA < assetCodeB', function() {
      const assetARST = new DigitalBitsBase.Asset(
        'ARST',
        'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
      );
      const assetUSDX = new DigitalBitsBase.Asset('USDA', assetARST.getIssuer());

      expect(DigitalBitsBase.Asset.compare(assetARST, assetARST)).to.eq(0);
      expect(DigitalBitsBase.Asset.compare(assetARST, assetUSDX)).to.eq(-1);

      expect(DigitalBitsBase.Asset.compare(assetUSDX, assetARST)).to.eq(1);
      expect(DigitalBitsBase.Asset.compare(assetUSDX, assetUSDX)).to.eq(0);

      // uppercase should be smaller
      const assetLower = new DigitalBitsBase.Asset('aRST', assetARST.getIssuer());
      expect(DigitalBitsBase.Asset.compare(assetARST, assetLower)).to.eq(-1);
      expect(DigitalBitsBase.Asset.compare(assetLower, assetA)).to.eq(1);
    });

    it('test if asset issuers are being validated as assetIssuerA < assetIssuerB', function() {
      const assetIssuerA = new DigitalBitsBase.Asset(
        'ARST',
        'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
      );
      const assetIssuerB = new DigitalBitsBase.Asset(
        'ARST',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );

      expect(DigitalBitsBase.Asset.compare(assetIssuerA, assetIssuerB)).to.eq(-1);
      expect(DigitalBitsBase.Asset.compare(assetIssuerA, assetIssuerA)).to.eq(0);

      expect(DigitalBitsBase.Asset.compare(assetIssuerB, assetIssuerA)).to.eq(1);
      expect(DigitalBitsBase.Asset.compare(assetIssuerB, assetIssuerB)).to.eq(0);
    });
  });
});
