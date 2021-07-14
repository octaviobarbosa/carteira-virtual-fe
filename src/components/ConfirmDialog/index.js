import React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@chakra-ui/react";

const ConfirmDialog = ({
  title,
  children,
  isOpen,
  onConfirm,
  onClose,
  isDelete,
  ...props
}) => {
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{children}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              {isDelete ? (
                <Button colorScheme="red" onClick={onConfirm} ml={3}>
                  Deletar
                </Button>
              ) : (
                <Button colorScheme="blue" onClick={onConfirm} ml={3}>
                  Confirmar
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ConfirmDialog;
