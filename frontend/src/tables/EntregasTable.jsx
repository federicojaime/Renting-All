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
import { FaSearch, FaEye, FaUndo, FaSave, FaFilePdf, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { generarPDFEntrega } from '../components/EntregaPDF';
import ApiService from '../services/api';
import { motion } from 'framer-motion';

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
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Vehículo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Fecha Entrega
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredData.map((entrega, index) => (
                                <motion.tr
                                    key={entrega.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {entrega.cliente}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {entrega.documento}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                            {entrega.vehiculo}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(entrega.fechaEntrega).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            entrega.fechaDevolucion 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        }`}>
                                            {entrega.fechaDevolucion ? 'Completada' : 'En curso'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                            >
                                                <FaEdit />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                            >
                                                <FaCheck />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                            >
                                                <FaTrash />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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