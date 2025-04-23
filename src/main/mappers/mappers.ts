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
  let macAddr;
  let netId = '';
  if (containerData.HostConfig.PortBindings) {
    portMapping = parsePortMapping(containerData.HostConfig.PortBindings);
  } else {
    portMapping = { key: '', hostPort: '' };
  }
  if (containerData.NetworkSettings.Networks[value]) {
    ipData = containerData.NetworkSettings.Networks[value].IPAddress;
    macAddr = containerData.NetworkSettings.Networks[value].MacAddress;
    networkUsed = value;
    netId = containerData.NetworkSettings.Networks[value].NetworkID.slice(
      0,
      10,
    );
  } else {
    console.log('No network found');
    if (
      containerData.NetworkSettings.Networks &&
      Object.keys(containerData.NetworkSettings.Networks).length > 0
    ) {
      ipData = containerData.NetworkSettings.IPAddress;
      macAddr = containerData.NetworkSettings.MacAddress;
      networkUsed = Object.keys(containerData.NetworkSettings.Networks).at(0);
    } else {
      ipData = containerData.NetworkSettings.IPAddress;
      macAddr = containerData.NetworkSettings.MacAddress;
      networkUsed = '';
    }
  }
  return {
    id: containerData.Id,
    label: containerData.Name,
    status: containerData.State.Status,
    ip: ipData,
    network: networkUsed,
    port: portMapping?.key,
    hostPort: portMapping?.hostPort,
    mac: macAddr,
    pid: containerData.State.Pid,
    eth: 'eth',
    netId,
  };
}

function mapVxlanId(networkData: any) {
  if (!networkData.Options) {
    return {
      vxlanId: null,
    };
  }
  if (!networkData.Options['com.docker.network.driver.overlay.vxlanid_list']) {
    return {
      vxlanId: null,
    };
  }
  const vxlanId =
    networkData.Options['com.docker.network.driver.overlay.vxlanid_list'];
  return {
    vxlanId,
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

function mapNetworkData(networkData: any, networkNameForOverlay: string) {
  if (networkData.Name === 'host') {
    return {
      name: networkData.Name,
      driver: 'host',
    };
  }
  if (networkData.Name === 'none') {
    return {
      name: networkData.Name,
      driver: 'none',
    };
  }
  if (networkData.Driver === 'overlay') {
    return {
      name: networkData.Name,
      driver: networkData.Driver,
      subnet: networkData.IPAM?.Config?.[0]?.Subnet || '',
      gateway: networkData.IPAM?.Config?.[0]?.Gateway || '',
      peers: networkData.Peers,
    };
  }
  if (networkData.Driver === '' && networkData.IPAM.Config === null) {
    return {
      name: networkData.Name,
    };
  }
  if (networkData.Name === 'docker_gwbridge') {
    networkData.Name = networkNameForOverlay;
  }
  let parentInterface = '';
  if (networkData.Options.parent) {
    parentInterface = networkData.Options.parent;
  }
  return {
    name: networkData.Name,
    subnet: networkData.IPAM.Config?.[0]?.Subnet || '',
    driver: networkData.Driver,
    gateway: networkData.IPAM.Config?.[0]?.Gateway || '',
    parentInterface,
  };
}

function mapDockerGWBridgeData(networkData: any, containerId: string) {
  if (networkData.Containers[containerId]) {
    return {
      ip: networkData.Containers[containerId].IPv4Address,
      mac: networkData.Containers[containerId].MacAddress,
    };
  }
  return {
    ip: undefined,
    mac: undefined,
  };
}

function mapVethData(vethName: string, containerName: string) {
  return {
    label: vethName,
    desiredContainer: containerName,
  };
}

function mapHostData(hostIp: string, hostEth: string) {
  return {
    ip: hostIp,
    eth: hostEth,
  };
}

module.exports = {
  mapContainerData,
  mapNetworkData,
  mapVMHostData,
  mapVethData,
  mapHostData,
  mapDockerGWBridgeData,
  mapVxlanId,
};
