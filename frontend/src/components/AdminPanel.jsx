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
} from '@chakra-ui/react';
import { FaCar, FaUserPlus, FaClipboardList, FaSignOutAlt, FaFileExport } from 'react-icons/fa';
import RegistroEntrega from './RegistroEntrega';
import RegistrarVehiculo from './RegistrarVehiculo';
import RegistrarCliente from './RegistrarCliente';

const AdminPanel = ({ onLogout }) => {
    const [activeForm, setActiveForm] = useState(null);
    const [entregas, setEntregas] = useState([]);
    const [flota, setFlota] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const cardBgColor = useColorModeValue('white', 'gray.700');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.200');

    useEffect(() => {
        // Simular la carga de datos de la flota
        const flotaSimulada = [
            { id: 'NE8601', marca: 'AG-NISSAN', modelo: '15-FRONTIER 2.442 MT 2.3 D CD', adquisicion: '6/16/2022', motor: 'YS23B524L6504665', chasis: '3AN1CD23W1L524677', patente: 'AF924UA', titulo: 'ECONOM S.A', estado: 'ALQUILADA', responsable: 'OLGA ANA', ministerio: 'CINE CATAMARCA', precio: '********', compania: 'SANCOR SEGUROS', poliza: '515345', vencimiento: '6/12/2024' },
            // Agrega más vehículos aquí si es necesario
        ];
        setFlota(flotaSimulada);
    }, []);

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

    const handleFormSubmit = (formType, data) => {
        onClose();
        if (formType === 'entrega') {
            setEntregas([...entregas, data]);
        } else if (formType === 'vehículo') {
            setFlota([...flota, data]);
        }
        toast({
            title: 'Operación exitosa',
            description: `Se ha completado el registro de ${formType} correctamente.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
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
            <Container maxW="7xl" py={10}>
                <VStack spacing={8} align="stretch">
                    <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
                        <Heading size="xl" color={headingColor} mb={{ base: 4, md: 0 }}>
                            Panel de Administración
                        </Heading>
                        <Button
                            leftIcon={<FaSignOutAlt />}
                            colorScheme="red"
                            variant="solid"
                            onClick={onLogout}
                            size="lg"
                        >
                            Cerrar Sesión
                        </Button>
                    </Flex>

                    <Grid
                        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                        gap={8}
                    >
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
                                {activeForm === 'vehicle' && <RegistrarVehiculo onSubmit={(data) => handleFormSubmit('vehículo', data)} />}
                                {activeForm === 'client' && <RegistrarCliente onSubmit={() => handleFormSubmit('cliente')} />}
                                {activeForm === 'delivery' && <RegistroEntrega flota={flota} onSubmit={(data) => handleFormSubmit('entrega', data)} />}
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </VStack>
            </Container>
        </Box>
    );
};

export default AdminPanel;