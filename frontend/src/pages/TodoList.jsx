import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import '../components/TodoList.css';
import { Dropdown } from "flowbite-react";


function TodoList({ socket }) {
  const navigate = useNavigate();

  const [housemates, setHousemates] = useState([]);
  let [assignedTo, setAssignedTo] = useState("");
  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const sessionId = localStorage.getItem("sessionId");
  
      if (!sessionId) {
        navigate("/login"); // Redirect to login if no session
        return;
      }
  
      try {
        const decodedToken = jwtDecode(sessionId);
        const userId = decodedToken.userId;
  
        const response = await fetch(
          "https://cohab-4fcf8ee594c1.herokuapp.com/api/users/getHouse",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
  
        const data = await response.json();
        
        if (data.token) {
          const houseData = jwtDecode(data.token); // Decode the house data from the token
          setTasks(houseData.house.tasks);
          setHousemates(houseData.house.members); // Ensure you are retrieving the right property
        } else {
          console.error("House not found:", data.error);
          navigate("/login"); // Redirect to login or handle error state
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        navigate("/login"); // Redirect to login or handle error
      }
    };
  
    fetchTasks();
  }, [navigate]);
  

  

  useEffect(() => {
    if (socket) {
      socket.on("tasksChange", (data) => {
        setTasks(data.tasks);
      });
    }
  }, [socket]);

  const handleAddTask = (e) => {
    e.preventDefault();
    
    // Emit the new task to the server
    socket.emit("createTask", {
      task: todo,
      completed: false,
      assignedTo: assignedTo
    });
    setTodo("");
    setAssignedTo("");
  };

  const handleDeleteTask = (task) => {
    // Emit the delete task event to the server
    socket.emit("deleteTask", { id: task._id });
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== task._id)
    );
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


  const handleSelectHousemate = (housemate) => {
    setAssignedTo(housemate);
  };

  const handleKeyPressOnDropdown = (event) => {
    if (event.key === 'Enter' && assignedTo && todo) {
      handleAddTask(event);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPressOnDropdown);

    return () => {
      window.removeEventListener('keydown', handleKeyPressOnDropdown);
    };
  }, [assignedTo]); 



  return (
    <div className="todo__container">
      {/* <Nav /> */}
      <form className="form" onSubmit={handleAddTask}>
        <input
          autoFocus
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="input"
          placeholder="Enter new task"
          required
        />
        <Dropdown label={assignedTo || "Assign to..."} inline={true}>
        {housemates.map((housemate, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelectHousemate(housemate)}>
            {housemate}
          </Dropdown.Item>
        ))}
      </Dropdown>
        <button className="form__cta input">Add Task</button>
      </form>
      <div className="todo__container" style= {{'paddingBottom': '0px'}}>
        <div className="todo__header todo__item">
          <span className="">Created</span>
          <span >Task</span>
          <span>Assignee</span>
          <span>Actions</span>
        </div>
      </div>
      <div className="todo__container_tasks">
        {tasks.map((taskItem) => (
          <div key={taskItem._id} className="todo__item">
            {isEditing === taskItem._id ? (
              <form onSubmit={(e) => submitEdit(e, taskItem._id)}>
                <input style={{'background-color' : '#222222', 'width' : '200px'}} autoFocus value={editText} onChange={handleEditChange} />
                <button type="submit">Save</button>
                <button type="submit" onClick={() => setIsEditing(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="todo__section">{taskItem.createdBy}</div>
                <div className="todo__section">{taskItem.task}</div>
                <div className="todo__section">{taskItem.assignedTo}</div>
                <div>
                  <button
                    className="commentsBtn"
                    onClick={() => startEditing(taskItem)}
                  >
                    Edit
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => handleDeleteTask(taskItem)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default TodoList;
