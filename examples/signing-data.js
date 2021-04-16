import * as DigitalbitsBase from '../src';

var keypair = DigitalbitsBase.Keypair.random();
var data = 'data to sign';
var signature = DigitalbitsBase.sign(data, keypair.rawSecretKey());

console.log('Signature: ' + signature.toString('hex'));

if (DigitalbitsBase.verify(data, signature, keypair.rawPublicKey())) {
  console.log('OK!');
} else {
  console.log('Bad signature!');
}
