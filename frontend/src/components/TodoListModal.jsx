import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { GripHorizontal, X } from "lucide-react";

import "./TodoList.css";

const TodoListModal = ({
  showModal,
  handleCloseModal,
  addTask,
  housemates,
  isEdit,
  editTask,
  editAssignedTo,
}) => {
  const [task, setTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (isEdit) {
      setTask(editTask);
      setAssignedTo(editAssignedTo);
    }
  }, [isEdit, editTask, editAssignedTo]);

  const submitTask = (e) => {
    e.preventDefault();
    addTask(task, assignedTo); // This will now handle both add and edit
    setTask("");
    setAssignedTo("");
    handleCloseModal();
  };

  const handleCancel = () => {
    setTask("");
    setAssignedTo("");
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      contentLabel="Add Task"
      className="modal-content z-[999] bg-black bg-opacity-55 h-screen w-full fixed left-0 top-0 flex justify-center items-center"
      overlayClassName="modal-overlay"
    >
      <form
        onSubmit={submitTask}
        className="modal-form bg-white dark:bg-neutral-900 rounded-lg shadow-2xl "
      >
        <header className=" bg-gray-100 dark:bg-neutral-800 px-4 py-2 flex justify-between items-center">
          <GripHorizontal className=" text-gray-400"></GripHorizontal>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              className="bg-transparent border-none hover:border-none "
              onClick={handleCloseModal}
            >
              <X
                className="text-gray-400 cursor-pointer hover:text-red-600"
                onClick={handleCancel}
              ></X>
            </button>
          </div>
        </header>
        <div className="p-2">
          {" "}
          <input
            autoFocus
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="task-input bg-white dark:bg-neutral-900 border-0 text-black dark:text-white text-xl font-semibold p-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
            placeholder="Enter new task"
            required
          />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="assignee-dropdown bg-neutral-800 text-white hover:bg-neutral-900 hover:cursor-pointer focus:text-white"
          >
            <option className="text-white" value="">
              Assign to...
            </option>
            {housemates.map((housemate, index) => (
              <option
                className="text-white focus:text-white"
                key={index}
                value={housemate}
              >
                {housemate}
              </option>
            ))}
          </select>
        </div>

        <footer className="flex flex-row justify-between items-center border-t p-3 pl-5 mt-5">
          <div></div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            {isEdit ? "Save Changes" : "Add Task"}{" "}
            {/* Update button text based on add/edit mode */}
          </button>
        </footer>
      </form>
    </Modal>
  );
};

export default TodoListModal;
