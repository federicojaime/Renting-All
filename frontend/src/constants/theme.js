// src/constants/theme.js
/**
 * Definición de colores para el tema de la aplicación
 * Estos colores son utilizados en toda la aplicación para mantener consistencia
 */
export const THEME_COLORS = {
    primary: {
        50: '#e3f2fd',
        100: '#bbdefb',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
    },
    secondary: {
        50: '#f3e5f5',
        100: '#e1bee7',
        500: '#9c27b0',
        600: '#8e24aa',
        700: '#7b1fa2',
    },
    success: {
        50: '#e8f5e9',
        100: '#c8e6c9',
        500: '#4caf50',
        600: '#43a047',
        700: '#388e3c',
    },
    warning: {
        50: '#fff8e1',
        100: '#ffecb3',
        500: '#ffc107',
        600: '#ffb300',
        700: '#ffa000',
    },
    error: {
        50: '#ffebee',
        100: '#ffcdd2',
        500: '#f44336',
        600: '#e53935',
        700: '#d32f2f',
    },
    neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
    }
};

// Colores para gráficos
export const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

// Datos de ejemplo para gráficos
export const SAMPLE_CHART_DATA = [
    { name: 'Ene', entregas: 12, ingresos: 4000 },
    { name: 'Feb', entregas: 19, ingresos: 5000 },
    { name: 'Mar', entregas: 15, ingresos: 6000 },
    { name: 'Abr', entregas: 27, ingresos: 8700 },
    { name: 'May', entregas: 24, ingresos: 7800 },
    { name: 'Jun', entregas: 35, ingresos: 9800 },
];