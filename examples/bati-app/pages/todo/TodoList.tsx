import React, { useState } from "react";

export function TodoList({
  initialTodoItems,
}: {
  initialTodoItems: { text: string }[];
}) {
  const [todoItems, setTodoItems] = useState(initialTodoItems);
  const [newTodo, setNewTodo] = useState("");
  return (
    <>
      <ul>
        {todoItems.map((todoItem) => (
          <li key={todoItem.text}>{todoItem.text}</li>
        ))}
      </ul>
      <div>
        <form
          onSubmit={async (ev) => {
            ev.preventDefault();

            // Optimistic UI update
            setTodoItems((prev) => [...prev, { text: newTodo }]);
            try {
              const response = await fetch("/api/todo/create", {
                method: "POST",
                body: JSON.stringify({ text: newTodo }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              await response.blob();
              setNewTodo("");
            } catch (e) {
              console.error(e);
              // rollback
              setTodoItems((prev) => prev.slice(0, -1));
            }
          }}
        >
          <input
            type="text"
            onChange={(ev) => setNewTodo(ev.target.value)}
            value={newTodo}
          />{" "}
          <button type="submit">Add to-do</button>
        </form>
      </div>
    </>
  );
}
