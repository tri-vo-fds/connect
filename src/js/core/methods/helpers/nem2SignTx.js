/* @flow */
'use strict';

import type {
    NEM2TransactionCommon,
    NEM2Transfer,
    NEM2MosaicDefinition,
} from '../../../types/trezor';

import type {
    Transaction as $NEM2Transaction,
    Mosaic as $NEM2Mosaic,
} from '../../../types/nem2';

export const NEM_MAINNET: number = 0x68;
export const NEM_TESTNET: number = 0x98;
export const NEM_MIJIN: number = 0x60;

export const NETWORKS = {
    'mainnet': NEM_MAINNET,
    'testnet': NEM_TESTNET,
    'mijin': NEM_MIJIN,
};

export const NEM_TRANSFER: 0x0101 = 0x0101;

export const TX_TYPES = {
    'transfer': NEM_TRANSFER,
};

const getCommon = (tx: $NEM2Transaction): NEMTransactionCommon => {
    return {
        type: tx.type,
        network_type: tx.networkType,
        version: tx.version,
        max_fee: tx.maxFee,
        deadline: tx.deadline,        
    };
};

const transferMessage = (tx: $NEM2Transaction): NEMTransfer => {
    const mosaics: ?Array<NEMMosaic> = tx.mosaics ? tx.mosaics.map((mosaic: $NEM2Mosaic) => ({
        id: mosaic.id,
        amount: mosaic.amount,
    })) : undefined;

    return {
        recipient_address: tx.recipientAddress.address,
        message: tx.message || undefined,
        mosaics,
    };
};

const mosaicDefinitionMessage = (tx: $NEM2Transaction): NEM2MosaicDefinition => {
    return {
        nonce: tx.nonce,
        mosaic_id: tx.mosaicId,
        flags: tx.flags,
        divisibility: tx.divisibility,
        duration: tx.duration
    }
};

export const createTx = (tx: $NEM2Transaction, address_n: Array<number>): NEMSignTxMessage => {
    const transaction: $NEM2Transaction = tx;    
    const message: NEMSignTxMessage = {
        address_n: address_n,
        generation_hash: tx.generationHash,
        transaction: getCommon(tx),
    };

    switch (transaction.type) {
        case 0x4154:
            message.transfer = transferMessage(transaction);
            break;
        case 0x414D:
            message.mosaic_definition = mosaicDefinitionMessage(transaction);
            break;
            // case 0x0801:
            //     message.importance_transfer = importanceTransferMessage(transaction);
            //     break;

            // case 0x1001:
            //     message.aggregate_modification = aggregateModificationMessage(transaction);
            //     break;

            // case 0x2001:
            //     message.provision_namespace = provisionNamespaceMessage(transaction);
            //     break;

            // case 0x4001:
            //     message.mosaic_creation = mosaicCreationMessage(transaction);
            //     break;

            // case 0x4002:
            //     message.supply_change = supplyChangeMessage(transaction);
            //     break;

        default:
            throw new Error(`Unknown transaction type: ${transaction.type}`);
    }

    return message;
};
