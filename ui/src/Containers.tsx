import * as React from "react";
import {
  Stack,
  Box,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import { v1 } from "@docker/extension-api-client-types";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReplayCircleIcon from "@mui/icons-material/ReplayCircleFilled";
import StopCircleIcon from "@mui/icons-material/StopCircle";

export interface SshConnection {
  host: string;
  hostname?: string;
  user?: string;
  identity_file?: string;
  proxy_command?: string;
  forward_agent?: string;
  other_fields?: object;
}

export type ContainerProps = {
  client: v1.DockerDesktopClient;
  sshConnection?: SshConnection;
};

const Containers = ({ client, sshConnection }: ContainerProps) => {
  return (
    <Box sx={{ pt: 1 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Container ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Port(s)</TableCell>
              <TableCell>CPU (%)</TableCell>
              <TableCell sx={{ minWidth: 96 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={sshConnection?.hostname}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {sshConnection?.hostname}
              </TableCell>
              <TableCell>{sshConnection?.hostname}</TableCell>
              <TableCell>{sshConnection?.host}</TableCell>
              <TableCell>{sshConnection?.user}</TableCell>
              <TableCell>{sshConnection?.identity_file}</TableCell>
              <TableCell>
                <IconButton sx={{ p: 0 }} color="success">
                  <PlayCircleIcon />
                </IconButton>
                <IconButton sx={{ p: 0 }} color="warning">
                  <ReplayCircleIcon />
                </IconButton>
                <IconButton sx={{ p: 0 }} color="error">
                  <StopCircleIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Containers;
