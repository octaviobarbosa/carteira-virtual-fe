import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { ConfirmDialog, PageHeader } from "../../components";

import useNotification from "../../hooks/useNotification";
import api from "../../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const modalRef = useRef();

  const [action, setAction] = useState({
    type: "new" | "edit",
    isOpen: false,
  });

  const [actionDelete, setActionDelete] = useState({
    isOpen: false,
    id: "",
  });

  const toast = useNotification();

  const getCategories = useCallback(async () => {
    try {
      const responseApi = await api.get("/categories");
      if (responseApi.status === 200) {
        setCategories(responseApi.data);
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleDelete = (id) => {
    setActionDelete({
      isOpen: true,
      id,
    });
  };

  const executeDelete = async () => {
    try {
      const responseApi = await api.delete(`/categories/${actionDelete.id}`);

      if (responseApi.status === 204) {
        setCategories(responseApi.data);
        getCategories();
        toast.success("Registro deletado!", "Sucesso");
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
    clearActions();
  };

  const handleNew = () => {
    setAction({
      type: "new",
      isOpen: true,
    });
  };

  const handleEdit = async (id) => {
    try {
      const responseApi = await api.get(`/categories/${id}`);

      if (responseApi.status === 200) {
        setCategory(responseApi.data);

        setAction({
          type: "edit",
          isOpen: true,
        });
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
  };

  const handleSave = async () => {
    try {
      if (category.id) {
        const responseApi = await api.put(
          `/categories/${category.id}`,
          category,
        );

        if (responseApi.status === 200) {
          getCategories();
          toast.success("Registro atualizado!", "Sucesso");
        }
      } else {
        const responseApi = await api.post(`/categories/`, category);

        if (responseApi.status === 201) {
          getCategories();
          toast.success("Registro criado!", "Sucesso");
        }
      }

      clearActions();
    } catch (error) {
      toast.error("Erro ao savar", "Error");
    }
  };

  const clearActions = () => {
    setAction({ type: "", isOpen: false });
    setActionDelete({ isOpen: false, id: "" });
    setCategory({});
  };

  return (
    <Box>
      <PageHeader />

      <Box as="main" w="1100px" pt="15px">
        <Flex justifyContent="space-between">
          <Text fontWeight={700} mb={5} fontSize="3xl">
            Categorias
          </Text>

          <IconButton
            colorScheme="blue"
            variant="outline"
            isRound
            color="primary.100"
            aria-label="Add Transação"
            icon={<AddIcon />}
            mr={2}
            onClick={handleNew}
          />
        </Flex>

        <Flex justifyContent="center" mt={5}>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories &&
                categories.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item?.name}</Td>
                    <Td isNumeric>
                      <Box>
                        <IconButton
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          isRound
                          color="primary.100"
                          aria-label="Editar Transação"
                          icon={<EditIcon />}
                          onClick={() => handleEdit(item.id)}
                        />

                        <IconButton
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          isRound
                          color="primary.100"
                          aria-label="Editar Transação"
                          icon={<DeleteIcon />}
                          ml={1}
                          onClick={() => handleDelete(item.id)}
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>

      <Modal
        isOpen={action.isOpen}
        onClose={clearActions}
        size="xl"
        initialFocusRef={modalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastro de Categoria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="md">
              <Input
                ref={modalRef}
                placeholder="nome"
                size="md"
                mb="15px"
                color="text.100"
                value={category.name}
                onChange={(e) => {
                  setCategory({ ...category, name: e.target.value });
                }}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={clearActions}>
              Cancelar
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSave}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        title="Deletar registro?"
        isOpen={actionDelete.isOpen}
        onClose={clearActions}
        onConfirm={executeDelete}
        isDelete
      >
        Confirme a exlusão do registro.
      </ConfirmDialog>
    </Box>
  );
};

export default Categories;
