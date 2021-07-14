import { Select } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const UserSelect = ({ ...props }) => {
  const [users, setUsers] = useState([]);

  const getCategories = useCallback(async () => {
    try {
      const responseApi = await api.get("/users");

      if (responseApi.status === 200) {
        setUsers(responseApi.data);
      }
    } catch (error) {
      // toast.error(error, "Error");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return (
    <Select placeholder="Usuário" size="md" color="text.100" {...props}>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </Select>
  );
};

export default UserSelect;
