import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { useUser } from './UserContext';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState('');

    const { user } = useUser();
    const houseID = user?.houseID;

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await fetch(`/api/houses/${houseID}/tasks`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const tasks = await response.json();
                setTasks(tasks);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        }
        
        fetchTasks();
    }, [houseID]);

    async function addTask(text) {
        const newTask = {
            text,
            completed: false
        };
        
        try {
            const response = await fetch(`/api/houses/${houseID}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // Fetch the updated task list after adding
            await fetchTasks();
            setText('');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function deleteTask(taskId) {
        try {
          const response = await fetch(`/api/houses/${houseID}/tasks/${taskId}`, {
            method: 'DELETE',
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete task');
          }
      
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
          console.error('Error deleting task:', error);
          // Optionally handle the error in the UI, such as displaying a message to the user
        }
      }
      


   return (
    <div className="todo-list">
    {tasks.map(task => (
    <TodoItem
    key={task.id} 
    task={task}
    deleteTask={deleteTask}
    toggleCompleted={toggleCompleted} 
    />
    ))}
   <input
    value={text}
    onChange={e => setText(e.target.value)} 
    />
   <button onClick={() => addTask(text)}>Add</button>
    </div>
    );
   }
   export default TodoList;