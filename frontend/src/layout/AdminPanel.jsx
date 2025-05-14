import React, { useState, useEffect } from 'react';
import {
    Box, Button, Grid, Heading, Text, Flex, VStack, HStack,
    useColorModeValue, Container, useDisclosure,
    useToast, Badge, Avatar, AvatarGroup,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader,
    DrawerOverlay, DrawerContent, DrawerCloseButton,
    Menu, MenuButton, MenuList, MenuItem, Input,
    Tooltip, Card, CardBody, CardHeader, CardFooter,
    Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, InputGroup, InputLeftElement, Link,
    Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
    Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody,
    PopoverFooter, PopoverArrow, PopoverCloseButton, Switch
} from '@chakra-ui/react';

// Iconos utilizando React Icons
import {
    FaCar, FaUserPlus, FaMoon, FaSun, FaUser, FaClipboardList, FaSignOutAlt,
    FaFileInvoiceDollar, FaFileExport, FaSearch, FaCog,
    FaBell, FaChartLine, FaEllipsisV, FaDownload, FaCalendarAlt,
    FaUsers, FaHome, FaTachometerAlt, FaFilter, FaStar, FaCheckCircle
} from 'react-icons/fa';
import { MdDashboard, MdHelp, MdAdd, MdNotifications, MdSettings, MdMenu } from 'react-icons/md';
import { IoAnalytics, IoCarSport, IoPersonAdd, IoReceiptOutline, IoHelpCircle } from 'react-icons/io5';
import { HiOutlineDocumentReport, HiCube, HiChartBar, HiCurrencyDollar } from 'react-icons/hi';

// Componentes importados
import RegistroEntrega from '../forms/RegistroEntrega';
import RegistrarVehiculo from '../forms/RegistrarVehiculo';
import RegistrarCliente from '../forms/RegistrarCliente';
import RegistrarFacturas from '../forms/RegistrarFacturas';
import FlotaTable from '../tables/FlotaTable';
import ClientTable from '../tables/ClientTable';
import EntregasTable from '../tables/EntregasTable';

// Gráficos
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Servicios y assets
import ApiService from '../services/api';
import LogoCodeo from '../assets/icon.png';
import Logo from "../assets/logo-horizontal.png";
import * as XLSX from 'xlsx';

// Colores de tema
const THEME_COLORS = {
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

// Datos de ejemplo para gráficos
const SAMPLE_CHART_DATA = [
    { name: 'Ene', entregas: 12, ingresos: 4000 },
    { name: 'Feb', entregas: 19, ingresos: 5000 },
    { name: 'Mar', entregas: 15, ingresos: 6000 },
    { name: 'Abr', entregas: 27, ingresos: 8700 },
    { name: 'May', entregas: 24, ingresos: 7800 },
    { name: 'Jun', entregas: 35, ingresos: 9800 },
];

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const AdminPanel = ({ onLogout, user }) => {
    // Estados
    const [activeForm, setActiveForm] = useState(null);
    const [entregas, setEntregas] = useState([]);
    const [flota, setFlota] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeDeliveries: 0,
        totalClients: 0,
        revenue: 0,
        growthRate: 12.5, // Tasa de crecimiento ejemplo
    });
    const [chartData, setChartData] = useState(SAMPLE_CHART_DATA);
    const [vehiclesByType, setVehiclesByType] = useState([
        { name: 'SUV', value: 35 },
        { name: 'Sedán', value: 25 },
        { name: 'Hatchback', value: 20 },
        { name: 'Pickup', value: 15 },
        { name: 'Van', value: 5 },
    ]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);

    // Hooks de Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDrawerOpen,
        onOpen: onDrawerOpen,
        onClose: onDrawerClose
    } = useDisclosure();
    const toast = useToast();

    // Estilos
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const sidebarBgColor = useColorModeValue('white', 'gray.800');
    const activeNavBgColor = useColorModeValue('primary.50', 'rgba(33, 150, 243, 0.15)');
    const activeNavColor = useColorModeValue('primary.700', 'primary.300');
    const hoverNavBgColor = useColorModeValue('gray.100', 'gray.700');

    // Efectos
    useEffect(() => {
        fetchData();
        fetchChartData();

        // Responsive design detection
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 992);
            if (window.innerWidth < 992) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                    estado: entrega.fecha_devolucion ? 'Completada' : 'Activa',
                    inventario: {
                        lucesPrincipales: entrega.luces_principales === 1,
                        luzMedia: entrega.luz_media === 1,
                        luzStop: entrega.luz_stop === 1,
                        // ... resto del inventario
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
                    revenue: statsRes.data.ingresos_totales,
                    growthRate: statsRes.data.tasa_crecimiento || 12.5
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
                position: 'bottom-right',
                variant: 'solid',
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
            // Usamos datos de muestra si hay un error
            setChartData(SAMPLE_CHART_DATA);
        }
    };

    // Configuración de las tarjetas de acción
    const actionCards = [
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

    // Elementos de navegación lateral
    const navItems = [
        { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
        { name: 'Vehículos', icon: FaCar, path: '/vehicles' },
        { name: 'Clientes', icon: FaUsers, path: '/clients' },
        { name: 'Entregas', icon: FaClipboardList, path: '/deliveries' },
        { name: 'Finanzas', icon: HiCurrencyDollar, path: '/finances' },
        { name: 'Reportes', icon: HiChartBar, path: '/reports' },
        { name: 'Configuración', icon: FaCog, path: '/settings' },
        { name: 'Ayuda', icon: IoHelpCircle, path: '/help' },
    ];

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
                    title: '¡Operación exitosa!',
                    description: `Se ha completado el registro de ${formType} correctamente.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom-right',
                    variant: 'solid',
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
                position: 'bottom-right',
                variant: 'solid',
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
                title: '¡Exportación exitosa!',
                description: 'El archivo Excel ha sido descargado.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom-right',
                variant: 'solid',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al exportar los datos.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
                variant: 'solid',
            });
        }
    };

    // Componente de Card Dashboard
    const DashboardCard = ({ title, value, description, icon, color, percentage, isPositive }) => (
        <Card
            boxShadow="sm"
            borderRadius="xl"
            variant="outline"
            p={2}
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.3s"
        >
            <CardBody>
                <Flex alignItems="center" justifyContent="space-between">
                    <Box p={2}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">{title}</Text>
                        <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                        <Flex alignItems="center" mt={1}>
                            {percentage && (
                                <Badge
                                    colorScheme={isPositive ? "green" : "red"}
                                    variant="subtle"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Stat size="sm" display="flex" alignItems="center">
                                        <StatArrow type={isPositive ? "increase" : "decrease"} />
                                        <StatNumber fontSize="xs" fontWeight="medium" ml={1}>{percentage}%</StatNumber>
                                    </Stat>
                                </Badge>
                            )}
                            {description && (
                                <Text fontSize="xs" color="gray.500" ml={2}>{description}</Text>
                            )}
                        </Flex>
                    </Box>
                    <Box
                        p={3}
                        borderRadius="full"
                        bg={`${color}.50`}
                        color={`${color}.500`}
                    >
                        <Box as={icon} size="24px" />
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );
    // Componente de tarjeta de acción
    const ActionCard = ({ title, icon, color, onClick, bgColor, description }) => (
        <Card
            bg={bgColor}
            borderRadius="xl"
            boxShadow="sm"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'md',
            }}
            onClick={onClick}
            overflow="hidden"
        >
            <CardBody p={0}>
                <Flex direction="column" p={5}>
                    <Flex
                        width="50px"
                        height="50px"
                        borderRadius="lg"
                        bg={`${color}20`}
                        justify="center"
                        align="center"
                        mb={4}
                    >
                        <Box as={icon} size="24px" color={color} />
                    </Flex>
                    <Heading size="md" mb={2} color={headingColor}>
                        {title}
                    </Heading>
                    <Text fontSize="sm" color={textColor}>
                        {description}
                    </Text>
                </Flex>
            </CardBody>
            <Box h="4px" w="full" bg={color} />
        </Card>
    );

    // Componente de navegación lateral
    const SidebarNav = () => (
        <Box
            as="aside"
            position="fixed"
            h="100vh"
            w={isSidebarOpen ? "250px" : "70px"}
            bg={sidebarBgColor}
            borderRightWidth="1px"
            borderRightColor={borderColor}
            transition="all 0.3s ease"
            overflowY="auto"
            zIndex="999"
            pt={2}
        >
            <Flex
                p={4}
                mb={4}
                align="center"
                justify={isSidebarOpen ? "space-between" : "center"}
            >
                {isSidebarOpen ? (
                    <img src={Logo} alt="Logo" style={{ height: "40px" }} />
                ) : (
                    <Box as={FaCar} size="24px" color="primary.500" />
                )}
                {isSidebarOpen && (
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(false)}
                        size="sm"
                        p={1}
                    >
                        <Box as={MdMenu} size="20px" />
                    </Button>
                )}
            </Flex>

            <VStack spacing={1} align="stretch" px={2}>
                {navItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        label={!isSidebarOpen ? item.name : ""}
                        placement="right"
                        hasArrow
                        openDelay={500}
                    >
                        <Flex
                            p={3}
                            borderRadius="md"
                            cursor="pointer"
                            align="center"
                            bg={index === 0 ? activeNavBgColor : "transparent"}
                            color={index === 0 ? activeNavColor : textColor}
                            _hover={{ bg: hoverNavBgColor }}
                            transition="all 0.2s"
                        >
                            <Box as={item.icon} size="20px" />
                            {isSidebarOpen && (
                                <Text ml={3} fontWeight={index === 0 ? "bold" : "normal"}>
                                    {item.name}
                                </Text>
                            )}
                            {isSidebarOpen && index === 0 && (
                                <Box
                                    position="absolute"
                                    right={0}
                                    width="4px"
                                    height="24px"
                                    bg="primary.500"
                                    borderRadius="full"
                                />
                            )}
                        </Flex>
                    </Tooltip>
                ))}
            </VStack>

            {!isSidebarOpen && (
                <Flex
                    position="absolute"
                    bottom="20px"
                    left={0}
                    right={0}
                    justify="center"
                >
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(true)}
                        size="sm"
                        p={1}
                    >
                        <Box as={MdMenu} size="20px" />
                    </Button>
                </Flex>
            )}
        </Box>
    );

    // Renderizado del componente
    return (
        <Box bg={bgColor} minH="100vh">
            {/* Sidebar */}
            <SidebarNav />

            {/* Contenido principal */}
            <Box
                ml={isSidebarOpen ? { base: 0, md: "250px" } : { base: 0, md: "70px" }}
                transition="all 0.3s ease"
                position="relative"
            >
                {/* Header */}
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    px={6}
                    py={3}
                    bg={cardBgColor}
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                    position="sticky"
                    top={0}
                    zIndex="99"
                    boxShadow="sm"
                >
                    {isSmallScreen && (
                        <Button
                            variant="ghost"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            mr={2}
                        >
                            <Box as={MdMenu} size="24px" />
                        </Button>
                    )}

                    <InputGroup maxW="400px" display={{ base: 'none', md: 'flex' }}>
                        <InputLeftElement>
                            <Box as={FaSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Buscar..."
                            bg="gray.50"
                            borderRadius="full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>

                    <HStack spacing={4}>
                        <Tooltip label="Notificaciones" hasArrow>
                            <Box position="relative">
                                <Popover>
                                    <PopoverTrigger>
                                        <Button variant="ghost" rounded="full">
                                            <Box as={FaBell} />
                                            {notificationCount > 0 && (
                                                <Badge
                                                    position="absolute"
                                                    top="-5px"
                                                    right="-5px"
                                                    colorScheme="red"
                                                    borderRadius="full"
                                                    fontSize="xs"
                                                >
                                                    {notificationCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverHeader fontWeight="bold">Notificaciones</PopoverHeader>
                                        <PopoverCloseButton />
                                        <PopoverBody>
                                            <VStack align="stretch" spacing={3}>
                                                <Flex p={2} bg="primary.50" borderRadius="md">
                                                    <Box as={FaClipboardList} color="primary.500" mt={1} />
                                                    <Box ml={3}>
                                                        <Text fontWeight="bold" fontSize="sm">Nueva entrega registrada</Text>
                                                        <Text fontSize="xs" color="gray.500">Hace 5 minutos</Text>
                                                    </Box>
                                                </Flex>
                                                <Flex p={2} bg="success.50" borderRadius="md">
                                                    <Box as={FaCheckCircle} color="success.500" mt={1} />
                                                    <Box ml={3}>
                                                        <Text fontWeight="bold" fontSize="sm">Entrega #35 completada</Text>
                                                        <Text fontSize="xs" color="gray.500">Hace 2 horas</Text>
                                                    </Box>
                                                </Flex>
                                            </VStack>
                                        </PopoverBody>
                                        <PopoverFooter>
                                            <Button size="sm" variant="link" colorScheme="blue">Ver todas</Button>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </Popover>
                            </Box>
                        </Tooltip>

                        <Tooltip label="Configuración" hasArrow>
                            <Button variant="ghost" rounded="full">
                                <Box as={FaCog} />
                            </Button>
                        </Tooltip>

                        <Menu>
                            <Tooltip label="Perfil" hasArrow>
                                <MenuButton>
                                    <Avatar size="sm" name={user?.nombre || "Usuario"} />
                                </MenuButton>
                            </Tooltip>
                            <MenuList>
                                <MenuItem icon={<FaUser />}>Perfil</MenuItem>
                                <MenuItem icon={<FaCog />}>Configuración</MenuItem>
                                <MenuItem icon={<FaSignOutAlt />} onClick={onLogout}>Cerrar Sesión</MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>

                {/* Contenido principal */}
                <Box p={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Título de página y breadcrumbs */}
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Heading as="h1" size="lg" mb={1}>Dashboard</Heading>
                                <Flex align="center">
                                    <Text fontSize="sm" color="gray.500">Inicio</Text>
                                    <Text fontSize="sm" color="gray.500" mx={2}>/</Text>
                                    <Text fontSize="sm" color="gray.700" fontWeight="medium">Dashboard</Text>
                                </Flex>
                            </Box>
                            <Button
                                leftIcon={<MdAdd />}
                                colorScheme="blue"
                                variant="solid"
                                borderRadius="full"
                                onClick={() => handleCardClick('delivery')}
                            >
                                Nueva Entrega
                            </Button>
                        </Flex>

                        {/* Estadísticas */}
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
                            <DashboardCard
                                title="Total Vehículos"
                                value={stats.totalVehicles.toLocaleString()}
                                description="Unidades registradas"
                                icon={IoCarSport}
                                color="primary"
                                percentage="8.5"
                                isPositive={true}
                            />
                            <DashboardCard
                                title="Entregas Activas"
                                value={stats.activeDeliveries.toLocaleString()}
                                description="En proceso"
                                icon={FaClipboardList}
                                color="success"
                                percentage="12.3"
                                isPositive={true}
                            />
                            <DashboardCard
                                title="Total Clientes"
                                value={stats.totalClients.toLocaleString()}
                                description="Registrados"
                                icon={FaUsers}
                                color="secondary"
                                percentage="5.2"
                                isPositive={true}
                            />
                            <DashboardCard
                                title="Ingresos"
                                value={`$${stats.revenue.toLocaleString()}`}
                                description="Este mes"
                                icon={HiCurrencyDollar}
                                color="warning"
                                percentage="15.7"
                                isPositive={true}
                            />
                        </SimpleGrid>

                        {/* Gráficos principales */}
                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                            <Card variant="outline" borderRadius="xl" boxShadow="sm">
                                <CardHeader pb={0}>
                                    <Flex justify="space-between" align="center">
                                        <Heading size="md">Tendencia de Entregas</Heading>
                                        <Menu>
                                            <MenuButton as={Button} variant="ghost" size="sm">
                                                <FaEllipsisV />
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem icon={<FaDownload />}>Exportar datos</MenuItem>
                                                <MenuItem icon={<FaFilter />}>Filtrar</MenuItem>
                                                <MenuItem icon={<HiChartBar />}>Ver detalles</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <Box height="300px" width="100%">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorEntregas" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={THEME_COLORS.primary[500]} stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor={THEME_COLORS.primary[500]} stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderColor} />
                                                <XAxis dataKey="name" stroke={textColor} />
                                                <YAxis stroke={textColor} />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: cardBgColor,
                                                        borderColor: borderColor,
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                    }}
                                                    itemStyle={{ color: textColor }}
                                                    formatter={(value) => [`${value} entregas`, 'Cantidad']}
                                                    labelStyle={{ color: headingColor }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="entregas"
                                                    stroke={THEME_COLORS.primary[500]}
                                                    fillOpacity={1}
                                                    fill="url(#colorEntregas)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardBody>
                            </Card>

                            <Card variant="outline" borderRadius="xl" boxShadow="sm">
                                <CardHeader pb={0}>
                                    <Flex justify="space-between" align="center">
                                        <Heading size="md">Ingresos Mensuales</Heading>
                                        <Menu>
                                            <MenuButton as={Button} variant="ghost" size="sm">
                                                <FaEllipsisV />
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem icon={<FaDownload />}>Exportar datos</MenuItem>
                                                <MenuItem icon={<FaFilter />}>Filtrar</MenuItem>
                                                <MenuItem icon={<HiChartBar />}>Ver detalles</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <Box height="300px" width="100%">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderColor} />
                                                <XAxis dataKey="name" stroke={textColor} />
                                                <YAxis stroke={textColor} />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: cardBgColor,
                                                        borderColor: borderColor,
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                    }}
                                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                                                />
                                                <Bar
                                                    dataKey="ingresos"
                                                    fill={THEME_COLORS.warning[500]}
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={30}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardBody>
                            </Card>
                        </SimpleGrid>

                        {/* Segunda fila de dashboard - Indicadores y Gráficos */}
                        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                            <Card variant="outline" borderRadius="xl" boxShadow="sm">
                                <CardHeader pb={0}>
                                    <Heading size="md">Distribución de Flota</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Box height="250px" width="100%">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={vehiclesByType}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {vehiclesByType.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: cardBgColor,
                                                        borderColor: borderColor,
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardBody>
                            </Card>

                            <Card variant="outline" borderRadius="xl" boxShadow="sm" gridColumn={{ lg: "span 2" }}>
                                <CardHeader>
                                    <Heading size="md">Últimas Entregas</Heading>
                                </CardHeader>
                                <CardBody>
                                    <VStack spacing={4} align="stretch">
                                        {entregas.slice(0, 3).map((entrega, index) => (
                                            <Flex
                                                key={index}
                                                p={3}
                                                borderRadius="lg"
                                                bg={cardBgColor}
                                                borderWidth="1px"
                                                borderColor={borderColor}
                                                justify="space-between"
                                                align="center"
                                            >
                                                <HStack spacing={4}>
                                                    <Flex
                                                        width="40px"
                                                        height="40px"
                                                        borderRadius="md"
                                                        bg="primary.50"
                                                        justify="center"
                                                        align="center"
                                                    >
                                                        <Box as={FaCar} color="primary.500" />
                                                    </Flex>
                                                    <Box>
                                                        <Text fontWeight="bold">{entrega.cliente}</Text>
                                                        <Text fontSize="sm" color="gray.500">{entrega.vehiculo}</Text>
                                                    </Box>
                                                </HStack>
                                                <HStack>
                                                    <Badge
                                                        colorScheme={entrega.estado === 'Activa' ? "green" : "blue"}
                                                        borderRadius="full"
                                                        px={3}
                                                        py={1}
                                                    >
                                                        {entrega.estado}
                                                    </Badge>
                                                    <Text fontSize="sm">{entrega.fechaEntrega}</Text>
                                                    <Button size="sm" variant="ghost">
                                                        <FaEllipsisV />
                                                    </Button>
                                                </HStack>
                                            </Flex>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            alignSelf="center"
                                            borderRadius="full"
                                            px={6}
                                        >
                                            Ver todas las entregas
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </SimpleGrid>

                        {/* Tarjetas de acción */}
                        <Box>
                            <Heading size="md" mb={4}>Acciones rápidas</Heading>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                                {actionCards.map((card) => (
                                    <ActionCard
                                        key={card.title}
                                        {...card}
                                        onClick={() => handleCardClick(card.form)}
                                    />
                                ))}
                            </SimpleGrid>
                        </Box>

                        {/* Tabs de contenido */}
                        <Card variant="outline" borderRadius="xl" boxShadow="sm" mt={6}>
                            <Tabs variant="soft-rounded" colorScheme="blue" p={4}>
                                <TabList mb={4} mx={2}>
                                    <Tab borderRadius="full" mr={2}>Informe de Entregas</Tab>
                                    <Tab borderRadius="full" mr={2}>Flota de Vehículos</Tab>
                                    <Tab borderRadius="full">Clientes</Tab>
                                </TabList>

                                <TabPanels>
                                    {/* Panel de Entregas */}
                                    <TabPanel>
                                        <Flex justifyContent="space-between" alignItems="center" mb={6}>
                                            <Heading size="md" color={headingColor}>Informe de Entregas</Heading>
                                            <Button
                                                leftIcon={<FaFileExport />}
                                                colorScheme="teal"
                                                borderRadius="full"
                                                onClick={() => exportToExcel(entregas, 'registro_entregas', {
                                                    cliente: 'Nombre del Cliente',
                                                    fechaEntrega: 'Fecha de Entrega',
                                                    ubicacion: 'Ubicación',
                                                    documento: 'Documento',
                                                    vehiculo: 'Vehículo Asignado'
                                                })}
                                            >
                                                Exportar
                                            </Button>
                                        </Flex>
                                        <Box overflowX="auto">
                                            <EntregasTable
                                                data={entregas}
                                                onUpdate={async (id, updatedData) => {
                                                    try {
                                                        const response = await ApiService.patch(`/entrega/${id}/finalizar`, updatedData);
                                                        if (response.ok) {
                                                            const updatedEntregas = entregas.map(entrega =>
                                                                entrega.id === id ? { ...entrega, ...updatedData } : entrega
                                                            );
                                                            setEntregas(updatedEntregas);
                                                            fetchData(); // Recargar los datos para actualizar todo
                                                            toast({
                                                                title: '¡Actualización exitosa!',
                                                                description: 'La entrega ha sido actualizada correctamente.',
                                                                status: 'success',
                                                                duration: 3000,
                                                                isClosable: true,
                                                                position: 'bottom-right',
                                                                variant: 'solid',
                                                            });
                                                        } else {
                                                            throw new Error(response.msg || 'Error al actualizar la entrega');
                                                        }
                                                    } catch (error) {
                                                        toast({
                                                            title: 'Error',
                                                            description: error.message || 'Hubo un problema al actualizar la entrega',
                                                            status: 'error',
                                                            duration: 5000,
                                                            isClosable: true,
                                                            position: 'bottom-right',
                                                            variant: 'solid',
                                                        });
                                                        throw error;
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </TabPanel>

                                    {/* Panel de Flota */}
                                    <TabPanel>
                                        <Flex justifyContent="space-between" alignItems="center" mb={6}>
                                            <Heading size="md" color={headingColor}>Flota de Vehículos</Heading>
                                            <Button
                                                leftIcon={<FaFileExport />}
                                                colorScheme="teal"
                                                borderRadius="full"
                                                onClick={() => exportToExcel(flota, 'flota_vehiculos', {
                                                    id: 'ID',
                                                    marca: 'Marca',
                                                    modelo: 'Modelo',
                                                    patente: 'Patente',
                                                    estado: 'Estado',
                                                    responsable: 'Responsable'
                                                })}
                                            >
                                                Exportar
                                            </Button>
                                        </Flex>
                                        <Box overflowX="auto">
                                            <FlotaTable
                                                data={flota}
                                                onUpdate={async (id, updatedData) => {
                                                    try {
                                                        const response = await ApiService.patch(`/vehiculo/${id}`, updatedData);
                                                        if (response.ok) {
                                                            const updatedFlota = flota.map(vehiculo =>
                                                                vehiculo.id === id ? { ...vehiculo, ...updatedData } : vehiculo
                                                            );
                                                            setFlota(updatedFlota);
                                                            toast({
                                                                title: '¡Actualización exitosa!',
                                                                description: 'El vehículo ha sido actualizado correctamente.',
                                                                status: 'success',
                                                                duration: 3000,
                                                                isClosable: true,
                                                                position: 'bottom-right',
                                                                variant: 'solid',
                                                            });
                                                        } else {
                                                            throw new Error(response.msg || 'Error al actualizar el vehículo');
                                                        }
                                                    } catch (error) {
                                                        toast({
                                                            title: 'Error',
                                                            description: error.message || 'Hubo un problema al actualizar el vehículo',
                                                            status: 'error',
                                                            duration: 5000,
                                                            isClosable: true,
                                                            position: 'bottom-right',
                                                            variant: 'solid',
                                                        });
                                                        throw error;
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </TabPanel>

                                    {/* Panel de Clientes */}
                                    <TabPanel>
                                        <Flex justifyContent="space-between" alignItems="center" mb={6}>
                                            <Heading size="md" color={headingColor}>Lista de Clientes</Heading>
                                            <Button
                                                leftIcon={<FaFileExport />}
                                                colorScheme="teal"
                                                borderRadius="full"
                                                onClick={() => exportToExcel(clientes, 'lista_clientes', {
                                                    nombre: 'Nombre',
                                                    documento: 'Documento',
                                                    email: 'Email',
                                                    telefono: 'Teléfono',
                                                    direccion: 'Dirección'
                                                })}
                                            >
                                                Exportar
                                            </Button>
                                        </Flex>
                                        <Box overflowX="auto">
                                            <ClientTable
                                                data={clientes}
                                                onUpdate={async (id, updatedData) => {
                                                    try {
                                                        const response = await ApiService.patch(`/cliente/${id}`, updatedData);
                                                        if (response.ok) {
                                                            const updatedClientes = clientes.map(cliente =>
                                                                cliente.id === id ? {
                                                                    ...cliente,
                                                                    tipo_cliente: updatedData.tipoCliente,
                                                                    nombre: updatedData.nombre,
                                                                    razon_social: updatedData.razonSocial,
                                                                    dni_cuit: updatedData.dniCuit,
                                                                    telefono: updatedData.telefono,
                                                                    email: updatedData.email
                                                                } : cliente
                                                            );
                                                            setClientes(updatedClientes);
                                                            toast({
                                                                title: '¡Actualización exitosa!',
                                                                description: 'El cliente ha sido actualizado correctamente.',
                                                                status: 'success',
                                                                duration: 3000,
                                                                isClosable: true,
                                                                position: 'bottom-right',
                                                                variant: 'solid',
                                                            });
                                                        } else {
                                                            throw new Error(response.msg || 'Error al actualizar el cliente');
                                                        }
                                                    } catch (error) {
                                                        toast({
                                                            title: 'Error',
                                                            description: error.message || 'Hubo un problema al actualizar el cliente',
                                                            status: 'error',
                                                            duration: 5000,
                                                            isClosable: true,
                                                            position: 'bottom-right',
                                                            variant: 'solid',
                                                        });
                                                        throw error;
                                                    }
                                                }}
                                                onDelete={async (id) => {
                                                    try {
                                                        const response = await ApiService.delete(`/cliente/${id}`);
                                                        if (response.ok) {
                                                            const updatedClientes = clientes.filter(cliente => cliente.id !== id);
                                                            setClientes(updatedClientes);
                                                            toast({
                                                                title: '¡Eliminación exitosa!',
                                                                description: 'El cliente ha sido eliminado correctamente.',
                                                                status: 'success',
                                                                duration: 3000,
                                                                isClosable: true,
                                                                position: 'bottom-right',
                                                                variant: 'solid',
                                                            });
                                                        } else {
                                                            throw new Error(response.msg || 'Error al eliminar el cliente');
                                                        }
                                                    } catch (error) {
                                                        toast({
                                                            title: 'Error',
                                                            description: error.message || 'Hubo un problema al eliminar el cliente',
                                                            status: 'error',
                                                            duration: 5000,
                                                            isClosable: true,
                                                            position: 'bottom-right',
                                                            variant: 'solid',
                                                        });
                                                        throw error;
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Card>

                        {/* Footer */}
                        <Box as="footer" bg={cardBgColor} color={textColor} py={6} px={6} mt={8} borderTopWidth="1px" borderTopColor={borderColor}>
                            <Container maxW="7xl">
                                <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                    <HStack spacing={2}>
                                        <Text>&copy; 2025 Sistema de Gestión de Flota</Text>
                                        <Text mx={2} color="gray.400">|</Text>
                                        <Link href="https://codeo.site/" display="flex" alignItems="center" color="primary.500">
                                            Desarrollado por <Text fontWeight="bold" ml={1}>Codeo.Ar</Text>
                                            <Box ml={2}><img src={LogoCodeo} alt="Logo Codeo" width="20px" /></Box>
                                        </Link>
                                    </HStack>
                                    <HStack spacing={4} mt={{ base: 4, md: 0 }}>
                                        <Link href="#" fontSize="sm" color="gray.500" _hover={{ color: "primary.500" }}>Términos</Link>
                                        <Link href="#" fontSize="sm" color="gray.500" _hover={{ color: "primary.500" }}>Privacidad</Link>
                                        <Link href="#" fontSize="sm" color="gray.500" _hover={{ color: "primary.500" }}>Ayuda</Link>
                                    </HStack>
                                </Flex>
                            </Container>
                        </Box>

                        {/* Modal de formularios */}
                        <Modal
                            isOpen={isOpen}
                            onClose={onClose}
                            size="3xl"
                            motionPreset="slideInBottom"
                        >
                            <ModalOverlay backdropFilter="blur(2px)" />
                            <ModalContent borderRadius="xl" mx={4}>
                                <ModalCloseButton />
                                <ModalBody p={6}>
                                    {activeForm === 'vehicle' && <RegistrarVehiculo onSubmit={(data) => handleFormSubmit('vehiculo', data)} />}
                                    {activeForm === 'client' && <RegistrarCliente onSubmit={(data) => handleFormSubmit('cliente', data)} />}
                                    {activeForm === 'delivery' && <RegistroEntrega flota={flota} clientes={clientes} onSubmit={(data) => handleFormSubmit('entrega', data)} />}
                                    {activeForm === 'facturas' && <RegistrarFacturas />}
                                </ModalBody>
                            </ModalContent>
                        </Modal>

                        {/* Drawer para configuraciones en móvil */}
                        <Drawer
                            isOpen={isDrawerOpen}
                            placement="right"
                            onClose={onDrawerClose}
                        >
                            <DrawerOverlay />
                            <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader borderBottomWidth="1px">Configuración</DrawerHeader>
                                <DrawerBody>
                                    <VStack spacing={4} align="stretch">
                                        <Box>
                                            <Text fontWeight="bold" mb={2}>Tema</Text>
                                            <Flex>
                                                <Button
                                                    flex={1}
                                                    leftIcon={<FaSun />}
                                                    colorScheme={!darkMode ? "blue" : "gray"}
                                                    variant={!darkMode ? "solid" : "outline"}
                                                    onClick={() => setDarkMode(false)}
                                                    mr={2}
                                                >
                                                    Claro
                                                </Button>
                                                <Button
                                                    flex={1}
                                                    leftIcon={<FaMoon />}
                                                    colorScheme={darkMode ? "blue" : "gray"}
                                                    variant={darkMode ? "solid" : "outline"}
                                                    onClick={() => setDarkMode(true)}
                                                >
                                                    Oscuro
                                                </Button>
                                            </Flex>
                                        </Box>

                                        <Box>
                                            <Text fontWeight="bold" mb={2}>Notificaciones</Text>
                                            <Switch isChecked={true} colorScheme="blue" />
                                        </Box>
                                    </VStack>
                                </DrawerBody>
                                <DrawerFooter borderTopWidth="1px">
                                    <Button variant="outline" mr={3} onClick={onDrawerClose}>
                                        Cancelar
                                    </Button>
                                    <Button colorScheme="blue">Guardar</Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
}
export default AdminPanel;