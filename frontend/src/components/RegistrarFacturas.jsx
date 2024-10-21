import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
    Input,
    Textarea,
    useToast,
    VStack,
    HStack,
    Text,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useColorModeValue,
    Checkbox,
    IconButton,
} from '@chakra-ui/react';
import { FaFileExport } from 'react-icons/fa';
import { MdOutlineNoteAdd } from 'react-icons/md';

// Simulando una función para obtener datos de vehículos
const fetchVehiculos = async () => {
    return [
        {
            dominio: 'AF876QA',
            descripcion: 'Direcc.Sitios Cultur.y Recreativos - Alquiler de Camioneta AC -NISSAN dominio AF876QA - modelo 2023',
            total: 1200000,
            contacto: 'GUADALUPE 2664656594',
            fechaInicio: '2024-07-04',
            fechaFin: '2024-09-04'
        },
        {
            dominio: 'AF876QC',
            descripcion: 'Alquiler de Camioneta AC -NISSAN 15-FRONTIER S 4X2 MT 2.3 D CD Dominio AF876QC',
            total: 1600000,
            contacto: 'eprado@geopetrolsa.com.ar',
            cuit: '30715217194'
        },
        // ... más vehículos
    ];
};

const RegistrarFacturas = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [facturas, setFacturas] = useState({});
    const [notas, setNotas] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const buttonColorScheme = useColorModeValue('teal', 'blue');

    useEffect(() => {
        const cargarDatos = async () => {
            const vehiculosData = await fetchVehiculos();
            setVehiculos(vehiculosData);
        };
        cargarDatos();
    }, []);

    useEffect(() => {
        if (selectedVehiculo) {
            inicializarFacturas(selectedVehiculo, selectedYear);
        }
    }, [selectedVehiculo, selectedYear]);

    const inicializarFacturas = (dominio, year) => {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const facturasIniciales = meses.reduce((acc, mes) => {
            acc[mes] = {
                fecha: '',
                numero: '',
                monto: '',
                pagado: false,
                notas: ''
            };
            return acc;
        }, {});
        setFacturas(prevFacturas => ({
            ...prevFacturas,
            [dominio]: {
                ...prevFacturas[dominio],
                [year]: facturasIniciales
            }
        }));
    };

    const handleFacturaChange = (dominio, year, mes, campo, valor) => {
        setFacturas(prevFacturas => ({
            ...prevFacturas,
            [dominio]: {
                ...prevFacturas[dominio],
                [year]: {
                    ...prevFacturas[dominio][year],
                    [mes]: {
                        ...prevFacturas[dominio][year][mes],
                        [campo]: valor
                    }
                }
            }
        }));
    };

    const handleNotaChange = (dominio, nota) => {
        setNotas(prevNotas => ({
            ...prevNotas,
            [dominio]: nota
        }));
    };

    const exportarACSV = () => {
        let csvContent = "Dominio,Descripción,Año,Mes,Fecha,Número,Monto,Pagado,Notas\n";

        Object.entries(facturas).forEach(([dominio, years]) => {
            const vehiculo = vehiculos.find(v => v.dominio === dominio);
            Object.entries(years).forEach(([year, meses]) => {
                Object.entries(meses).forEach(([mes, factura]) => {
                    csvContent += `${dominio},${vehiculo.descripcion},${year},${mes},${factura.fecha},${factura.numero},${factura.monto},${factura.pagado ? 'Sí' : 'No'},${factura.notas}\n`;
                });
            });
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `facturas_${selectedYear}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        onClose();
        toast({
            title: "Exportación exitosa",
            description: "El archivo CSV ha sido descargado.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Container maxW={{ base: 'full', md: 'container.lg' }} py={10}>
            <VStack spacing={8} align="stretch">
                <Heading size="xl" color={textColor} textAlign="center">Registro de Facturas y Pagos</Heading>

                <HStack spacing={4} flexWrap="wrap" justifyContent="center">
                    <Select
                        value={selectedVehiculo}
                        onChange={(e) => setSelectedVehiculo(e.target.value)}
                        placeholder="Seleccione un vehículo"
                        maxW={{ base: 'full', md: '300px' }}
                    >
                        {vehiculos.map((vehiculo) => (
                            <option key={vehiculo.dominio} value={vehiculo.dominio}>
                                {vehiculo.dominio} - {vehiculo.descripcion}
                            </option>
                        ))}
                    </Select>
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        maxW={{ base: 'full', md: '150px' }}
                    >
                        {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </Select>
                    <IconButton
                        icon={<FaFileExport />}
                        colorScheme={buttonColorScheme}
                        onClick={onOpen}
                        aria-label="Exportar a CSV"
                        variant="outline"
                    />
                </HStack>

                {selectedVehiculo && (
                    <Box borderWidth={1} borderRadius="lg" p={6} bg={bgColor} shadow="md">
                        <VStack spacing={4} align="stretch">
                            <Heading size="md" color={textColor} textAlign="center">
                                {vehiculos.find(v => v.dominio === selectedVehiculo)?.descripcion}
                            </Heading>
                            <Flex justifyContent="space-between" wrap="wrap">
                                <Text><strong>CUIT:</strong> {vehiculos.find(v => v.dominio === selectedVehiculo)?.cuit || 'N/A'}</Text>
                                <Text><strong>Contacto:</strong> {vehiculos.find(v => v.dominio === selectedVehiculo)?.contacto}</Text>
                            </Flex>
                            <Textarea
                                placeholder="Notas generales del vehículo"
                                value={notas[selectedVehiculo] || ''}
                                onChange={(e) => handleNotaChange(selectedVehiculo, e.target.value)}
                                maxW="full"
                            />
                            <Table variant="striped" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Mes</Th>
                                        <Th>Fecha</Th>
                                        <Th>Número</Th>
                                        <Th>Monto</Th>
                                        <Th>Pagado</Th>
                                        <Th>Notas</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Object.entries(facturas[selectedVehiculo]?.[selectedYear] || {}).map(([mes, factura]) => (
                                        <Tr key={mes}>
                                            <Td>{mes}</Td>
                                            <Td>
                                                <Input
                                                    type="date"
                                                    value={factura.fecha}
                                                    onChange={(e) => handleFacturaChange(selectedVehiculo, selectedYear, mes, 'fecha', e.target.value)}
                                                    size="sm"
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    value={factura.numero}
                                                    onChange={(e) => handleFacturaChange(selectedVehiculo, selectedYear, mes, 'numero', e.target.value)}
                                                    placeholder="Número de factura"
                                                    size="sm"
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={factura.monto}
                                                    onChange={(e) => handleFacturaChange(selectedVehiculo, selectedYear, mes, 'monto', e.target.value)}
                                                    placeholder="Monto"
                                                    size="sm"
                                                />
                                            </Td>
                                            <Td>
                                                <Checkbox
                                                    isChecked={factura.pagado}
                                                    onChange={(e) => handleFacturaChange(selectedVehiculo, selectedYear, mes, 'pagado', e.target.checked)}
                                                    colorScheme={buttonColorScheme}
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    value={factura.notas}
                                                    onChange={(e) => handleFacturaChange(selectedVehiculo, selectedYear, mes, 'notas', e.target.value)}
                                                    placeholder="Notas"
                                                    size="sm"
                                                />
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </VStack>
                    </Box>
                )}
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Exportar Facturas</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>¿Estás seguro de que deseas exportar las facturas a CSV?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={buttonColorScheme} mr={3} onClick={exportarACSV}>
                            Exportar
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default RegistrarFacturas;
