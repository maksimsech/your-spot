import 'server-only'

import { notReachable } from '@/types/non-reachable'


type LogLevel = 'log' | 'warn' | 'error'
interface ServerLogData {
    logLevel: LogLevel
    data?: unknown[]
}
export function serverLog(message: string, data: ServerLogData) {
    const logger = getLogger(data.logLevel)

    if (data.data) {
        logger(message, ...data.data)
    } else {
        logger(message)
    }
}

function getLogger(logLevel: LogLevel) {
    switch (logLevel) {
    case 'log': return console.log
    case 'warn': return console.warn
    case 'error': return console.error
    default: notReachable(logLevel)
    }
}
