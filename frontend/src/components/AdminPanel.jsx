import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    Heading,
    Icon,
    Text,
    Flex,
    VStack,
    useColorModeValue,
    Container,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useToast,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    InputGroup,
    InputLeftElement,
    Input,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import { FaCar, FaUserPlus, FaClipboardList, FaSignOutAlt, FaFileInvoiceDollar, FaFileExport, FaSearch, FaCog, FaBell, FaChartLine } from 'react-icons/fa';
import { MdDashboard, MdHelp } from 'react-icons/md';
import RegistroEntrega from './RegistroEntrega';
import RegistrarVehiculo from './RegistrarVehiculo';
import RegistrarCliente from './RegistrarCliente';
import RegistrarFacturas from './RegistrarFacturas';
//import Logo from './Logo'; // Assume we have a Logo component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE_URL = 'http://localhost:3000/api';

const AdminPanel = ({ onLogout, user }) => {
    const [activeForm, setActiveForm] = useState(null);
    const [entregas, setEntregas] = useState([
        // Datos simulados para entregas
        { cliente: 'Juan Pérez', fechaEntrega: '2024-10-20', ubicacion: 'San Luis', documento: 'DNI-12345678', vehiculo: 'Ford Ranger' },
        { cliente: 'Ana García', fechaEntrega: '2024-10-18', ubicacion: 'Potrero de los Funes', documento: 'DNI-87654321', vehiculo: 'Toyota Hilux' },
        { cliente: 'Carlos López', fechaEntrega: '2024-10-15', ubicacion: 'Merlo', documento: 'DNI-11223344', vehiculo: 'Chevrolet S10' },
    ]); // Línea 65 (aproximadamente)

    const [flota, setFlota] = useState([
        // Datos simulados para la flota de vehículos
        { id: 1, marca: 'Ford', modelo: 'Ranger', patente: 'ABC123', estado: 'Disponible', responsable: 'Pedro Martínez' },
        { id: 2, marca: 'Toyota', modelo: 'Hilux', patente: 'XYZ789', estado: 'En Mantenimiento', responsable: 'María Fernández' },
        { id: 3, marca: 'Chevrolet', modelo: 'S10', patente: 'QWE456', estado: 'Asignado', responsable: 'Luis Gómez' },
    ]); // Línea 66 (aproximadamente)

    const [stats, setStats] = useState({
        // Estadísticas simuladas
        totalVehicles: 15,
        activeDeliveries: 8,
        totalClients: 27,
        revenue: 150000,
    }); // Línea 67 (aproximadamente)

    const [chartData, setChartData] = useState([
        // Datos simulados para los gráficos
        { name: 'Enero', entregas: 12, ingresos: 50000 },
        { name: 'Febrero', entregas: 18, ingresos: 75000 },
        { name: 'Marzo', entregas: 15, ingresos: 60000 },
        { name: 'Abril', entregas: 20, ingresos: 90000 },
        { name: 'Mayo', entregas: 25, ingresos: 100000 },
    ]); // Línea 68 (aproximadamente)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const cardBgColor = useColorModeValue('white', 'gray.700');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.200');



    useEffect(() => {
        fetchData();
        fetchChartData();
    }, []);

    const fetchData = async () => {
        try {
            const [entregasRes, flotaRes, statsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/entregas`),
                fetch(`${API_BASE_URL}/flota`),
                fetch(`${API_BASE_URL}/stats`)
            ]);

            const entregasData = await entregasRes.json();
            const flotaData = await flotaRes.json();
            const statsData = await statsRes.json();

            setEntregas(entregasData);
            setFlota(flotaData);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los datos. Por favor, intente nuevamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/chart-data`);
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const actionCards = [
        {
            title: 'Registrar Vehículo',
            icon: FaCar,
            color: 'blue.500',
            bgColor: 'blue.50',
            description: 'Añade un nuevo vehículo al sistema.',
            form: 'vehicle'
        },
        {
            title: 'Registrar Cliente',
            icon: FaUserPlus,
            color: 'green.500',
            bgColor: 'green.50',
            description: 'Registra un nuevo cliente en la base de datos.',
            form: 'client'
        },
        {
            title: 'Registro de Entrega',
            icon: FaClipboardList,
            color: 'purple.500',
            bgColor: 'purple.50',
            description: 'Crea un nuevo registro de entrega.',
            form: 'delivery'
        },
        {
            title: 'Registrar Facturas',
            icon: FaFileInvoiceDollar,
            color: 'orange.500',
            bgColor: 'orange.50',
            description: 'Gestiona las facturas y pagos de los vehículos.',
            form: 'facturas'
        },
    ];

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

    const handleCardClick = (form) => {
        setActiveForm(form);
        onOpen();
    };

    const handleFormSubmit = async (formType, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${formType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            onClose();
            fetchData(); // Refresh data after successful submission
            toast({
                title: 'Operación exitosa',
                description: `Se ha completado el registro de ${formType} correctamente.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al procesar su solicitud. Por favor, intente nuevamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const exportToCSV = (data, filename) => {
        const headers = Object.keys(data[0]).join(',');
        const csvContent = [
            headers,
            ...data.map(item => Object.values(item).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Box bg={bgColor} minH="100vh">
            <Flex as="header" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg={cardBgColor} color={headingColor}>
                <Flex align="center" mr={5}>
                    {/* <Logo />*/}
                    <Heading as="h1" size="lg" letterSpacing={'tighter'}>
                        Admin Panel
                    </Heading>
                </Flex>

                <Flex align="center">
                    <Menu>
                        <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0} marginRight={5}>
                            <Icon as={FaBell} w={6} h={6} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Notificación 1</MenuItem>
                            <MenuItem>Notificación 2</MenuItem>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                            <Icon as={FaCog} w={6} h={6} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Configuración</MenuItem>
                            <MenuItem onClick={onLogout}>Cerrar Sesión</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <Container maxW="7xl" py={10}>
                <VStack spacing={8} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading size="xl" color={headingColor}>
                            Bienvenida, Soledad  {/*{user.name}*/}
                        </Heading>
                        <Button leftIcon={<FaChartLine />} colorScheme="teal" onClick={onDrawerOpen}>
                            Ver Análisis
                        </Button>
                    </Flex>

                    <StatGroup>
                        <Stat>
                            <StatLabel>Total Vehículos</StatLabel>
                            <StatNumber>{stats.totalVehicles}</StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                23.36%
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Entregas Activas</StatLabel>
                            <StatNumber>{stats.activeDeliveries}</StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                9.05%
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Total Clientes</StatLabel>
                            <StatNumber>{stats.totalClients}</StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                5.42%
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Ingresos</StatLabel>
                            <StatNumber>${stats.revenue.toLocaleString()}</StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                12.75%
                            </StatHelpText>
                        </Stat>
                    </StatGroup>

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>

                        {actionCards.map((card) => (
                            <ActionCard
                                key={card.title}
                                {...card}
                                onClick={() => handleCardClick(card.form)}
                            />
                        ))}
                    </Grid>

                    <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                        <Tabs>
                            <TabList>
                                <Tab>Informe de Entregas</Tab>
                                <Tab>Flota de Vehículos</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                        <Heading size="lg" color={headingColor}>Informe de Entregas</Heading>
                                        <Button
                                            leftIcon={<FaFileExport />}
                                            colorScheme="teal"
                                            onClick={() => exportToCSV(entregas, 'registros_entrega.csv')}
                                        >
                                            Exportar a CSV
                                        </Button>
                                    </Flex>
                                    <Table variant="simple">
                                        <TableCaption>Registros de entrega</TableCaption>
                                        <Thead>
                                            <Tr>
                                                <Th>Cliente</Th>
                                                <Th>Fecha de Entrega</Th>
                                                <Th>Ubicación</Th>
                                                <Th>Documento</Th>
                                                <Th>Vehículo</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {entregas.map((entrega, index) => (
                                                <Tr key={index}>
                                                    <Td>{entrega.cliente}</Td>
                                                    <Td>{entrega.fechaEntrega}</Td>
                                                    <Td>{entrega.ubicacion}</Td>
                                                    <Td>{entrega.documento}</Td>
                                                    <Td>{entrega.vehiculo}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                                <TabPanel>
                                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                        <Heading size="lg" color={headingColor}>Flota de Vehículos</Heading>
                                        <Button
                                            leftIcon={<FaFileExport />}
                                            colorScheme="teal"
                                            onClick={() => exportToCSV(flota, 'flota_vehiculos.csv')}
                                        >
                                            Exportar a CSV
                                        </Button>
                                    </Flex>
                                    <Table variant="simple">
                                        <TableCaption>Flota de Camionetas</TableCaption>
                                        <Thead>
                                            <Tr>
                                                <Th>ID</Th>
                                                <Th>Marca</Th>
                                                <Th>Modelo</Th>
                                                <Th>Patente</Th>
                                                <Th>Estado</Th>
                                                <Th>Responsable</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {flota.map((vehiculo) => (
                                                <Tr key={vehiculo.id}>
                                                    <Td>{vehiculo.id}</Td>
                                                    <Td>{vehiculo.marca}</Td>
                                                    <Td>{vehiculo.modelo}</Td>
                                                    <Td>{vehiculo.patente}</Td>
                                                    <Td>{vehiculo.estado}</Td>
                                                    <Td>{vehiculo.responsable}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>

                    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {activeForm === 'vehicle' && <RegistrarVehiculo onSubmit={(data) => handleFormSubmit('vehiculo', data)} />}
                                {activeForm === 'client' && <RegistrarCliente onSubmit={(data) => handleFormSubmit('cliente', data)} />}
                                {activeForm === 'delivery' && <RegistroEntrega flota={flota} onSubmit={(data) => handleFormSubmit('entrega', data)} />}
                                {activeForm === 'facturas' && <RegistrarFacturas />}
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                    <Drawer
                        isOpen={isDrawerOpen}
                        placement="right"
                        onClose={onDrawerClose}
                        size="lg"
                    >
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>Análisis de Datos</DrawerHeader>

                            <DrawerBody>
                                <VStack spacing={8} align="stretch">
                                    <Box>
                                        <Heading size="md" mb={4}>Tendencia de Entregas</Heading>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="entregas" stroke="#8884d8" activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    <Box>
                                        <Heading size="md" mb={4}>Estadísticas Mensuales</Heading>
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th>Mes</Th>
                                                    <Th>Entregas</Th>
                                                    <Th>Ingresos</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {chartData.map((data, index) => (
                                                    <Tr key={index}>
                                                        <Td>{data.name}</Td>
                                                        <Td>{data.entregas}</Td>
                                                        <Td>${data.ingresos.toLocaleString()}</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </Box>
                                </VStack>
                            </DrawerBody>

                            <DrawerFooter>
                                <Button variant="outline" mr={3} onClick={onDrawerClose}>
                                    Cerrar
                                </Button>
                                <Button colorScheme="blue" onClick={() => exportToCSV(chartData, 'analisis_datos.csv')}>Exportar Datos</Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </VStack>
            </Container>

            <Box as="footer" bg={cardBgColor} color={textColor} py={4} mt={8}>
                <Container maxW="7xl">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text>&copy; 2024 Admin Panel. Todos los derechos reservados.</Text>
                        <Flex>
                            <Button variant="ghost" leftIcon={<MdHelp />} mr={2}>
                                Ayuda
                            </Button>
                            <Button variant="ghost" leftIcon={<FaCog />}>
                                Configuración
                            </Button>
                        </Flex>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminPanel;