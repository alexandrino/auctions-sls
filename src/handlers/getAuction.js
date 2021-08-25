import AWS from 'aws-sdk'
import createError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import logger from '../lib/logger'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuction(event) {
  logger.info('getAuction.start')

  try {
    const { id } = event.pathParameters
    const { AUCTIONS_TABLE_NAME: tableName } = process.env

    const result = await dynamodb.get({
      TableName: tableName,
      Key: { id },
    }).promise()

    const { Item: item } = result

    if (item) {
      logger.info('getAuctions.success', item)
      return {
        statusCode: 200,
        body: JSON.stringify(item),
      }
    }

    logger.info('getAuctions.notFound', id)
    throw createError.NotFound(`Auction Id: ${id} not found`)
  } catch (error) {
    logger.error('getAuction.error', error)
    throw new createError.InternalServerError(error)
  }
}

const handler = commonMiddleware(getAuction)

export {
  handler as default,
  handler,
}
