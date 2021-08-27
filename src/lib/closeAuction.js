import AWS from 'aws-sdk'
import logger from './logger'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

async function closeAuction(auction) {
  const { id } = auction
  logger.info(`closeAuction.start ${id}`)

  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: {
        id,
      },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeValues: {
        ':status': 'CLOSED',
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    }
    const result = await dynamoDb
      .update(params)
      .promise()

    logger.info(`closeAuction.success ${id}`)
    return result.Items
  } catch (error) {
    logger.error('closeAuction.error', {
      errorMessage: error.message,
      id,
    })

    throw error
  }
}

export {
  closeAuction as default,
  closeAuction,
}
