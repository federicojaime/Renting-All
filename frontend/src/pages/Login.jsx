import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  useToast, 
  InputGroup, 
  InputRightElement, 
  InputLeftElement, 
  Image, 
  Text, 
  IconButton,
  FormErrorMessage,
  Heading,
  Flex,
  Container,
  useColorModeValue,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Icon,
  SlideFade,
  Spinner,
  useBreakpointValue,
  HStack,
  Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaUserAlt, FaLock, FaSignInAlt, FaShieldAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import Logo from "../assets/logo.png";
import Fondo from "../assets/imagen_fondo.jpg";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: 'ejemplo@email.com', password: 'contraseña' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState('initial'); // 'initial', 'loading', 'success'
  const toast = useToast();

  // Responsive settings
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logoSize = useBreakpointValue({ base: "150px", md: "180px" });
  const formWidth = useBreakpointValue({ base: "90%", sm: "450px", md: "480px" });

  // Colores para el tema 2025
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');
  const primaryColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(23, 25, 35, 0.85)');
  
  // Efectos visuales adicionales
  useEffect(() => {
    if (loginState === 'success') {
      const timer = setTimeout(() => {
        // Proceso de redireccionamiento o carga completado
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loginState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginState('loading');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.ok) {
        setLoginState('success');
        
        // Mostrar toast de éxito
        toast({
          title: '¡Login exitoso!',
          description: '¡Bienvenido al sistema!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
          variant: 'solid',
        });
        
        // Pequeño retraso para mostrar la animación de éxito
        setTimeout(() => {
          onLogin(data.data.jwt, data.data);
        }, 1000);
      } else {
        setLoginState('initial');
        toast({
          title: 'Error de acceso',
          description: data.msg || 'Credenciales inválidas',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
          variant: 'solid',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginState('initial');
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      bgImage={`url(${Fondo})`}
      bgSize="cover"
      bgPosition="center"
      position="relative"
      overflow="hidden"
    >
      {/* Overlay con gradiente */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-br, rgba(0,0,0,0.4), rgba(0,0,0,0.7))"
        zIndex="1"
      />

      {/* Elementos de diseño */}
      <MotionBox 
        position="absolute" 
        top="-100px" 
        right="-100px" 
        w="400px" 
        h="400px" 
        bg={primaryColor}
        borderRadius="full" 
        opacity="0.15" 
        zIndex="2"
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <MotionBox 
        position="absolute" 
        bottom="-50px" 
        left="-50px" 
        w="300px" 
        h="300px" 
        bg={secondaryColor}
        borderRadius="full" 
        opacity="0.15" 
        zIndex="2"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <Container maxW="full" centerContent>
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="100vh"
          zIndex="3"
          w="100%"
        >
          <MotionFlex
            direction="column"
            align="center"
            w={formWidth}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card 
              bg={glassBg}
              borderRadius="3xl"
              boxShadow="2xl"
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              position="relative"
              backdropFilter="blur(16px)"
              w="full"
              transition="all 0.3s"
              px={{ base: 6, md: 10 }}
              py={{ base: 8, md: 10 }}
            >
              {/* Barra de color decorativa superior */}
              <Box 
                position="absolute" 
                top={0}
                left={0}
                right={0}
                h="6px" 
                bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`} 
              />

              <VStack spacing={6} align="center">
                <MotionBox
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Image 
                    src={Logo} 
                    alt="Renting All Logo" 
                    w={logoSize}
                    mb={2} 
                    filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))"
                  />
                </MotionBox>
                
                <SlideFade in={true} offsetY="20px">
                  <Heading
                    as="h1"
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    color={textColor}
                    letterSpacing="wide"
                    textAlign="center"
                    mb={1}
                  >
                    Bienvenido a Renting All
                  </Heading>
                  <Text color={subtextColor} fontSize="md" textAlign="center">
                    Accede al sistema de gestión de flota
                  </Text>
                </SlideFade>

                <Divider />

                {loginState === 'success' ? (
                  <VStack spacing={6} py={10}>
                    <Box
                      borderRadius="full"
                      bg={`${primaryColor}20`}
                      p={4}
                      width="80px"
                      height="80px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FaCheckCircle} color={primaryColor} boxSize={10} />
                    </Box>
                    <Heading size="md" color={textColor} textAlign="center">
                      ¡Inicio de sesión exitoso!
                    </Heading>
                    <Text color={subtextColor} textAlign="center">
                      Redirigiendo al panel de administración...
                    </Text>
                    <Spinner
                      thickness="3px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color={primaryColor}
                      size="md"
                    />
                  </VStack>
                ) : (
                  <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack spacing={5} w="100%" pt={2}>
                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel color={textColor} fontWeight="500" mb={2}>
                          Email
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement color={primaryColor}>
                            <FaUserAlt />
                          </InputLeftElement>
                          <Input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: primaryColor,
                              boxShadow: `0 0 0 1px ${primaryColor}`
                            }}
                            _hover={{
                              borderColor: primaryColor
                            }}
                          />
                        </InputGroup>
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel color={textColor} fontWeight="500" mb={2}>
                          Contraseña
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement color={primaryColor}>
                            <FaLock />
                          </InputLeftElement>
                          <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Ingresa tu contraseña"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: primaryColor,
                              boxShadow: `0 0 0 1px ${primaryColor}`
                            }}
                            _hover={{
                              borderColor: primaryColor
                            }}
                          />
                          <InputRightElement>
                            <IconButton
                              variant="ghost"
                              onClick={() => setShowPassword(!showPassword)}
                              icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                              color="gray.400"
                              _hover={{ bg: 'transparent', color: primaryColor }}
                              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>

                      <HStack w="full" justify="space-between" pt={3} pb={2}>
                        <Tooltip label="Función no disponible" placement="top">
                          <Text
                            fontSize="sm"
                            color={primaryColor}
                            cursor="pointer"
                            fontWeight="medium"
                            _hover={{ textDecoration: 'underline' }}
                          >
                            ¿Olvidaste tu contraseña?
                          </Text>
                        </Tooltip>
                      </HStack>

                      <Button
                        type="submit"
                        w="100%"
                        bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
                        color="white"
                        size="lg"
                        height="56px"
                        fontSize="md"
                        fontWeight="600"
                        leftIcon={<FaSignInAlt />}
                        mt={2}
                        borderRadius="xl"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                          opacity: 0.9
                        }}
                        _active={{
                          transform: "translateY(0)",
                        }}
                        isLoading={isLoading}
                        loadingText="Iniciando sesión..."
                        transition="all 0.2s"
                      >
                        Iniciar Sesión
                      </Button>

                      <Flex 
                        p={3} 
                        mt={4}
                        bg="blue.50" 
                        borderRadius="lg" 
                        borderWidth="1px"
                        borderColor="blue.100"
                        w="full"
                        align="center"
                      >
                        <Icon as={FaInfoCircle} color="blue.500" boxSize={5} mr={3} />
                        <Text fontSize="sm" color="blue.700">
                          Para acceder al sistema, contacta con el administrador para obtener tus credenciales.
                        </Text>
                      </Flex>
                    </VStack>
                  </form>
                )}

                <HStack spacing={1} pt={3} opacity={0.7}>
                  <Icon as={FaShieldAlt} color={textColor} boxSize={3} />
                  <Text color={subtextColor} fontSize="xs" textAlign="center">
                    Conexión segura - © 2025 Renting All
                  </Text>
                </HStack>
              </VStack>
            </Card>
          </MotionFlex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Login;