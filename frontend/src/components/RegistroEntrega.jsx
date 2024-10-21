import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Heading,
    Container,
    InputGroup,
    InputLeftElement,
    useColorModeValue,
    Select,
} from '@chakra-ui/react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaFileAlt, FaCar } from 'react-icons/fa';

const RegistroEntrega = ({ onSubmit, flota = [] }) => {
    const [entregaData, setEntregaData] = useState({
        cliente: '',
        fechaEntrega: '',
        ubicacion: '',
        documento: '',
        vehiculo: '',
    });

    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleChange = (e) => {
        setEntregaData({
            ...entregaData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            onSubmit(entregaData);
            toast({
                title: 'Entrega registrada',
                description: 'La entrega ha sido registrada exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setEntregaData({
                cliente: '',
                fechaEntrega: '',
                ubicacion: '',
                documento: '',
                vehiculo: '',
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar la entrega.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="xl" py={10}>
            <Box
                bg={bgColor}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="lg"
                p={8}
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" mb={6}>
                    Registro de Entrega
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="cliente" isRequired>
                            <FormLabel>Cliente</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaUser color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="cliente"
                                    value={entregaData.cliente}
                                    onChange={handleChange}
                                    placeholder="Nombre del cliente"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="fechaEntrega" isRequired>
                            <FormLabel>Fecha de Entrega</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} /><Input
                                    type="date"
                                    name="fechaEntrega"
                                    value={entregaData.fechaEntrega}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="ubicacion" isRequired>
                            <FormLabel>Ubicación</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaMapMarkerAlt color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="ubicacion"
                                    value={entregaData.ubicacion}
                                    onChange={handleChange}
                                    placeholder="Lugar de entrega"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="documento" isRequired>
                            <FormLabel>Documento</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaFileAlt color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="documento"
                                    value={entregaData.documento}
                                    onChange={handleChange}
                                    placeholder="Número de documento"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="vehiculo" isRequired>
                            <FormLabel>Vehículo</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Select
                                    name="vehiculo"
                                    value={entregaData.vehiculo}
                                    onChange={handleChange}
                                    placeholder="Seleccione un vehículo"
                                >
                                    {flota && flota.length > 0 ? (
                                        flota.map((vehiculo) => (
                                            <option key={vehiculo.id} value={vehiculo.id}>
                                                {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay vehículos disponibles</option>
                                    )}
                                </Select>
                            </InputGroup>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            mt={4}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                        >
                            Registrar Entrega
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default RegistroEntrega;