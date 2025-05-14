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
} from '@chakra-ui/react';
import { FaSearch, FaEdit, FaTrash, FaSave, FaUser, FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ClientTable = ({ data, onUpdate, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [editingClient, setEditingClient] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = data.filter(client =>
            Object.values(client).some(value =>
                value && value.toString().toLowerCase().includes(term)
            )
        );
        setFilteredData(filtered);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        onOpen();
    };

    const handleDelete = async (clientId) => {
        if (window.confirm('¿Está seguro que desea eliminar este cliente?')) {
            try {
                await onDelete(clientId);
                toast({
                    title: "Éxito",
                    description: "Cliente eliminado correctamente",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el cliente",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingClient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Transformar los nombres de campos al formato esperado por el backend
            const updateData = {
                id: editingClient.id,
                tipoCliente: editingClient.tipo_cliente,
                nombre: editingClient.nombre,
                razonSocial: editingClient.razon_social || '', // Enviar string vacío si es null
                dniCuit: editingClient.dni_cuit,
                telefono: editingClient.telefono,
                email: editingClient.email
            };

            await onUpdate(editingClient.id, updateData);
            onClose();

            toast({
                title: "Éxito",
                description: "Los cambios se guardaron correctamente",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudieron guardar los cambios",
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
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>

            {filteredData.length === 0 ? (
                <Alert status="info">
                    <AlertIcon />
                    No se encontraron clientes
                </Alert>
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nombre - Razón Social</Th>
                            <Th>Documento</Th>
                            <Th>Email</Th>
                            <Th>Teléfono</Th>
                            <Th>Email</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredData.map((client) => (
                            <Tr key={client.id}>
                                <Td>{client.nombre || client.razon_social || '-'}</Td>
                                <Td>{client.dni_cuit}</Td>
                                <Td>{client.email}</Td>
                                <Td>{client.telefono}</Td>
                                <Td>{client.email}</Td>
                                <Td>
                                    <ButtonGroup spacing={2}>
                                        <IconButton
                                            aria-label="Editar cliente"
                                            icon={<FaEdit />}
                                            onClick={() => handleEdit(client)}
                                            colorScheme="blue"
                                            size="sm"
                                        />
                                        <IconButton
                                            aria-label="Eliminar cliente"
                                            icon={<FaTrash />}
                                            onClick={() => handleDelete(client.id)}
                                            colorScheme="red"
                                            size="sm"
                                        />
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Cliente</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {editingClient && (
                            <SimpleGrid columns={1} spacing={4}>
                                <FormControl>
                                    <FormLabel>Nombre</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaUser />} />
                                        <Input
                                            name="nombre"
                                            value={editingClient.nombre || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Documento</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaIdCard />} />
                                        <Input
                                            name="dni_cuit"
                                            value={editingClient.dni_cuit || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaEnvelope />} />
                                        <Input
                                            name="email"
                                            type="email"
                                            value={editingClient.email || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Teléfono</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaPhone />} />
                                        <Input
                                            name="telefono"
                                            value={editingClient.telefono || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </SimpleGrid>
                        )}

                        <Box mt={6} display="flex" justifyContent="flex-end" gap={4}>
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button
                                colorScheme="blue"
                                leftIcon={<FaSave />}
                                onClick={handleSave}
                            >
                                Guardar Cambios
                            </Button>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ClientTable;