import AWS from 'aws-sdk'
import logger from './logger'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

async function getEndedAuctions() {
  try {
    logger.info('getEndedAuctions.start')

    const now = new Date()
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: '#status = :status AND endingAt <= :now',
      ExpressionAttributeValues: {
        ':status': 'OPEN',
        ':now': now.toISOString(),
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    }
    const result = await dynamoDb
      .query(params)
      .promise()

    logger.info('getEndedAuctions.success')
    return result.Items
  } catch (error) {
    logger.error('getEndedAuctions.error', {
      errorMessage: error.message,
    })

    throw error
  }
}

export {
  getEndedAuctions as default,
  getEndedAuctions,
}
