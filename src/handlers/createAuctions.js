import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import createError  from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createAuctions(event, context) {
  console.log('createAuctions.start')
  try {
    const { title } = JSON.parse(event.body)
    const now = new Date()
    const auction = {
      id: uuid(),
      title,
      status: 'OPEN',
      created_at: now.toISOString(),
    }

    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise()

    const body = JSON.stringify({ auction })
    console.log('createAuctions.success', body)
  
    return {
      statusCode: 201,
      body,
    }
  } catch(error) {
    console.error('createAuctions.error', error)
    throw new createError.InternalServerError(error)
  }
}

export const handler = commonMiddleware(createAuctions)

