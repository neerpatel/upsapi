# Project Overview and Architecture
[apcupsd-scripts Documentation](./apcupsd-scripts.md) | [App Documentation](./app.md) | [Hubitat Documentation](./hubitat.md)

This document provides a high-level overview of the UPS monitoring system, explaining how the different components work together to bridge an APC UPS with a Hubitat home automation hub.

## System Architecture Diagram

The following diagram illustrates the main components of the system and their interactions.

```mermaid
graph TD
    subgraph "Physical Devices"
        A[APC UPS]
        B[Raspberry Pi]
        C[Hubitat Hub]
    end

    subgraph "Raspberry Pi"
        D[apcupsd Service]
        E[upsapi Node.js App]
    end

    subgraph "upsapi Node.js App"
        F[Express API Server]
        G[Cron Service]
    end

    subgraph "Hubitat Hub"
        H[Maker API]
        I[UPSMonitor Driver]
    end

    A -- USB/Network --> D;
    D -- Network Socket/CLI --> F;
    G -- HTTP Request (localhost) --> F;
    F -- HTTP POST --> H;
    H -- Device Events --> I;

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
```

## Data Flow

The data flows through the system in a continuous loop, initiated by a cron job.

```mermaid
sequenceDiagram
    participant Cron as Cron Service
    participant API as upsapi Server
    participant apcupsd as apcupsd Daemon
    participant Hubitat as Hubitat Hub

    loop Every 5 minutes
        Cron->>+API: GET /hubitat?event=cron
        API->>+apcupsd: Fetch UPS Status (socket/CLI)
        apcupsd-->>-API: Return UPS Data (JSON)
        API->>+Hubitat: POST /notify with UPS Data
        Hubitat-->>-API: Acknowledge
        API-->>-Cron: Complete
    end
```

### Step-by-Step Explanation

1.  **Cron Trigger**: The `cron.js` service, managed by PM2, runs on a schedule (e.g., every 5 minutes). It sends an HTTP GET request to its own `upsapi` server at the `/hubitat` endpoint.

2.  **Fetch UPS Data**: The `/hubitat` endpoint in the `upsapi` server receives the request. It then calls the internal `/ups/status` or `/ups/apcaccess` endpoint to get the latest data from the `apcupsd` daemon.

3.  **Communicate with `apcupsd`**: The `ups.js` API module communicates with the `apcupsd` daemon running on the Raspberry Pi. It can do this in two ways:
    -   **Network Socket (Primary)**: Connects to `apcupsd` on port 3551 for a fast and reliable data transfer.
    -   **`apcaccess` CLI (Fallback)**: Executes the `apcaccess` shell command and parses its text output.

4.  **Forward to Hubitat**: Once the `upsapi` server has the UPS data, it constructs a JSON payload and sends it to the Hubitat hub via an HTTP POST request to the Maker API endpoint.

5.  **Hubitat Processing**: The Hubitat Maker API receives the data and passes it to the `UPSMonitor` virtual device. The `UPSMonitor.groovy` driver code parses the JSON and updates the device's attributes (e.g., battery level, status, voltage).

6.  **Monitoring and Automation**: With the data now in Hubitat, you can view the UPS status on a dashboard, create rules to send notifications on power loss, or trigger other home automations.

[apcupsd-scripts Documentation](./apcupsd-scripts.md) | [App Documentation](./app.md) | [Hubitat Documentation](./hubitat.md)
