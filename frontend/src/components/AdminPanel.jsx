import React, { useState, useEffect } from 'react';
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
    FaBell, FaChartLine
} from 'react-icons/fa';
import { MdDashboard, MdHelp } from 'react-icons/md';
import RegistroEntrega from './RegistroEntrega';
import RegistrarVehiculo from './RegistrarVehiculo';
import RegistrarCliente from './RegistrarCliente';
import RegistrarFacturas from './RegistrarFacturas';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ApiService from '../services/api';
import LogoCodeo from '../assets/icon.png';
import Logo from "../assets/logo-horizontal.png";
import * as XLSX from 'xlsx';
import FlotaTable from './FlotaTable';
import ClientTable from './ClientTable';
import EntregasTable from './EntregasTable';

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
    });
    const [chartData, setChartData] = useState([]);

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
        <Box bg={bgColor} minH="100vh">
            {/* Header */}
            <Flex as="header" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg={cardBgColor} color={headingColor}>
                <img src={Logo} alt="Admin Panel Logo" className="h-16 w-auto" />
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
                            <MenuItem onClick={onLogout}>Cerrar Sesión</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            <Container maxW="7xl" py={10}>
                <VStack spacing={8} align="stretch">
                    {/* Estadísticas */}
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={6}>
                        <Box
                            bg="blue.50"
                            p={6}
                            borderRadius="lg"
                            boxShadow="lg"
                            textAlign="center"
                            transition="all 0.3s"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'xl',
                            }}
                        >
                            <Text color="gray.600" fontSize="md" fontWeight="medium" mb={2}>
                                Total Vehículos
                            </Text>
                            <Text color="blue.600" fontSize="3xl" fontWeight="bold">
                                {stats.totalVehicles.toLocaleString()}
                            </Text>
                        </Box>

                        <Box
                            bg="green.50"
                            p={6}
                            borderRadius="lg"
                            boxShadow="lg"
                            textAlign="center"
                            transition="all 0.3s"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'xl',
                            }}
                        >
                            <Text color="gray.600" fontSize="md" fontWeight="medium" mb={2}>
                                Entregas Activas
                            </Text>
                            <Text color="green.600" fontSize="3xl" fontWeight="bold">
                                {stats.activeDeliveries.toLocaleString()}
                            </Text>
                        </Box>

                        <Box
                            bg="purple.50"
                            p={6}
                            borderRadius="lg"
                            boxShadow="lg"
                            textAlign="center"
                            transition="all 0.3s"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'xl',
                            }}
                        >
                            <Text color="gray.600" fontSize="md" fontWeight="medium" mb={2}>
                                Total Clientes
                            </Text>
                            <Text color="purple.600" fontSize="3xl" fontWeight="bold">
                                {stats.totalClients.toLocaleString()}
                            </Text>
                        </Box>
                    </Grid>

                    {/* Tarjetas de acción */}
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                        {actionCards.map((card) => (
                            <ActionCard
                                key={card.title}
                                {...card}
                                onClick={() => handleCardClick(card.form)}
                            />
                        ))}
                    </Grid>

                    {/* Tabs de contenido */}
                    <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="lg">
                        <Tabs>
                            <TabList>
                                <Tab>Informe de Entregas</Tab>
                                <Tab>Flota de Vehículos</Tab>
                                <Tab>Clientes</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Panel de Entregas */}
                                {/* Panel de Entregas */}
                                <TabPanel>
                                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                        <Heading size="lg" color={headingColor}>Informe de Entregas</Heading>
                                        <Button
                                            leftIcon={<FaFileExport />}
                                            colorScheme="teal"
                                            onClick={() => exportToExcel(entregas, 'registro_entregas', {
                                                cliente: 'Nombre del Cliente',
                                                fechaEntrega: 'Fecha de Entrega',
                                                ubicacion: 'Ubicación',
                                                documento: 'Documento',
                                                vehiculo: 'Vehículo Asignado'
                                            })}
                                        >
                                            Exportar a Excel
                                        </Button>
                                    </Flex>
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
                                                        title: 'Actualización exitosa',
                                                        description: 'La entrega ha sido actualizada correctamente.',
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
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
                                                });
                                                throw error;
                                            }
                                        }}
                                    />
                                </TabPanel>

                                {/* Panel de Flota */}
                                <TabPanel>
                                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                        <Heading size="lg" color={headingColor}>Flota de Vehículos</Heading>
                                        <Button
                                            leftIcon={<FaFileExport />}
                                            colorScheme="teal"
                                            onClick={() => exportToExcel(flota, 'flota_vehiculos', {
                                                id: 'ID',
                                                marca: 'Marca',
                                                modelo: 'Modelo',
                                                patente: 'Patente',
                                                estado: 'Estado',
                                                responsable: 'Responsable'
                                            })}
                                        >
                                            Exportar a Excel
                                        </Button>
                                    </Flex>
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
                                                        title: 'Actualización exitosa',
                                                        description: 'El vehículo ha sido actualizado correctamente.',
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
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
                                                });
                                                throw error;
                                            }
                                        }}
                                    />
                                </TabPanel>

                                {/* Panel de Clientes */}
                                <TabPanel>
                                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                        <Heading size="lg" color={headingColor}>Lista de Clientes</Heading>
                                        <Button
                                            leftIcon={<FaFileExport />}
                                            colorScheme="teal"
                                            onClick={() => exportToExcel(clientes, 'lista_clientes', {
                                                nombre: 'Nombre',
                                                documento: 'Documento',
                                                email: 'Email',
                                                telefono: 'Teléfono',
                                                direccion: 'Dirección'
                                            })}
                                        >
                                            Exportar a Excel
                                        </Button>
                                    </Flex>
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
                                                        title: 'Actualización exitosa',
                                                        description: 'El cliente ha sido actualizado correctamente.',
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
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
                                                        title: 'Eliminación exitosa',
                                                        description: 'El cliente ha sido eliminado correctamente.',
                                                        status: 'success',
                                                        duration: 3000,
                                                        isClosable: true,
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
                                                });
                                                throw error;
                                            }
                                        }}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </VStack>
            </Container>

            {/* Modal de formularios */}
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

            {/* Footer */}
            <Box as="footer" bg={cardBgColor} color={textColor} py={4} mt={8}>
                <Container maxW="7xl">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text mr={2}>&copy; 2025 Admin Panel.
                            <Link href="https://codeo.site/" display="flex" alignItems="center">
                                Desarrollado por Codeo.Ar <img src={LogoCodeo} alt="Logo Codeo" width={"3%"} />
                            </Link>
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminPanel;