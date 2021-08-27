import { getEndedAuctions } from '../lib/getEndedAuctions'
import logger from '../lib/logger'

async function processAuctions() {
  logger.info('processAuctions.start')
  try {
    const auctions = await getEndedAuctions()
    logger.info('processAuctions.success', {
      auctions,
    })
  } catch (error) {
    logger.error('processAuctions.error', {
      error,
    })
    throw error
  }
}

const handler = processAuctions

export {
  handler as default,
  handler,
}
