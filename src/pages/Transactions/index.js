import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatToBRL } from "brazilian-values";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Card, PageHeader } from "../../components";

import useNotification from "../../hooks/useNotification";
import api from "../../services/api";

const Transactions = () => {
  const [balance, setBalance] = useState({});
  const [transactions, setTransactions] = useState([]);

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

  return (
    <Box>
      <PageHeader />

      <Box as="main" w="1100px" pt="15px">
        <Text fontWeight={700} mb={5} fontSize="3xl">
          Transações
        </Text>

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
          <Card>
            <IconButton
              colorScheme="blue"
              variant="outline"
              isRound
              color="primary.100"
              aria-label="Add Transação"
              icon={<AddIcon />}
            />
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
              </Tr>
            </Thead>
            <Tbody>
              {transactions &&
                transactions.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      {item.operation === "I" ? (
                        <ArrowDownIcon color="green" />
                      ) : (
                        <ArrowUpIcon color="red" />
                      )}
                    </Td>
                    <Td>{item.description}</Td>
                    <Td isNumeric>{formatToBRL(item.value)}</Td>
                    <Td>{item?.category?.name}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Flex>
      </Box>
    </Box>
  );
};

export default Transactions;
