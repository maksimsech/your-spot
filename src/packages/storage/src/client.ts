import { S3Client } from '@aws-sdk/client-s3'

import {
    accessKeyId,
    secretAccessKey,
    apiUrl,
} from './env'


export const s3 = new S3Client({
    region: 'auto',
    endpoint: apiUrl,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
})
