import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

function TodoList({ socket }) {

  const navigate = useNavigate();

  const LogOut = () => {
      localStorage.removeItem("sessionId");
      navigate("/");
  };

  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([]); 
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
      // Listening for tasks updates from the server
      socket.on('tasksChange', (data) => {
          console.log("I am changing!");
          console.log(tasks);
          console.log(data.tasks.tasks);
          setTasks(data.tasks);
      });

      // Clean up the listener when the component unmounts
      return () => {
          socket.off('tasksChange');
      };
  }, [socket]); // Empty dependency array means this will run once on mount

  const handleAddTask = (e) => {
      e.preventDefault();
      console.log("I am being called");
      // Emit the new task to the server
      socket.emit("createTask", {
          task: todo,
          completed: false,
      });          
      setTodo("");
  };

  const handleDeleteTask = (task) => {
      // Emit the delete task event to the server
      socket.emit("deleteTask", { id : task._id });
      setTasks(currentTasks => currentTasks.filter(task => task.id !== task._id));
  };

const startEditing = (task) => {
  setIsEditing(task._id);
  setEditText(task.task);
};

const handleEditChange = (e) => {
  setEditText(e.target.value);
};

const submitEdit = (e, taskId) => {
  e.preventDefault();
  // Emit the updated task to the server
  socket.emit("modifyTask", {
    _id: taskId,
    task: editText,
    completed: false, // or the current status of the task
  });
  setIsEditing(null);
  setEditText("");
};

  return (
      <div>
          <Nav />
          <form className="form" onSubmit={handleAddTask}>
              <input
                  autoFocus
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className="input"
                  placeholder="Enter new task"
                  required
              />
              <button className="form__cta">Add Task</button>
          </form>
          <div className="todo__container">
          {tasks.map((taskItem) => (
        <div key={taskItem._id} className="todo__item">
          {isEditing === taskItem._id ? (
            <form onSubmit={(e) => submitEdit(e, taskItem._id)}>
              <input autoFocus value={editText} onChange={handleEditChange} />
              <button type="submit">Save</button>
              <button onClick={() => setIsEditing(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <p>{taskItem.task}</p>
              <div>
                <button className="commentsBtn" onClick={() => startEditing(taskItem)}>Edit</button>
                <button className="deleteBtn" onClick={() => handleDeleteTask(taskItem)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
          </div>
          <button onClick={LogOut}>Log Out</button>
          <button><Link to="/dashboard" className="text-white dark:text-white hover:underline">Dashboard</Link></button>
      </div>
      
  );
}
export default TodoList;