function mapContainerData(containerData: any) {
  // console.log('Mapping container data:', containerData);
  // console.log('Container data:', containerData.NetworkSettings.IPAddress);
  return {
    label: containerData.Name,
    status: containerData.State.Status,
    ip: containerData.NetworkSettings.IPAddress,
  };
}

module.exports = { mapContainerData };
