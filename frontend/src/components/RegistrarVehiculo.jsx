import React, { useState, useCallback } from 'react';
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
    FormErrorMessage,
    SimpleGrid,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCar, FaBarcode, FaCalendarAlt, FaCog, FaIdCard, FaDollarSign, FaShieldAlt } from 'react-icons/fa';
import ApiService from '../services/api';

const MotionBox = motion(Box);

const RegistrarVehiculo = ({ onSubmit }) => {
    const [vehiculoData, setVehiculoData] = useState({
        nroInterno: '',
        designacion: '',
        marca: '',
        modelo: '',
        adquisicion: '',
        motor: '',
        chasis: '',
        patente: '',
        titulo: '',
        estado: 'DISPONIBLE',
        responsable: '',
        ministerio: '',
        precio: '',
        compania: '',
        nroPoliza: '',
        vencimiento: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const inputBgColor = useColorModeValue('gray.50', 'gray.800');

    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'nroInterno':
                return value.trim() === '' ? 'El número interno es requerido' : '';
            case 'patente':
                return !/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(value) ? 'La patente debe tener el formato AA000AA' : '';
            case 'precio':
                return value && (isNaN(value) || value < 0) ? 'El precio debe ser un número positivo' : '';
            case 'designacion':
                return value.trim().length < 3 ? 'La designación debe tener al menos 3 caracteres' : '';
            case 'marca':
                return value.trim().length < 2 ? 'La marca debe tener al menos 2 caracteres' : '';
            case 'modelo':
                return value.trim().length < 2 ? 'El modelo debe tener al menos 2 caracteres' : '';
            case 'motor':
                return value.trim().length < 3 ? 'El número de motor debe tener al menos 3 caracteres' : '';
            case 'chasis':
                return value.trim().length < 3 ? 'El número de chasis debe tener al menos 3 caracteres' : '';
            default:
                return '';
        }
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setVehiculoData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }, [validateField]);

    const validateForm = () => {
        const requiredFields = [
            'nroInterno', 'designacion', 'marca', 'modelo',
            'adquisicion', 'motor', 'chasis', 'patente',
            'titulo', 'estado'
        ];

        const newErrors = {};
        requiredFields.forEach(field => {
            const error = validateField(field, vehiculoData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        // Validaciones adicionales para campos opcionales con contenido
        if (vehiculoData.precio) {
            const precioError = validateField('precio', vehiculoData.precio);
            if (precioError) newErrors.precio = precioError;
        }

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
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await ApiService.post('/vehiculo', vehiculoData);

            if (response.ok) {
                onOpen();
                if (onSubmit) {
                    onSubmit(response.data);
                }
            } else {
                throw new Error(response.msg || 'Error al registrar el vehículo');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Hubo un problema al registrar el vehículo',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    const resetForm = () => {
        setVehiculoData({
            nroInterno: '',
            designacion: '',
            marca: '',
            modelo: '',
            adquisicion: '',
            motor: '',
            chasis: '',
            patente: '',
            titulo: '',
            estado: 'DISPONIBLE',
            responsable: '',
            ministerio: '',
            precio: '',
            compania: '',
            nroPoliza: '',
            vencimiento: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Container maxW="6xl" py={10}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg={bgColor}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="lg"
                p={8}
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Registrar Vehículo
                </Heading>
                <form onSubmit={handleSubmit}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl id="nroInterno" isRequired isInvalid={!!errors.nroInterno}>
                            <FormLabel>Nº Interno</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="nroInterno"
                                    value={vehiculoData.nroInterno}
                                    onChange={handleChange}
                                    placeholder="Número interno"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.nroInterno}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="designacion" isRequired isInvalid={!!errors.designacion}>
                            <FormLabel>Designación</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="designacion"
                                    value={vehiculoData.designacion}
                                    onChange={handleChange}
                                    placeholder="Designación"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.designacion}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="marca" isRequired isInvalid={!!errors.marca}>
                            <FormLabel>Marca</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="marca"
                                    value={vehiculoData.marca}
                                    onChange={handleChange}
                                    placeholder="Marca del vehículo"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.marca}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="modelo" isRequired isInvalid={!!errors.modelo}>
                            <FormLabel>Modelo</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="modelo"
                                    value={vehiculoData.modelo}
                                    onChange={handleChange}
                                    placeholder="Modelo del vehículo"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.modelo}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="adquisicion" isRequired isInvalid={!!errors.adquisicion}>
                            <FormLabel>Adquisición</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} />
                                <Input
                                    type="date"
                                    name="adquisicion"
                                    value={vehiculoData.adquisicion}
                                    onChange={handleChange}
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.adquisicion}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="motor" isRequired isInvalid={!!errors.motor}>
                            <FormLabel>Número de Motor</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCog color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="motor"
                                    value={vehiculoData.motor}
                                    onChange={handleChange}
                                    placeholder="Número de motor"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.motor}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="chasis" isRequired isInvalid={!!errors.chasis}>
                            <FormLabel>Número de Chasis</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaBarcode color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="chasis"
                                    value={vehiculoData.chasis}
                                    onChange={handleChange}
                                    placeholder="Número de chasis"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.chasis}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="patente" isRequired isInvalid={!!errors.patente}>
                            <FormLabel>Patente</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="patente"
                                    value={vehiculoData.patente}
                                    onChange={handleChange}
                                    placeholder="AA000AA"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.patente}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="titulo" isRequired>
                            <FormLabel>Título</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="titulo"
                                    value={vehiculoData.titulo}
                                    onChange={handleChange}
                                    placeholder="Título"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="estado" isRequired>
                            <FormLabel>Estado</FormLabel>
                            <Select
                                name="estado"
                                value={vehiculoData.estado}
                                onChange={handleChange}
                                bg={inputBgColor}
                            >
                                <option value="DISPONIBLE">DISPONIBLE</option>
                                <option value="ALQUILADA">ALQUILADA</option>
                            </Select>
                        </FormControl>

                        <FormControl id="responsable">
                            <FormLabel>Responsable</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="responsable"
                                    value={vehiculoData.responsable}
                                    onChange={handleChange}
                                    placeholder="Responsable"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="ministerio">
                            <FormLabel>Ministerio</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="ministerio"
                                    value={vehiculoData.ministerio}
                                    onChange={handleChange}
                                    placeholder="Ministerio"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="precio" isInvalid={!!errors.precio}>
                            <FormLabel>Precio</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaDollarSign color="gray.300" />} />
                                <Input
                                    type="number"
                                    name="precio"
                                    value={vehiculoData.precio}
                                    onChange={handleChange}
                                    placeholder="Precio"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.precio}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="compania">
                            <FormLabel>Compañía de Seguros</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaShieldAlt color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="compania"
                                    value={vehiculoData.compania}
                                    onChange={handleChange}
                                    placeholder="Compañía de seguros"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="nroPoliza">
                            <FormLabel>Nº Póliza</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaShieldAlt color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="nroPoliza"
                                    value={vehiculoData.nroPoliza}
                                    onChange={handleChange}
                                    placeholder="Número de póliza"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="vencimiento">
                            <FormLabel>Vencimiento</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} />
                                <Input
                                    type="date"
                                    name="vencimiento"
                                    value={vehiculoData.vencimiento}
                                    onChange={handleChange}
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>
                    </SimpleGrid>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        mt={8}
                        size="lg"
                        isLoading={isSubmitting}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Spinner /> : 'Registrar Vehículo'}
                    </Button>
                </form>
            </MotionBox>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Registro Exitoso</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>El vehículo ha sido registrado exitosamente.</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={resetForm}>
                            Registrar Otro
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default RegistrarVehiculo;