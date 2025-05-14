import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Button, Grid, Heading, Icon, Text, Flex, VStack,
    useColorModeValue, Container, useDisclosure, Modal,
    ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
    useToast, Table, Thead, Tbody, Tr, Th, Td, TableCaption,
    Tabs, TabList, TabPanels, Tab, TabPanel, Menu, MenuButton,
    MenuList, MenuItem, InputGroup, InputLeftElement, Input,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader,
    DrawerOverlay, DrawerContent, DrawerCloseButton, Link
} from '@chakra-ui/react';
import {
    FaCar, FaUserPlus, FaClipboardList, FaSignOutAlt,
    FaFileInvoiceDollar, FaFileExport, FaSearch, FaCog,
    FaBell, FaChartLine,FaUserEdit, FaUsers
} from 'react-icons/fa';
import { MdDashboard, MdHelp } from 'react-icons/md';
import RegistroEntrega from '../forms/RegistroEntrega';
import RegistrarVehiculo from '../forms/RegistrarVehiculo';
import RegistrarCliente from '../forms/RegistrarCliente';
import RegistrarFacturas from '../forms/RegistrarFacturas';
import UserTable from '../tables/UserTable';
import UserProfile from './UserProfile';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ApiService from '../services/api';
import LogoCodeo from '../assets/icon.png';
import Logo from "../assets/logo-horizontal.png";
import * as XLSX from 'xlsx';
import FlotaTable from '../tables/FlotaTable';
import ClientTable from '../tables/ClientTable';
import EntregasTable from '../tables/EntregasTable';

const AdminPanel = ({ onLogout, user }) => {
    // Variables adicionales para estilos
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    
    // Estados
    const [activeForm, setActiveForm] = useState(null);
    const [entregas, setEntregas] = useState([]);
    const [flota, setFlota] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [currentUser, setCurrentUser] = useState(user);
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeDeliveries: 0,
        totalClients: 0,
        revenue: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Hooks de Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen,
        onClose: onDrawerClose } = useDisclosure();
    const toast = useToast();

    // Estilos
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const cardBgColor = useColorModeValue('white', 'gray.700');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    // Efectos
    useEffect(() => {
        fetchData();
        fetchChartData();
    }, []);

    // Función para cargar datos
    const fetchData = async () => {
        try {
            const [entregasRes, vehiculosRes, statsRes, clientesRes] =
                await Promise.all([
                    ApiService.get('/entregas'),
                    ApiService.get('/vehiculos'),
                    ApiService.get('/stats'),
                    ApiService.get('/clientes')
                ]);
            if (entregasRes.ok) {
                const formattedEntregas = entregasRes.data.map(entrega => ({
                    id: entrega.id,
                    cliente: entrega.cliente_nombre,
                    fechaEntrega: entrega.fecha_entrega,
                    ubicacion: entrega.lugar_entrega,
                    documento: entrega.cliente_documento,
                    vehiculo: `${entrega.marca} ${entrega.modelo}`,
                    vehiculoData: {
                        marca: entrega.marca,
                        modelo: entrega.modelo,
                        patente: entrega.patente,
                        tipo: entrega.designacion
                    },
                    dniEntrega: entrega.dni_entrega,
                    dniRecibe: entrega.dni_recibe,
                    kilometrajeEntrega: entrega.kilometraje_entrega,
                    kilometrajeDevolucion: entrega.kilometraje_devolucion,
                    nivelCombustible: entrega.nivel_combustible,
                    funcionarioEntrega: entrega.funcionario_entrega,
                    funcionarioRecibe: entrega.funcionario_recibe,
                    lugarDevolucion: entrega.lugar_devolucion,
                    fechaDevolucion: entrega.fecha_devolucion,
                    inventario: {
                        lucesPrincipales: entrega.luces_principales === 1,
                        luzMedia: entrega.luz_media === 1,
                        luzStop: entrega.luz_stop === 1,
                        antenaRadio: entrega.antena_radio === 1,
                        limpiaParabrisas: entrega.limpia_parabrisas === 1,
                        espejoIzquierdo: entrega.espejo_izquierdo === 1,
                        espejoDerecho: entrega.espejo_derecho === 1,
                        vidriosLaterales: entrega.vidrios_laterales === 1,
                        parabrisas: entrega.parabrisas === 1,
                        tapones: entrega.tapones === 1,
                        taponGasolina: entrega.tapon_gasolina === 1,
                        carroceria: entrega.carroceria === 1,
                        parachoqueDelantero: entrega.parachoque_delantero === 1,
                        parachoqueTrasero: entrega.parachoque_trasero === 1,
                        placas: entrega.placas === 1,
                        calefaccion: entrega.calefaccion === 1,
                        radioCd: entrega.radio_cd === 1,
                        bocinas: entrega.bocinas === 1,
                        encendedor: entrega.encendedor === 1,
                        espejoRetrovisor: entrega.espejo_retrovisor === 1,
                        ceniceros: entrega.ceniceros === 1,
                        cinturones: entrega.cinturones === 1,
                        manijasVidrios: entrega.manijas_vidrios === 1,
                        pisosGoma: entrega.pisos_goma === 1,
                        tapetes: entrega.tapetes === 1,
                        fundaAsientos: entrega.funda_asientos === 1,
                        jaladorPuertas: entrega.jalador_puertas === 1,
                        sujetadorManos: entrega.sujetador_manos === 1,
                        gato: entrega.gato === 1,
                        llaveRueda: entrega.llave_rueda === 1,
                        estucheLlaves: entrega.estuche_llaves === 1,
                        triangulo: entrega.triangulo === 1,
                        llantaAuxilio: entrega.llanta_auxilio === 1,
                        extintor: entrega.extintor === 1,
                        botiquin: entrega.botiquin === 1,
                        otros: entrega.otros === 1,
                        soat: entrega.soat === 1,
                        inspeccionTecnica: entrega.inspeccion_tecnica === 1
                    }
                }));
                setEntregas(formattedEntregas);
            }

            if (vehiculosRes.ok) {
                setFlota(vehiculosRes.data);
            }

            if (statsRes.ok) {
                setStats({
                    totalVehicles: statsRes.data.total_vehiculos,
                    activeDeliveries: statsRes.data.entregas_activas,
                    totalClients: statsRes.data.total_clientes,
                    revenue: statsRes.data.ingresos_totales
                });
            }

            if (clientesRes.ok) {
                setClientes(clientesRes.data);
            }
        } catch (error) {
            console.error('Error general:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los datos',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    // Función para cargar datos del gráfico
    const fetchChartData = async () => {
        try {
            const response = await ApiService.get('/stats/chart');
            if (response.ok) {
                setChartData(response.data);
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    // Configuración de las tarjetas de acción
    const actionCards = [
        {
            title: 'Registrar Vehículo',
            icon: FaCar,
            color: 'blue',
            description: 'Añade un nuevo vehículo al sistema.',
            form: 'vehicle'
        },
        {
            title: 'Registrar Cliente',
            icon: FaUserPlus,
            color: 'green',
            description: 'Registra un nuevo cliente.',
            form: 'client'
        },
        {
            title: 'Registrar Entrega',
            icon: FaClipboardList,
            color: 'purple',
            description: 'Registra una nueva entrega.',
            form: 'delivery'
        },
        {
            title: 'Registrar Factura',
            icon: FaFileInvoiceDollar,
            color: 'orange',
            description: 'Crea una nueva factura.',
            form: 'invoice'
        }
    ];

    // Componente de tarjeta de acción
    const ActionCard = ({ title, icon, color, onClick, bgColor, description }) => (
        <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'xl',
            }}
            cursor="pointer"
            onClick={onClick}
        >
            <Icon as={icon} w={12} h={12} color={color} mb={4} />
            <Text fontWeight="bold" fontSize="xl" mb={2} color={headingColor}>
                {title}
            </Text>
            <Text fontSize="sm" color={textColor}>
                {description}
            </Text>
        </Box>
    );

    // Manejadores de eventos
    const handleCardClick = (form) => {
        setActiveForm(form);
        onOpen();
    };

    const handleFormSubmit = async (formType, data) => {
        try {
            let endpoint = '';
            switch (formType) {
                case 'vehiculo':
                    endpoint = '/vehiculo';
                    break;
                case 'cliente':
                    endpoint = '/cliente';
                    break;
                case 'entrega':
                    endpoint = '/entrega';
                    break;
                case 'factura':
                    endpoint = '/factura';
                    break;
                default:
                    throw new Error('Tipo de formulario no válido');
            }

            const response = await ApiService.post(endpoint, data);

            if (response.ok) {
                onClose();
                fetchData();
                toast({
                    title: 'Operación exitosa',
                    description: `Se ha completado el registro de ${formType} correctamente.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.msg || 'Error en la operación');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Hubo un problema al procesar su solicitud.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Funciones de exportación
    const exportToExcel = async (data, filename, headers) => {
        try {
            const formattedData = data.map(item => {
                const newItem = {};
                Object.keys(headers).forEach(key => {
                    newItem[headers[key]] = item[key];
                });
                return newItem;
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(formattedData, {
                header: Object.values(headers)
            });

            const columnWidths = Object.values(headers).map(header => ({
                wch: Math.max(header.length, 15)
            }));
            ws['!cols'] = columnWidths;

            XLSX.utils.book_append_sheet(wb, ws, 'Datos');
            XLSX.writeFile(wb, `${filename}.xlsx`);

            toast({
                title: 'Exportación exitosa',
                description: 'El archivo Excel ha sido descargado.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al exportar los datos.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    // Renderizado del componente
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isSidebarOpen ? 0 : -300 }}
                className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-30"
            >
                <div className="p-4">
                    <img src={Logo} alt="Logo" className="h-8 mb-8" />
                    <nav className="space-y-2">
                        {actionCards.map((card) => (
                            <motion.button
                                key={card.title}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCardClick(card.form)}
                                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <card.icon className={`text-${card.color}-500 text-xl`} />
                                <span className="text-gray-700 dark:text-gray-200">{card.title}</span>
                            </motion.button>
                        ))}
                    </nav>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-field pl-10"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            
                            <button
                                onClick={onLogout}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <FaSignOutAlt className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {Object.entries(stats).map(([key, value]) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-6"
                            >
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </h3>
                                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                    {value}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="glass-card p-6 mb-8">
                        <h2 className="text-xl font-medium mb-4">Estadísticas</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#0ea5e9" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-medium mb-4">Últimas Entregas</h2>
                            <EntregasTable data={entregas} />
                        </div>

                        <div className="glass-card p-6">
                            <h2 className="text-xl font-medium mb-4">Flota</h2>
                            <FlotaTable data={flota} />
                        </div>

                        <div className="glass-card p-6">
                            <h2 className="text-xl font-medium mb-4">Clientes</h2>
                            <ClientTable data={clientes} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {activeForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-6 w-full max-w-2xl"
                        >
                            {activeForm === 'vehicle' && <RegistrarVehiculo onClose={() => setActiveForm(null)} />}
                            {activeForm === 'client' && <RegistrarCliente onClose={() => setActiveForm(null)} />}
                            {activeForm === 'delivery' && <RegistroEntrega onClose={() => setActiveForm(null)} />}
                            {activeForm === 'invoice' && <RegistrarFacturas onClose={() => setActiveForm(null)} />}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;