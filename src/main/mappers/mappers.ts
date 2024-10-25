function parsePortMapping(portBindings) {
  // Check if PortBindings is not empty
  if (Object.keys(portBindings).length > 0) {
    //TODO what if multiple port mappings
    for (const key in portBindings) {
      if (portBindings.hasOwnProperty(key)) {
        const binding = portBindings[key][0]; // Get the first entry in the array
        const hostPort = binding.HostPort; // Get the HostPort value
        return { key, hostPort };
      }
    }
  }
}

function mapContainerData(containerData: any, value: string) {
  let ipData;
  let networkUsed;
  let portMapping;
  if (containerData.HostConfig.PortBindings) {
    portMapping = parsePortMapping(containerData.HostConfig.PortBindings);
  } else {
    portMapping = { key: '', hostPort: '' };
  }
  if (containerData.NetworkSettings.Networks[value]) {
    ipData = containerData.NetworkSettings.Networks[value].IPAddress;
    networkUsed = value;
  } else {
    console.log('No network found');
    if (
      containerData.NetworkSettings.Networks &&
      Object.keys(containerData.NetworkSettings.Networks).length > 0
    ) {
      ipData = containerData.NetworkSettings.IPAddress;
      networkUsed = Object.keys(containerData.NetworkSettings.Networks).at(0);
    } else {
      ipData = containerData.NetworkSettings.IPAddress;
      //TODO
      networkUsed = '';
    }
  }
  return {
    label: containerData.Name,
    status: containerData.State.Status,
    ip: ipData,
    network: networkUsed,
    port: portMapping?.key,
    hostPort: portMapping?.hostPort,
  };
}

function mapVMHostData(nodeInfo: any) {
  return {
    role: nodeInfo.Spec.Role,
    status: nodeInfo.Status.State,
    availability: nodeInfo.Spec.Availability,
    ip: nodeInfo.Status.Addr,
    id: nodeInfo.ID,
    hostname: nodeInfo.Description.Hostname,
  };
}

function mapNetworkData(networkData: any) {
  if (networkData.Name === 'host') {
    return {
      name: networkData.Name,
      driver: 'host',
    };
  } else if (networkData.Name === 'none') {
    return {
      name: networkData.Name,
      driver: 'none',
    };
  } else if (networkData.Driver === 'overlay') {
    return {
      name: networkData.Name,
      driver: networkData.Driver,
      subnet: networkData.IPAM.Config[0].Subnet,
      gateway: networkData.IPAM.Config[0].Gateway,
      peers: networkData.Peers,
    };
  } else {
    return {
      name: networkData.Name,
      subnet: networkData.IPAM.Config[0].Subnet,
      driver: networkData.Driver,
      gateway: networkData.IPAM.Config[0].Gateway,
    };
  }
}

module.exports = { mapContainerData, mapNetworkData, mapVMHostData };
