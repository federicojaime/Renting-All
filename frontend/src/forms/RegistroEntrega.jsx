import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaUser, FaSave, FaTimes } from 'react-icons/fa';
import ApiService from '../services/api';

const RegistroEntrega = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        clienteId: '',
        vehiculoId: '',
        fechaEntrega: '',
        fechaDevolucion: '',
        lugarEntrega: '',
        lugarDevolucion: '',
        kilometrajeEntrega: '',
        kilometrajeDevolucion: '',
        nivelCombustible: '',
        funcionarioEntrega: '',
        funcionarioRecibe: '',
        observaciones: ''
    });

    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesRes, vehiculosRes] = await Promise.all([
                    ApiService.get('/clientes'),
                    ApiService.get('/vehiculos')
                ]);

                if (clientesRes.ok && vehiculosRes.ok) {
                    setClientes(clientesRes.data);
                    setVehiculos(vehiculosRes.data.filter(v => v.estado === 'disponible'));
                }
            } catch (error) {
                setError('Error al cargar los datos');
            }
        };

        fetchData();
    }, []);

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
            const response = await ApiService.post('/entregas', formData);
            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                setError('Error al registrar la entrega');
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
                            Registro de Entrega
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
                                    Cliente
                                </label>
                                <select
                                    name="clienteId"
                                    value={formData.clienteId}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.nombre} {cliente.apellido} - {cliente.documento}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Vehículo
                                </label>
                                <select
                                    name="vehiculoId"
                                    value={formData.vehiculoId}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="">Seleccionar vehículo</option>
                                    {vehiculos.map(vehiculo => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha de Entrega
                                </label>
                                <input
                                    type="datetime-local"
                                    name="fechaEntrega"
                                    value={formData.fechaEntrega}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha de Devolución
                                </label>
                                <input
                                    type="datetime-local"
                                    name="fechaDevolucion"
                                    value={formData.fechaDevolucion}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Lugar de Entrega
                                </label>
                                <input
                                    type="text"
                                    name="lugarEntrega"
                                    value={formData.lugarEntrega}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Lugar de Devolución
                                </label>
                                <input
                                    type="text"
                                    name="lugarDevolucion"
                                    value={formData.lugarDevolucion}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Kilometraje de Entrega
                                </label>
                                <input
                                    type="number"
                                    name="kilometrajeEntrega"
                                    value={formData.kilometrajeEntrega}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nivel de Combustible
                                </label>
                                <select
                                    name="nivelCombustible"
                                    value={formData.nivelCombustible}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                >
                                    <option value="">Seleccionar nivel</option>
                                    <option value="1/4">1/4</option>
                                    <option value="1/2">1/2</option>
                                    <option value="3/4">3/4</option>
                                    <option value="Lleno">Lleno</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Funcionario que Entrega
                                </label>
                                <input
                                    type="text"
                                    name="funcionarioEntrega"
                                    value={formData.funcionarioEntrega}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Funcionario que Recibe
                                </label>
                                <input
                                    type="text"
                                    name="funcionarioRecibe"
                                    value={formData.funcionarioRecibe}
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
                                {loading ? 'Guardando...' : 'Guardar Entrega'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegistroEntrega;