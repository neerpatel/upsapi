# `apcupsd-scripts` Documentation
[Project Overview](./overview.md) | [App Documentation](./app.md) | [Hubitat Documentation](./hubitat.md)

This directory contains scripts and configuration templates related to the `apcupsd` (APC UPS Daemon) service, which is responsible for communicating with the physical UPS device.

## Files

### `apcupsd.conf.tpl`

This is a template file for the main `apcupsd` configuration (`/etc/apcupsd/apcupsd.conf`). It allows for dynamic configuration based on environment variables.



### `apccontrol`

This is a standard shell script used by the `apcupsd` daemon to handle events from the UPS. It can be customized to perform specific actions on events like:


In this project, the primary notification mechanism is through the Node.js app to Hubitat, but this script provides a lower-level way to handle UPS events directly on the Raspberry Pi if needed.

## Deployment Process

The `post-deploy.sh` script handles the configuration of `apcupsd`:

1.  It stops the `apcupsd` service.
2.  It processes the `apcupsd.conf.tpl` file, creating a final `apcupsd.conf`.
3.  It copies the contents of this directory to `/etc/apcupsd/`.
4.  It restarts the `apcupsd` service to apply the new configuration.

This ensures that the `apcupsd` daemon is correctly configured to communicate with the UPS every time the application is deployed.
