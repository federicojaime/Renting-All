import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, InputGroup, InputRightElement, InputLeftElement, Image, Text, IconButton } from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import Logo from "../assets/logo.png";
import Fondo from "../assets/imagen_fondo.jpg";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: 'admin', password: 'admin123' });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      toast({
        title: 'Login exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onLogin('dummyToken');
    } else {
      toast({
        title: 'Credenciales incorrectas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
              <FormControl>
                <FormLabel color="#7d9bb3" fontWeight="500" mb={2}>
                  Usuario <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement color="#7d9bb3">
                    <FaUserAlt />
                  </InputLeftElement>
                  <Input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
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
              </FormControl>

              <FormControl>
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