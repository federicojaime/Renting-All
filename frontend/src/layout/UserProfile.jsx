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
    InputRightElement,
    Text,
    Flex,
    Avatar,
    Divider,
    IconButton,
    useColorModeValue,
    FormErrorMessage,
    Card,
    CardBody,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash, FaSave, FaUserEdit } from 'react-icons/fa';
import ApiService from '../services/api';

const UserProfile = ({ user, onUpdate }) => {
    const [userData, setUserData] = useState({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');
    const subtitleColor = useColorModeValue('gray.600', 'gray.400');

    const validateField = (name, value) => {
        switch (name) {
            case 'firstname':
                return value.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres' : '';
            case 'lastname':
                return value.trim().length < 3 ? 'El apellido debe tener al menos 3 caracteres' : '';
            case 'email':
                return !/\S+@\S+\.\S+/.test(value) ? 'El email no es válido' : '';
            case 'password':
                if (value.trim() === '') return '';
                return value.trim().length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
            case 'confirmPassword':
                if (userData.password.trim() === '' && value.trim() === '') return '';
                return value !== userData.password ? 'Las contraseñas no coinciden' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Validación especial para confirmPassword
        if (name === 'password') {
            const confirmError = value !== userData.confirmPassword ? 'Las contraseñas no coinciden' : '';
            setErrors(prev => ({
                ...prev,
                confirmPassword: confirmError
            }));
        }

        if (name === 'confirmPassword') {
            const confirmError = value !== userData.password ? 'Las contraseñas no coinciden' : '';
            setErrors(prev => ({
                ...prev,
                confirmPassword: confirmError
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(userData).forEach(key => {
            if (key === 'password' || key === 'confirmPassword') {
                // Solo validar contraseñas si se está intentando cambiarlas
                if (userData.password || userData.confirmPassword) {
                    const error = validateField(key, userData[key]);
                    if (error) {
                        newErrors[key] = error;
                    }
                }
            } else {
                const error = validateField(key, userData[key]);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            // Datos a enviar al API
            const updateData = {
                firstname: userData.firstname,
                lastname: userData.lastname,
                email: userData.email
            };

            // Si hay contraseña, incluirla
            if (userData.password) {
                updateData.password = userData.password;
            }

            const response = await ApiService.patch(`/user/${userData.id}`, updateData);

            if (response.ok) {
                // Actualizar el estado global del usuario si se proporciona una función de actualización
                if (onUpdate) {
                    onUpdate({
                        ...user,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        email: userData.email
                    });
                }

                // Limpiar campos de contraseña
                setUserData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                }));

                toast({
                    title: 'Perfil actualizado',
                    description: 'Su información ha sido actualizada correctamente',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.msg || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Hubo un problema al actualizar su perfil',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener iniciales para el avatar
    const getInitials = () => {
        return `${userData.firstname.charAt(0)}${userData.lastname.charAt(0)}`.toUpperCase();
    };

    return (
        <Container maxW="5xl" py={10}>
            <Card bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius="lg" boxShadow="xl" overflow="hidden">
                <CardBody p={0}>
                    <Box bg="teal.500" p={6} position="relative">
                        <Flex justifyContent="center" alignItems="center" direction="column" position="relative">
                            <Avatar
                                size="2xl"
                                name={`${userData.firstname} ${userData.lastname}`}
                                bg="teal.700"
                                color="white"
                                mb={2}
                                src=""
                                fontSize="3xl"
                            >
                                {getInitials()}
                            </Avatar>
                            <Heading as="h2" size="xl" color="white" mt={2}>
                                {userData.firstname} {userData.lastname}
                            </Heading>
                            <Text color="white" opacity={0.9} fontSize="md">
                                {userData.email}
                            </Text>
                        </Flex>
                    </Box>

                    <Box p={8}>
                        <Heading as="h3" size="md" mb={6} color={textColor}>
                            Editar Perfil
                        </Heading>

                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6} align="stretch">
                                <FormControl isRequired isInvalid={!!errors.firstname}>
                                    <FormLabel fontWeight="medium">Nombre</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FaUser color="gray.300" />
                                        </InputLeftElement>
                                        <Input
                                            type="text"
                                            name="firstname"
                                            value={userData.firstname}
                                            onChange={handleChange}
                                            placeholder="Nombre"
                                            _focus={{
                                                borderColor: "teal.500",
                                                boxShadow: "0 0 0 1px teal.500"
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={!!errors.lastname}>
                                    <FormLabel fontWeight="medium">Apellido</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FaUser color="gray.300" />
                                        </InputLeftElement>
                                        <Input
                                            type="text"
                                            name="lastname"
                                            value={userData.lastname}
                                            onChange={handleChange}
                                            placeholder="Apellido"
                                            _focus={{
                                                borderColor: "teal.500",
                                                boxShadow: "0 0 0 1px teal.500"
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={!!errors.email}>
                                    <FormLabel fontWeight="medium">Email</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FaEnvelope color="gray.300" />
                                        </InputLeftElement>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            _focus={{
                                                borderColor: "teal.500",
                                                boxShadow: "0 0 0 1px teal.500"
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                                </FormControl>

                                <Divider my={2} />

                                <Text fontSize="sm" color={subtitleColor} mb={2}>
                                    Cambiar contraseña (dejar en blanco para mantener la actual)
                                </Text>

                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel fontWeight="medium">Nueva Contraseña</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" color="gray.300" children="🔒" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={userData.password}
                                            onChange={handleChange}
                                            placeholder="Nueva contraseña (opcional)"
                                            _focus={{
                                                borderColor: "teal.500",
                                                boxShadow: "0 0 0 1px teal.500"
                                            }}
                                        />
                                        <InputRightElement>
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.confirmPassword}>
                                    <FormLabel fontWeight="medium">Confirmar Contraseña</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" color="gray.300" children="🔒" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirmar contraseña"
                                            _focus={{
                                                borderColor: "teal.500",
                                                boxShadow: "0 0 0 1px teal.500"
                                            }}
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    leftIcon={<FaSave />}
                                    size="lg"
                                    isLoading={isSubmitting}
                                    loadingText="Guardando..."
                                    mt={4}
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "lg",
                                    }}
                                >
                                    Guardar Cambios
                                </Button>
                            </VStack>
                        </form>
                    </Box>
                </CardBody>
            </Card>
        </Container>
    );
};

export default UserProfile;