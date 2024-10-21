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
} from '@chakra-ui/react';
import { FaCar, FaBarcode, FaCalendarAlt, FaCog, FaIdCard } from 'react-icons/fa';

const RegistrarVehiculo = ({ onSubmit }) => {
    const [vehiculoData, setVehiculoData] = useState({
        marca: '',
        modelo: '',
        patente: '',
        anio: '',
        motor: '',
        chasis: '',
    });

    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleChange = (e) => {
        setVehiculoData({
            ...vehiculoData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            onSubmit(vehiculoData);
            toast({
                title: 'Vehículo registrado',
                description: 'El vehículo ha sido registrado exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setVehiculoData({
                marca: '',
                modelo: '',
                patente: '',
                anio: '',
                motor: '',
                chasis: '',
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar el vehículo.',
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
                    Registrar Vehículo
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="marca" isRequired>
                            <FormLabel>Marca</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="marca"
                                    value={vehiculoData.marca}
                                    onChange={handleChange}
                                    placeholder="Marca del vehículo"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="modelo" isRequired>
                            <FormLabel>Modelo</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="modelo"
                                    value={vehiculoData.modelo}
                                    onChange={handleChange}
                                    placeholder="Modelo del vehículo"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="patente" isRequired>
                            <FormLabel>Patente</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="patente"
                                    value={vehiculoData.patente}
                                    onChange={handleChange}
                                    placeholder="Número de patente"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="anio" isRequired>
                            <FormLabel>Año</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} />
                                <Input
                                    type="number"
                                    name="anio"
                                    value={vehiculoData.anio}
                                    onChange={handleChange}
                                    placeholder="Año del vehículo"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="motor" isRequired>
                            <FormLabel>Número de Motor</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCog color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="motor"
                                    value={vehiculoData.motor}
                                    onChange={handleChange}
                                    placeholder="Número de motor"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="chasis" isRequired>
                            <FormLabel>Número de Chasis</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaBarcode color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="chasis"
                                    value={vehiculoData.chasis}
                                    onChange={handleChange}
                                    placeholder="Número de chasis"
                                />
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
                            Registrar Vehículo
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default RegistrarVehiculo;