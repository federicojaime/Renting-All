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
  FormErrorMessage 
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
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onLogin(data.data.jwt, data.data);
      } else {
        toast({
          title: 'Error',
          description: data.msg || 'Error al iniciar sesión',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error de conexión',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="rgba(255, 255, 255, 0.85)"
        backdropFilter="blur(10px)"
        borderRadius="sm"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        border="1px solid rgba(255, 255, 255, 0.18)"
        p={8}
        w="100%"
        maxW="400px"
        position="relative"
      >
        <VStack spacing={6}>
          <Image src={Logo} alt="Renting All Logo" w="180px" mb={2} />
          
          <Text
            fontSize="2xl"
            fontWeight="500"
            color="#7d9bb3"
            letterSpacing="wide"
            mb={4}
          >
            Iniciar Sesión
          </Text>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} w="100%">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel color="#7d9bb3" fontWeight="500" mb={2}>
                  Email <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement color="#7d9bb3">
                    <FaUserAlt />
                  </InputLeftElement>
                  <Input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu email"
                    bg="rgba(255, 255, 255, 0.75)"
                    border="1px solid rgba(125, 155, 179, 0.3)"
                    borderRadius="sm"
                    _focus={{
                      borderColor: "#7d9bb3",
                      boxShadow: "0 0 0 1px #7d9bb3"
                    }}
                    _hover={{
                      borderColor: "#7d9bb3"
                    }}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel color="#7d9bb3" fontWeight="500" mb={2}>
                  Contraseña <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement color="#7d9bb3">
                    <FaLock />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    bg="rgba(255, 255, 255, 0.75)"
                    border="1px solid rgba(125, 155, 179, 0.3)"
                    borderRadius="sm"
                    _focus={{
                      borderColor: "#7d9bb3",
                      boxShadow: "0 0 0 1px #7d9bb3"
                    }}
                    _hover={{
                      borderColor: "#7d9bb3"
                    }}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      color="#7d9bb3"
                      _hover={{ bg: 'transparent' }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                w="100%"
                bg="#7d9bb3"
                color="white"
                size="lg"
                fontSize="md"
                fontWeight="500"
                mt={4}
                borderRadius="sm"
                _hover={{
                  bg: "#6b859b",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{
                  bg: "#5f7689",
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
                isLoading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;