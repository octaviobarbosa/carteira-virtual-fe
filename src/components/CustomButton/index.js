import { Button } from "@chakra-ui/react";
import React from "react";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      bg="primary.100"
      color="text.100"
      _hover={{ bg: "primary.150", color: "#FFF " }}
      _active={{
        bg: "white.200",
        color: "black.100",
        transform: "scale(0.98)",
        borderColor: "#bec3c9",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
