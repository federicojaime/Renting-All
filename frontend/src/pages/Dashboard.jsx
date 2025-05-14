// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Button, Flex, Heading, SimpleGrid, Text, VStack, HStack,
    Card, CardBody, CardHeader, useDisclosure, useToast, Badge,
    Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay,
    ModalContent, ModalBody, ModalCloseButton,
    useColorModeValue
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import {
    FaClipboardList, FaUsers, FaCar, FaEllipsisV
} from 'react-icons/fa';
import {
    IoCarSport
} from 'react-icons/io5';
import {
    HiCurrencyDollar
} from 'react-icons/hi';

// Componentes
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import DashboardCard from '../components/cards/DashboardCard';
import ActionCard from '../components/cards/ActionCard';
import AreaChart from '../components/charts/AreaChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import EntregasTable from '../components/tables/EntregasTable';
import FlotaTable from '../components/tables/FlotaTable';
import ClientTable from '../components/tables/ClientTable';

// Formularios
import RegistroEntrega from '../forms/RegistroEntrega';
import RegistrarVehiculo from '../forms/RegistrarVehiculo';
import RegistrarCliente from '../forms/RegistrarCliente';
import RegistrarFacturas from '../forms/RegistrarFacturas';

// Hooks y servicios
import useApi from '../hooks/useApi';
import { useSidebarResponsive } from '../hooks/useResponsive';
import { exportToExcel, exportFormats } from '../utils/exportUtils';

// Datos
import { actionCards } from '../constants/navItems';
import { SAMPLE_CHART_DATA } from '../constants/theme';

/**
 * Componente principal del Dashboard
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onLogout - Función para cerrar sesión
 * @param {Object} props.user - Datos del usuario actual
 * @returns {JSX.Element} Componente Dashboard
 */
const Dashboard = ({ onLogout, user }) => {
    // Estados y hooks
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarResponsive();
    const [activeForm, setActiveForm] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCount, setNotificationCount] = useState(3);
    const [vehiclesByType, setVehiclesByType] = useState([
        { name: 'SUV', value: 35 },
        { name: 'Sedán', value: 25 },
        { name: 'Hatchback', value: 20 },
        { name: 'Pickup', value: 15 },
        { name: 'Van', value: 5 },
    ]);

    // Chakra UI hooks
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // API hooks para cada recurso
    const {
        data: entregas,
        isLoading: loadingEntregas,
        fetchData: fetchEntregas,
        updateResource: updateEntrega
    } = useApi('/entregas', {
        formatResponse: (data) => data.map(entrega => ({
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
        }))
    });

    const {
        data: flota,
        isLoading: loadingFlota,
        fetchData: fetchFlota,
        updateResource: updateVehiculo
    } = useApi('/vehiculos');

    const {
        data: clientes,
        isLoading: loadingClientes,
        fetchData: fetchClientes,
        updateResource: updateCliente,
        deleteResource: deleteCliente
    } = useApi('/clientes');

    const {
        data: stats = {
            totalVehicles: 0,
            activeDeliveries: 0,
            totalClients: 0,
            revenue: 0,
            growthRate: 12.5
        },
        fetchData: fetchStats
    } = useApi('/stats');

    const {
        data: chartData = SAMPLE_CHART_DATA,
        fetchData: fetchChartData
    } = useApi('/stats/chart');

    // Efectos
    useEffect(() => {
        // Detección de pantalla pequeña
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 992);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Manejador de clic en tarjeta de acción
    const handleCardClick = (form) => {
        setActiveForm(form);
        onOpen();
    };

    // Manejador de envío de formulario
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

            const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (response.ok) {
                onClose();
                // Actualizar datos
                fetchEntregas();
                fetchFlota();
                fetchClientes();
                fetchStats();
                fetchChartData();

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
                throw new Error(responseData.message || 'Error en la operación');
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

    // Colores según el modo (claro/oscuro)
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBgColor = useColorModeValue('white', 'gray.800');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box bg={bgColor} minH="100vh">
            {/* Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Contenido principal */}
            <Box
                ml={isSidebarOpen ? { base: 0, md: "250px" } : { base: 0, md: "70px" }}
                transition="all 0.3s ease"
                position="relative"
            >
                {/* Header */}
                <Header
                    isSmallScreen={isSmallScreen}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    notificationCount={notificationCount}
                    onLogout={onLogout}
                    user={user}
                />

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
                                value={stats?.totalVehicles?.toLocaleString?.() || '0'}
                                description="Unidades registradas"
                                icon={IoCarSport}
                                color="primary"
                                percentage="8.5"
                                isPositive={true}
                            />

                            <DashboardCard
                                title="Entregas Activas"
                                value={stats?.activeDeliveries?.toLocaleString?.() || '0'}
                                description="En proceso"
                                icon={FaClipboardList}
                                color="success"
                                percentage="12.3"
                                isPositive={true}
                            />

                            <DashboardCard
                                title="Total Clientes"
                                value={stats?.totalClients?.toLocaleString?.() || '0'}
                                description="Registrados"
                                icon={FaUsers}
                                color="secondary"
                                percentage="5.2"
                                isPositive={true}
                            />

                            <DashboardCard
                                title="Ingresos"
                                value={`$${stats?.revenue?.toLocaleString?.() || '0'}`}
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
                                    <AreaChart
                                        data={chartData}
                                        title="Tendencia de Entregas"
                                        dataKey="entregas"
                                        tooltipLabel="entregas"
                                        onExport={() => exportToExcel(
                                            chartData,
                                            'tendencia_entregas',
                                            { name: 'Mes', entregas: 'Entregas', ingresos: 'Ingresos ($)' },
                                            (message) => toast({
                                                title: '¡Exportación exitosa!',
                                                description: message,
                                                status: 'success',
                                                duration: 3000,
                                                isClosable: true,
                                                position: 'bottom-right',
                                            }),
                                            (message) => toast({
                                                title: 'Error',
                                                description: message,
                                                status: 'error',
                                                duration: 5000,
                                                isClosable: true,
                                                position: 'bottom-right',
                                            })
                                        )}
                                    />
                                </CardHeader>
                            </Card>

                            <Card variant="outline" borderRadius="xl" boxShadow="sm">
                                <CardHeader pb={0}>
                                    <BarChart
                                        data={chartData}
                                        title="Ingresos Mensuales"
                                        dataKey="ingresos"
                                        tooltipLabel="Ingresos"
                                        formatValue={(value) => `$${value.toLocaleString()}`}
                                        onExport={() => exportToExcel(
                                            chartData,
                                            'ingresos_mensuales',
                                            { name: 'Mes', ingresos: 'Ingresos ($)' },
                                            (message) => toast({
                                                title: '¡Exportación exitosa!',
                                                description: message,
                                                status: 'success',
                                                duration: 3000,
                                                isClosable: true,
                                                position: 'bottom-right',
                                            }),
                                            (message) => toast({
                                                title: 'Error',
                                                description: message,
                                                status: 'error',
                                                duration: 5000,
                                                isClosable: true,
                                                position: 'bottom-right',
                                            })
                                        )}
                                    />
                                </CardHeader>
                            </Card>
                        </SimpleGrid>

                        {/* Segunda fila de dashboard - Distribución de flota y últimas entregas */}
                        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                            <Card variant="outline" borderRadius="xl" boxShadow="sm">
                                <CardHeader pb={0}>
                                    <PieChart
                                        data={vehiclesByType}
                                        title="Distribución de Flota"
                                    />
                                </CardHeader>
                            </Card>

                            <Card variant="outline" borderRadius="xl" boxShadow="sm" gridColumn={{ lg: "span 2" }}>
                                <CardHeader>
                                    <Heading size="md">Últimas Entregas</Heading>
                                </CardHeader>
                                <CardBody>
                                    <VStack spacing={4} align="stretch">
                                        {entregas && entregas.slice(0, 3).map((entrega, index) => (
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
                                                leftIcon={<FaEllipsisV />}
                                                colorScheme="teal"
                                                borderRadius="full"
                                                onClick={() => exportToExcel(
                                                    entregas || [],
                                                    exportFormats.entregas.filename,
                                                    exportFormats.entregas.headers,
                                                    (message) => toast({
                                                        title: '¡Exportación exitosa!',
                                                        description: message,
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
                                                        position: 'bottom-right',
                                                    }),
                                                    (message) => toast({
                                                        title: 'Error',
                                                        description: message,
                                                        status: 'error',
                                                        duration: 5000,
                                                        isClosable: true,
                                                        position: 'bottom-right',
                                                    })
                                                )}
                                            >
                                                Exportar
                                            </Button>
                                        </Flex>

                                        <Box overflowX="auto">
                                            {entregas && (
                                                <EntregasTable
                                                    data={entregas}
                                                    onUpdate={async (id, updatedData) => {
                                                        try {
                                                            const result = await updateEntrega(id, updatedData);
                                                            if (result.success) {
                                                                toast({
                                                                    title: '¡Actualización exitosa!',
                                                                    description: 'La entrega ha sido actualizada correctamente.',
                                                                    status: 'success',
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                    position: 'bottom-right',
                                                                    variant: 'solid',
                                                                });
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
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </TabPanel>

                                    {/* Panel de Flota */}
                                    <TabPanel>
                                        <Flex justifyContent="space-between" alignItems="center" mb={6}>
                                            <Heading size="md" color={headingColor}>Flota de Vehículos</Heading>
                                            <Button
                                                leftIcon={<FaEllipsisV />}
                                                colorScheme="teal"
                                                borderRadius="full"
                                                onClick={() => exportToExcel(
                                                    flota || [],
                                                    exportFormats.vehiculos.filename,
                                                    exportFormats.vehiculos.headers,
                                                    (message) => toast({
                                                        title: '¡Exportación exitosa!',
                                                        description: message,
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
                                                        position: 'bottom-right',
                                                    }),
                                                    (message) => toast({
                                                        title: 'Error',
                                                        description: message,
                                                        status: 'error',
                                                        duration: 5000,
                                                        isClosable: true,
                                                        position: 'bottom-right',
                                                    })
                                                )}
                                            >
                                                Exportar
                                            </Button>
                                        </Flex>

                                        <Box overflowX="auto">
                                            {flota && (
                                                <FlotaTable
                                                    data={flota}
                                                    onUpdate={async (id, updatedData) => {
                                                        try {
                                                            const result = await updateVehiculo(id, updatedData);
                                                            if (result.success) {
                                                                toast({
                                                                    title: '¡Actualización exitosa!',
                                                                    description: 'El vehículo ha sido actualizado correctamente.',
                                                                    status: 'success',
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                    position: 'bottom-right',
                                                                    variant: 'solid',
                                                                });
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
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </TabPanel>

                                    {/* Panel de Clientes */}
                                    <TabPanel>
                                        <Flex justifyContent="space-between" alignItems="center" mb={6}>
                                            <Heading size="md" color={headingColor}>Lista de Clientes</Heading>
                                            <Button
                                                leftIcon={<FaEllipsisV />}
                                                colorScheme="teal"
                                                borderRadius="full"
                                                onClick={() => exportToExcel(
                                                    clientes || [],
                                                    exportFormats.clientes.filename,
                                                    exportFormats.clientes.headers,
                                                    (message) => toast({
                                                        title: '¡Exportación exitosa!',
                                                        description: message,
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
                                                        position: 'bottom-right',
                                                    }),
                                                    (message) => toast({
                                                        title: 'Error',
                                                        description: message,
                                                        status: 'error',
                                                        duration: 5000,
                                                        isClosable: true,
                                                        position: 'bottom-right',
                                                    })
                                                )}
                                            >
                                                Exportar
                                            </Button>
                                        </Flex>

                                        <Box overflowX="auto">
                                            {clientes && (
                                                <ClientTable
                                                    data={clientes}
                                                    onUpdate={async (id, updatedData) => {
                                                        try {
                                                            const result = await updateCliente(id, updatedData);
                                                            if (result.success) {
                                                                toast({
                                                                    title: '¡Actualización exitosa!',
                                                                    description: 'El cliente ha sido actualizado correctamente.',
                                                                    status: 'success',
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                    position: 'bottom-right',
                                                                    variant: 'solid',
                                                                });
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
                                                        }
                                                    }}
                                                    onDelete={async (id) => {
                                                        try {
                                                            const result = await deleteCliente(id);
                                                            if (result.success) {
                                                                toast({
                                                                    title: '¡Eliminación exitosa!',
                                                                    description: 'El cliente ha sido eliminado correctamente.',
                                                                    status: 'success',
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                    position: 'bottom-right',
                                                                    variant: 'solid',
                                                                });
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
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Card>

                        {/* Footer */}
                        <Footer />
                    </VStack>
                </Box>
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
        </Box>
    );
};

export default Dashboard;