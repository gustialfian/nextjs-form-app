import { Button, Link, Modal, Snackbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Head from "next/head";
import * as React from "react";
import { subscriberSubmit } from "../data/api";
import { useRouter } from "next/router";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const defaultData = {
  address: "",
  contactNumber: "",
  contactPerson: "",
};

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

export default function Checkout() {
  const router = useRouter();
  const { userId } = router.query;
  const [data, setData] = React.useState(defaultData);
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subsinfo = { ...data, userId: userId };
    console.log("Submit", subsinfo);
    subscriberSubmit(subsinfo)
      .then((res) => {
        console.log("done", res);
        setOpen(true);
        setData(defaultData);
      })
      .catch((err) => {
        console.log("<Form /> handleSumbit");
        console.error(err);
      });
  };

  console.log("router.query.userId: ", userId);
  console.log("data", data);

  if (!userId) {
    return (
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Please make sure you have the right url.
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Data Submited"
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thank you {userId} for submiting the form
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please wait until our admin proccess your submission.
          </Typography>
        </Box>
      </Modal>

      <Head>
        <title>User Info Form</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Ruangguru
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          id="form-subcriber-info"
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography component="h1" variant="h4" marginBottom="1em">
            Hello {userId}
          </Typography>

          <Typography
            component="p"
            variant="p"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
            marginBottom="1em"
          >
            Please fill out this form for your gift.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                id="address"
                name="address"
                label="Address"
                fullWidth
                variant="standard"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="contact_number"
                name="contact_number"
                label="Contact Number"
                fullWidth
                variant="standard"
                value={data.contactNumber}
                onChange={(e) =>
                  setData({ ...data, contactNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="contact_person"
                name="contact_person"
                label="Contact Person"
                fullWidth
                variant="standard"
                value={data.contactPerson}
                onChange={(e) =>
                  setData({ ...data, contactPerson: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" sx={{ mt: 3, ml: 1 }}>
              Submit
            </Button>
          </Box>
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
