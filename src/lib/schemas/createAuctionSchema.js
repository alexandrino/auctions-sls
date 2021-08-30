const schema = {
  type: 'object',
  properties: {
    body: {
      properties: {
        title: {
          type: 'string',
        },
      },
      required: ['title'],
    },
  },
  required: ['body'],
}

export default schema
