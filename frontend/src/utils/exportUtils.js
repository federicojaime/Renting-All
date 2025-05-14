// src/utils/exportUtils.js
import * as XLSX from 'xlsx';

/**
 * Función para exportar datos a Excel
 * 
 * @param {Array} data - Array de objetos para exportar
 * @param {string} filename - Nombre del archivo sin extensión
 * @param {Object} headers - Mapeo de claves de objeto a nombres de columna
 * @param {Function} onSuccess - Callback al terminar con éxito
 * @param {Function} onError - Callback en caso de error
 */
export const exportToExcel = (data, filename, headers, onSuccess, onError) => {
    try {
        // Formatear los datos según el mapeo de headers
        const formattedData = data.map(item => {
            const newItem = {};
            Object.keys(headers).forEach(key => {
                newItem[headers[key]] = item[key];
            });
            return newItem;
        });

        // Crear un nuevo libro de Excel
        const wb = XLSX.utils.book_new();

        // Crear hoja con los datos formateados
        const ws = XLSX.utils.json_to_sheet(formattedData, {
            header: Object.values(headers)
        });

        // Ajustar el ancho de las columnas
        const columnWidths = Object.values(headers).map(header => ({
            wch: Math.max(header.length, 15)
        }));
        ws['!cols'] = columnWidths;

        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Datos');

        // Guardar el archivo
        XLSX.writeFile(wb, `${filename}.xlsx`);

        // Notificar éxito
        if (onSuccess) {
            onSuccess('El archivo Excel ha sido descargado.');
        }
    } catch (error) {
        console.error('Error al exportar a Excel:', error);

        // Notificar error
        if (onError) {
            onError('Hubo un problema al exportar los datos.');
        }
    }
};

/**
 * Opciones de formato para exportación
 */
export const exportFormats = {
    entregas: {
        filename: 'registro_entregas',
        headers: {
            cliente: 'Nombre del Cliente',
            fechaEntrega: 'Fecha de Entrega',
            ubicacion: 'Ubicación',
            documento: 'Documento',
            vehiculo: 'Vehículo Asignado',
            estado: 'Estado',
            funcionarioEntrega: 'Responsable Entrega'
        }
    },
    vehiculos: {
        filename: 'flota_vehiculos',
        headers: {
            id: 'ID',
            marca: 'Marca',
            modelo: 'Modelo',
            patente: 'Patente',
            estado: 'Estado',
            responsable: 'Responsable',
            tipo: 'Tipo de Vehículo',
            kilometraje: 'Kilometraje',
            ultimoMantenimiento: 'Último Mantenimiento'
        }
    },
    clientes: {
        filename: 'lista_clientes',
        headers: {
            nombre: 'Nombre',
            documento: 'Documento',
            email: 'Email',
            telefono: 'Teléfono',
            direccion: 'Dirección',
            tipoCliente: 'Tipo de Cliente'
        }
    }
};