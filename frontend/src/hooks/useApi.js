// src/hooks/useApi.js
import { useState, useCallback, useEffect } from 'react';
import ApiService from '../services/api';

/**
 * Hook personalizado para llamadas a la API
 * 
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones para la petición
 * @returns {Object} Estados y funciones para realizar peticiones
 */
const useApi = (endpoint, options = {}) => {
    const {
        initialData = null,
        autoFetch = true,
        formatResponse,
        deps = []
    } = options;

    // Estados
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(autoFetch);
    const [error, setError] = useState(null);

    /**
     * Función para realizar la petición a la API
     * @param {Object} params - Parámetros para la petición
     * @returns {Promise} - Resultado de la petición
     */
    const fetchData = useCallback(async (params = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ApiService.get(endpoint);

            if (response.ok) {
                const formattedData = formatResponse
                    ? formatResponse(response.data)
                    : response.data;

                setData(formattedData);
                setIsLoading(false);
                return { success: true, data: formattedData };
            } else {
                throw new Error(response.msg || 'Error en la petición');
            }
        } catch (err) {
            setError(err.message || 'Error desconocido');
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    }, [endpoint, formatResponse]);

    /**
     * Función para crear un nuevo recurso
     * @param {Object} newData - Datos a enviar
     * @returns {Promise} - Resultado de la petición
     */
    const createResource = useCallback(async (newData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ApiService.post(endpoint, newData);

            if (response.ok) {
                // Re-obtener datos actualizados
                await fetchData();
                return { success: true, data: response.data };
            } else {
                throw new Error(response.msg || 'Error al crear el recurso');
            }
        } catch (err) {
            setError(err.message || 'Error desconocido');
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    }, [endpoint, fetchData]);

    /**
     * Función para actualizar un recurso existente
     * @param {string|number} id - ID del recurso
     * @param {Object} updatedData - Datos actualizados
     * @returns {Promise} - Resultado de la petición
     */
    const updateResource = useCallback(async (id, updatedData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ApiService.patch(`${endpoint}/${id}`, updatedData);

            if (response.ok) {
                // Re-obtener datos actualizados
                await fetchData();
                return { success: true, data: response.data };
            } else {
                throw new Error(response.msg || 'Error al actualizar el recurso');
            }
        } catch (err) {
            setError(err.message || 'Error desconocido');
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    }, [endpoint, fetchData]);

    /**
     * Función para eliminar un recurso
     * @param {string|number} id - ID del recurso
     * @returns {Promise} - Resultado de la petición
     */
    const deleteResource = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ApiService.delete(`${endpoint}/${id}`);

            if (response.ok) {
                // Re-obtener datos actualizados
                await fetchData();
                return { success: true };
            } else {
                throw new Error(response.msg || 'Error al eliminar el recurso');
            }
        } catch (err) {
            setError(err.message || 'Error desconocido');
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    }, [endpoint, fetchData]);

    // Cargar datos automáticamente si autoFetch es true
    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [fetchData, autoFetch, ...deps]);

    return {
        data,
        isLoading,
        error,
        fetchData,
        createResource,
        updateResource,
        deleteResource,
        setData
    };
};

export default useApi;