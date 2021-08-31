import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import { getAuctionById } from './getAuction'
import logger from '../lib/logger'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function placeBid(event) {
  const { id } = event.pathParameters
  const { amount } = event.body
  const { email } = event.requestContext.authorizer

  logger.info('placeBid.start', {
    id,
    amount,
  })

  try {
    const auctionData = await getAuctionById(id)
    const {
      highestBid: {
        amount: currentAmount,
      },
      status,
    } = auctionData

    logger.info('placeBid.diff', {
      id,
      amount,
      currentAmount,
    })

    if (status !== 'OPEN') {
      return {
        statusCode: 401,
        body: 'You cannot bid on closed auctions',
      }
    }

    if (amount <= currentAmount) {
      return {
        statusCode: 401,
        body: `Your Bid must be higher than ${currentAmount}`,
      }
    }

    const { AUCTIONS_TABLE_NAME: tableName } = process.env
    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
      ExpressionAttributeValues: {
        ':amount': amount,
        ':bidder': email,
      },
      ReturnValues: 'ALL_NEW',
    }

    const result = await dynamodb.update(params).promise()
    const { Attributes: attributes } = result

    logger.info('placeBids.success', { id })
    return {
      statusCode: 200,
      body: JSON.stringify(attributes),
    }
  } catch (error) {
    logger.error('placeBid.error', {
      id,
      error,
    })
    return {
      statusCode: 500,
      body: error.message,
    }
  }
}

const handler = commonMiddleware(placeBid)

export {
  handler as default,
  handler,
}
