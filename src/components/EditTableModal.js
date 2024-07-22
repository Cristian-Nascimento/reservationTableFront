import React, { useState } from 'react';
import './EditTableModal.css'; // Certifique-se de que este arquivo CSS esteja incluído

const EditTableModal = ({ table, onSave, onCancel }) => {
    const [updatedTable, setUpdatedTable] = useState(table);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTable(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(updatedTable);
    };

    // Função para converter uma data em formato UTC para o formato ISO aceito por datetime-local
    const formatDateForInput = (date) => {
        if (!date) return '';
        const utcDate = new Date(date);
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <div className="modal open">
            <div className="modal-header">
                <span className="modal-close" onClick={onCancel}>×</span>
                <h2>Editar Mesa {table.tableNumber}</h2>
            </div>
            <div className="modal-body">
                <label>
                    Cliente:
                    <input
                        type="text"
                        name="client"
                        value={updatedTable.client || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Horário de Reserva:
                    <input
                        type="datetime-local"
                        name="hourReservation"
                        value={formatDateForInput(updatedTable.hourReservation)}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="modal-footer">
                <button className="modal-button" onClick={onCancel}>Cancelar</button>
                <button className="modal-button" onClick={handleSave}>Salvar</button>
            </div>
        </div>
    );
};

export default EditTableModal;
