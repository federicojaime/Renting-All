import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, VStack,
    useToast, Heading, Container, InputGroup, InputLeftElement,
    Select, useColorModeValue, FormErrorMessage, Text,
    Flex, Card, CardBody, CardHeader, Badge, Icon,
    Divider, HStack, Tooltip, Tabs, TabList, Tab, TabPanels, TabPanel,
    Grid, GridItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUser, FaBuilding, FaIdCard, FaPhone, FaEnvelope, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const MotionBox = motion(Box);

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
    const [formState, setFormState] = useState('editing'); // 'editing', 'submitting', 'success'
    const toast = useToast();
    
    // Estilos con tendencias 2025
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.700', 'gray.300');
    const inputBg = useColorModeValue('gray.50', 'gray.700');
    const successBg = useColorModeValue('green.50', 'green.900');
    const primaryColor = useColorModeValue('blue.500', 'blue.300');
    const secondaryColor = useColorModeValue('purple.500', 'purple.300');

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
                position: 'bottom-right',
                variant: 'solid',
            });
            return;
        }

        setIsSubmitting(true);
        setFormState('submitting');
        
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

            // Si hay errores en la respuesta
            if (result !== undefined && result.errors && result.errors.length > 0) {
                toast({
                    title: 'Error',
                    description: result.errors[0],
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                    variant: 'solid',
                });
                setFormState('editing');
                return;
            }

            // Éxito
            setFormState('success');
            setTimeout(() => {
                // Reiniciar el formulario después de mostrar el éxito
                setClienteData({
                    tipoCliente: 'persona',
                    nombre: '',
                    razonSocial: '',
                    dniCuit: '',
                    telefono: '',
                    email: '',
                });
                setFormState('editing');
            }, 3000);

            toast({
                title: '¡Cliente registrado!',
                description: 'El cliente ha sido registrado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom-right',
                variant: 'solid',
            });

        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar el cliente',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
                variant: 'solid',
            });
            setFormState('editing');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (formState === 'success') {
        return (
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                maxW="xl" 
                mx="auto"
                py={10}
            >
                <Card 
                    bg={successBg}
                    borderRadius="2xl"
                    boxShadow="xl"
                    p={8}
                    textAlign="center"
                >
                    <CardBody>
                        <Box 
                            mx="auto" 
                            mb={6}
                            bg="green.100" 
                            color="green.600" 
                            w="80px" 
                            h="80px" 
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={FaCheckCircle} w="40px" h="40px" />
                        </Box>
                        <Heading size="lg" mb={4} color="green.700">
                            ¡Cliente registrado con éxito!
                        </Heading>
                        <Text color="green.700" mb={6}>
                            Los datos del cliente han sido guardados correctamente en el sistema.
                        </Text>
                    </CardBody>
                </Card>
            </MotionBox>
        );
    }

    return (
        <Container maxW="xl" py={10}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card
                    bg={cardBg}
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius="xl"
                    boxShadow="xl"
                    overflow="hidden"
                    position="relative"
                >
                    {/* Barra de color decorativa superior */}
                    <Box 
                        position="absolute" 
                        top="0" 
                        left="0" 
                        right="0" 
                        h="8px" 
                        bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`} 
                    />
                    
                    <CardHeader pt={10}>
                        <Flex align="center" mb={2}>
                            <Box 
                                p={2} 
                                bg={`${primaryColor}20`} 
                                borderRadius="full" 
                                mr={3}
                            >
                                <Icon as={clienteData.tipoCliente === 'persona' ? FaUser : FaBuilding} 
                                    color={primaryColor} 
                                    boxSize={5} 
                                />
                            </Box>
                            <Heading as="h2" size="lg" color={headingColor}>
                                Registrar Clientes
                            </Heading>
                        </Flex>
                        
                        <Text color="gray.500" fontSize="md">
                            Complete el formulario para registrar un nuevo cliente en el sistema
                        </Text>
                    </CardHeader>

                    <Divider />

                    <CardBody pt={6}>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6} align="stretch">
                                <Tabs 
                                    variant="soft-rounded" 
                                    colorScheme="blue"
                                    mb={4}
                                    onChange={(index) => setClienteData(prev => ({
                                        ...prev,
                                        tipoCliente: index === 0 ? 'persona' : 'empresa',
                                        nombre: '',
                                        razonSocial: '',
                                        dniCuit: ''
                                    }))}
                                    index={clienteData.tipoCliente === 'persona' ? 0 : 1}
                                >
                                    <TabList>
                                        <Tab>
                                            <HStack>
                                                <Icon as={FaUser} />
                                                <Text>Persona</Text>
                                            </HStack>
                                        </Tab>
                                        <Tab>
                                            <HStack>
                                                <Icon as={FaBuilding} />
                                                <Text>Empresa</Text>
                                            </HStack>
                                        </Tab>
                                    </TabList>
                                    <TabPanels mt={6}>
                                        <TabPanel p={0}>
                                            <FormControl isRequired isInvalid={!!errors.nombre} mb={6}>
                                                <FormLabel fontWeight="medium">Nombre Completo</FormLabel>
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
                                                        bg={inputBg}
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor: primaryColor,
                                                            boxShadow: `0 0 0 1px ${primaryColor}`
                                                        }}
                                                    />
                                                </InputGroup>
                                                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                                            </FormControl>
                                        </TabPanel>
                                        <TabPanel p={0}>
                                            <FormControl isRequired isInvalid={!!errors.razonSocial} mb={6}>
                                                <FormLabel fontWeight="medium">Razón Social</FormLabel>
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
                                                        bg={inputBg}
                                                        borderRadius="lg"
                                                        _focus={{
                                                            borderColor: primaryColor,
                                                            boxShadow: `0 0 0 1px ${primaryColor}`
                                                        }}
                                                    />
                                                </InputGroup>
                                                <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                                            </FormControl>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                                    <GridItem>
                                        <FormControl isRequired isInvalid={!!errors.dniCuit}>
                                            <FormLabel fontWeight="medium">
                                                {clienteData.tipoCliente === 'persona' ? 'DNI' : 'CUIT'}
                                            </FormLabel>
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
                                                    bg={inputBg}
                                                    borderRadius="lg"
                                                    _focus={{
                                                        borderColor: primaryColor,
                                                        boxShadow: `0 0 0 1px ${primaryColor}`
                                                    }}
                                                />
                                            </InputGroup>
                                            <FormErrorMessage>{errors.dniCuit}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl isRequired isInvalid={!!errors.telefono}>
                                            <FormLabel fontWeight="medium">Teléfono</FormLabel>
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
                                                    bg={inputBg}
                                                    borderRadius="lg"
                                                    _focus={{
                                                        borderColor: primaryColor,
                                                        boxShadow: `0 0 0 1px ${primaryColor}`
                                                    }}
                                                />
                                            </InputGroup>
                                            <FormErrorMessage>{errors.telefono}</FormErrorMessage>
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <FormControl isRequired isInvalid={!!errors.email}>
                                    <FormLabel fontWeight="medium">Correo Electrónico</FormLabel>
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
                                            bg={inputBg}
                                            borderRadius="lg"
                                            _focus={{
                                                borderColor: primaryColor,
                                                boxShadow: `0 0 0 1px ${primaryColor}`
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                                </FormControl>

                                <Flex 
                                    p={4} 
                                    bg="blue.50" 
                                    borderRadius="lg" 
                                    color="blue.600"
                                    align="center"
                                >
                                    <Icon as={FaInfoCircle} boxSize={5} mr={2} />
                                    <Text fontSize="sm">
                                        {clienteData.tipoCliente === 'persona' 
                                            ? 'Los datos personales serán tratados según nuestra política de privacidad' 
                                            : 'Los datos de la empresa serán utilizados para facturación y comunicaciones'
                                        }
                                    </Text>
                                </Flex>

                                <Button
                                    type="submit"
                                    bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
                                    _hover={{
                                        bgGradient: `linear(to-r, ${primaryColor}, ${secondaryColor})`,
                                        opacity: 0.9,
                                        transform: "translateY(-2px)",
                                        boxShadow: "xl",
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                    }}
                                    color="white"
                                    size="lg"
                                    height="56px"
                                    borderRadius="lg"
                                    fontWeight="bold"
                                    mt={4}
                                    isLoading={isSubmitting}
                                    loadingText="Registrando..."
                                    disabled={isSubmitting}
                                    transition="all 0.3s"
                                >
                                    Registrar Clientes
                                </Button>
                            </VStack>
                        </form>
                    </CardBody>
                </Card>
            </MotionBox>
        </Container>
    );
};

export default RegistrarCliente;