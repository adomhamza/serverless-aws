import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult,
  // APIGatewayProxyHandler, 
 } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos';



// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  if (!await updateTodo(event,updatedTodo)) {
 
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'This Todo does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    body: ''
  }
})


handler.use(
  cors({ 
    credentials: true 
  })
)