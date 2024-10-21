// 1. Crear el Formulario de Login
// src/components/Login.jsx
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, InputGroup, InputRightElement, InputLeftElement, Image, Heading, IconButton } from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  // Hardcoded user for login
  const hardcodedUser = { username: 'admin', password: 'admin123' };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      credentials.username === hardcodedUser.username &&
      credentials.password === hardcodedUser.password
    ) {
      toast({
        title: 'Login exitoso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onLogin('dummyToken');
    } else {
      toast({
        title: 'Credenciales incorrectas',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="md" textAlign="center" bg="white">
      <Image src="/logo.png" alt="Logo" boxSize="100px" mx="auto" mb={4} />
      <Heading as="h2" size="lg" mb={6} color="blue.600">Iniciar Sesión</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Usuario</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FaUserAlt color="gray.300" />} />
              <Input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
              />
            </InputGroup>
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<FaLock color="gray.300" />} />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  onClick={toggleShowPassword}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full" mt={4}>
            Iniciar Sesión
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
