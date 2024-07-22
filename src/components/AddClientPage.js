import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddClientPage.css';

const AddClientPage = () => {
    const [clientName, setClientName] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [hourReservation, setHourReservation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tables, setTables] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Função para buscar mesas disponíveis
        const fetchTables = async () => {
            try {
                const response = await fetch('http://localhost:9000/tables');
                const data = await response.json();
                const uniqueTables = data.filter((table, index, self) =>
                    index === self.findIndex((t) => t.tableNumber === table.tableNumber)
                );
                const sortedTables = uniqueTables.sort((a, b) => a.tableNumber - b.tableNumber);
                setTables(sortedTables);
            } catch (error) {
                console.error('Erro ao buscar mesas:', error);
                alert('Erro ao buscar mesas. Por favor, tente novamente mais tarde.');
            }
        };

        fetchTables();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9000/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: clientName,
                    tableNumber: parseInt(tableNumber, 10),
                    phoneNumber: phoneNumber,
                    hourReservation,
                }),
            });

            if (response.ok) {
                alert('Cliente adicionado com sucesso!');
                navigate('/');
            } else {
                const errorText = await response.text();
                alert(`Erro ao adicionar cliente: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            alert('Erro ao adicionar cliente. Por favor, tente novamente mais tarde.');
        }
    };

    return (
        <div className="add-client-page">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Cadastrar Cliente</h2>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nome do Cliente:
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Exemplo: Cristian"
                                required
                            />
                        </label>
                        <label>
                            Telefone do Cliente:
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Exemplo: 81999999999"
                                required
                            />
                        </label>
                        <label>
                            Número da Mesa:
                            <select
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma mesa</option>
                                {tables.map((table) => (
                                    <option key={table.tableNumber} value={table.tableNumber}>
                                        Mesa {table.tableNumber}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Horário da Reserva:
                            <input
                                type="datetime-local"
                                value={hourReservation}
                                onChange={(e) => setHourReservation(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Adicionar Cliente</button>
                        <button type="button" onClick={() => navigate('/')}>Voltar para a Tela Inicial</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddClientPage;
