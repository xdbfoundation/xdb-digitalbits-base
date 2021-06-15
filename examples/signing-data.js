import * as DigitalBitsBase from '../src';

var keypair = DigitalBitsBase.Keypair.random();
var data = 'data to sign';
var signature = DigitalBitsBase.sign(data, keypair.rawSecretKey());

console.log('Signature: ' + signature.toString('hex'));

if (DigitalBitsBase.verify(data, signature, keypair.rawPublicKey())) {
  console.log('OK!');
} else {
  console.log('Bad signature!');
}
