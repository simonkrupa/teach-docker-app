function mapContainerData(containerData: any, value: string) {
  let ipData;
  let networkUsed;
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
  };
}

function mapNetworkData(networkData: any) {
  return {
    name: networkData.Name,
    subnet: networkData.IPAM.Config[0].Subnet,
    driver: networkData.Driver,
    gateway: networkData.IPAM.Config[0].Gateway,
  };
}

module.exports = { mapContainerData, mapNetworkData };
