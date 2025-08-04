# `Hubitat` Documentation

This directory contains the Groovy code for the Hubitat Elevation device driver. This driver allows a Hubitat hub to understand and display the data from the APC UPS.

## `UPSMonitor.groovy`

This file is a **device driver** for the Hubitat Elevation platform. When installed on a Hubitat hub, it creates a virtual device that represents the physical UPS.

### Key Features

1.  **Capabilities**: The driver declares several capabilities that map to standard Hubitat device features. This allows the UPS data to be used in dashboards, rules, and other automations.
    -   `Battery`: Reports the UPS battery percentage.
    -   `VoltageMeasurement`: Reports the incoming line voltage.
    -   `PowerSource`: Indicates whether the power source is `mains` or `battery`.
    -   `PowerMeter`: Reports the current load on the UPS in watts.
    -   And many others, like `temperature`, `frequency`, etc.

2.  **Communication**: The driver listens for incoming HTTP POST requests from the `upsapi` application. It exposes an endpoint that the Node.js application calls.
    -   The `upsapi` app sends a JSON payload containing all the UPS metrics.
    -   The driver parses this JSON and updates the corresponding attributes of the virtual device.

3.  **Device Attributes**: It defines custom attributes to store all the information provided by `apcupsd`, such as:
    -   `status`: The current status of the UPS (e.g., `ONLINE`, `ONBATT`).
    -   `timeleft`: The estimated runtime remaining on battery.
    -   `bcharge`: The battery charge percentage.
    -   `linev`: The line voltage.

### Integration Diagram

```mermaid
graph LR
    A[upsapi App] -- HTTP POST --> B(Hubitat Hub);
    B -- /apps/api/... --> C[Maker API App];
    C -- Forwards data --> D[UPSMonitor Virtual Device];
    D -- Updates attributes using --> E(UPSMonitor.groovy Driver);
```
This setup allows you to monitor your UPS status directly within your Hubitat dashboard and create automations based on UPS events (e.g., send a notification when power is lost).

---
[Back to Overview](./overview.md) | [apcupsd-scripts Documentation](./apcupsd-scripts.md) | [App Documentation](./app.md)
