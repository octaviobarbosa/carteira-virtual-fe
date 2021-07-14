import React from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import useApp from "../../hooks/useApp";
import { useHistory } from "react-router-dom";

const PageHeader = ({ children, ...props }) => {
  const appData = useApp();
  const { user } = appData.getAppData();

  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("app");
    history.push("/");
  };

  return (
    <Box
      as="header"
      w="1100px"
      bg="primary.100"
      h="50px"
      justifyItems="center"
      alignItems="center"
    >
      <Flex justifyContent="space-between">
        <Flex justifyContent="center" alignItems="center">
          <Button
            variant="unstyled"
            ml={2}
            onClick={() => history.push("/transactions")}
          >
            <Text fontWeight={500} color="secondary.100">
              Transações
            </Text>
          </Button>

          <Button
            variant="unstyled"
            ml={2}
            onClick={() => history.push("/categories")}
          >
            <Text fontWeight={500} color="secondary.100">
              Categorias
            </Text>
          </Button>
          <Button
            variant="unstyled"
            ml={2}
            onClick={() => history.push("/payments")}
          >
            <Text fontWeight={500} color="secondary.100">
              Pagamentos
            </Text>
          </Button>
        </Flex>
        <Flex h="50px" w="50px" justifyContent="center" alignItems="center">
          <Tooltip
            label={`${user.name} / Click for logout`}
            aria-label="name tooltip"
          >
            <Stack>
              <Avatar
                size="sm"
                name={user.name}
                cursor="pointer"
                onClick={handleLogout}
              />
            </Stack>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PageHeader;
