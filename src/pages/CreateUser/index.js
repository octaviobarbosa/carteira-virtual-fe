import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CustomButton } from "../../components";
import useNotification from "../../hooks/useNotification";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import api from "../../services/api";

const CreateUser = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [newUser, setNewUser] = useState({});

  const toast = useNotification();
  const history = useHistory();

  const handleSave = async () => {
    try {
      if (!newUser.name) {
        toast.warning("Name é obrigatório", "Oops..");
        return;
      }

      if (!newUser.email) {
        toast.warning("Email é obrigatório", "Oops..");
        return;
      }

      if (!newUser.password) {
        toast.warning("Password é obrigatório", "Oops..");
        return;
      }

      if (newUser.password && newUser.password.length < 6) {
        toast.warning("Insira uma senha com pelo menos 6 caracteres", "Oops..");
        return;
      }

      if (!newUser.confirmPassword) {
        toast.warning("Confirm password é obrigatório", "Oops..");
        return;
      }

      if (newUser.confirmPassword && newUser.confirmPassword.length < 6) {
        toast.warning(
          "Insira a senha de confirmação com pelo menos 6 caracteres",
          "Oops..",
        );
        return;
      }

      if (newUser.password !== newUser.confirmPassword) {
        toast.warning("Senhas não corespondem", "Oops..");
        return;
      }

      let status = 0;

      const responseApi = await api.post("/users", newUser).catch((err) => {
        if (err.response.status === 400) {
          status = 400;
          toast.warning(err.response.data.message, "Oops..");
        }
      });

      if (!responseApi && status === 400) {
        return;
      }

      if (responseApi.status === 201) {
        toast.success("Usuário criado!", "Sucesso");
        history.push("/login");
      }
    } catch (error) {
      toast.error(`${error}`, "Oops... Error occurred..");
    }
  };

  return (
    <Center height="100vh" width="100%">
      <Box
        border="1px solid"
        borderColor="primary.100"
        borderRadius="5px"
        w="500px"
        p="20px"
        m="0 auto"
      >
        <Grid templateColumns="repeat(3, 1fr)">
          <Box>
            <IconButton
              variant="ghost"
              icon={
                <ArrowBackIcon boxSize={6} onClick={() => history.goBack()} />
              }
            />
          </Box>
          <Box>
            <Text fontSize="24px" mb="15px" color="text.100">
              Criar Usuário
            </Text>
          </Box>
        </Grid>

        <InputGroup size="md" mb="15px">
          <Input
            placeholder="name"
            size="md"
            color="text.100"
            onChange={(e) => {
              setNewUser({ ...newUser, name: e.target.value });
            }}
          />
        </InputGroup>

        <InputGroup size="md" mb="15px">
          <Input
            placeholder="email"
            size="md"
            color="text.100"
            onChange={(e) => {
              setNewUser({ ...newUser, email: e.target.value });
            }}
          />
        </InputGroup>

        <InputGroup size="md" mb="15px">
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            color="text.100"
            onChange={(e) => {
              setNewUser({ ...newUser, password: e.target.value });
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <InputGroup size="md" mb="15px">
          <Input
            type={show ? "text" : "password"}
            placeholder="confirm password"
            color="text.100"
            onChange={(e) => {
              setNewUser({ ...newUser, confirmPassword: e.target.value });
            }}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Flex justifyContent="flex-end">
          <CustomButton width="100px" onClick={handleSave}>
            Salvar
          </CustomButton>
        </Flex>
      </Box>
    </Center>
  );
};

export default CreateUser;
