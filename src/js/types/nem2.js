/* @flow */
// NEM2 types from nem2-sdk
// https://nem2project.github.io/#transferTransaction

import type { $Path, $Common } from './params';
import type { Unsuccessful$ } from './response';
import type { NEM2SignedTx } from './trezor';

type Message = {
    payload: string,
    type: number,
}

export type Mosaic = {
    id: string, // uint64
    amount: string, // uint64
}

export type NetworkType =
    104 // MAIN_NET
  | 152 // TEST_NET
  | 96 // MIJIN
  | 144 // MIJIN_TEST

export type NEM2Address = {
    address: String,
    networkType: NetworkType,
}

export type Transaction = {
    type: number,
    network: NetworkType,
    version: number,
    maxFee: string, // uint64
    deadline: string, // uint64
    signer: ?string,
    signature: ?string,

    // Transfer Transaction Fields
    recipientAddress: NEM2Address,
    mosaics: Array<Mosaic>,
    message: Message,

    // Mosaic Definition Fields
    nonce: ?number,
    mosaicId: ?string,
    flags: ?number,
    divisibility: ?number,
    duration: ?string,
}

// get public key

export type NEM2Publickey = {
    address: string,
    path: Array<number>,
    serializedPath: string,
}

// sign transaction

export type $NEM2SignTransaction = $Common & {
    path: $Path,
    transaction: Transaction,
}

export type NEM2SignTransaction$ = {
    success: true,
    payload: NEM2SignedTx,
} | Unsuccessful$;

