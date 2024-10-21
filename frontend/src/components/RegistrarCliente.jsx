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
    Select,
    useColorModeValue,
    SimpleGrid,
} from '@chakra-ui/react';
import { FaUser, FaBuilding, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const RegistrarCliente = ({ onSubmit }) => {
    const [clienteData, setClienteData] = useState({
        tipoCliente: 'persona', // Persona o entidad
        nombre: '',
        razonSocial: '', // Solo para entidades
        dniCuit: '',
        telefono: '',
        email: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteData({
            ...clienteData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(clienteData);
            toast({
                title: 'Cliente registrado',
                description: 'El cliente ha sido registrado exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setClienteData({
                tipoCliente: 'persona',
                nombre: '',
                razonSocial: '',
                dniCuit: '',
                telefono: '',
                email: '',
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar el cliente.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
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
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Registrar Cliente
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl id="tipoCliente" isRequired>
                            <FormLabel>Tipo de Cliente</FormLabel>
                            <Select
                                name="tipoCliente"
                                value={clienteData.tipoCliente}
                                onChange={handleChange}
                                placeholder="Seleccione el tipo de cliente"
                            >
                                <option value="persona">Persona</option>
                                <option value="empresa">Entidad (Empresa, Estado, etc.)</option>
                            </Select>
                        </FormControl>

                        {clienteData.tipoCliente === 'persona' ? (
                            <>
                                <FormControl id="nombre" isRequired>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" children={<FaUser color="gray.300" />} />
                                        <Input
                                            type="text"
                                            name="nombre"
                                            value={clienteData.nombre}
                                            onChange={handleChange}
                                            placeholder="Nombre completo del cliente"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl id="dniCuit" isRequired>
                                    <FormLabel>DNI</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                        <Input
                                            type="text"
                                            name="dniCuit"
                                            value={clienteData.dniCuit}
                                            onChange={handleChange}
                                            placeholder="Número de DNI"
                                        />
                                    </InputGroup>
                                </FormControl>
                            </>
                        ) : (
                            <>
                                <FormControl id="razonSocial" isRequired>
                                    <FormLabel>Razón Social</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" children={<FaBuilding color="gray.300" />} />
                                        <Input
                                            type="text"
                                            name="razonSocial"
                                            value={clienteData.razonSocial}
                                            onChange={handleChange}
                                            placeholder="Nombre de la empresa o entidad"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl id="dniCuit" isRequired>
                                    <FormLabel>CUIT</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                        <Input
                                            type="text"
                                            name="dniCuit"
                                            value={clienteData.dniCuit}
                                            onChange={handleChange}
                                            placeholder="Número de CUIT"
                                        />
                                    </InputGroup>
                                </FormControl>
                            </>
                        )}

                        <FormControl id="telefono" isRequired>
                            <FormLabel>Teléfono</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaPhone color="gray.300" />} />
                                <Input
                                    type="tel"
                                    name="telefono"
                                    value={clienteData.telefono}
                                    onChange={handleChange}
                                    placeholder="Número de teléfono"
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="email" isRequired>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaEnvelope color="gray.300" />} />
                                <Input
                                    type="email"
                                    name="email"
                                    value={clienteData.email}
                                    onChange={handleChange}
                                    placeholder="Correo electrónico"
                                />
                            </InputGroup>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            mt={4}
                            isLoading={isSubmitting}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar Cliente'}
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    ); 
};

export default RegistrarCliente;
