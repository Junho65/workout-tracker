import type { Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>({
  authMode:'apiKey',
});

const{data:newTodo}=await client.models.Todo.create({
  content:"my todo",
  isDone:true,
})

const todo = {
  id:'some_id',
  content:'Updated content'
};

const{data:updatedTodo}=await client.models.Todo.update(todo);

const toBeDeletedTodo = {
  id: '123123213'
}

const { data: deletedTodo } = await client.models.Todo.delete(toBeDeletedTodo)


export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false,
    });
    // no more manual refetchTodos required!
    // - fetchTodos()
  };

  return (
    <div>
      <button onClick={createTodo}>Add new todo</button>
      <ul>
        {todos.map(({ id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
    </div>
  );
}