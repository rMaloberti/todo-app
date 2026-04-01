import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import type { Todo } from "./types";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  // Filter
  type Filter = "all" | "active" | "completed";

  const [filter, setFilter] = useState<Filter>("all");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const moveTodo = (from: number, to: number) => {
    const updated = [...todos];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setTodos(updated);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Todo App</h1>
      <div className="input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>
      <div>
        {filteredTodos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            moveTodo={moveTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
