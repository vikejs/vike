import React from "react";
import "./code.css";
import { getUsers } from "../../api/users";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../types/User";

export { Page, prefetchQueries };

const prefetchQueries = {
  users: {
    fn: getUsers,
  },
};

function Page() {
  const { data, isFetching, isError, error, refetch } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (import.meta.env.DEV && isFetching) return "⚡ Fetching ⚡";
  if (isError) return JSON.stringify(error);
  return (
    <>
      <h1>Users</h1>
      <p>
        Example of using <code>vite-plugin-ssr</code>.
      </p>
      <button onClick={() => refetch()}>Refetch 🔄️</button>
      <ul>
        {data &&
          data.length > 0 &&
          data.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </>
  );
}
