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
    Select,
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
    Text,
    useToast,
    Alert,
    AlertIcon,
    SimpleGrid,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { FaSearch, FaEdit, FaSave, FaCar, FaIdCard, FaCalendarAlt, FaCog, FaBarcode, FaDollarSign, FaShieldAlt } from 'react-icons/fa';

const FlotaTable = ({ data, onUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = data.filter(vehicle =>
            Object.values(vehicle).some(value =>
                value && value.toString().toLowerCase().includes(term)
            )
        );
        setFilteredData(filtered);
    };

    const handleEdit = (vehicle) => {
        // Format the vehicle data for editing
        const formattedVehicle = {
            ...vehicle,
            nro_interno: vehicle.nro_interno,
            designacion: vehicle.designacion,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            fecha_adquisicion: vehicle.fecha_adquisicion ? vehicle.fecha_adquisicion.split('T')[0] : '',
            motor: vehicle.nro_motor,
            chasis: vehicle.nro_chasis,
            patente: vehicle.patente,
            titulo: vehicle.titulo,
            estado: vehicle.estado,
            responsable: vehicle.responsable,
            ministerio: vehicle.ministerio,
            precio: vehicle.precio,
            compania: vehicle.compania_seguro,
            nroPoliza: vehicle.nro_poliza,
            fecha_vencimiento: vehicle.fecha_vencimiento ? vehicle.fecha_vencimiento.split('T')[0] : ''
        };
        setEditingVehicle(formattedVehicle);
        onOpen();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingVehicle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const updateData = {
                nro_interno: editingVehicle.nro_interno,
                designacion: editingVehicle.designacion,
                marca: editingVehicle.marca,
                modelo: editingVehicle.modelo,
                adquisicion: editingVehicle.fecha_adquisicion,
                motor: editingVehicle.motor,
                chasis: editingVehicle.chasis,
                patente: editingVehicle.patente,
                titulo: editingVehicle.titulo,
                estado: editingVehicle.estado,
                responsable: editingVehicle.responsable,
                ministerio: editingVehicle.ministerio,
                precio: editingVehicle.precio,
                compania: editingVehicle.compania,
                nroPoliza: editingVehicle.nroPoliza,
                vencimiento: editingVehicle.fecha_vencimiento
            };

            await onUpdate(editingVehicle.id, updateData);
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
                    placeholder="Buscar vehículo..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>

            {filteredData.length === 0 ? (
                <Alert status="info">
                    <AlertIcon />
                    No se encontraron vehículos
                </Alert>
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nº Interno</Th>
                            <Th>Designación</Th>
                            <Th>Marca</Th>
                            <Th>Modelo</Th>
                            <Th>Patente</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredData.map((vehicle) => (
                            <Tr key={vehicle.id}>
                                <Td>{vehicle.nro_interno}</Td>
                                <Td>{vehicle.designacion}</Td>
                                <Td>{vehicle.marca}</Td>
                                <Td>{vehicle.modelo}</Td>
                                <Td>{vehicle.patente}</Td>
                                <Td>{vehicle.estado}</Td>
                                <Td>
                                    <IconButton
                                        aria-label="Editar vehículo"
                                        icon={<FaEdit />}
                                        onClick={() => handleEdit(vehicle)}
                                        colorScheme="blue"
                                        size="sm"
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Vehículo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {editingVehicle && (
                            <SimpleGrid columns={2} spacing={4}>
                                <FormControl>
                                    <FormLabel>Nº Interno</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaIdCard />} />
                                        <Input
                                            name="nro_interno"
                                            value={editingVehicle.nro_interno || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Designación</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaCar />} />
                                        <Input
                                            name="designacion"
                                            value={editingVehicle.designacion || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Marca</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaCar />} />
                                        <Input
                                            name="marca"
                                            value={editingVehicle.marca || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Modelo</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaCar />} />
                                        <Input
                                            name="modelo"
                                            value={editingVehicle.modelo || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Fecha de Adquisición</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaCalendarAlt />} />
                                        <Input
                                            type="date"
                                            name="fecha_adquisicion"
                                            value={editingVehicle.fecha_adquisicion || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Estado</FormLabel>
                                    <Select
                                        name="estado"
                                        value={editingVehicle.estado || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="DISPONIBLE">DISPONIBLE</option>
                                        <option value="ALQUILADA">ALQUILADA</option>
                                        <option value="NO_DISPONIBLE">NO DISPONIBLE</option>
                                        <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Número de Motor</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaCog />} />
                                        <Input
                                            name="motor"
                                            value={editingVehicle.motor || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Número de Chasis</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaBarcode />} />
                                        <Input
                                            name="chasis"
                                            value={editingVehicle.chasis || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Patente</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaIdCard />} />
                                        <Input
                                            name="patente"
                                            value={editingVehicle.patente || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Título</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaIdCard />} />
                                        <Input
                                            name="titulo"
                                            value={editingVehicle.titulo || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Responsable</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaIdCard />} />
                                        <Input
                                            name="responsable"
                                            value={editingVehicle.responsable || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Ministerio</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaIdCard />} />
                                        <Input
                                            name="ministerio"
                                            value={editingVehicle.ministerio || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Precio</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaDollarSign />} />
                                        <Input
                                            type="number"
                                            name="precio"
                                            value={editingVehicle.precio || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Compañía de Seguro</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaShieldAlt />} />
                                        <Input
                                            name="compania"
                                            value={editingVehicle.compania || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Nº Póliza</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaShieldAlt />} />
                                        <Input
                                            name="nro_poliza"
                                            value={editingVehicle.nro_poliza || ''}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Fecha de Vencimiento</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaCalendarAlt />} />
                                        <Input
                                            type="date"
                                            name="fecha_vencimiento"
                                            value={editingVehicle.fecha_vencimiento || ''}
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

export default FlotaTable;