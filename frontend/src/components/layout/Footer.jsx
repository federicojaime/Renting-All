// src/components/layout/Footer.jsx
import React from 'react';
import {
    Box, Container, Flex, HStack, Text, Link,
    useColorModeValue
} from '@chakra-ui/react';

import Logo from '../../assets/icon.png';

/**
 * Componente Footer para el panel de administración
 * 
 * @returns {JSX.Element} Componente Footer
 */
const Footer = () => {
    // Colores según el modo (claro/oscuro)
    const cardBgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            as="footer"
            bg={cardBgColor}
            color={textColor}
            py={6}
            px={6}
            mt={8}
            borderTopWidth="1px"
            borderTopColor={borderColor}
        >
            <Container maxW="7xl">
                <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
                    {/* Copyright e información de desarrollo */}
                    <HStack spacing={2}>
                        <Text>&copy; 2025 Sistema de Gestión de Flota</Text>
                        <Text mx={2} color="gray.400">|</Text>
                        <Link href="https://codeo.site/" display="flex" alignItems="center" color="primary.500">
                            Desarrollado por <Text fontWeight="bold" ml={1}>Codeo.Ar</Text>
                            <Box ml={2}><img src={Logo} alt="Logo Codeo" width="20px" /></Box>
                        </Link>
                    </HStack>

                    {/* Enlaces de interés */}
                    <HStack spacing={4} mt={{ base: 4, md: 0 }}>
                        <Link href="#" fontSize="sm" color="gray.500" _hover={{ color: "primary.500" }}>Términos</Link>
                        <Link href="#" fontSize="sm" color="gray.500" _hover={{ color: "primary.500" }}>Privacidad</Link>
                        <Link href="#" fontSize="sm" color="gray.500" _hover={{ color: "primary.500" }}>Ayuda</Link>
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;