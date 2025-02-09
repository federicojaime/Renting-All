import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack,
    useToast, Heading, Container, InputGroup, InputLeftElement,
    Select, useColorModeValue, FormErrorMessage,
} from '@chakra-ui/react';
import { FaUser, FaBuilding, FaIdCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const RegistrarCliente = ({ onSubmit }) => {
    const [clienteData, setClienteData] = useState({
        tipoCliente: 'persona',
        nombre: '',
        razonSocial: '',
        dniCuit: '',
        telefono: '',
        email: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const validateField = (name, value) => {
        switch (name) {
            case 'nombre':
                return clienteData.tipoCliente === 'persona' && value.trim().length < 3
                    ? 'El nombre debe tener al menos 3 caracteres'
                    : '';
            case 'razonSocial':
                return clienteData.tipoCliente === 'empresa' && value.trim().length < 3
                    ? 'La razón social debe tener al menos 3 caracteres'
                    : '';
            case 'dniCuit':
                if (clienteData.tipoCliente === 'persona') {
                    return !/^\d{7,8}$/.test(value)
                        ? 'El DNI debe tener entre 7 y 8 números'
                        : '';
                } else {
                    return !/^\d{11}$/.test(value)
                        ? 'El CUIT debe tener 11 números'
                        : '';
                }
            case 'telefono':
                return !/^\d{10}$/.test(value)
                    ? 'El teléfono debe tener 10 números'
                    : '';
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'El email no es válido'
                    : '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(clienteData).forEach(key => {
            if (key === 'razonSocial' && clienteData.tipoCliente === 'persona') return;
            if (key === 'nombre' && clienteData.tipoCliente === 'empresa') return;

            const error = validateField(key, clienteData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (name === 'tipoCliente') {
            setClienteData(prev => ({
                ...prev,
                nombre: '',
                razonSocial: '',
                dniCuit: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast({
                title: 'Error de validación',
                description: 'Por favor, corrija los errores en el formulario',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = {
                tipoCliente: clienteData.tipoCliente,
                dniCuit: clienteData.dniCuit,
                telefono: clienteData.telefono,
                email: clienteData.email,
                nombre: clienteData.tipoCliente === 'persona' ? clienteData.nombre : '',
                razonSocial: clienteData.tipoCliente === 'empresa' ? clienteData.razonSocial : ''
            };

            const result = await onSubmit(dataToSend);

            console.log(result);


            // Verificamos si hay errores en la respuesta
            if (result != undefined > 0) {
                // Mostramos el primer error del array de errores
               
                return; // Salimos sin limpiar el formulario
            }

            // Si llegamos aquí, la operación fue exitosa
            setClienteData({
                tipoCliente: 'persona',
                nombre: '',
                razonSocial: '',
                dniCuit: '',
                telefono: '',
                email: '',
            });

            toast({
                title: 'Cliente registrado',
                description: 'El cliente ha sido registrado exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar el cliente',
                status: 'error',
                duration: 5000,
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
                            >
                                <option value="persona">Persona</option>
                                <option value="empresa">Entidad (Empresa, Estado, etc.)</option>
                            </Select>
                        </FormControl>

                        {clienteData.tipoCliente === 'persona' ? (
                            <FormControl id="nombre" isRequired isInvalid={!!errors.nombre}>
                                <FormLabel>Nombre Completo</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaUser color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                        type="text"
                                        name="nombre"
                                        value={clienteData.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                            </FormControl>
                        ) : (
                            <FormControl id="razonSocial" isRequired isInvalid={!!errors.razonSocial}>
                                <FormLabel>Razón Social</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaBuilding color="gray.300" />
                                    </InputLeftElement>
                                    <Input
                                        type="text"
                                        name="razonSocial"
                                        value={clienteData.razonSocial}
                                        onChange={handleChange}
                                        placeholder="Nombre de la empresa o entidad"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                            </FormControl>
                        )}

                        <FormControl id="dniCuit" isRequired isInvalid={!!errors.dniCuit}>
                            <FormLabel>{clienteData.tipoCliente === 'persona' ? 'DNI' : 'CUIT'}</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <FaIdCard color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="text"
                                    name="dniCuit"
                                    value={clienteData.dniCuit}
                                    onChange={handleChange}
                                    placeholder={clienteData.tipoCliente === 'persona' ? 'DNI' : 'CUIT'}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.dniCuit}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="telefono" isRequired isInvalid={!!errors.telefono}>
                            <FormLabel>Teléfono</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <FaPhone color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="tel"
                                    name="telefono"
                                    value={clienteData.telefono}
                                    onChange={handleChange}
                                    placeholder="Número de teléfono"
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.telefono}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="email" isRequired isInvalid={!!errors.email}>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <InputGroup>
                                <InputLeftElement>
                                    <FaEnvelope color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="email"
                                    name="email"
                                    value={clienteData.email}
                                    onChange={handleChange}
                                    placeholder="Correo electrónico"
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="full"
                            mt={4}
                            isLoading={isSubmitting}
                            loadingText="Registrando..."
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                            disabled={isSubmitting}
                        >
                            Registrar Cliente
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default RegistrarCliente;