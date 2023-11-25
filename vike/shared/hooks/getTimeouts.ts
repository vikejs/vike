export { getTimeouts }

import { ConfigTimeout, HookName } from "../page-configs/Config.js";

type Timeouts = {
    timeoutErr: number
    timeoutWarn: number
}

function getDefaultTimeouts(hookName: HookName): Timeouts {
    if (hookName === 'onBeforeRoute') {
        return {
            timeoutErr: 5 * 1000,
            timeoutWarn: 1 * 1000
        }
    }
    if (hookName === 'onBeforePrerender') {
        return {
            timeoutErr: 10 * 60 * 1000,
            timeoutWarn: 30 * 1000
        }
    }
    return {
        timeoutErr: 30 * 1000,
        timeoutWarn: 4 * 1000
    }
}

function getTimeouts(configTimeouts: undefined | ConfigTimeout, hookName: HookName): Timeouts {
    const defaultTimeouts = getDefaultTimeouts(hookName)
    if (!configTimeouts || !(hookName in configTimeouts)) {
        return defaultTimeouts
    }
    const timeoutErr = configTimeouts[hookName]?.error || defaultTimeouts.timeoutErr
    const timeoutWarn = configTimeouts[hookName]?.warning || defaultTimeouts.timeoutWarn
    return {
        timeoutErr,
        timeoutWarn
    }
}