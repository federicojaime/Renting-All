import React, { useState, useEffect } from 'react';
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
    FormErrorMessage,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaCar, FaRuler } from 'react-icons/fa';
import ApiService from '../services/api';

const RegistroEntrega = ({ onSubmit }) => {
    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [entregaData, setEntregaData] = useState({
        vehiculo_id: '',
        cliente_id: '',
        funcionarioEntrega: '',
        funcionarioRecibe: '',
        dniEntrega: '',
        dniRecibe: '',
        fechaEntrega: '',
        fechaDevolucion: '',
        lugarEntrega: '',
        lugarDevolucion: '',
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
            // Nuevos campos de inventario
            calefaccion: false,
            radioCd: false,
            bocinas: false,
            encendedor: false,
            espejoRetrovisor: false,
            ceniceros: false,
            cinturones: false,
            manijasVidrios: false,
            pisosGoma: false,
            tapetes: false,
            fundaAsientos: false,
            jaladorPuertas: false,
            sujetadorManos: false,
            gato: false,
            llaveRueda: false,
            estucheLlaves: false,
            triangulo: false,
            llantaAuxilio: false,
            extintor: false,
            botiquin: false,
            otros: false,
            soat: false,
            inspeccionTecnica: false
        },
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.700');

    useEffect(() => {
        fetchClientes();
        fetchVehiculos();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await ApiService.get('/clientes');
            if (response.ok) {
                setClientes(response.data);
            }
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los clientes',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const fetchVehiculos = async () => {
        try {
            const response = await ApiService.get('/vehiculos?estado=DISPONIBLE');
            if (response.ok) {
                setVehiculos(response.data);
            }
        } catch (error) {
            console.error('Error al cargar vehículos:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los vehículos disponibles',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'vehiculo_id':
                return !value ? 'Debe seleccionar un vehículo' : '';
            case 'cliente_id':
                return !value ? 'Debe seleccionar un cliente' : '';
            case 'funcionarioEntrega':
            case 'funcionarioRecibe':
                return value.trim().length < 3 ? 'Debe tener al menos 3 caracteres' : '';
            case 'dniEntrega':
            case 'dniRecibe':
                return !/^\d{7,8}$/.test(value) ? 'DNI inválido' : '';
            case 'fechaEntrega':
                return !value ? 'La fecha de entrega es requerida' : '';
            case 'lugarEntrega':
                return value.trim().length < 3 ? 'El lugar de entrega es requerido' : '';
            case 'kilometrajeEntrega':
                return isNaN(value) || value < 0 ? 'Kilometraje inválido' : '';
            case 'nivelCombustible':
                return !value ? 'Debe seleccionar el nivel de combustible' : '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'vehiculo_id', 'cliente_id', 'funcionarioEntrega',
            'funcionarioRecibe', 'dniEntrega', 'dniRecibe',
            'fechaEntrega', 'lugarEntrega', 'kilometrajeEntrega',
            'nivelCombustible'
        ];

        requiredFields.forEach(field => {
            const error = validateField(field, entregaData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setEntregaData(prev => ({
                ...prev,
                inventario: {
                    ...prev.inventario,
                    [name]: checked,
                },
            }));
        } else {
            setEntregaData(prev => ({
                ...prev,
                [name]: value,
            }));
        }

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
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
            const response = await ApiService.post('/entrega', entregaData);

            if (response.ok) {
                toast({
                    title: 'Entrega registrada',
                    description: 'La entrega ha sido registrada exitosamente',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Resetear formulario
                setEntregaData({
                    vehiculo_id: '',
                    cliente_id: '',
                    funcionarioEntrega: '',
                    funcionarioRecibe: '',
                    dniEntrega: '',
                    dniRecibe: '',
                    fechaEntrega: '',
                    fechaDevolucion: '',
                    lugarEntrega: '',
                    lugarDevolucion: '',
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
                        // Nuevos campos de inventario
                        calefaccion: false,
                        radioCd: false,
                        bocinas: false,
                        encendedor: false,
                        espejoRetrovisor: false,
                        ceniceros: false,
                        cinturones: false,
                        manijasVidrios: false,
                        pisosGoma: false,
                        tapetes: false,
                        fundaAsientos: false,
                        jaladorPuertas: false,
                        sujetadorManos: false,
                        gato: false,
                        llaveRueda: false,
                        estucheLlaves: false,
                        triangulo: false,
                        llantaAuxilio: false,
                        extintor: false,
                        botiquin: false,
                        otros: false,
                        soat: false,
                        inspeccionTecnica: false
                    },
                });

                if (onSubmit) {
                    onSubmit(response.data);
                }

                // Actualizar lista de vehículos disponibles
                fetchVehiculos();
            } else {
                throw new Error(response.msg || 'Error al registrar la entrega');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Hubo un problema al registrar la entrega',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxW="6xl" py={10}>
            <Box
                bg={bgColor}
                borderWidth={1}
                borderRadius="lg"
                p={8}
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Registro de Entrega de Vehículo
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired isInvalid={!!errors.cliente_id}>
                                <FormLabel>Cliente</FormLabel>
                                <Select
                                    name="cliente_id"
                                    value={entregaData.cliente_id}
                                    onChange={handleChange}
                                    placeholder="Seleccione un cliente"
                                >
                                    {clientes.map(cliente => (
                                        <option key={cliente.id} value={cliente.id}>
                                            {cliente.tipo_cliente === 'persona'
                                                ? cliente.nombre
                                                : cliente.razon_social} - {cliente.dni_cuit}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.cliente_id}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.vehiculo_id}>
                                <FormLabel>Vehículo</FormLabel>
                                <Select
                                    name="vehiculo_id"
                                    value={entregaData.vehiculo_id}
                                    onChange={handleChange}
                                    placeholder="Seleccione un vehículo"
                                >
                                    {vehiculos.map(vehiculo => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.marca} {vehiculo.modelo} - {vehiculo.patente}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.vehiculo_id}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.funcionarioEntrega}>
                                <FormLabel>Funcionario que entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaUser />
                                    </InputLeftElement>
                                    <Input
                                        name="funcionarioEntrega"
                                        value={entregaData.funcionarioEntrega}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.funcionarioEntrega}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.dniEntrega}>
                                <FormLabel>DNI (Entrega)</FormLabel>
                                <Input
                                    name="dniEntrega"
                                    value={entregaData.dniEntrega}
                                    onChange={handleChange}
                                    placeholder="DNI"
                                />
                                <FormErrorMessage>{errors.dniEntrega}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.funcionarioRecibe}>
                                <FormLabel>Funcionario que recibe</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaUser />
                                    </InputLeftElement>
                                    <Input
                                        name="funcionarioRecibe"
                                        value={entregaData.funcionarioRecibe}
                                        onChange={handleChange}
                                        placeholder="Nombre completo"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.funcionarioRecibe}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.dniRecibe}>
                                <FormLabel>DNI (Recibe)</FormLabel>
                                <Input
                                    name="dniRecibe"
                                    value={entregaData.dniRecibe}
                                    onChange={handleChange}
                                    placeholder="DNI"
                                />
                                <FormErrorMessage>{errors.dniRecibe}</FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired isInvalid={!!errors.fechaEntrega}>
                                <FormLabel>Fecha de Entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaCalendarAlt />
                                    </InputLeftElement>
                                    <Input
                                        type="date"
                                        name="fechaEntrega"
                                        value={entregaData.fechaEntrega}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.fechaEntrega}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.lugarEntrega}>
                                <FormLabel>Lugar de Entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaMapMarkerAlt />
                                    </InputLeftElement>
                                    <Input
                                        name="lugarEntrega"
                                        value={entregaData.lugarEntrega}
                                        onChange={handleChange}
                                        placeholder="Lugar de entrega"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.lugarEntrega}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.kilometrajeEntrega}>
                                <FormLabel>Kilometraje de Entrega</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <FaRuler />
                                    </InputLeftElement>
                                    <Input
                                        type="number"
                                        name="kilometrajeEntrega"
                                        value={entregaData.kilometrajeEntrega}
                                        onChange={handleChange}
                                        placeholder="Km de entrega"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.kilometrajeEntrega}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.nivelCombustible}>
                                <FormLabel>Nivel de Combustible</FormLabel>
                                <Select
                                    name="nivelCombustible"
                                    value={entregaData.nivelCombustible}
                                    onChange={handleChange}
                                    placeholder="Seleccione el nivel"
                                >
                                    <option value="lleno">Lleno</option>
                                    <option value="3/4">3/4</option>
                                    <option value="1/2">1/2</option>
                                    <option value="1/4">1/4</option>
                                    <option value="vacio">Vacío</option>
                                </Select>
                                <FormErrorMessage>{errors.nivelCombustible}</FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>

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
                            />
                        </FormControl>

                        <Text fontSize="sm" color="gray.600" mt={2}>
                            Nota: Utilizar Gas Oil Premium - Infinia Diesel – Quantium Diesel – Shell Bi Power.
                            Prohibido fumar dentro del vehículo.
                        </Text>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            width="full"
                            mt={4}
                            isLoading={isSubmitting}
                            loadingText="Registrando..."
                            disabled={isSubmitting}
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