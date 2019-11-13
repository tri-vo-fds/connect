/* @flow */
'use strict';

import type {
    NEMTransactionCommon,
    NEMTransfer,
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

const getCommon = (tx: $NEM2Transaction, address_n?: Array<number>): NEMTransactionCommon => {
    return {
        address_n,
        network: (tx.version >> 24) & 0xFF,
        timestamp: tx.timeStamp,
        fee: tx.fee,
        deadline: tx.deadline,
        signer: address_n ? undefined : tx.signer,
    };
};

const transferMessage = (tx: $NEM2Transaction): NEMTransfer => {
    const mosaics: ?Array<NEMMosaic> = tx.mosaics ? tx.mosaics.map((mosaic: $NEM2Mosaic) => ({
        namespace: mosaic.mosaicId.namespaceId,
        mosaic: mosaic.mosaicId.name,
        quantity: mosaic.quantity,
    })) : undefined;

    return {
        recipient: tx.recipient,
        amount: tx.amount,
        payload: tx.message.payload || undefined,
        public_key: tx.message.type === 0x02 ? tx.message.publicKey : undefined,
        mosaics,
    };
};

export const createTx = (tx: $NEM2Transaction, address_n: Array<number>): NEMSignTxMessage => {
    let transaction: $NEM2Transaction = tx;
    const message: NEMSignTxMessage = {
        transaction: getCommon(tx, address_n),
    };

    message.cosigning = (tx.type === 0x1002);
    if (message.cosigning || tx.type === 0x1004) {
        transaction = tx.otherTrans;
        message.multisig = getCommon(transaction);
    }

    switch (transaction.type) {
        case 0x0101:
            message.transfer = transferMessage(transaction);
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
            throw new Error('Unknown transaction type');
    }

    return message;
};