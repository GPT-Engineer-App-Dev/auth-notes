import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, Button, Input, VStack, Text, Container, Heading, useToast } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";

const SUPABASE_URL = "https://mnwefvnykbgyhbdzpleh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

const Index = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogin = async () => {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      sessionStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast({
        title: "Logged in successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to log in.",
        description: data.error_description || "Check your credentials and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out successfully.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider>
      <Container centerContent>
        {!user ? (
          <VStack spacing={4}>
            <Heading>Login</Heading>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button colorScheme="blue" onClick={handleLogin}>
              Log In
            </Button>
          </VStack>
        ) : (
          <Box>
            <Text>Welcome, you are logged in!</Text>
            <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default Index;
