import React, { useState } from 'react';
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
  Divider
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import Logo from "../assets/logo.png";
import Fondo from "../assets/imagen_fondo.jpg";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: 'ejemplo@email.com', password: 'contraseña' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Colores para el tema 2025
  const bgGradient = "linear(to-br, teal.400, blue.500)";
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const brandColor = useColorModeValue('teal.500', 'teal.300');
  const inputBg = useColorModeValue('gray.50', 'gray.700');

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
    }
    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
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
        toast({
          title: 'Login exitoso',
          description: '¡Bienvenido al sistema!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        onLogin(data.data.jwt, data.data);
      } else {
        toast({
          title: 'Error',
          description: data.msg || 'Error al iniciar sesión',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión con el servidor',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
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
        bg="rgba(0, 0, 0, 0.4)"
        zIndex="1"
      />

      {/* Círculos decorativos */}
      <Box 
        position="absolute" 
        top="-100px" 
        right="-100px" 
        w="400px" 
        h="400px" 
        bg={brandColor}
        borderRadius="full" 
        opacity="0.2" 
        zIndex="2"
      />
      <Box 
        position="absolute" 
        bottom="-50px" 
        left="-50px" 
        w="300px" 
        h="300px" 
        bg="blue.400" 
        borderRadius="full" 
        opacity="0.2" 
        zIndex="2"
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
          <Box
            bg={cardBg}
            p={{ base: 8, md: 10 }}
            borderRadius="2xl"
            boxShadow="xl"
            w={{ base: '90%', sm: '450px' }}
            border="1px solid"
            borderColor="gray.100"
            position="relative"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
              boxShadow: "2xl",
              transform: "translateY(-5px)"
            }}
          >
            {/* Elemento decorativo superior */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              h="8px"
              bgGradient={bgGradient}
            />

            <VStack spacing={6} align="center">
              <Image 
                src={Logo} 
                alt="Renting All Logo" 
                w="180px" 
                mb={2} 
                filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))"
              />
              
              <Heading
                as="h1"
                fontSize="2xl"
                fontWeight="700"
                color={textColor}
                letterSpacing="wide"
                textAlign="center"
              >
                Bienvenido a Renting All
              </Heading>

              <Text color="gray.500" fontSize="sm" mb={4} textAlign="center">
                Ingresa tus credenciales para acceder al sistema
              </Text>

              <Divider />

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={5} w="100%">
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel color={textColor} fontWeight="500" mb={2}>
                      Email
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement color={brandColor}>
                        <FaUserAlt />
                      </InputLeftElement>
                      <Input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Ingresa tu email"
                        bg={inputBg}
                        borderRadius="lg"
                        _focus={{
                          borderColor: brandColor,
                          boxShadow: `0 0 0 1px ${brandColor}`
                        }}
                        _hover={{
                          borderColor: brandColor
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
                      <InputLeftElement color={brandColor}>
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
                          borderColor: brandColor,
                          boxShadow: `0 0 0 1px ${brandColor}`
                        }}
                        _hover={{
                          borderColor: brandColor
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          color="gray.400"
                          _hover={{ bg: 'transparent', color: brandColor }}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    w="100%"
                    bgGradient={bgGradient}
                    color="white"
                    size="lg"
                    fontSize="md"
                    fontWeight="600"
                    mt={6}
                    borderRadius="lg"
                    _hover={{
                      bgGradient: "linear(to-br, teal.500, blue.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      bgGradient: "linear(to-br, teal.600, blue.700)",
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                    isLoading={isLoading}
                    loadingText="Iniciando sesión..."
                  >
                    Iniciar Sesión
                  </Button>
                </VStack>
              </form>

              <Text color="gray.500" fontSize="xs" textAlign="center" mt={4}>
                © 2025 Renting All. Todos los derechos reservados.
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Login;