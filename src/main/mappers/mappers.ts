function mapContainerData(containerData: any) {
  return {
    label: containerData.Name,
    status: containerData.State.Status,
    ip: containerData.NetworkSettings.IPAddress,
  };
}

module.exports = { mapContainerData };
