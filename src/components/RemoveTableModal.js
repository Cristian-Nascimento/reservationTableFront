import React from 'react';
import './RemoveTableModal.css'; // Certifique-se de que este arquivo CSS esteja incluído

const RemoveTableModal = ({ tableNumber, onConfirm, onCancel }) => {
    return (
        <div className="modal open">
            <div className="modal-header">
                <span className="modal-close" onClick={onCancel}>×</span>
                <h2>Remover Mesa {tableNumber}</h2>
            </div>
            <div className="modal-body">
                <p>Você tem certeza que deseja remover a mesa {tableNumber}?</p>
            </div>
            <div className="modal-footer">
                <button className="modal-button" onClick={onCancel}>Cancelar</button>
                <button className="modal-button" onClick={onConfirm}>Confirmar</button>
            </div>
        </div>
    );
};

export default RemoveTableModal;
