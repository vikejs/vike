export async function createTodoHandler<
  Context extends Record<string | number | symbol, unknown>,
>(request: Request, _context?: Context): Promise<Response> {
  // In a real case, user-provided data should ALWAYS be validated with tools like zod
  const newTodo = (await request.json()) as { text: string };

  console.log("Received new todo", newTodo);

  return new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
