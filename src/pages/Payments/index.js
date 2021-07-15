import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { formatToBRL } from "brazilian-values";

import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { ConfirmDialog, PageHeader } from "../../components";

import useNotification from "../../hooks/useNotification";
import api from "../../services/api";
import moment from "moment";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState({});
  const modalRef = useRef();

  const [action, setAction] = useState({
    type: "new" | "edit",
    isOpen: false,
  });

  const [actionDelete, setActionDelete] = useState({
    isOpen: false,
    id: "",
  });

  const [actionPay, setActionPay] = useState({
    isOpen: false,
    data: {},
  });

  const [actionReverse, setActionReverse] = useState({
    isOpen: false,
    id: "",
  });

  const toast = useNotification();

  const getPayments = useCallback(async () => {
    try {
      const responseApi = await api.get("/payments");
      if (responseApi.status === 200) {
        setPayments(responseApi.data);
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  const handleDelete = (id) => {
    setActionDelete({
      isOpen: true,
      id,
    });
  };

  const executeDelete = async () => {
    try {
      const responseApi = await api.delete(`/payments/${actionDelete.id}`);

      if (responseApi.status === 204) {
        setPayment(responseApi.data);
        getPayments();
        toast.success("Registro deletado!", "Sucesso");
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
    clearActions();
  };

  const handleNew = () => {
    setPayment({
      type: "P",
      due_date: moment(Date.now()).format("YYYY-MM-DD"),
      is_automatic_debt: false,
      repeat: 1,
    });
    setAction({
      type: "new",
      isOpen: true,
    });
  };

  const handleEdit = async (id) => {
    try {
      const responseApi = await api.get(`/payments/${id}`);

      if (responseApi.status === 200) {
        setPayment(responseApi.data);

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
      if (payment.id) {
        const responseApi = await api.put(`/payments/${payment.id}`, payment);

        if (responseApi.status === 200) {
          getPayments();
          toast.success("Registro atualizado!", "Sucesso");
        }
      } else {
        const responseApi = await api.post(`/payments/`, payment);

        if (responseApi.status === 201) {
          getPayments();
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
    setActionPay({ isOpen: false, data: {} });
    setActionReverse({ isOpen: false, id: "" });
    setPayment({});
  };

  const handlePay = (id) => {
    setActionPay({
      isOpen: true,
      data: {
        payment_id: id,
        payment_date: moment(Date.now()).format("YYYY-MM-DD"),
      },
    });
  };

  const handleSavePay = async () => {
    try {
      const responseApi = await api.post(`/payments/pay`, actionPay.data);

      if (responseApi.status === 200) {
        getPayments();
        toast.success("Pagamento baixado!", "Sucesso");
      }

      clearActions();
    } catch (error) {
      toast.error("Erro ao baixar", "Error");
    }
  };

  const handleReverse = (id) => {
    setActionReverse({
      isOpen: true,
      id,
    });
  };

  const executeReverse = async () => {
    try {
      const responseApi = await api.post(
        `/payments/reverse/${actionReverse.id}`,
      );

      if (responseApi.status === 200) {
        getPayments();
        toast.success("Pagamento estornado!", "Sucesso");
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
    clearActions();
  };

  return (
    <Box>
      <PageHeader />

      <Box as="main" w="1100px" pt="15px">
        <Flex justifyContent="space-between">
          <Text fontWeight={700} mb={5} fontSize="3xl">
            Pagamentos
          </Text>

          <IconButton
            colorScheme="blue"
            variant="outline"
            isRound
            size="sm"
            color="primary.100"
            aria-label="Add Pagamento"
            icon={<AddIcon />}
            mr={2}
            onClick={handleNew}
          />
        </Flex>

        <Flex justifyContent="center" mt={5}>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Tipo</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Valor</Th>
                <Th>Vencimento</Th>
                <Th>Pagamento/Recebimento</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments &&
                payments.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <Center>
                        {item?.type === "R" ? (
                          <ArrowDownIcon color="green" />
                        ) : (
                          <ArrowUpIcon color="red" />
                        )}
                      </Center>
                    </Td>
                    <Td>{item?.description}</Td>
                    <Td isNumeric>{formatToBRL(item.value)}</Td>
                    <Td>{moment(item?.due_date).format("DD/MM/YYYY")}</Td>
                    <Td>
                      {item?.payment_date
                        ? moment(item?.payment_date).format("DD/MM/YYYY")
                        : null}
                    </Td>
                    <Td isNumeric>
                      <Box>
                        <Tooltip
                          label={`Baixar Pagamento`}
                          aria-label="add tooltip"
                        >
                          <IconButton
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            isRound
                            color="primary.100"
                            aria-label="baixar Pagamento"
                            icon={<CalendarIcon />}
                            onClick={() => handlePay(item.id)}
                            disabled={item.payment_date}
                          />
                        </Tooltip>

                        <Tooltip
                          label={`Estornar Pagamento`}
                          aria-label="add tooltip"
                        >
                          <IconButton
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            isRound
                            color="primary.100"
                            aria-label="baixar Pagamento"
                            icon={<RepeatIcon />}
                            onClick={() => handleReverse(item.id)}
                            disabled={!item.payment_date}
                          />
                        </Tooltip>

                        <Tooltip
                          label={`Editar Pagamento`}
                          aria-label="add tooltip"
                        >
                          <IconButton
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            isRound
                            color="primary.100"
                            aria-label="Editar Pagamento"
                            icon={<EditIcon />}
                            ml={1}
                            onClick={() => handleEdit(item.id)}
                            disabled={item.payment_date}
                          />
                        </Tooltip>

                        <Tooltip
                          label={`Deletar Pagamento`}
                          aria-label="add tooltip"
                        >
                          <IconButton
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            isRound
                            color="primary.100"
                            aria-label="Deletar Pagamento"
                            icon={<DeleteIcon />}
                            ml={1}
                            onClick={() => handleDelete(item.id)}
                            disabled={item.payment_date}
                          />
                        </Tooltip>
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
          <ModalHeader>Cadastro de Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="md" mb={2}>
              <RadioGroup
                onChange={(e) => setPayment({ ...payment, type: e })}
                value={payment.type}
              >
                <Stack direction="row">
                  <Radio value="P">Pagar</Radio>
                  <Radio value="R">Receber</Radio>
                </Stack>
              </RadioGroup>
            </InputGroup>

            <InputGroup size="md" mb={2}>
              <Input
                ref={modalRef}
                placeholder="descrição"
                size="md"
                mb="15px"
                color="text.100"
                value={payment.description}
                onChange={(e) => {
                  setPayment({
                    ...payment,
                    description: e.target.value,
                  });
                }}
              />
            </InputGroup>

            <InputGroup size="md" mb={2}>
              <Input
                placeholder="valor"
                size="md"
                mb="15px"
                type="number"
                color="text.100"
                value={payment.value}
                onChange={(e) => {
                  setPayment({
                    ...payment,
                    value: e.target.value.replace(",", "."),
                  });
                }}
              />
            </InputGroup>

            <InputGroup size="md" mb={2}>
              <Input
                placeholder="descrição"
                size="md"
                mb="15px"
                type="date"
                color="text.100"
                value={moment(payment.due_date).format("YYYY-MM-DD")}
                onChange={(e) => {
                  const due_date = moment(e.target.value).format("YYYY-MM-DD");
                  setPayment({
                    ...payment,
                    due_date,
                  });
                }}
              />
            </InputGroup>

            <InputGroup size="md" mb={2}>
              <Checkbox
                mr={3}
                value={payment.is_automatic_debt}
                onChange={(e) => {
                  setPayment({
                    ...payment,
                    is_automatic_debt: e.target.checked,
                  });
                }}
              >
                Débito Automatico
              </Checkbox>

              <Text pt={2} mr={2}>
                Repetir
              </Text>
              <NumberInput
                defaultValue={0}
                min={1}
                onChange={(value) => {
                  setPayment({ ...payment, repeat: value });
                }}
                value={payment.repeat || 0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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

      <Modal
        isOpen={actionPay.isOpen}
        onClose={clearActions}
        size="xl"
        initialFocusRef={modalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Baxiar Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="md" mb={2}>
              <Input
                ref={modalRef}
                placeholder="Data de pagamento"
                size="md"
                mb="15px"
                type="date"
                color="text.100"
                value={actionPay.data.payment_date}
                onChange={(e) => {
                  const payment_date = moment(e.target.value).format(
                    "YYYY-MM-DD",
                  );
                  setActionPay({
                    ...actionPay,
                    data: {
                      ...actionPay.data,
                      payment_date,
                    },
                  });

                  // setPayment({
                  //   ...payment,
                  //   payment_date,
                  // });
                }}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={clearActions}>
              Cancelar
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSavePay}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        title="Estornar registro?"
        isOpen={actionReverse.isOpen}
        onClose={clearActions}
        onConfirm={executeReverse}
      >
        Confirme o estorno do registro.
      </ConfirmDialog>

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

export default Payments;
