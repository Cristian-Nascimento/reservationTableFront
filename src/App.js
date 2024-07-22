// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AddClientPage from './components/AddClientPage';
import AddTablePage from './components/AddTablePage';
import './App.css';

const App = () => {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'

    const showAlert = (message, type) => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage('');
            setAlertType('');
        }, 1000); // Mostrar alerta por 1 segundo
    };

    return (
        <Router>
            <div className="App">
                {alertMessage && (
                    <div className={`alert ${alertType}`}>
                        {alertMessage}
                    </div>
                )}
                <Routes>
                    <Route path="/" element={<HomePage showAlert={showAlert} />} />
                    <Route path="/add-client" element={<AddClientPage showAlert={showAlert} />} />
                    <Route path="/add-table" element={<AddTablePage showAlert={showAlert} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
