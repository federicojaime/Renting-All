// src/components/layout/Header.jsx
import React from 'react';
import {
    Flex, InputGroup, InputLeftElement, Input, HStack,
    Button, Box, Badge, Avatar, Menu, MenuButton,
    MenuList, MenuItem, Tooltip, Popover, PopoverTrigger,
    PopoverContent, PopoverArrow, PopoverHeader, PopoverBody,
    PopoverFooter, PopoverCloseButton, VStack, Text,
    useColorModeValue
} from '@chakra-ui/react';
import {
    FaSearch, FaBell, FaCog, FaUser,
    FaSignOutAlt, FaClipboardList, FaCheckCircle
} from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';

/**
 * Componente Header para el panel de administración
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isSmallScreen - Si la pantalla es pequeña
 * @param {boolean} props.isSidebarOpen - Estado de apertura del sidebar
 * @param {Function} props.setIsSidebarOpen - Función para cambiar estado del sidebar
 * @param {string} props.searchQuery - Término de búsqueda
 * @param {Function} props.setSearchQuery - Función para cambiar término de búsqueda
 * @param {number} props.notificationCount - Cantidad de notificaciones
 * @param {Function} props.onLogout - Función para cerrar sesión
 * @param {Object} props.user - Datos del usuario logueado
 * @returns {JSX.Element} Componente Header
 */
const Header = ({
    isSmallScreen,
    isSidebarOpen,
    setIsSidebarOpen,
    searchQuery,
    setSearchQuery,
    notificationCount,
    onLogout,
    user
}) => {
    // Colores según el modo (claro/oscuro)
    const cardBgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            px={6}
            py={3}
            bg={cardBgColor}
            borderBottomWidth="1px"
            borderBottomColor={borderColor}
            position="sticky"
            top={0}
            zIndex="99"
            boxShadow="sm"
        >
            {/* Botón de menú para móviles */}
            {isSmallScreen && (
                <Button
                    variant="ghost"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    mr={2}
                >
                    <Box as={MdMenu} size="24px" />
                </Button>
            )}

            {/* Barra de búsqueda */}
            <InputGroup maxW="400px" display={{ base: 'none', md: 'flex' }}>
                <InputLeftElement>
                    <Box as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                    placeholder="Buscar..."
                    bg="gray.50"
                    borderRadius="full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>

            {/* Menú de usuario y notificaciones */}
            <HStack spacing={4}>
                {/* Notificaciones */}
                <Tooltip label="Notificaciones" hasArrow>
                    <Box position="relative">
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="ghost" rounded="full">
                                    <Box as={FaBell} />
                                    {notificationCount > 0 && (
                                        <Badge
                                            position="absolute"
                                            top="-5px"
                                            right="-5px"
                                            colorScheme="red"
                                            borderRadius="full"
                                            fontSize="xs"
                                        >
                                            {notificationCount}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader fontWeight="bold">Notificaciones</PopoverHeader>
                                <PopoverCloseButton />
                                <PopoverBody>
                                    <VStack align="stretch" spacing={3}>
                                        <Flex p={2} bg="primary.50" borderRadius="md">
                                            <Box as={FaClipboardList} color="primary.500" mt={1} />
                                            <Box ml={3}>
                                                <Text fontWeight="bold" fontSize="sm">Nueva entrega registrada</Text>
                                                <Text fontSize="xs" color="gray.500">Hace 5 minutos</Text>
                                            </Box>
                                        </Flex>
                                        <Flex p={2} bg="success.50" borderRadius="md">
                                            <Box as={FaCheckCircle} color="success.500" mt={1} />
                                            <Box ml={3}>
                                                <Text fontWeight="bold" fontSize="sm">Entrega #35 completada</Text>
                                                <Text fontSize="xs" color="gray.500">Hace 2 horas</Text>
                                            </Box>
                                        </Flex>
                                    </VStack>
                                </PopoverBody>
                                <PopoverFooter>
                                    <Button size="sm" variant="link" colorScheme="blue">Ver todas</Button>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    </Box>
                </Tooltip>

                {/* Configuración */}
                <Tooltip label="Configuración" hasArrow>
                    <Button variant="ghost" rounded="full">
                        <Box as={FaCog} />
                    </Button>
                </Tooltip>

                {/* Menú de usuario */}
                <Menu>
                    <Tooltip label="Perfil" hasArrow>
                        <MenuButton>
                            <Avatar size="sm" name={user?.nombre || "Usuario"} />
                        </MenuButton>
                    </Tooltip>
                    <MenuList>
                        <MenuItem icon={<FaUser />}>Perfil</MenuItem>
                        <MenuItem icon={<FaCog />}>Configuración</MenuItem>
                        <MenuItem icon={<FaSignOutAlt />} onClick={onLogout}>Cerrar Sesión</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </Flex>
    );
};

export default Header;