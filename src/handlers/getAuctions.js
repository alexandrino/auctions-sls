import AWS from 'aws-sdk'
import createError  from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuctions() {
  console.log('getAuctions.start')
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
    console.log('getAuctions.success', items.length)
    return response
  } catch(error) {
    console.error('getAuctions.error', error)
    throw new createError.InternalServerError(error)
  }
}

export const handler = commonMiddleware(getAuctions)
