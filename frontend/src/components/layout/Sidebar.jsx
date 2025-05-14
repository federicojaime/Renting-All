// src/components/layout/Sidebar.jsx
import React from 'react';
import {
    Box, Flex, Text, VStack, Button, Tooltip,
    useColorModeValue
} from '@chakra-ui/react';
import { MdMenu } from 'react-icons/md';
import { FaCar } from 'react-icons/fa';
import { navItems } from '../../constants/navItems';
import Logo from '../../assets/logo-horizontal.png';
import LogoCorto from '../../assets/logo.png';

/**
 * Componente de barra lateral de navegación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isSidebarOpen - Estado de apertura de la barra lateral
 * @param {Function} props.setIsSidebarOpen - Función para cambiar el estado de apertura
 * @returns {JSX.Element} Componente Sidebar
 */
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    // Colores según el modo (claro/oscuro)
    const sidebarBgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const activeNavBgColor = useColorModeValue('primary.50', 'rgba(33, 150, 243, 0.15)');
    const activeNavColor = useColorModeValue('primary.700', 'primary.300');
    const hoverNavBgColor = useColorModeValue('gray.100', 'gray.700');

    return (
        <Box
            as="aside"
            position="fixed"
            h="100vh"
            w={isSidebarOpen ? "250px" : "70px"}
            bg={sidebarBgColor}
            borderRightWidth="1px"
            borderRightColor={borderColor}
            transition="all 0.3s ease"
            overflowY="auto"
            zIndex="999"
            pt={2}
        >
            {/* Logo o Ícono */}
            <Flex
                p={4}
                mb={4}
                align="center"
                justify={isSidebarOpen ? "space-between" : "center"}
            >
                {isSidebarOpen ? (
                    <img src={Logo} alt="Logo" style={{ height: "40px" }} />
                ) : (
                    <img src={LogoCorto} alt="Logo" style={{ height: "50px" }} />
                )}
                {isSidebarOpen && (
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(false)}
                        size="sm"
                        p={1}
                    >
                        <Box as={MdMenu} size="20px" />
                    </Button>
                )}
            </Flex>

            {/* Items de navegación */}
            <VStack spacing={1} align="stretch" px={2}>
                {navItems.map((item, index) => (
                    <Tooltip
                        key={index}
                        label={!isSidebarOpen ? item.name : ""}
                        placement="right"
                        hasArrow
                        openDelay={500}
                    >
                        <Flex
                            p={3}
                            borderRadius="md"
                            cursor="pointer"
                            align="center"
                            bg={index === 0 ? activeNavBgColor : "transparent"}
                            color={index === 0 ? activeNavColor : textColor}
                            _hover={{ bg: hoverNavBgColor }}
                            transition="all 0.2s"
                        >
                            <Box as={item.icon} size="20px" />
                            {isSidebarOpen && (
                                <Text ml={3} fontWeight={index === 0 ? "bold" : "normal"}>
                                    {item.name}
                                </Text>
                            )}
                            {isSidebarOpen && index === 0 && (
                                <Box
                                    position="absolute"
                                    right={0}
                                    width="4px"
                                    height="24px"
                                    bg="primary.500"
                                    borderRadius="full"
                                />
                            )}
                        </Flex>
                    </Tooltip>
                ))}
            </VStack>

            {/* Botón para abrir sidebar cuando está cerrado */}
            {!isSidebarOpen && (
                <Flex
                    position="absolute"
                    bottom="20px"
                    left={0}
                    right={0}
                    justify="center"
                >
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(true)}
                        size="sm"
                        p={1}
                    >
                        <Box as={MdMenu} size="20px" />
                    </Button>
                </Flex>
            )}
        </Box>
    );
};

export default Sidebar;