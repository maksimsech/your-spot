import { S3Client } from '@aws-sdk/client-s3'

import {
    accessKeyId,
    secretAccessKey,
    storageAccountId,
} from './env'


export const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${storageAccountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
})
