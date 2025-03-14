"use client";
//Оголосити компоненту клієнською, а не серверною

import { useState } from "react";

export default function Counter({ users }) {
  const [count, setCount] = useState(1);

  return (
    <div>
      <p>There are {users.length} users</p>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}
