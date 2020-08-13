import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../lambda/utils';
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'

import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';



const todosAccess= new TodosAccess()
const bucketName = process.env.TODOS_S3_BUCKET

export async function getAllTodos(): Promise<TodoItem[]> {

  return todosAccess.getAllTodos()
}
export async function createTodo(createTodoRequest: CreateTodoRequest,event: APIGatewayProxyEvent): Promise<TodoItem> {
  
    const itemId = uuid.v4()
    const userId = getUserId(event)
    return await todosAccess.createTodo({
        todoId: itemId,
        userId: userId,
        createdAt:new Date(Date.now()).toISOString(),
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
        ...createTodoRequest
    })
  }

  export async function deleteTodo(event: APIGatewayProxyEvent){
      //get todoId from the parameters that user send to url
    const todoId = event.pathParameters.todoId;
     //get user by id
  const userId = getUserId(event);
    const validTodo=todosAccess.todoExists(todoId,userId)
    if (!validTodo){ // it means that the todo does not exist

        return false}
    else
    {   await todosAccess.deleteTodo(todoId,userId)
        
        return true}
}

export async function updateTodo(event: APIGatewayProxyEvent,updateTodoRequest: UpdateTodoRequest){
    
  const todoId = event.pathParameters.todoId;
  //get user by id
  const userId = getUserId(event);
  const validTodo= todosAccess.todoExists(todoId,userId)
  
  if (!validTodo){ 

      return false}
  else
  {   await todosAccess.updateTodo(todoId, userId, updateTodoRequest)
      
      return true}
}