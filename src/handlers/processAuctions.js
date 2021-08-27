import { closeAuction } from '../lib/closeAuction'
import { getEndedAuctions } from '../lib/getEndedAuctions'
import logger from '../lib/logger'

async function processAuctions() {
  logger.info('processAuctions.start')
  try {
    const auctions = await getEndedAuctions()
    const auctionsToClose = await Promise.all(auctions.map(closeAuction))
    const auctionsClosed = auctionsToClose.length
    logger.info('processAuctions.success', {
      auctionsClosed,
    })
    return {
      auctionsClosed,
    }
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
