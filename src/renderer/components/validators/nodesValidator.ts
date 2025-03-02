import _ from 'lodash';

const excludeKeys = [
  'eth2',
  'desiredNetwork2',
  'ip2',
  'mac2',
  'nodeId',
  'nodeLabel',
  'peers',
  'network2',
  'position',
  'draggable',
  'hostPort',
  'mac',
  'port',
  'eth',
  'hEth',
  'desiredNetwork',
  'height',
  'width',
];

const excludeKeysAndIp = [
  'eth2',
  'desiredNetwork2',
  'ip2',
  'mac2',
  'nodeId',
  'nodeLabel',
  'peers',
  'network2',
  'position',
  'draggable',
  'hostPort',
  'mac',
  'port',
  'eth',
  'hEth',
  'desiredNetwork',
  'height',
  'width',
  'ip',
  'subnet',
  'gateway',
];

const excludeObjects = [
  'vethNode',
  'hostNode',
  'lanNode',
  'overlayNetworkNode',
];

const nodesValidator = (currentNodes, correctNodes) => {
  const flattenedArray = currentNodes.flatMap((obj) => {
    return [{ ...obj, ...obj.data }];
  });

  let excludeKeysArray = excludeKeys;
  flattenedArray.forEach((obj) => {
    if (
      obj.type === 'networkNode' &&
      ['macvlan', 'ipvlan', 'overlay'].includes(obj.data.driver)
    ) {
      excludeKeysArray = excludeKeysAndIp;
    }
  });

  const currentNodesFlatten = flattenedArray
    .filter((obj) => !excludeObjects.includes(obj.type))
    .map((obj) => {
      const { data, ...filteredObj } = obj;
      return Object.fromEntries(
        Object.entries(filteredObj).filter(
          ([key]) => !excludeKeysArray.includes(key),
        ),
      );
    });

  console.log('currentNodesFlatten', currentNodesFlatten);
  console.log('correctNodes', correctNodes);
  return _.isEqual(currentNodesFlatten, correctNodes);
};

export default nodesValidator;
