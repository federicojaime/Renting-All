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
    FormControl,
    FormLabel,
    FormErrorMessage
} from '@chakra-ui/react';
import { FaFileExport, FaSave } from 'react-icons/fa';
import { MdOutlineNoteAdd } from 'react-icons/md';
import ApiService from '../services/api';

const RegistrarFacturas = ({ onSubmit }) => {
    const [vehiculos, setVehiculos] = useState([]);
    const [selectedVehiculo, setSelectedVehiculo] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [facturas, setFacturas] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        fetchVehiculos();
    }, []);

    useEffect(() => {
        if (selectedVehiculo && selectedYear) {
            fetchFacturas();
        }
    }, [selectedVehiculo, selectedYear]);

    const fetchVehiculos = async () => {
        try {
            const response = await ApiService.get('/vehiculos');
            if (response.ok) {
                setVehiculos(response.data);
            } else {
                throw new Error(response.msg || 'Error al obtener los vehículos');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los vehículos',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const fetchFacturas = async () => {
        setIsLoading(true);
        try {
            const response = await ApiService.get(
                `/facturas/vehiculo/${selectedVehiculo}/${selectedYear}`
            );
            if (response.ok) {
                organizarFacturas(response.data);
            } else {
                throw new Error(response.msg || 'Error al obtener las facturas');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las facturas',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const organizarFacturas = (facturasData) => {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        const facturasOrganizadas = meses.reduce((acc, mes) => {
            const facturaDelMes = facturasData.find(f => {
                const fecha = new Date(f.fecha);
                return fecha.getMonth() === meses.indexOf(mes);
            });

            acc[mes] = facturaDelMes || {
                fecha: '',
                numero: '',
                monto: '',
                pagado: false,
                notas: ''
            };
            return acc;
        }, {});

        setFacturas({
            ...facturas,
            [selectedVehiculo]: {
                ...facturas[selectedVehiculo],
                [selectedYear]: facturasOrganizadas
            }
        });
    };

    const validateFactura = (factura) => {
        const errors = {};
        if (factura.fecha && !isValidDate(factura.fecha)) {
            errors.fecha = 'Fecha inválida';
        }
        if (factura.numero && factura.numero.trim().length < 3) {
            errors.numero = 'Número de factura inválido';
        }
        if (factura.monto && (isNaN(factura.monto) || Number(factura.monto) <= 0)) {
            errors.monto = 'Monto inválido';
        }
        return errors;
    };

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    };
    const handleFacturaChange = async (mes, campo, valor) => {
        setFacturas(prevFacturas => ({
            ...prevFacturas,
            [selectedVehiculo]: {
                ...prevFacturas[selectedVehiculo],
                [selectedYear]: {
                    ...prevFacturas[selectedVehiculo][selectedYear],
                    [mes]: {
                        ...prevFacturas[selectedVehiculo][selectedYear][mes],
                        [campo]: valor
                    }
                }
            }
        }));
    };

    const guardarFacturas = async () => {
        setIsSaving(true);
        try {
            const facturasParaGuardar = [];
            Object.entries(facturas[selectedVehiculo][selectedYear]).forEach(([mes, factura]) => {
                if (factura.fecha || factura.numero || factura.monto) {
                    const errors = validateFactura(factura);
                    if (Object.keys(errors).length > 0) {
                        throw new Error(`Errores en factura de ${mes}: ${Object.values(errors).join(', ')}`);
                    }
                    facturasParaGuardar.push({
                        ...factura,
                        vehiculo_id: selectedVehiculo,
                        mes: mes,
                        year: selectedYear
                    });
                }
            });

            const response = await ApiService.post('/facturas/batch', { facturas: facturasParaGuardar });

            if (response.ok) {
                toast({
                    title: 'Éxito',
                    description: 'Las facturas han sido guardadas correctamente',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                fetchFacturas(); // Recargar datos
            } else {
                throw new Error(response.msg || 'Error al guardar las facturas');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Hubo un problema al guardar las facturas',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const exportarACSV = () => {
        try {
            const vehiculo = vehiculos.find(v => v.id === selectedVehiculo);
            if (!vehiculo) throw new Error('Vehículo no encontrado');

            let csvContent = "Mes,Fecha,Número,Monto,Pagado,Notas\n";

            Object.entries(facturas[selectedVehiculo][selectedYear]).forEach(([mes, factura]) => {
                csvContent += `${mes},${factura.fecha},${factura.numero},${factura.monto},${factura.pagado ? 'Sí' : 'No'},"${factura.notas}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `facturas_${vehiculo.patente}_${selectedYear}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: 'Exportación exitosa',
                description: 'El archivo CSV ha sido descargado',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'No se pudo exportar el archivo',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW={{ base: 'full', md: 'container.xl' }} py={10}>
            <VStack spacing={8} align="stretch">
                <Heading size="xl" color={textColor} textAlign="center">
                    Registro de Facturas
                </Heading>

                <HStack spacing={4} flexWrap="wrap" justifyContent="center">
                    <Select
                        value={selectedVehiculo}
                        onChange={(e) => setSelectedVehiculo(e.target.value)}
                        placeholder="Seleccione un vehículo"
                        maxW={{ base: 'full', md: '300px' }}
                        isDisabled={isLoading}
                    >
                        {vehiculos.map((vehiculo) => (
                            <option key={vehiculo.id} value={vehiculo.id}>
                                {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                            </option>
                        ))}
                    </Select>

                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        maxW={{ base: 'full', md: '150px' }}
                        isDisabled={isLoading}
                    >
                        {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </Select>

                    <HStack>
                        <IconButton
                            icon={<FaSave />}
                            colorScheme="blue"
                            onClick={guardarFacturas}
                            isLoading={isSaving}
                            aria-label="Guardar facturas"
                        />
                        <IconButton
                            icon={<FaFileExport />}
                            colorScheme="teal"
                            onClick={exportarACSV}
                            isDisabled={!selectedVehiculo || isLoading}
                            aria-label="Exportar a CSV"
                        />
                    </HStack>
                </HStack>

                {selectedVehiculo && facturas[selectedVehiculo]?.[selectedYear] && (
                    <Box borderWidth={1} borderRadius="lg" p={6} bg={bgColor} shadow="md">
                        <Table variant="simple" size="sm">
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
                                {Object.entries(facturas[selectedVehiculo][selectedYear]).map(([mes, factura]) => (
                                    <Tr key={mes}>
                                        <Td>{mes}</Td>
                                        <Td>
                                            <Input
                                                type="date"
                                                value={factura.fecha}
                                                onChange={(e) => handleFacturaChange(mes, 'fecha', e.target.value)}
                                                size="sm"
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={factura.numero}
                                                onChange={(e) => handleFacturaChange(mes, 'numero', e.target.value)}
                                                placeholder="Número"
                                                size="sm"
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                type="number"
                                                value={factura.monto}
                                                onChange={(e) => handleFacturaChange(mes, 'monto', e.target.value)}
                                                placeholder="Monto"
                                                size="sm"
                                            />
                                        </Td>
                                        <Td>
                                            <Checkbox
                                                isChecked={factura.pagado}
                                                onChange={(e) => handleFacturaChange(mes, 'pagado', e.target.checked)}
                                            />
                                        </Td>
                                        <Td>
                                            <Input
                                                value={factura.notas}
                                                onChange={(e) => handleFacturaChange(mes, 'notas', e.target.value)}
                                                placeholder="Notas"
                                                size="sm"
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default RegistrarFacturas;