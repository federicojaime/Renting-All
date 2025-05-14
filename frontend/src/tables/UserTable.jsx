import React, { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    useToast,
    Alert,
    AlertIcon,
    SimpleGrid,
    FormControl,
    FormLabel,
    ButtonGroup,
    FormErrorMessage,
    InputRightElement,
    HStack,
    Badge
} from '@chakra-ui/react';
import { FaSearch, FaEdit, FaTrash, FaSave, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import ApiService from '../services/api';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [newUser, setNewUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredData(users);
    }, [users]);

    const fetchUsers = async () => {
        try {
            const response = await ApiService.get('/users');
            if (response.ok) {
                setUsers(response.data);
            } else {
                throw new Error(response.msg || 'Error al obtener los usuarios');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los usuarios',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = users.filter(user =>
            Object.values(user).some(value =>
                value && value.toString().toLowerCase().includes(term)
            )
        );
        setFilteredData(filtered);
    };

    const handleEdit = (user) => {
        setEditingUser({
            ...user,
            password: '' // Vaciar la contraseña por seguridad
        });
        onEditOpen();
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
            try {
                const response = await ApiService.delete(`/user/${userId}`);
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== userId));
                    toast({
                        title: "Éxito",
                        description: "Usuario eliminado correctamente",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    throw new Error(response.msg || 'Error al eliminar el usuario');
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "No se pudo eliminar el usuario",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstname':
                return value.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres' : '';
            case 'lastname':
                return value.trim().length < 3 ? 'El apellido debe tener al menos 3 caracteres' : '';
            case 'email':
                return !/\S+@\S+\.\S+/.test(value) ? 'El email no es válido' : '';
            case 'password':
                // Sólo validar si es un nuevo usuario o si se está cambiando la contraseña
                if ((isNewOpen || value.trim() !== '')) {
                    return value.trim().length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
                }
                return '';
            default:
                return '';
        }
    };

    const validateForm = (data) => {
        const newErrors = {};
        Object.keys(data).forEach(key => {
            // Si es editando un usuario y la contraseña está vacía, no validar la contraseña
            if (key === 'password' && !isNewOpen && data[key].trim() === '') {
                return;
            }

            const error = validateField(key, data[key]);
            if (error) {
                newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e, isEditing = false) => {
        const { name, value } = e.target;
        if (isEditing) {
            setEditingUser(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setNewUser(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Limpiar error cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSaveEdit = async () => {
        if (!validateForm(editingUser)) {
            toast({
                title: "Error de validación",
                description: "Por favor, corrija los errores del formulario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const userData = { ...editingUser };
            // Si la contraseña está vacía, no enviarla en la actualización
            if (userData.password.trim() === '') {
                delete userData.password;
            }

            const response = await ApiService.patch(`/user/${editingUser.id}`, userData);
            if (response.ok) {
                setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
                onEditClose();
                toast({
                    title: "Éxito",
                    description: "Usuario actualizado correctamente",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.msg || 'Error al actualizar el usuario');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "No se pudo actualizar el usuario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCreateUser = async () => {
        if (!validateForm(newUser)) {
            toast({
                title: "Error de validación",
                description: "Por favor, corrija los errores del formulario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await ApiService.post('/user', newUser);
            if (response.ok) {
                fetchUsers(); // Recargar la lista completa
                setNewUser({
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: ''
                });
                onNewClose();
                toast({
                    title: "Éxito",
                    description: "Usuario creado correctamente",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.msg || 'Error al crear el usuario');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "No se pudo crear el usuario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box>
            <HStack spacing={4} mb={4} justifyContent="space-between">
                <InputGroup maxW={{ base: 'full', md: '300px' }}>
                    <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
                    <Input
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </InputGroup>
                <Button
                    leftIcon={<FaUserPlus />}
                    colorScheme="blue"
                    onClick={onNewOpen}
                >
                    Nuevo Usuario
                </Button>
            </HStack>

            {filteredData.length === 0 ? (
                <Alert status="info">
                    <AlertIcon />
                    No se encontraron usuarios
                </Alert>
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Apellido</Th>
                            <Th>Email</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredData.map((user) => (
                            <Tr key={user.id}>
                                <Td>{user.id}</Td>
                                <Td>{user.firstname}</Td>
                                <Td>{user.lastname}</Td>
                                <Td>{user.email}</Td>
                                <Td>
                                    <ButtonGroup spacing={2}>
                                        <IconButton
                                            aria-label="Editar usuario"
                                            icon={<FaEdit />}
                                            onClick={() => handleEdit(user)}
                                            colorScheme="blue"
                                            size="sm"
                                        />
                                        <IconButton
                                            aria-label="Eliminar usuario"
                                            icon={<FaTrash />}
                                            onClick={() => handleDelete(user.id)}
                                            colorScheme="red"
                                            size="sm"
                                        />
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}

            {/* Modal para Editar Usuario */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Usuario</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {editingUser && (
                            <SimpleGrid columns={1} spacing={4}>
                                <FormControl isInvalid={!!errors.firstname}>
                                    <FormLabel>Nombre</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaUser color="gray.300" />} />
                                        <Input
                                            name="firstname"
                                            value={editingUser.firstname || ''}
                                            onChange={(e) => handleChange(e, true)}
                                            placeholder="Nombre"
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.lastname}>
                                    <FormLabel>Apellido</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaUser color="gray.300" />} />
                                        <Input
                                            name="lastname"
                                            value={editingUser.lastname || ''}
                                            onChange={(e) => handleChange(e, true)}
                                            placeholder="Apellido"
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement children={<FaEnvelope color="gray.300" />} />
                                        <Input
                                            name="email"
                                            type="email"
                                            value={editingUser.email || ''}
                                            onChange={(e) => handleChange(e, true)}
                                            placeholder="Email"
                                        />
                                    </InputGroup>
                                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.password}>
                                    <FormLabel>Contraseña (dejar en blanco para mantener la actual)</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement color="gray.300" children="🔒" />
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={editingUser.password || ''}
                                            onChange={(e) => handleChange(e, true)}
                                            placeholder="Nueva contraseña (opcional)"
                                        />
                                        <InputRightElement>
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                                </FormControl>

                                <Box mt={6} display="flex" justifyContent="flex-end" gap={4}>
                                    <Button onClick={onEditClose}>Cancelar</Button>
                                    <Button
                                        colorScheme="blue"
                                        leftIcon={<FaSave />}
                                        onClick={handleSaveEdit}
                                    >
                                        Guardar Cambios
                                    </Button>
                                </Box>
                            </SimpleGrid>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal para Nuevo Usuario */}
            <Modal isOpen={isNewOpen} onClose={onNewClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear Nuevo Usuario</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <SimpleGrid columns={1} spacing={4}>
                            <FormControl isRequired isInvalid={!!errors.firstname}>
                                <FormLabel>Nombre</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaUser color="gray.300" />} />
                                    <Input
                                        name="firstname"
                                        value={newUser.firstname}
                                        onChange={handleChange}
                                        placeholder="Nombre"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.lastname}>
                                <FormLabel>Apellido</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaUser color="gray.300" />} />
                                    <Input
                                        name="lastname"
                                        value={newUser.lastname}
                                        onChange={handleChange}
                                        placeholder="Apellido"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.email}>
                                <FormLabel>Email</FormLabel>
                                <InputGroup>
                                    <InputLeftElement children={<FaEnvelope color="gray.300" />} />
                                    <Input
                                        name="email"
                                        type="email"
                                        value={newUser.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.password}>
                                <FormLabel>Contraseña</FormLabel>
                                <InputGroup>
                                    <InputLeftElement color="gray.300" children="🔒" />
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={newUser.password}
                                        onChange={handleChange}
                                        placeholder="Contraseña"
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
                            </FormControl>

                            <Box mt={6} display="flex" justifyContent="flex-end" gap={4}>
                                <Button onClick={onNewClose}>Cancelar</Button>
                                <Button
                                    colorScheme="blue"
                                    leftIcon={<FaSave />}
                                    onClick={handleCreateUser}
                                >
                                    Crear Usuario
                                </Button>
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default UserTable;