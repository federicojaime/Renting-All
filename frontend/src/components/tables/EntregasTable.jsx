import React, { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    useToast,
    Alert,
    AlertIcon,
    SimpleGrid,
    FormControl,
    FormLabel,
    ButtonGroup,
    Text,
    Stack,
    Divider,
} from '@chakra-ui/react';
import { FaSearch, FaEye, FaUndo, FaSave, FaFilePdf } from 'react-icons/fa';
import { generarPDFEntrega } from './EntregaPDF';
import ApiService from '../../services/api';

const EntregasTable = ({ data, onUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [selectedEntrega, setSelectedEntrega] = useState(null);
    const [devolucionData, setDevolucionData] = useState({
        fechaDevolucion: '',
        lugarDevolucion: '',
        kilometrajeDevolucion: '',
        observaciones: ''
    });

    const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
    const { isOpen: isDevolucionOpen, onOpen: onDevolucionOpen, onClose: onDevolucionClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = data.filter(entrega =>
            Object.values(entrega).some(value =>
                value && value.toString().toLowerCase().includes(term)
            )
        );
        setFilteredData(filtered);
    };

    const handleView = async (entrega) => {
        console.log('Entrega:', entrega);
        try {
            // Hacer una llamada a la API para obtener los detalles completos
            const response = await ApiService.get(`/entrega/${entrega.id}`);
            if (response.ok) {
                // Combinar los datos existentes con los detalles adicionales
                const entregaCompleta = {
                    ...entrega,
                    ...response.data,

                    inventario: entrega.inventario  // Mantén el inventario original
                };
                setSelectedEntrega(entregaCompleta);
                onViewOpen();
            }
        } catch (error) {
            console.error('Error al obtener detalles:', error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los detalles completos",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDevolucion = (entrega) => {
        setSelectedEntrega(entrega);
        setDevolucionData({
            fechaDevolucion: new Date().toISOString().split('T')[0],
            lugarDevolucion: '',
            kilometrajeDevolucion: '',
            observaciones: ''
        });
        onDevolucionOpen();
    };

    const handleDevolucionChange = (e) => {
        const { name, value } = e.target;
        setDevolucionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDevolucionSubmit = async () => {
        try {
            await onUpdate(selectedEntrega.id, devolucionData);
            onDevolucionClose();
            toast({
                title: "Éxito",
                description: "Devolución registrada correctamente",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo registrar la devolución",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <InputGroup mb={4}>
                <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
                <Input
                    placeholder="Buscar entrega..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>

            {filteredData.length === 0 ? (
                <Alert status="info">
                    <AlertIcon />
                    No se encontraron entregas
                </Alert>
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Cliente</Th>
                            <Th>Fecha de Entrega</Th>
                            <Th>Ubicación</Th>
                            <Th>Documento</Th>
                            <Th>Vehículo</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredData.map((entrega) => (
                            <Tr key={entrega.id}>
                                <Td>{entrega.cliente}</Td>
                                <Td>{entrega.fechaEntrega}</Td>
                                <Td>{entrega.ubicacion}</Td>
                                <Td>{entrega.documento}</Td>
                                <Td>{entrega.vehiculo}</Td> {/* Esto ya es un string formateado */}
                                <Td>
                                    <ButtonGroup spacing={2}>
                                        <IconButton
                                            aria-label="Ver detalles"
                                            icon={<FaEye />}
                                            onClick={() => handleView(entrega)}
                                            colorScheme="blue"
                                            size="sm"
                                        />
                                        {/* ... resto de los botones */}
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            {/* Modal de Vista Detallada */}
            <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Detalles de la Entrega</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Button
                            leftIcon={<FaFilePdf />}
                            colorScheme="red"
                            size="sm"
                            mb={4}
                            onClick={() => {
                                const doc = generarPDFEntrega(selectedEntrega);
                                doc.save(`entrega-${selectedEntrega.id}.pdf`);
                            }}
                        >
                            Descargar PDF
                        </Button>
                        {selectedEntrega && (
                            <Stack spacing={4}>
                                <Box>
                                    <Text fontWeight="bold">Información del Cliente</Text>
                                    <Text>Nombre: {selectedEntrega.cliente}</Text>
                                    <Text>Documento: {selectedEntrega.documento}</Text>
                                </Box>
                                <Divider />
                                <Box>
                                    <Text fontWeight="bold">Información del Vehículo</Text>
                                    <Text>Vehículo: {selectedEntrega.vehiculo}</Text>
                                    <Text>Kilometraje: {selectedEntrega.kilometrajeEntrega}</Text>
                                    <Text>Nivel de Combustible: {selectedEntrega.nivelCombustible}</Text>
                                </Box>
                                <Divider />
                                <Box>
                                    <Text fontWeight="bold">Información de la Entrega</Text>
                                    <Text>Fecha: {selectedEntrega.fechaEntrega}</Text>
                                    <Text>Ubicación: {selectedEntrega.ubicacion}</Text>
                                    <Text>Funcionario que entrega: {selectedEntrega.funcionarioEntrega}</Text>
                                    <Text>Funcionario que recibe: {selectedEntrega.funcionarioRecibe}</Text>
                                </Box>
                                {!selectedEntrega.fechaDevolucion || selectedEntrega.fechaDevolucion === "0000-00-00" && (
                                    <>
                                        <Divider />
                                        <Box>
                                            <Text fontWeight="bold">Información de la Devolución</Text>
                                            <Text>Fecha: Sin Devolución</Text>
                                            <Text>Lugar: {selectedEntrega.lugarDevolucion ?? "No definido"}</Text>
                                            <Text>Kilometraje: {selectedEntrega.kilometrajeDevolucion ?? "No definido"}</Text>
                                        </Box>
                                    </>
                                )}

                            </Stack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal de Devolución */}
            <Modal isOpen={isDevolucionOpen} onClose={onDevolucionClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Registrar Devolución</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <SimpleGrid columns={1} spacing={4}>
                            <FormControl>
                                <FormLabel>Fecha de Devolución</FormLabel>
                                <Input
                                    name="fechaDevolucion"
                                    type="date"
                                    value={devolucionData.fechaDevolucion}
                                    onChange={handleDevolucionChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Lugar de Devolución</FormLabel>
                                <Input
                                    name="lugarDevolucion"
                                    value={devolucionData.lugarDevolucion}
                                    onChange={handleDevolucionChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Kilometraje de Devolución</FormLabel>
                                <Input
                                    name="kilometrajeDevolucion"
                                    type="number"
                                    value={devolucionData.kilometrajeDevolucion}
                                    onChange={handleDevolucionChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Observaciones</FormLabel>
                                <Input
                                    name="observaciones"
                                    value={devolucionData.observaciones}
                                    onChange={handleDevolucionChange}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <Box mt={6} display="flex" justifyContent="flex-end" gap={4}>
                            <Button onClick={onDevolucionClose}>Cancelar</Button>
                            <Button
                                colorScheme="blue"
                                leftIcon={<FaSave />}
                                onClick={handleDevolucionSubmit}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default EntregasTable;