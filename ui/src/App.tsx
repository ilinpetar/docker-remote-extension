import React, { useEffect } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Stack,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import Containers, { SshConnection } from "./Containers";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const ddClient = useDockerDesktopClient();
  const [connected, setConnected] = React.useState<boolean>(false);
  const [sshConfig, setSshConfig] = React.useState<SshConnection[]>();
  const [sshConnection, setSshConnection] = React.useState<SshConnection>();

  const connect = () => {
    // TODO: open ssh tunnel
    sshConnection &&
      console.log(
        "Connecting to %s as %s using identity file %s",
        sshConnection["hostname"],
        sshConnection["user"],
        sshConnection["identity_file"]
      );
    setConnected(true);
  };

  const disconnect = () => {
    // TODO: open ssh tunnel
    sshConnection &&
      console.log("Disconnecting from %s", sshConnection["hostname"]);
    setConnected(false);
  };

  useEffect(() => {
    ddClient.extension.vm?.service
      ?.get("/ssh-config")
      .then((response: any) => {
        setSshConfig(JSON.parse(response));
      })
      .catch((error) => {
        ddClient.desktopUI.toast.error("Failed parsing ~/.ssh/config");
      });
  }, []);

  const handleHostChange = (event: any) => {
    sshConfig && setSshConnection(sshConfig[event.target.value]);
  };

  return (
    <>
      <Typography variant="h3">
        Connect to remote running Docker daemon
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Identified ssh connections from ~/.ssh/config:
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="ssh-host-select-label">Select remote host</InputLabel>
          <Select
            labelId="ssh-host-select-label"
            id="ssh-host-select"
            label="Select remote host"
            onChange={handleHostChange}
            disabled={connected}
          >
            {sshConfig?.map((sshConnection: SshConnection, index) => {
              return (
                sshConnection.hostname &&
                sshConnection.user &&
                sshConnection.identity_file && (
                  <MenuItem value={index}>
                    {sshConnection.host + " (" + sshConnection.hostname + ")"}
                  </MenuItem>
                )
              );
            })}
          </Select>
        </FormControl>
        <Button
          color={connected ? "error" : "success"}
          onClick={connected ? () => disconnect() : () => connect()}
          disabled={!sshConnection}
          endIcon={connected ? <StopCircleIcon /> : <PlayCircleIcon />}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>
      </Stack>
      {connected && (
        <Containers client={ddClient} sshConnection={sshConnection} />
      )}
    </>
  );
}
