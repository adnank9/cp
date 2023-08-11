import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useUserContext } from "../userContext/userContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function TableComponent() {
  const [rows, setRows] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const { setNewUserData } = useUserContext();

  const [userData, setUserData] = useState({
    username: "",
    plan: "",
    storage: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const { newUserData } = useUserContext();
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("http://localhost:8080/user/getUsers");
        if (response.ok) {
          const data = await response.json();
          setRows(data);
          console.log(data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  const getRowId = (row) => row._id;

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/getUsers");
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setRows(data);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/deleteUser/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("User deleted from MongoDB");
        // Fetch updated user data after deletion
        fetchUserData();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async (id) => {
    try {
      let url = "http://localhost:8080/user/saveUser";
      let method = "POST";
      console.log(id);

      if (userData.id) {
        url = `http://localhost:8080/user/updateUser/${id}`;
        method = "PUT";
        console.log("Edited", id);
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        let savedUser = await response.json();
        console.log(savedUser);
        console.log("User saved to MongoDB");
        fetchUserData();
        handleClose();
        savedUser = [];
      } else {
        throw new Error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 230 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "plan", headerName: "Plan", width: 130 },
    {
      field: "storage",
      headerName: "Storage",
      type: "number",
      width: 130,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setUserData({
              username: params.row.username,
              plan: params.row.plan,
              storage: params.row.storage,
            });
            handleOpen();
          }}
          //onClick={() => params.value(params.row)}
          //onClick={() => params.row.handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 110,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div>
        <Button onClick={handleOpen}>Add User</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add User
            </Typography>
            <TextField
              id="outlined-basic"
              label="Username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              variant="outlined"
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Plan</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="plan"
                value={userData.plan}
                label="plan"
                onChange={handleChange}
              >
                <MenuItem value={"Starter"}>Starter</MenuItem>
                <MenuItem value={"Professional"}>Professional</MenuItem>
                <MenuItem value={"Ultimate"}>Ultimate</MenuItem>
              </Select>
              <TextField
                id="outlined-basic"
                label="Storage"
                name="storage"
                value={userData.storage}
                onChange={handleChange}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">GB</InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Click on the Save button to save details.
            </Typography>
            <Stack direction="row" justifyContent="center">
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={getRowId}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          // checkboxSelection
        />
      </div>
    </div>
  );
}
