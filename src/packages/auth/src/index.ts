import type { AuthConfig } from '@auth/core'

import { adapter } from './adapter'
import { baseConfig } from './base-config'


export const config = {
    ...baseConfig,
    adapter,
} satisfies AuthConfig
