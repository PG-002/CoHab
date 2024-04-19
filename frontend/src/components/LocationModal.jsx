import React from 'react';
import ReactDOM from 'react-dom';


const modalRoot = document.getElementById('modal-root'); // Ensure there's a div with this id in your public/index.html

const LocationModal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-btn">Close</button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default LocationModal;
