import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaSave, FaTimes } from 'react-icons/fa';
import ApiService from '../services/api';

const RegistroVehiculo = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        anio: '',
        patente: '',
        color: '',
        kilometraje: '',
        estado: 'disponible',
        precio: '',
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
            const response = await ApiService.post('/vehiculos', formData);
            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                setError('Error al registrar el vehículo');
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
                            <FaCar className="text-primary-600" />
                            Registro de Vehículo
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
                                    Marca
                                </label>
                                <input
                                    type="text"
                                    name="marca"
                                    value={formData.marca}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Modelo
                                </label>
                                <input
                                    type="text"
                                    name="modelo"
                                    value={formData.modelo}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Año
                                </label>
                                <input
                                    type="number"
                                    name="anio"
                                    value={formData.anio}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Patente
                                </label>
                                <input
                                    type="text"
                                    name="patente"
                                    value={formData.patente}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Color
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Kilometraje
                                </label>
                                <input
                                    type="number"
                                    name="kilometraje"
                                    value={formData.kilometraje}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Estado
                                </label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="disponible">Disponible</option>
                                    <option value="en_uso">En uso</option>
                                    <option value="mantenimiento">En mantenimiento</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Precio por Día
                                </label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={formData.precio}
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
                                {loading ? 'Guardando...' : 'Guardar Vehículo'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegistroVehiculo; 