import {Apis, Manager, ChainConfig} from "bitsharesjs-ws";
import {ChainStore} from "bitsharesjs/es";

export const nodes = [
    {name: "Local", url: "wss://127.0.0.1:8090"},
    {name: "Scopic Node", url: "wss://35.171.116.3:8090"},
    {name: "Bitshares Node", url: "wss://bitshares.openledger.info/ws"}
];

export function createConnection(node) {
    let urls = nodes.map(node => node.url);
    let connectionManager = new Manager({url: node.url, urls});
    return connectionManager.connectWithFallback(true).then((res) => {
        return Apis.instance();
    });
}