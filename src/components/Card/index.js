import { Flex } from "@chakra-ui/react";
import React from "react";

const Card = ({ children, ...props }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      w="200px"
      h="50px"
      borderRadius="4px"
      border="1px solid #0F76B8"
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Card;
