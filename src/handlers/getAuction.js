import AWS from 'aws-sdk'
import createError from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuction(event) {
  console.log('getAuction.start')
  try {
    const { id } = event.pathParameters
    const { AUCTIONS_TABLE_NAME: tableName } = process.env

    const result = await dynamodb.get({
      TableName: tableName,
      Key: { id },
    }).promise()

    const { Item: item } = result

    if(item) {
      console.log('getAuctions.success', item)
      return {
        statusCode: 200,
        body: JSON.stringify(item),
      }
    }

    console.log('getAuctions.notFound', id)
    createError.NotFound(`Auction Id: ${id} not found`)
  } catch(error) {
    console.error('getAuction.error', error)
    throw new createError.InternalServerError(error)
  }
}

export const handler = commonMiddleware(getAuction)
