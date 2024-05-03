import { z } from 'zod'


const envSchema = z.object({
    SYSTEM_REFRESH_FF_CACHE_API_KEY: z.string().min(1),
})


const {
    SYSTEM_REFRESH_FF_CACHE_API_KEY: refreshFFCacheApiKey,
} = envSchema.parse(process.env)

export { refreshFFCacheApiKey }
