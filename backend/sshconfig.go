package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// SSHHost represents a single host configuration from the SSH config file
type SSHHost struct {
	Host         string            `json:"host"`
	HostName     string            `json:"hostname,omitempty"`
	User         string            `json:"user,omitempty"`
	Port         string            `json:"port,omitempty"`
	IdentityFile string            `json:"identity_file,omitempty"`
	ProxyCommand string            `json:"proxy_command,omitempty"`
	ForwardAgent string            `json:"forward_agent,omitempty"`
	OtherFields  map[string]string `json:"other_fields,omitempty"`
}

// ParseSshConfig parses the SSH config file and returns a slice of SSHHost
func ParseSshConfig() (string, error) {
	// Default path for SSH config file
	configPath := os.Getenv("HOME") + "/.ssh/config"
	data, err := os.ReadFile(configPath)
	if err != nil {
		return "", fmt.Errorf("failed to read SSH config file: %v", err)
	}

	var hosts []SSHHost
	var currentHost *SSHHost

	lines := strings.Split(string(data), "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		fields := strings.Fields(line)
		if len(fields) < 2 {
			continue
		}

		key := strings.ToLower(fields[0])
		value := strings.Join(fields[1:], " ")

		switch key {
		case "host":
			// Save previous host if exists
			if currentHost != nil {
				hosts = append(hosts, *currentHost)
			}
			// Start new host
			currentHost = &SSHHost{
				Host:        value,
				OtherFields: make(map[string]string),
			}
		default:
			if currentHost == nil {
				continue
			}
			// Handle known fields
			switch key {
			case "hostname":
				currentHost.HostName = value
			case "user":
				currentHost.User = value
			case "port":
				currentHost.Port = value
			case "identityfile":
				currentHost.IdentityFile = value
			case "proxycommand":
				currentHost.ProxyCommand = value
			case "forwardagent":
				currentHost.ForwardAgent = value
			default:
				// Store unknown fields in OtherFields
				currentHost.OtherFields[key] = value
			}
		}
	}

	// Add the last host if exists
	if currentHost != nil {
		hosts = append(hosts, *currentHost)
	}

	// Convert to JSON
	jsonData, err := json.MarshalIndent(hosts, "", "  ")
	return string(jsonData), err
}
