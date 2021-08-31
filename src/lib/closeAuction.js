import AWS from 'aws-sdk'
import logger from './logger'

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const sqs = new AWS.SQS()

async function closeAuction(auction) {
  const { id } = auction
  const {
    AUCTIONS_TABLE_NAME: tableName,
    MAIL_QUEUE_URL: mailQueueUrl,
  } = process.env
  logger.info(`closeAuction.start ${id}`)

  try {
    const params = {
      TableName: tableName,
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
    await dynamoDb
      .update(params)
      .promise()

    const notifySeller = sqs
      .sendMessage({
        QueueUrl: mailQueueUrl,
        MessageBody: JSON.stringify({
          subject: `auction closed ${id}`,
        }),
      })
      .promise()

    // notifyBidder
    const result = await Promise.all([notifySeller])
    logger.info(`closeAuction.success ${id}`)

    return result
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
