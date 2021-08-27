import AWS from 'aws-sdk'
import createError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import logger from '../lib/logger'

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getAuctionById = async (id) => {
  const { AUCTIONS_TABLE_NAME: tableName } = process.env

  logger.info(`getAuctionById.start ${id}`)
  const result = await dynamodb.get({
    TableName: tableName,
    Key: { id },
  }).promise()

  const { Item: item } = result
  logger.info('getAuctionById.success', { item })
  return item
}

async function getAuction(event) {
  const { id } = event.pathParameters

  logger.info(`getAuction.start ${id}`)
  try {
    const item = await getAuctionById(id)

    if (item) {
      logger.info('getAuctions.success', { item })
      return {
        statusCode: 200,
        body: JSON.stringify(item),
      }
    }

    logger.info('getAuctions.notFound', { id })
    throw createError.NotFound(`Auction Id: ${id} not found`)
  } catch (error) {
    logger.error('getAuction.error', { error })
    return {
      statusCode: 500,
      body: error.message,
    }
  }
}

const handler = commonMiddleware(getAuction)

export {
  handler as default,
  handler,
  getAuctionById,
}
