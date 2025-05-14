import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSave, FaTimes } from 'react-icons/fa';
import ApiService from '../services/api';

const RegistroCliente = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        documento: '',
        tipoDocumento: 'DNI',
        email: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
        observaciones: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await ApiService.post('/clientes', formData);
            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                setError('Error al registrar el cliente');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaUser className="text-primary-600" />
                            Registro de Cliente
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo de Documento
                                </label>
                                <select
                                    name="tipoDocumento"
                                    value={formData.tipoDocumento}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="DNI">DNI</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                    <option value="Cédula">Cédula</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Número de Documento
                                </label>
                                <input
                                    type="text"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    name="fechaNacimiento"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Observaciones
                            </label>
                            <textarea
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                rows="3"
                                className="input-field"
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                <FaSave />
                                {loading ? 'Guardando...' : 'Guardar Cliente'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegistroCliente; 