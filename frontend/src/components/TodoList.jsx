import { useState, useEffect } from "react";
import Nav from "./Nav";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

function TodoList({ socket }) {

    const navigate = useNavigate();

    const LogOut = () => {
        localStorage.removeItem("sessionId");
        navigate("/");
    };

    const [todo, setTodo] = useState("");
    const [tasks, setTasks] = useState([]); // You'll need state to store your tasks

    // This useEffect hook will run once on component mount to set up the socket listeners
    useEffect(() => {

    const token = localStorage.getItem("sessionId");
    const decodedToken = jwtDecode(token);

    // Access the houseID from the token payload
    const houseID = decodedToken.user.houseID;
    // console.log('house id is ' + houseID);
    // console.log('token is ' + token);

        // Listening for tasks updates from the server
        socket.on('tasksChange', (data) => {
            console.log("I am changing!");
            console.log(tasks);
            console.log(data.tasks.tasks);
            setTasks(data.tasks.tasks);
            console.log(data.tasks) // Update the local state with the new tasks
        });

        // Send an event to join the room using the stored houseID when component mounts
        // Ideally, the houseID should be passed down as a prop to this component
        // or retrieved from a global state/store or secure storage.
        socket.emit('requestTask');

        // Clean up the listener when the component unmounts
        return () => {
            socket.off('tasksChange');
        };
    }, [socket]); // Empty dependency array means this will run once on mount

    const handleAddTodo = (e) => {
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
        // You may want to optimistically remove the task from the state as well
        setTasks(currentTasks => currentTasks.filter(task => task.id !== task._id));
    };
    return (
        <div>
            <Nav />
            <form className="form" onSubmit={handleAddTodo}>
                <input
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    className="input"
                    placeholder="Enter new task"
                    required
                />
                <button className="form__cta">Add Todo</button>
            </form>
            <div className="todo__container">
                {/* Render the list of tasks */}
                {tasks.map((taskItem) => (
                    <div key={taskItem._id} className="todo__item">
                        <p>{taskItem.task}</p>
                        <div>
                            {/* Implement the functionality for viewing comments */}
                            <button className="commentsBtn">View Comments</button>
                            {/* Implement the functionality for deleting a task */}
                            <button className="deleteBtn" onClick={() => handleDeleteTask(taskItem)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={LogOut}>Log Out</button>
            <button><Link to="/dashboard" className="text-white dark:text-white hover:underline">Dashboard</Link></button>
        </div>
        
    );
}
export default TodoList;