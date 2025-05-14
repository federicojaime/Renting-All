// src/constants/navItems.js
/**
 * Elementos de navegación para el sidebar
 * Cada elemento contiene nombre, icono y ruta
 */
import {
    FaCar, FaUsers, FaClipboardList, FaCog
} from 'react-icons/fa';
import {
    MdDashboard, MdHelp
} from 'react-icons/md';
import {
    IoHelpCircle
} from 'react-icons/io5';
import {
    HiCurrencyDollar, HiChartBar
} from 'react-icons/hi';

export const navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { name: 'Vehículos', icon: FaCar, path: '/vehicles' },
    { name: 'Clientes', icon: FaUsers, path: '/clients' },
    { name: 'Entregas', icon: FaClipboardList, path: '/deliveries' },
    { name: 'Finanzas', icon: HiCurrencyDollar, path: '/finances' },
    { name: 'Reportes', icon: HiChartBar, path: '/reports' },
    { name: 'Configuración', icon: FaCog, path: '/settings' },
    { name: 'Ayuda', icon: IoHelpCircle, path: '/help' },
];

// Configuración de las tarjetas de acción rápida
import { IoCarSport, IoPersonAdd, IoReceiptOutline } from 'react-icons/io5';
import { HiOutlineDocumentReport } from 'react-icons/hi';

export const actionCards = [
    {
        title: 'Registrar Vehículo',
        icon: IoCarSport,
        color: 'primary.500',
        bgColor: 'primary.50',
        description: 'Añade un nuevo vehículo al sistema.',
        form: 'vehicle'
    },
    {
        title: 'Registrar Cliente',
        icon: IoPersonAdd,
        color: 'success.500',
        bgColor: 'success.50',
        description: 'Registra un nuevo cliente en la base de datos.',
        form: 'client'
    },
    {
        title: 'Registro de Entrega',
        icon: HiOutlineDocumentReport,
        color: 'secondary.500',
        bgColor: 'secondary.50',
        description: 'Crea un nuevo registro de entrega.',
        form: 'delivery'
    },
    {
        title: 'Registrar Facturas',
        icon: IoReceiptOutline,
        color: 'warning.500',
        bgColor: 'warning.50',
        description: 'Gestiona las facturas y pagos de los vehículos.',
        form: 'facturas'
    },
];