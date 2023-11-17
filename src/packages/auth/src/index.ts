import type { AuthConfig } from '@auth/core'

import { adapter } from './adapter'
import { baseConfig } from './base-config'
import type { AuthUser } from './types'


export { AuthUser }
export const config = {
    ...baseConfig,
    adapter,
} satisfies AuthConfig
