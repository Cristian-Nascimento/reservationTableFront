// src/components/AddTablePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTablePage.css';

const AddTablePage = () => {
    const [tableNumber, setTableNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://reservationtableapi.onrender.com//tables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableNumber: parseInt(tableNumber, 10),
                }),
            });

            if (response.ok) {
                alert('Mesa adicionada com sucesso!');
                setTableNumber('');
                navigate('/');
            } else {
                const errorText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(errorText, 'text/html');
                const preText = doc.querySelector('pre')?.textContent || '';
                const match = /Mesa \d+ Já existe/.exec(preText);
                const errorMessage = match ? match[0] : 'Erro desconhecido';
                alert(`Erro ao adicionar mesa: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar mesa:', error);
            alert('Erro ao adicionar mesa. Por favor, tente novamente mais tarde.');
        }
    };

    const handleTableNumberChange = (e) => {
        const value = e.target.value;
        // Only allow numbers
        if (/^\d*$/.test(value)) {
            setTableNumber(value);
        }
    };

    return (
        <div className="add-table-page">
            <div className="modals-container">
                <div className="modal-container">
                    <div className="modal-header">
                        <h2>Cadastrar Mesa</h2>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Número da Mesa:
                                <input
                                    type="text"
                                    value={tableNumber}
                                    onChange={handleTableNumberChange}
                                    required
                                    placeholder="Digite o número da mesa"
                                />
                            </label>
                            <button type="submit">Adicionar Mesa</button>
                            <div className="buttons-container">
                                <button className="back-button" onClick={() => navigate('/')}>Voltar para a Tela Inicial</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTablePage;
