import _ from 'lodash';

const excludeKeys = [
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

const excludeObjects = ['vethNode', 'hostNode'];

const nodesValidator = (currentNodes, correctNodes) => {
  const flattenedArray = currentNodes.flatMap((obj) => {
    return [{ ...obj, ...obj.data }];
  });

  // Remove the 'data' property after merging
  const currentNodesFlatten = flattenedArray
    .filter((obj) => !excludeObjects.includes(obj.type))
    .map((obj) => {
      const { data, ...filteredObj } = obj;
      return Object.fromEntries(
        Object.entries(filteredObj).filter(
          ([key]) => !excludeKeys.includes(key),
        ),
      );
    });

  console.log('currentNodesFlatten', currentNodesFlatten);
  console.log('correctNodes', correctNodes);
  return _.isEqual(currentNodesFlatten, correctNodes);
};

export default nodesValidator;
