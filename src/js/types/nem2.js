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

export type TransactionType =
    0x4154 // Transfer
  | 0x414D // MosaicDefinition
  | 0x424D // MosaicSupplyChange
  | 0x414E // NamespaceRegistration
  | 0x424E // AddressAlias
  | 0x434E // MosaicAlias
  | 0x4344 // NamespaceMetadata
  | 0x4244 // MosaicMetadata
  | 0x4144 // AccountMetadata
  | 0x4152 // SecretLock
  | 0x4252 // SecretProof
  | 0x4148 // HashLock
  | 0x4141 // AggregateComplete
  | 0x4241 // AggregateBonded

export type NEM2Address = {
    address: String,
    networkType: NetworkType,
}

export type TransactionBase = {
    type: TransactionType,
    network: NetworkType,
    version: number,
    maxFee: string, // uint64 (optional so the Transaction type can be reused as an inner transaction)
    deadline: string, // uint64 (optional so the Transaction type can be reused as an inner transaction)
    signer?: string,
    signature?: string,

    signerPublicKey: string, // used in inner transaction
}

export type Transaction = TransactionBase &
                            Transfer &
                            MosaicDefinition &
                            MosaicSupply &
                            NamespaceRegistration &
                            AddressAlias &
                            MosaicAlias &
                            NamespaceMetadata &
                            MosaicMetadata &
                            AccountMetadata &
                            SecretLock &
                            SecretProof &
                            HashLock &
                            Aggregate;

export type Transfer = {
    recipientAddress: NEM2Address,
    mosaics: Array<Mosaic>,
    message: Message,
}

export type MosaicDefinition = {
    nonce: number,
    id: string,
    flags: number,
    divisibility: number,
    duration: string,
}

export type MosaicSupply = {
    mosaicId: string,
    action: number,
    delta: string,
}

export type NamespaceRegistration = {
    registrationType: number,
    namespaceName: string,
    id: string,
    parentId?: string,
    duration?: string,
}

export type AddressAlias = {
    namespaceId: string,
    address: NEM2Address,
    aliasAction: number,
}

export type MosaicAlias = {
    namespaceId: string,
    mosaicId: string,
    aliasAction: number,
}

export type NamespaceMetadata = {
    targetPublicKey: string,
    scopedMetadataKey: string,
    targetNamespaceId: string,
    valueSizeDelta: number,
    valueSize: number,
    value: string,
}

export type MosaicMetadata = {
    targetPublicKey: string,
    scopedMetadataKey: string,
    targetMosaicId: string,
    valueSizeDelta: number,
    valueSize: number,
    value: string,
}

export type AccountMetadata = {
    targetPublicKey: string,
    scopedMetadataKey: string,
    valueSizeDelta: number,
    valueSize: number,
    value: string,
}

export type SecretLock = {
    mosaicId: string,
    amount: string,
    duration: string,
    hashAlgorithm: number,
    secret: string,
    recipientAddress: NEM2Address,
}

export type SecretProof = {
    hashAlgorithm: number,
    secret: string,
    proof: string,
}

export type HashLock = {
    mosaicId: string,
    amount: string,
    duration: string,
    hash: string,
}

export type MultisigModification = {
    minApprovalDelta: number,
    minRemovalDelta: number,
    publicKeyAdditions: string[],
    publicKeyDeletions: string[],
}

// Define the AccountRestriction types seperately as they all need to share the same properties
// restrictionAdditions, restrictionDeletions which differ in types between the three transactions.
export type AccountAddressRestrictionTransaction = TransactionBase & {
    restrictionType: number,
    restrictionAdditions: NEM2Address[],
    restrictionDeletions: NEM2Address[],
}

export type AccountMosaicRestrictionTransaction = TransactionBase & {
    restrictionType: number,
    restrictionAdditions: string[],
    restrictionDeletions: string[],
}

export type AccountOperationRestrictionTransaction = TransactionBase & {
    restrictionType: number,
    restrictionAdditions: number[],
    restrictionDeletions: number[],
}

export type Aggregate = {
    innerTransactions: Array<Transaction>,
    cosignatures: Array<Cosignatures>,
}

export type Cosignatures = {
    signature: string,
    publicKey: string,
}

// get public key

export type $NEM2Publickey = {
    path: $Path,
    showDisplay: boolean
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

export type NEM2Publickey$ = {
    success: true,
    payload: {
        path: $Path,
        publicKey: string,
        serializedPath: string
    },    
} | Unsuccessful$;

