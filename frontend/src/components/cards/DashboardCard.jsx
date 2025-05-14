// src/components/cards/DashboardCard.jsx
import React from 'react';
import {
    Card, CardBody, Flex, Box, Text, Badge, Stat,
    StatArrow, StatNumber,
    useColorModeValue
} from '@chakra-ui/react';

/**
 * Tarjeta para mostrar estadísticas en el dashboard
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {string|number} props.value - Valor principal a mostrar
 * @param {string} props.description - Descripción o detalle adicional
 * @param {React.ElementType} props.icon - Icono a mostrar
 * @param {string} props.color - Color base para la tarjeta (primary, success, etc)
 * @param {string|number} props.percentage - Porcentaje de variación
 * @param {boolean} props.isPositive - Si la variación es positiva o negativa
 * @returns {JSX.Element} Componente DashboardCard
 */
const DashboardCard = ({
    title,
    value,
    description,
    icon,
    color,
    percentage,
    isPositive
}) => {
    return (
        <Card
            boxShadow="sm"
            borderRadius="xl"
            variant="outline"
            p={2}
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.3s"
        >
            <CardBody>
                <Flex alignItems="center" justifyContent="space-between">
                    <Box p={2}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">{title}</Text>
                        <Text fontSize="2xl" fontWeight="bold" mt={1}>{value}</Text>
                        <Flex alignItems="center" mt={1}>
                            {percentage && (
                                <Badge
                                    colorScheme={isPositive ? "green" : "red"}
                                    variant="subtle"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Stat size="sm" display="flex" alignItems="center">
                                        <StatArrow type={isPositive ? "increase" : "decrease"} />
                                        <StatNumber fontSize="xs" fontWeight="medium" ml={1}>{percentage}%</StatNumber>
                                    </Stat>
                                </Badge>
                            )}
                            {description && (
                                <Text fontSize="xs" color="gray.500" ml={2}>{description}</Text>
                            )}
                        </Flex>
                    </Box>
                    <Box
                        p={3}
                        borderRadius="full"
                        bg={`${color}.50`}
                        color={`${color}.500`}
                    >
                        <Box as={icon} size="24px" />
                    </Box>
                </Flex>
            </CardBody>
        </Card>
    );
};

export default DashboardCard;