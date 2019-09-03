import { Account, Authority, Params, Executor, Config } from './config';
import * as fs from "fs";

/**
 * Set masternode accounts
 */
const masterAddress1 = '0x929710d206f0e1133f353553353de5bc80c8460b';    // thor master-key -config-dir ~/Work/tmp/node1
const masterAddress2 = '0xaf05f933692569a710c2f6fa323a59e20068d418';    // thor master-key -config-dir ~/Work/tmp/node2
const masterAddress3 = '0x7bd72c20b67b7145a85eb2705913eeb980635a64';    // thor master-key -config-dir ~/Work/tmp/node3
const endorsor = '0x5e4abda5cced44f70c9d2e1be4fda08c4291945b';
const _authority: Authority[] = [
    { masterAddress: masterAddress1, endorsorAddress: endorsor, identity: strToHexStr('id1', 64) },
    { masterAddress: masterAddress2, endorsorAddress: endorsor, identity: strToHexStr('id2', 64) },
    { masterAddress: masterAddress3, endorsorAddress: endorsor, identity: strToHexStr('id3', 64) }
];

/**
 * Set network global parameters
 */
const _params: Params = {
    rewardRatio: 300000000000000000,
    baseGasPrice: 1000000000000000,
    proposerEndorsement: 25000000000000000000000000,
    executorAddress: strToHexStr('Executor', 40)
}

/**
 * Set accounts
 */
const _accounts: Account[] = [
    {
        address: endorsor,
        balance: 25000000000000000000000000,
        energy: 0,
        code: "0x6060604052600256",
        storage: { ['0x' + '0'.repeat(63) + '1']: '0x' + '0'.repeat(63) + '2' }
    },
    { address: '0xfa580a85722b39c500a514c7292e9e5710a73974', balance: 100000000000000000000000000},
    { address: '0xe4e98a2c7831af1173f9f84c530fe844859d1836', balance: 100000000000000000000000000}
];

/**
 * Set Executor contract
 */
const _executor: Executor = {
    approvers: [
        { address: '0xcb43d5d874893a67d94cdb0c28e2a93285f56ff0', identity: strToHexStr('approver1', 64) },
        { address: '0x7d350a72ea46d0927139e57dfe2174d7acaa9d30', identity: strToHexStr('approver2', 64) },
        { address: '0x62fa853cefc28aca2c225e66da96a692171d86e7', identity: strToHexStr('approver3', 64) }
    ]
}

/**
 * Construct the JSON object
 */
const config: Config = {
    launchTime: Math.floor(new Date().getTime()/1000),  // Launch time in the unit of second
    gasLimit: 10000000,
    extraData: 'CustomChain',
    accounts: _accounts,
    authority: _authority,
    params: _params,
    executor: _executor
}

// Write the JSON string to file
fs.writeFileSync(
    './customChainConfig.json',
    // Correct scientific notations
    JSON.stringify(config).replace(/([1-9]\.?[0-9]*)e\+([1-9][0-9]*)/ig, (_, p1, p2) => {
        p1 = p1.replace('.', '');
        const n = parseInt(p2) - p1.length + 1;
        const str = p1 + '0'.repeat(n);
        return str;
    })
);

function strToHexStr(str: string, hexLen: number): string {
    let hexstr = Buffer.from(str).toString('hex');
    const dif = hexstr.length - hexLen;
    if (dif > 0) {
        return '0x' + hexstr.slice(dif);
    } else {
        return '0x' + '0'.repeat(Math.abs(dif)) + hexstr;
    }
}