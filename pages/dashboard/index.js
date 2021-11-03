import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TableContainer,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/dist/client/router";
import * as React from "react";
import {
  listSubscriberInfo,
  checkStatus,
  changeStatus,
  identity,
} from "../../data/api";

const mdTheme = createTheme();

function useIdentity() {
  const [isAuthenticate, setIsAuthenticate] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    identity().then((res) => {
      if (res.msg != "ok") {
        router.push("/signin");
        return;
      }
      setIsAuthenticate(true);
    });
  }, []);
  return isAuthenticate;
}

function DashboardContent() {
  const router = useRouter();
  const [isCheckModalOpen, setIsCheckModalOpen] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [isStatusLoading, setIsStatusLoading] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState();
  const [subsInfo, setSubsInfo] = React.useState([]);
  const isAuthenticate = useIdentity();

  React.useEffect(() => {
    listSubscriberInfo().then((res) => {
      if (!res.data) {
        return;
      }
      setSubsInfo(res.data);
    });
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsCheckModalOpen(false);
  };

  const handleCheck = (userID) => {
    setIsCheckModalOpen(true);
    setSelectedUserId(userID);
  };

  const handleStatusChange = (newValue, id) => {
    setIsStatusLoading(true);
    changeStatus(id, newValue).then((res) => {
      const newSub = subsInfo.map((val) => {
        if (val.ID !== id) {
          return val;
        }
        return {
          ...val,
          status: newValue,
        };
      });
      setSubsInfo(newSub);
      setIsSnackbarOpen(true);
      setIsStatusLoading(false);
    });
  };

  if (!isAuthenticate) {
    return (
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Loading...
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Layout />

        <Modal open={isCheckModalOpen} onClose={handleClose}>
          <CheckModal userId={selectedUserId} />
        </Modal>

        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Status Submission changed"
        />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Recent Orders
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Contact Number</TableCell>
                        <TableCell>Contact Person</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subsInfo.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.userID}</TableCell>
                          <TableCell>{row.address}</TableCell>
                          <TableCell>{row.contactNumber}</TableCell>
                          <TableCell>{row.contactPerson}</TableCell>
                          <TableCell>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Age"
                              value={row.status}
                              onChange={(e) =>
                                handleStatusChange(e.target.value, row.ID)
                              }
                              disabled={isStatusLoading}
                            >
                              <MenuItem value={"created"}>Created</MenuItem>
                              <MenuItem value={"delivery"}>Delivery</MenuItem>
                              <MenuItem value={"rejected"}>Rejected</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => handleCheck(row.userID)}
                            >
                              Check
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function Layout() {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    router.push("/signin");
  };

  return (
    <>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    </>
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const prizeLookUp = {
  englishacademy: "Shoes",
  skillacademy: "Bag",
  ruangguru: "Pencils",
};

function CheckModal({ userId }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [packages, setPackages] = React.useState();
  const [errMsg, setErrMsg] = React.useState();
  React.useEffect(() => {
    checkStatus(userId).then((res) => {
      setIsLoading(false);
      if (res.status === "error") {
        setErrMsg(res.message);
        return;
      }
      setPackages(res.packages);
    });
  }, []);

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {userId}'s packages
      </Typography>

      {isLoading && !packages && (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Loading...
        </Typography>
      )}

      {!isLoading && errMsg && (
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {errMsg}
        </Typography>
      )}

      {packages && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell>Tag</TableCell>
                <TableCell>Prize</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.orderStatus}</TableCell>
                  <TableCell>{row.packageName}</TableCell>
                  <TableCell>{row.packageSerial}</TableCell>
                  <TableCell>{row.packageTag}</TableCell>
                  <TableCell>{prizeLookUp[row.packageTag]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
