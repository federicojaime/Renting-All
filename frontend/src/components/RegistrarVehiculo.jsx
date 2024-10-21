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

const MotionBox = motion(Box);

const RegistrarCamioneta = ({ onSubmit }) => {
    const [camionetaData, setCamionetaData] = useState({
        nroInterno: '',
        designacion: '',
        marca: '',
        modelo: '',
        adquisicion: '',
        motor: '',
        chasis: '',
        patente: '',
        titulo: '',
        estado: '',
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
                return isNaN(value) || value < 0 ? 'El precio debe ser un número positivo' : '';
            default:
                return '';
        }
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setCamionetaData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }, [validateField]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = Object.keys(camionetaData).reduce((acc, key) => {
            const error = validateField(key, camionetaData[key]);
            if (error) acc[key] = error;
            return acc;
        }, {});

        if (Object.keys(newErrors).length === 0) {
            try {
                setIsSubmitting(true);
                await onSubmit(camionetaData);
                setIsSubmitting(false);
                onOpen(); // Abre el modal de confirmación
            } catch (error) {
                console.error('Error:', error);
                setIsSubmitting(false);
                toast({
                    title: 'Error',
                    description: 'Hubo un problema al registrar la camioneta.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            setErrors(newErrors);
            toast({
                title: 'Error en el formulario',
                description: 'Por favor, corrige los errores antes de enviar.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const resetForm = () => {
        setCamionetaData({
            nroInterno: '',
            designacion: '',
            marca: '',
            modelo: '',
            adquisicion: '',
            motor: '',
            chasis: '',
            patente: '',
            titulo: '',
            estado: '',
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
                    Registrar Camioneta
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
                                    value={camionetaData.nroInterno}
                                    onChange={handleChange}
                                    placeholder="Número interno"
                                    bg={inputBgColor}
                                    aria-describedby="nroInterno-error"
                                />
                            </InputGroup>
                            <FormErrorMessage>{errors.nroInterno}</FormErrorMessage>
                        </FormControl>

                        <FormControl id="designacion" isRequired>
                            <FormLabel>Designación</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="designacion"
                                    value={camionetaData.designacion}
                                    onChange={handleChange}
                                    placeholder="Designación"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="marca" isRequired>
                            <FormLabel>Marca</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCar color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="marca"
                                    value={camionetaData.marca}
                                    onChange={handleChange}
                                    placeholder="Marca del vehículo"
                                    bg={inputBgColor}
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
                                    value={camionetaData.modelo}
                                    onChange={handleChange}
                                    placeholder="Modelo del vehículo"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="adquisicion" isRequired>
                            <FormLabel>Adquisición</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaCalendarAlt color="gray.300" />} />
                                <Input
                                    type="date"
                                    name="adquisicion"
                                    value={camionetaData.adquisicion}
                                    onChange={handleChange}
                                    bg={inputBgColor}
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
                                    value={camionetaData.motor}
                                    onChange={handleChange}
                                    placeholder="Número de motor"
                                    bg={inputBgColor}
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
                                    value={camionetaData.chasis}
                                    onChange={handleChange}
                                    placeholder="Número de chasis"
                                    bg={inputBgColor}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl id="patente" isRequired isInvalid={!!errors.patente}>
                            <FormLabel>Patente</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="patente"
                                    value={camionetaData.patente}
                                    onChange={handleChange}
                                    placeholder="AA000AA"
                                    bg={inputBgColor}
                                    aria-describedby="patente-error"
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
                                    value={camionetaData.titulo}
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
                                value={camionetaData.estado}
                                onChange={handleChange}
                                placeholder="Seleccione el estado"
                                bg={inputBgColor}
                            >
                                <option value="ALQUILADA">ALQUILADA</option>
                                <option value="DISPONIBLE">DISPONIBLE</option>
                            </Select>
                        </FormControl>

                        <FormControl id="responsable">
                            <FormLabel>Responsable</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" children={<FaIdCard color="gray.300" />} />
                                <Input
                                    type="text"
                                    name="responsable"
                                    value={camionetaData.responsable}
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
                                    value={camionetaData.ministerio}
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
                                    value={camionetaData.precio}
                                    onChange={handleChange}
                                    placeholder="Precio"
                                    bg={inputBgColor}
                                    aria-describedby="precio-error"
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
                                    value={camionetaData.compania}
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
                                    value={camionetaData.nroPoliza}
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
                                    value={camionetaData.vencimiento}
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
                        aria-label="Registrar Camioneta"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Spinner /> : 'Registrar Camioneta'}
                    </Button>
                </form>
            </MotionBox>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Registro Exitoso</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>La camioneta ha sido registrada exitosamente.</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={resetForm}>
                            Registrar Otra
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default RegistrarCamioneta;
