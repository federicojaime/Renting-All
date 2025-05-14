// src/components/charts/PieChart.jsx
import React from 'react';
import {
    Box, Heading
} from '@chakra-ui/react';
import {
    PieChart as RechartsPieChart, Pie, Cell,
    Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { PIE_COLORS } from '../../constants/theme';

/**
 * Componente de gráfico circular
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para el gráfico
 * @param {string} props.title - Título del gráfico
 * @param {string} props.dataKey - Clave de datos a graficar (valor numérico)
 * @param {string} props.nameKey - Clave para nombres de segmentos
 * @param {Array} props.colors - Colores para los segmentos
 * @param {Object} props.colorStyles - Estilos de colores (opcionales)
 * @returns {JSX.Element} Componente PieChart
 */
const PieChartComponent = ({
    data,
    title = 'Distribución de Flota',
    dataKey = 'value',
    nameKey = 'name',
    colors = PIE_COLORS,
    colorStyles
}) => {
    // Usar estilos por defecto o los personalizados
    const styles = {
        cardBgColor: colorStyles?.cardBgColor || 'white',
        borderColor: colorStyles?.borderColor || 'gray.200'
    };

    // Función para generar la etiqueta personalizada del gráfico
    const renderCustomizedLabel = ({ name, percent }) => {
        return `${name} ${(percent * 100).toFixed(0)}%`;
    };

    return (
        <Box>
            <Heading size="md" mb={4}>{title}</Heading>
            <Box height="250px" width="100%">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey={dataKey}
                            nameKey={nameKey}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: styles.cardBgColor,
                                borderColor: styles.borderColor,
                                borderRadius: '8px'
                            }}
                            formatter={(value, name) => [`${value} unidades`, name]}
                        />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default PieChartComponent;