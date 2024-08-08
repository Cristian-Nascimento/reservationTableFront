import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import RemoveTableModal from './RemoveTableModal';
import EditTableModal from './EditTableModal';
import logo from '../images/logo.jpg';

const HomePage = ({ showAlert }) => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [modalType, setModalType] = useState(null);
    const navigate = useNavigate();

    const fetchAvailableTables = useCallback(async () => {
        try {
            const response = await fetch('https://reservationtableapi.onrender.com//tables');
            const data = await response.json();

            // Ordena as mesas pelo tableNumber em ordem crescente
            const sortedTables = data.sort((a, b) => a.tableNumber - b.tableNumber);

            setTables(sortedTables);
        } catch (error) {
            console.error('Erro ao buscar mesas disponíveis:', error);
            showAlert('Erro ao buscar mesas disponíveis', 'error');
        }
    }, [showAlert]);

    useEffect(() => {
        fetchAvailableTables();
    }, [fetchAvailableTables]);

    const handleEdit = (table) => {
        setSelectedTable(table);
        setModalType('edit');
    };

    const handleDelete = (table) => {
        setSelectedTable(table);
        setModalType('remove');
    };

    const handleModalClose = () => {
        setSelectedTable(null);
        setModalType(null);
    };

    const handleDeleteConfirm = async () => {
        if (selectedTable) {
            try {
                const response = await fetch(`https://reservationtableapi.onrender.com//tables/${selectedTable.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    showAlert('Mesa removida com sucesso!', 'success');
                    fetchAvailableTables();
                    handleModalClose();
                } else {
                    const errorText = await response.text();
                    showAlert(`Erro ao remover mesa: ${errorText}`, 'error');
                }
            } catch (error) {
                console.error('Erro ao remover mesa:', error);
                showAlert('Erro ao remover mesa', 'error');
            }
        }
    };

    const handleEditSave = async (updatedTable) => {
        if (updatedTable) {
            try {
                const response = await fetch(`https://reservationtableapi.onrender.com//tables/${updatedTable.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTable),
                });

                if (response.ok) {
                    showAlert('Mesa atualizada com sucesso!', 'success');
                    fetchAvailableTables();
                    handleModalClose();
                } else {
                    const errorText = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(errorText, 'text/html');
                    const preText = doc.querySelector('pre')?.textContent || '';
                    const match = /Já existe uma reserva para esta mesa dentro de um intervalo de ±1 hora./.exec(preText);
                    const errorMessage = match[0]
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Erro ao atualizar mesa:', error);
                showAlert('Erro ao atualizar mesa', 'error');
            }
        }
    };

    // Agrupando mesas por número de mesa
    const groupedTables = tables.reduce((acc, table) => {
        if (!acc[table.tableNumber]) {
            acc[table.tableNumber] = [];
        }
        acc[table.tableNumber].push(table);
        return acc;
    }, {});

    return (
        <div className="home-page">
            <img src={logo} alt="Logo do Restaurante" className="restaurant-logo" />
            <h1>Gerenciamento de reserva de mesa Realfit</h1>
            <div className="buttons-container">
                <button className="reserve-button" onClick={() => navigate('/add-client')}>
                    Reservar Mesa
                </button>
                <button className="add-table-button" onClick={() => navigate('/add-table')}>
                    Cadastrar Mesa
                </button>
            </div>
            <div className="table-list">
                <h2>Mesas Disponíveis</h2>
                {Object.keys(groupedTables).map(tableNumber => (
                    <div key={tableNumber} className="table-group">
                        <h3>Mesa {tableNumber}</h3>
                        <ul>
                            {groupedTables[tableNumber].map(table => (
                                <li key={table.id} className="table-list-item">
                                    <div className="table-info">
                                        {table.client && <div>Cliente: {table.client}</div>}
                                        {table.hourReservation && <div>Horário: {new Date(table.hourReservation).toLocaleString('pt-BR')}</div>}
                                    </div>
                                    <div className="icon-container">
                                        <div className="edit-icon" onClick={() => handleEdit(table)}>✎</div>
                                        <div className="delete-icon" onClick={() => handleDelete(table)}>🗑</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {modalType === 'remove' && selectedTable && (
                <RemoveTableModal
                    tableNumber={selectedTable.tableNumber}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleModalClose}
                />
            )}
            {modalType === 'edit' && selectedTable && (
                <EditTableModal
                    table={selectedTable}
                    onSave={handleEditSave}
                    onCancel={handleModalClose}
                />
            )}
        </div>
    );
};

export default HomePage;
