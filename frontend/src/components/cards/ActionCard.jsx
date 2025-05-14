// src/components/cards/ActionCard.jsx
import React from 'react';
import {
    Card, CardBody, Flex, Box, Heading, Text,
    useColorModeValue
} from '@chakra-ui/react';

/**
 * Tarjeta de acción para funciones rápidas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {React.ElementType} props.icon - Icono a mostrar
 * @param {string} props.color - Color principal (primary, success, etc)
 * @param {Function} props.onClick - Función al hacer click
 * @param {string} props.bgColor - Color de fondo
 * @param {string} props.description - Descripción de la acción
 * @returns {JSX.Element} Componente ActionCard
 */
const ActionCard = ({
    title,
    icon,
    color,
    onClick,
    bgColor,
    description
}) => {
    const headingColor = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Card
            bg={bgColor}
            borderRadius="xl"
            boxShadow="sm"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'md',
            }}
            onClick={onClick}
            overflow="hidden"
        >
            <CardBody p={0}>
                <Flex direction="column" p={5}>
                    <Flex
                        width="50px"
                        height="50px"
                        borderRadius="lg"
                        bg={`${color}20`}
                        justify="center"
                        align="center"
                        mb={4}
                    >
                        <Box as={icon} size="24px" color={color} />
                    </Flex>
                    <Heading size="md" mb={2} color={headingColor}>
                        {title}
                    </Heading>
                    <Text fontSize="sm" color={textColor}>
                        {description}
                    </Text>
                </Flex>
            </CardBody>
            <Box h="4px" w="full" bg={color} />
        </Card>
    );
};

export default ActionCard;