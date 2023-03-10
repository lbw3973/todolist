const headers = {
  "content-type": "application/json",
  apikey: "FcKdtJs202301",
  username: "KDT4_LeeByoungWook",
};

export const createTodo = async (title, order) => {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        title,
        order,
      }),
    }
  );
  const json = await res.json();
  return json;
};

export const readTodos = async () => {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "GET",
      headers: headers,
    }
  );
  const json = await res.json();
  return json;
};

export const updateTodo = async (todo) => {
  await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todo.id}`,
    {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        title: `${todo.title}`,
        done: todo.done,
        order: todo.order,
      }),
    }
  );
};

export const deleteTodo = async (todo) => {
  await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todo.id}`,
    {
      method: "DELETE",
      headers,
    }
  );
};

export const reOrderTodo = async (todo) => {
  await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/reorder`,
    {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        todoIds: todo,
      }),
    }
  );
};
