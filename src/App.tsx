import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import Column from "./components/Column";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Task } from "./types";

const initialTasks: Task[] = [
  { id: "1", text: "Learn React", column: "done" },
  { id: "2", text: "Build project", column: "progress" },
  { id: "3", text: "Deploy app", column: "todo" },
];

type ColumnId = "todo" | "progress" | "done";

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [input, setInput] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: input,
      column: "todo",
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const columns: ColumnId[] = ["todo", "progress", "done"];

    if (columns.includes(over.id as ColumnId)) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === active.id
            ? { ...task, column: over.id as ColumnId }
            : task,
        ),
      );
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      <div className="input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="board">
          <Column
            id="todo"
            title="To Do"
            tasks={tasks.filter((t) => t.column === "todo")}
          />
          <Column
            id="progress"
            title="In Progress"
            tasks={tasks.filter((t) => t.column === "progress")}
          />
          <Column
            id="done"
            title="Done"
            tasks={tasks.filter((t) => t.column === "done")}
          />
        </div>
      </DndContext>
    </div>
  );
}

export default App;
