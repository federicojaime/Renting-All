// src/components/charts/BarChart.jsx
import React from 'react';
import {
    Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button, Flex
} from '@chakra-ui/react';
import {
    BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { FaEllipsisV, FaDownload, FaFilter } from 'react-icons/fa';
import { HiChartBar } from 'react-icons/hi';
import { THEME_COLORS } from '../../constants/theme';

/**
 * Componente de gráfico de barras
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para el gráfico
 * @param {string} props.title - Título del gráfico
 * @param {string} props.dataKey - Clave de datos a graficar
 * @param {Function} props.onExport - Función para exportar datos
 * @param {string} props.tooltipLabel - Etiqueta para el tooltip
 * @param {string} props.formatValue - Función para formatear valores
 * @param {Object} props.colorStyles - Estilos de colores (opcionales)
 * @returns {JSX.Element} Componente BarChart
 */
const BarChartComponent = ({
    data,
    title = 'Ingresos Mensuales',
    dataKey = 'ingresos',
    onExport,
    tooltipLabel = 'Ingresos',
    formatValue = (value) => `$${value.toLocaleString()}`,
    colorStyles
}) => {
    // Usar estilos por defecto o los personalizados
    const styles = {
        cardBgColor: colorStyles?.cardBgColor || 'white',
        textColor: colorStyles?.textColor || 'gray.600',
        borderColor: colorStyles?.borderColor || 'gray.200',
        headingColor: colorStyles?.headingColor || 'gray.800',
        chartColor: colorStyles?.chartColor || THEME_COLORS.warning[500]
    };

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">{title}</Heading>
                <Menu>
                    <MenuButton as={Button} variant="ghost" size="sm">
                        <FaEllipsisV />
                    </MenuButton>
                    <MenuList>
                        <MenuItem icon={<FaDownload />} onClick={onExport}>Exportar datos</MenuItem>
                        <MenuItem icon={<FaFilter />}>Filtrar</MenuItem>
                        <MenuItem icon={<HiChartBar />}>Ver detalles</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            <Box height="300px" width="100%">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={styles.borderColor} />
                        <XAxis dataKey="name" stroke={styles.textColor} />
                        <YAxis stroke={styles.textColor} />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: styles.cardBgColor,
                                borderColor: styles.borderColor,
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                            formatter={(value) => [formatValue(value), tooltipLabel]}
                        />
                        <Bar
                            dataKey={dataKey}
                            fill={styles.chartColor}
                            radius={[4, 4, 0, 0]} // Bordes redondeados en la parte superior
                            barSize={30}
                        />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default BarChartComponent;