import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import createError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import logger from '../lib/logger'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createAuctions(event) {
  logger.info('createAuctions.start')
  try {
    const { title } = JSON.parse(event.body)
    const now = new Date()
    const endDate = new Date()
    endDate.setHours(endDate.getHours() + 1)

    const auction = {
      id: uuid(),
      title,
      status: 'OPEN',
      highestBid: {
        amount: 0,
      },
      created_at: now.toISOString(),
      endingAt: endDate.toISOString(),
    }

    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise()

    const body = JSON.stringify({ auction })
    logger.info('createAuctions.success', body)

    return {
      statusCode: 201,
      body,
    }
  } catch (error) {
    logger.error('createAuctions.error', error)
    throw new createError.InternalServerError(error)
  }
}

const handler = commonMiddleware(createAuctions)

export {
  handler as default,
  handler,
}
