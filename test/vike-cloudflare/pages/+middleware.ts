import { enhance } from '@universal-middleware/core'

export default [
  enhance(
    async function todoHandler(request: Request): Promise<Response> {
      const res = await request.json()

      console.log('Received todo item:', res)

      return new Response(JSON.stringify({ status: 'OK' }), {
        status: 200,
        headers: {
          'content-type': 'application/json'
        }
      })
    },
    {
      name: 'todo-handler',
      method: 'POST',
      path: '/api/todo/create',
      immutable: false
    }
  )
]
