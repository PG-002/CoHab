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
  const [showCompleted, setShowCompleted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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


  const checkScreenSize = () => {
    if (window.innerWidth < 600)
      setIsMobile(true);
    else
      setIsMobile(false);
  };

  useEffect(() => {
    window.addEventListener('resize', checkScreenSize);

    checkScreenSize();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Function to toggle completed tasks view
  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleCompleteTask = (task) => {
    socket.emit("modifyTask", {
      ...task,
      completed : true
    });
  };
  

  useEffect(() => {
    if (socket) {
      socket.on("tasksChange", (data) => {
        setTasks(data.tasks);
      });
    }
  }, [socket]);

  const handleAddTask = (e) => {
    e.preventDefault();

    socket.emit("createTask", {
      task: todo,
      completed: false,
      assignedTo: assignedTo
    });
    setTodo("");
    setAssignedTo("");
  };

  const handleDeleteTask = (task) => {
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
    socket.emit("modifyTask", {
      _id: taskId,
      task: editText,
      completed: false,
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
      <form className="form" onSubmit={handleAddTask}>
        <input
          autoFocus
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="input"
          placeholder="Enter new task"
          required
        />
        <Dropdown className="dropdown" label={assignedTo || "Assign to..."} inline={true}>
        {housemates.map((housemate, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelectHousemate(housemate)}>
            {housemate}
          </Dropdown.Item>
        ))}
      </Dropdown>
        <button className="form__cta input">Add</button>
      </form>
      {
      isMobile ? (
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={toggleShowCompleted}
          />
          <span className="switch-slider">
            <span className="switch-label switch-label-off">Incomplete</span>
            <span className="switch-label switch-label-on">Complete</span>
          </span>
        </label>
      ) : (
        <div className="todo__header-switch">
          <div 
            className={`header-tab incomplete ${!showCompleted ? 'active' : ''}`}
            onClick={() => setShowCompleted(false)}
          >
            Incomplete
          </div>
          <div 
            className={`header-tab complete ${showCompleted ? 'active' : ''}`}
            onClick={() => setShowCompleted(true)}
          >
            Complete
          </div>
        </div>
      )
    }
      {/* <label className="toggle-switch">
        <input
        type="checkbox"
        checked={showCompleted}
        onChange={toggleShowCompleted}
        />
      <span className="switch-slider">
      <span className="switch-label switch-label-off">Incomplete</span>
      <span className="switch-label switch-label-on">Complete</span>
      </span>
      </label> */}
      <div className="todo__container" style= {{'paddingBottom': '0px'}}>
        <div className="todo__header todo__item">
          <span className="">Created</span>
          <span >Task</span>
          <span>Assignee</span>
          <span>Actions</span>
        </div>
      </div>
      <div className="todo__container_tasks">
  {tasks.filter(task => task.completed === showCompleted).map((taskItem) => (
    <div key={taskItem._id} className={`todo__item ${taskItem.completed ? "completed-task" : ""}`}>
      {isEditing === taskItem._id ? (
        <form onSubmit={(e) => submitEdit(e, taskItem._id)}>
          <input
            style={{'backgroundColor': '#222222', 'width': '200px'}}
            autoFocus
            value={editText}
            onChange={handleEditChange}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(null)}>Cancel</button>
        </form>
      ) : (
        <>
          <div className="todo__section">{taskItem.createdBy}</div>
          <div className="todo__section">{taskItem.task}</div>
          <div className="todo__section">{taskItem.assignedTo}</div>
          <div className="todo__actions">
            {!taskItem.completed && (
              <>
                <button
                  className="doneBtn"
                  onClick={() => handleCompleteTask(taskItem)}
                >
                  Done
                </button>
                <button
                  className="commentsBtn"
                  onClick={() => startEditing(taskItem)}
                >
                  Edit
                </button>
              </>
            )}
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
