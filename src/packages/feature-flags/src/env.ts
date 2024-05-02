import { z } from 'zod'


const envSchema = z.object({
    CLOUDFLARE_KV_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_KV_FF_NAMESPACE_ID: z.string().min(1),
    CLOUDFLARE_KV_API_TOKEN: z.string().min(1),
})

const {
    CLOUDFLARE_KV_ACCOUNT_ID: accountId,
    CLOUDFLARE_KV_FF_NAMESPACE_ID: namespaceId,
    CLOUDFLARE_KV_API_TOKEN: apiToken,
} = envSchema.parse(process.env)

export {
    accountId,
    namespaceId,
    apiToken,
}
