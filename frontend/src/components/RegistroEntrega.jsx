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
    Textarea,
    SimpleGrid,
    Checkbox,
    Text,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaCar, FaRuler } from 'react-icons/fa';

const RegistroEntregaVehiculo = ({ onSubmit, flota = [] }) => {
    const [entregaData, setEntregaData] = useState({
        funcionarioEntrega: '',
        funcionarioRecibe: '',
        dniEntrega: '',
        dniRecibe: '',
        fechaEntrega: '',
        fechaDevolucion: '',
        lugarEntrega: '',
        lugarDevolucion: '',
        marca: '',
        modelo: '',
        tipo: '',
        color: '',
        placa: '',
        kilometrajeEntrega: '',
        kilometrajeDevolucion: '',
        nivelCombustible: '',
        observaciones: '',
        inventario: {
            lucesPrincipales: false,
            luzMedia: false,
            luzStop: false,
            antenaRadio: false,
            limpiaParabrisas: false,
            espejoIzquierdo: false,
            espejoDerecho: false,
            vidriosLaterales: false,
            parabrisas: false,
            tapones: false,
            taponGasolina: false,
            carroceria: false,
            parachoqueDelantero: false,
            parachoqueTrasero: false,
            placas: false,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const inputBgColor = useColorModeValue('gray.50', 'gray.800');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setEntregaData((prev) => ({
                ...prev,
                inventario: {
                    ...prev.inventario,
                    [name]: checked,
                },
            }));
        } else {
            setEntregaData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(entregaData);
            toast({
                title: 'Entrega registrada',
                description: 'La entrega del vehículo ha sido registrada exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setEntregaData({
                funcionarioEntrega: '',
                funcionarioRecibe: '',
                dniEntrega: '',
                dniRecibe: '',
                fechaEntrega: '',
                fechaDevolucion: '',
                lugarEntrega: '',
                lugarDevolucion: '',
                marca: '',
                modelo: '',
                tipo: '',
                color: '',
                placa: '',
                kilometrajeEntrega: '',
                kilometrajeDevolucion: '',
                nivelCombustible: '',
                observaciones: '',
                inventario: {
                    lucesPrincipales: false,
                    luzMedia: false,
                    luzStop: false,
                    antenaRadio: false,
                    limpiaParabrisas: false,
                    espejoIzquierdo: false,
                    espejoDerecho: false,
                    vidriosLaterales: false,
                    parabrisas: false,
                    tapones: false,
                    taponGasolina: false,
                    carroceria: false,
                    parachoqueDelantero: false,
                    parachoqueTrasero: false,
                    placas: false,
                },
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un problema al registrar la entrega del vehículo.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxW={{ base: 'full', md: 'container.xl' }} py={10}>
            <Box
                bg="white"
                borderWidth={1}
                borderRadius="lg"
                p={{ base: 4, md: 8 }}
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Registro de Entrega y Recepción de Vehículo Institucional
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel>Funcionario que entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaUser />} />
                                    <Input
                                        name="funcionarioEntrega"
                                        value={entregaData.funcionarioEntrega}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>DNI (Entrega)</FormLabel>
                                <Input
                                    name="dniEntrega"
                                    value={entregaData.dniEntrega}
                                    onChange={handleChange}
                                    placeholder="DNI"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Funcionario que recibe</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaUser />} />
                                    <Input
                                        name="funcionarioRecibe"
                                        value={entregaData.funcionarioRecibe}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>DNI (Recibe)</FormLabel>
                                <Input
                                    name="dniRecibe"
                                    value={entregaData.dniRecibe}
                                    onChange={handleChange}
                                    placeholder="DNI"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <Heading as="h3" size="md" mt={4}>
                            Características del Vehículo
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel>Marca</FormLabel>
                                <Input
                                    name="marca"
                                    value={entregaData.marca}
                                    onChange={handleChange}
                                    placeholder="Marca del vehículo"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Modelo</FormLabel>
                                <Input
                                    name="modelo"
                                    value={entregaData.modelo}
                                    onChange={handleChange}
                                    placeholder="Modelo del vehículo"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Tipo</FormLabel>
                                <Input
                                    name="tipo"
                                    value={entregaData.tipo}
                                    onChange={handleChange}
                                    placeholder="Tipo de vehículo"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Color</FormLabel>
                                <Input
                                    name="color"
                                    value={entregaData.color}
                                    onChange={handleChange}
                                    placeholder="Color del vehículo"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Placa</FormLabel>
                                <Input
                                    name="placa"
                                    value={entregaData.placa}
                                    onChange={handleChange}
                                    placeholder="Número de placa"
                                    bg={inputBgColor}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <Heading as="h3" size="md" mt={4}>
                            Detalles de Entrega y Devolución
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel>Fecha de Entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaCalendarAlt />} />
                                    <Input
                                        type="date"
                                        name="fechaEntrega"
                                        value={entregaData.fechaEntrega}
                                        onChange={handleChange}
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Fecha de Devolución</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaCalendarAlt />} />
                                    <Input
                                        type="date"
                                        name="fechaDevolucion"
                                        value={entregaData.fechaDevolucion}
                                        onChange={handleChange}
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Lugar de Entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaMapMarkerAlt />} />
                                    <Input
                                        name="lugarEntrega"
                                        value={entregaData.lugarEntrega}
                                        onChange={handleChange}
                                        placeholder="Lugar de entrega"
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Lugar de Devolución</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaMapMarkerAlt />} />
                                    <Input
                                        name="lugarDevolucion"
                                        value={entregaData.lugarDevolucion}
                                        onChange={handleChange}
                                        placeholder="Lugar de devolución"
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Kilometraje de Entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaRuler />} />
                                    <Input
                                        type="number"
                                        name="kilometrajeEntrega"
                                        value={entregaData.kilometrajeEntrega}
                                        onChange={handleChange}
                                        placeholder="Km de entrega"
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Kilometraje de Devolución</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaRuler />} />
                                    <Input
                                        type="number"
                                        name="kilometrajeDevolucion"
                                        value={entregaData.kilometrajeDevolucion}
                                        onChange={handleChange}
                                        placeholder="Km de devolución"
                                        bg={inputBgColor}
                                    />
                                </InputGroup>
                            </FormControl>
                        </SimpleGrid>

                        <FormControl>
                            <FormLabel>Nivel de Combustible</FormLabel>
                            <Select
                                name="nivelCombustible"
                                value={entregaData.nivelCombustible}
                                onChange={handleChange}
                                bg={inputBgColor}
                            >
                                <option value="">Seleccione el nivel</option>
                                <option value="lleno">Lleno</option>
                                <option value="3/4">3/4</option>
                                <option value="1/2">1/2</option>
                                <option value="1/4">1/4</option>
                                <option value="vacio">Vacío</option>
                            </Select>
                        </FormControl>

                        <Heading as="h3" size="md" mt={4}>
                            Inventario y Control de Condiciones
                        </Heading>
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                            {Object.keys(entregaData.inventario).map((item) => (
                                <Checkbox
                                    key={item}
                                    name={item}
                                    isChecked={entregaData.inventario[item]}
                                    onChange={handleChange}
                                >
                                    {item.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                </Checkbox>
                            ))}
                        </SimpleGrid>

                        <FormControl>
                            <FormLabel>Observaciones</FormLabel>
                            <Textarea
                                name="observaciones"
                                value={entregaData.observaciones}
                                onChange={handleChange}
                                placeholder="Observaciones adicionales"
                                bg={inputBgColor}
                            />
                        </FormControl>

                        <Text fontSize="sm" color="gray.600" mt={2}>
                            Nota: Utilizar Gas Oil Premium - Infinia Diesel – Quantium Diesel – Shell Bi Power. Prohibido fumar dentro del vehículo.
                        </Text>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            width="full"
                            mt={4}
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner /> : 'Registrar Entrega'}
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
};

export default RegistroEntregaVehiculo;
