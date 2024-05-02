import {
    accountId,
    namespaceId,
    apiToken,
} from './env'


export async function getValue(key: string) {
    const url = getReadKeyValuePairUrl(key)

    return fetch(
        url,
        {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
        },
    )
        .then(r => r.text())
}


function getReadKeyValuePairUrl(keyName: string) {
    return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${keyName}`
}
