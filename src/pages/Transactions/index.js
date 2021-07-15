import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
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
import { Card, CategorySelect, PageHeader, UserSelect } from "../../components";
import moment from "moment";
import fileDownload from "js-file-download";

import useNotification from "../../hooks/useNotification";
import api from "../../services/api";

const Transactions = () => {
  const [balance, setBalance] = useState({});
  const [transactions, setTransactions] = useState([]);

  const [transaction, setTransaction] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const [history, setHistory] = useState({
    isOpen: false,
  });
  const [filter, setFilter] = useState({
    start: moment(Date.now()).format("YYYY-MM-DD"),
    end: moment(Date.now()).format("YYYY-MM-DD"),
  });

  const [transactionLogs, setTransactionLogs] = useState([]);

  const modalRef = useRef();

  const toast = useNotification();

  const getTransactions = useCallback(async () => {
    try {
      const responseApi = await api.get("/transactions");
      if (responseApi.status === 200) {
        setTransactions(responseApi.data);
      }

      const responseApiBalance = await api.get("/transactions/balance");
      if (responseApiBalance.status === 200) {
        setBalance(responseApiBalance.data);
      }
    } catch (error) {
      toast.error("Erro ao processar requisição", "Error");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  const handleNew = () => {
    setTransaction({ operation: "I" });
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      if (transaction.operation !== "E") {
        const responseApi = await api.post(`/transactions/`, transaction);

        if (responseApi.status === 201) {
          getTransactions();
          toast.success("Transação inserida!", "Sucesso");
          setIsOpen(false);
          setTransaction({});
        }
      }

      // send
      const responseApi = await api.post(`/transactions/send`, transaction);

      if (responseApi.status === 201) {
        getTransactions();
        toast.success("Transação enviada!", "Sucesso");
        setIsOpen(false);
        setTransaction({});
      }
    } catch (error) {
      toast.error("Erro ao savar", "Error");
    }
  };

  const getTransactionLogs = async () => {
    try {
      const responseApi = await api.get(
        `/transactions/logs?start=${filter.start}&end=${filter.end}`,
      );
      if (responseApi.status === 200) {
        setTransactionLogs(responseApi.data);
      }
    } catch (error) {
      toast.error("Erro ao processar requisição" + error, "Error");
    }
  };

  const handleHistory = () => {
    getTransactionLogs();

    setHistory({
      ...history,
      isOpen: true,
    });
  };

  const handleCloseHistory = () => {
    setHistory({
      isOpen: false,
      filter: { start: Date.now(), end: Date.now() },
    });
  };

  const handleDownloadHistory = async () => {
    try {
      const responseApi = await api.get(
        `/transactions/logs/csv?start=${filter.start}&end=${filter.end}`,
      );
      if (responseApi.status === 200) {
        const contentDisposition = responseApi.headers["content-disposition"];
        var match = contentDisposition.match(/filename\s*=\s*"(.+)"/i);
        var filename = match[1];

        fileDownload(responseApi.data, filename);

        toast.success("Download efetuado.", "Sucesso");
      }
    } catch (error) {
      toast.error("Erro ao processar requisição" + error, "Error");
    }
  };

  return (
    <Box>
      <PageHeader />

      <Box as="main" w="1100px" pt="15px">
        <Flex justifyContent="space-between">
          <Text fontWeight={700} mb={5} fontSize="3xl">
            Transações
          </Text>

          <Box>
            <Tooltip
              label={`Adicionar/Enviar Transação`}
              aria-label="add tooltip"
            >
              <IconButton
                colorScheme="blue"
                variant="outline"
                size="sm"
                isRound
                color="primary.100"
                aria-label="Add Transação"
                icon={<AddIcon />}
                onClick={handleNew}
              />
            </Tooltip>
            <Button colorScheme="blue" ml={2} onClick={handleHistory}>
              Histórico
            </Button>
          </Box>
        </Flex>

        <Flex justifyContent="space-between">
          <Card>
            <Text fontWeight={500}>Entradas:</Text>
            <Text fontWeight={500} ml={2}>
              {formatToBRL(balance.income)}
            </Text>
          </Card>
          <Card>
            <Text fontWeight={500}>Saídas:</Text>
            <Text fontWeight={500} ml={2}>
              {formatToBRL(balance.outcome)}
            </Text>
          </Card>
          <Card>
            <Text fontWeight={500}>Líquido:</Text>
            <Text fontWeight={500} ml={2}>
              {formatToBRL(balance.balance)}
            </Text>
          </Card>
        </Flex>

        <Flex justifyContent="center" mt={5}>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Operação</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Valor</Th>
                <Th>Categoria</Th>
                <Th>Enviado/Recebido</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions &&
                transactions.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <Center>
                        {item.operation === "I" ? (
                          <ArrowDownIcon color="green" />
                        ) : (
                          <ArrowUpIcon color="red" />
                        )}
                      </Center>
                    </Td>
                    <Td>{item.description}</Td>
                    <Td isNumeric>{formatToBRL(item.value)}</Td>
                    <Td>{item?.category?.name}</Td>
                    <Td>
                      {item?.to_user_id
                        ? `Enviado para ${item.to_user.name}`
                        : ""}
                      {item?.from_user_id
                        ? `Recebido de ${item.from_user.name}`
                        : ""}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>

      {/* add */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        initialFocusRef={modalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastro de Transação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="md" mb={2}>
              <RadioGroup
                onChange={(e) =>
                  setTransaction({ ...transaction, operation: e })
                }
                value={transaction.operation}
              >
                <Stack direction="row">
                  <Radio value="I">Entrada</Radio>
                  <Radio value="O">Saída</Radio>
                  <Radio value="E">Enviar</Radio>
                </Stack>
              </RadioGroup>
            </InputGroup>

            <InputGroup size="md" mb={2}>
              <Input
                ref={modalRef}
                placeholder="obervação"
                size="md"
                mb="15px"
                color="text.100"
                value={transaction.description}
                onChange={(e) => {
                  setTransaction({
                    ...transaction,
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
                value={transaction.value}
                onChange={(e) => {
                  setTransaction({
                    ...transaction,
                    value: e.target.value.replace(",", "."),
                  });
                }}
              />
            </InputGroup>

            {transaction.operation !== "E" && (
              <InputGroup size="md" mb={2}>
                <CategorySelect
                  mb="15px"
                  value={transaction.category_id}
                  onChange={(e) => {
                    setTransaction({
                      ...transaction,
                      category_id: e.target.value,
                    });
                  }}
                />
              </InputGroup>
            )}

            {transaction.operation === "E" && (
              <InputGroup size="md" mb={2}>
                <UserSelect
                  mb="15px"
                  value={transaction.send_user_id}
                  onChange={(e) => {
                    setTransaction({
                      ...transaction,
                      send_user_id: e.target.value,
                    });
                  }}
                />
              </InputGroup>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSave}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* History */}
      <Modal
        isOpen={history.isOpen}
        onClose={handleCloseHistory}
        size="6xl"
        initialFocusRef={modalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Histórico de Transação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Flex justifyContent="space-between">
                <InputGroup size="md">
                  <Input
                    ref={modalRef}
                    placeholder="start"
                    size="md"
                    color="text.100"
                    type="date"
                    value={filter.start}
                    onChange={(e) => {
                      const start = moment(e.target.value).format("YYYY-MM-DD");
                      setFilter({ ...filter, start });
                    }}
                  />
                </InputGroup>

                <InputGroup size="md" ml={2}>
                  <Input
                    placeholder="end"
                    size="md"
                    color="text.100"
                    type="date"
                    value={filter.end}
                    onChange={(e) => {
                      const end = moment(e.target.value).format("YYYY-MM-DD");
                      setFilter({ ...filter, end });
                    }}
                  />
                </InputGroup>

                <Button
                  colorScheme="blue"
                  ml={2}
                  onClick={getTransactionLogs}
                  w={200}
                  rightIcon={<SearchIcon />}
                >
                  Buscar
                </Button>

                <Button
                  colorScheme="blue"
                  ml={2}
                  onClick={handleDownloadHistory}
                  w={250}
                  rightIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </Flex>

              <Flex justifyContent="center" mt={5}>
                <Table variant="striped" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th>Operação</Th>
                      <Th>Data</Th>
                      <Th>Log</Th>
                      <Th isNumeric>Valor</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transactionLogs &&
                      transactionLogs.map((item) => (
                        <Tr key={item.id}>
                          <Td>
                            {item.operation === "I" ? (
                              <ArrowDownIcon color="green" />
                            ) : (
                              <ArrowUpIcon color="red" />
                            )}
                          </Td>
                          <Td>{moment(item.date).format("DD/MM/YYYY")}</Td>
                          <Td>{item.log}</Td>
                          <Td isNumeric>{formatToBRL(item.value)}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Flex>
            </Box>
          </ModalBody>

          {/* <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSave}>
              Salvar
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Transactions;
