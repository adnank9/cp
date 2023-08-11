import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { useState } from "react";
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

export default function ModalComponent() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
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

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const savedUser = await response.json();
        console.log(savedUser);
        console.log("User saved to MongoDB");
        handleClose();
      } else {
        throw new Error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  return (
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
            Text in a modal
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
  );
}
