function mapContainerData(containerData: any, value: string) {
  let ipData;
  if (containerData.NetworkSettings.Networks[value]) {
    ipData = containerData.NetworkSettings.Networks[value].IPAddress;
  } else {
    ipData = containerData.NetworkSettings.IPAddress;
  }
  return {
    label: containerData.Name,
    status: containerData.State.Status,
    ip: ipData,
  };
}

module.exports = { mapContainerData };
