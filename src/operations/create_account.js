import xdr from '../xdr';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';

/**
 * Create and fund a non existent account.
 * @function
 * @alias Operation.createAccount
 * @param {object} opts Options object
 * @param {string} opts.destination - Destination account ID to create an account for.
 * @param {string} opts.startingBalance - Amount in XDB the account should be funded for. Must be greater
 *                                   than the [reserve balance amount](https://developers.digitalbits.io/guides/concepts/fees.html).
 * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
 * @returns {xdr.CreateAccountOp} Create account operation
 */
export function createAccount(opts) {
  if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error('destination is invalid');
  }
  if (!this.isValidAmount(opts.startingBalance, true)) {
    throw new TypeError(
      'startingBalance must be of type String, represent a non-negative number and have at most 7 digits after the decimal'
    );
  }
  const attributes = {};
  attributes.destination = Keypair.fromPublicKey(
    opts.destination
  ).xdrAccountId();
  attributes.startingBalance = this._toXDRAmount(opts.startingBalance);
  const createAccountOp = new xdr.CreateAccountOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.createAccount(createAccountOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
