import type { Todo } from "../types";

interface Props {
  todo: Todo;
  index: number;
  moveTodo: (from: number, to: number) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

function TodoItem({ todo, index, moveTodo, toggleTodo, deleteTodo }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    const fromIndex = Number(e.dataTransfer.getData("index"));
    moveTodo(fromIndex, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="todo"
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={(e) => e.currentTarget.classList.add("drag-over")}
      onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
    >
      <span
        onClick={() => toggleTodo(todo.id)}
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer",
        }}
      >
        {todo.text}
      </span>

      <button onClick={() => deleteTodo(todo.id)}>❌</button>
    </div>
  );
}

export default TodoItem;
