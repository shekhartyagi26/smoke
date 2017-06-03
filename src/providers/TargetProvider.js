import * as BaseProvider from './BaseProvider'

/* Provider for Target */
const targets = (model, body) => ({...body })
export default {
    ...BaseProvider,
    targets
}
