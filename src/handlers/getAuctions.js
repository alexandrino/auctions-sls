import AWS from 'aws-sdk'
import createError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import logger from '../lib/logger'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuctions() {
  logger.info('getAuctions.start')

  try {
    const { AUCTIONS_TABLE_NAME: tableName } = process.env
    const result = await dynamodb.scan({
      TableName: tableName,
    }).promise()

    const { Items: items } = result
    const response = {
      statusCode: 200,
      body: JSON.stringify(items),
    }
    logger.info('getAuctions.success', items.length)
    return response
  } catch (error) {
    logger.error('getAuctions.error', error)
    throw new createError.InternalServerError(error)
  }
}

const handler = commonMiddleware(getAuctions)

export {
  handler as default,
  handler,
}
