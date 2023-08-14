import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Image } from "mui-image";
import { RootState } from "../../store";
import {
  AppBar,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

export const DeviceDetails = () => {
  const selectedDeviceName = useSelector(
    (state: RootState) => state.ui.data.name
  );
  const selectedDeviceModel = useSelector(
    (state: RootState) => state.ui.data.meta.model
  );

  const selectedDevice = useSelector(
    (state: RootState) =>
      state.dhcp.leases.filter((lease) => {
        // does the selected mac exist in the lease data?
        return lease.data.some((device) => {
          return device.mac === state.ui.selectedMac;
        });
      })[0]
  );

  return (
    <Box sx={{ width: 400 }}>
      <AppBar
        position="static"
        color="primary"
        enableColorOnDark
        sx={{ padding: 1 }}
      >
        <Typography variant="h6" align="center">
          {selectedDeviceName}
        </Typography>
      </AppBar>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        padding={2}
      >
        <Box
          sx={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
        >
          <Image
            alt="selectedDeviceName"
            src={`/icons/devices/${selectedDeviceModel}.png`}
            width={100}
            height="auto"
          />
        </Box>

        {selectedDevice.description && (
          <Paper sx={{ width: "100%", padding: 2 }}>
            <Typography>{selectedDevice.description}</Typography>
          </Paper>
        )}
        {selectedDevice.data.map((value) => (
          <TableContainer component={Paper}>
            <Table aria-label="simple table" key={value.mac}>
              <TableBody>
                {Object.entries(value).map(([key, value]) => (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell align="right">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </Stack>
    </Box>
  );
};
