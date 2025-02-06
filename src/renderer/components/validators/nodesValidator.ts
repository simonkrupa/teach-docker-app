/* eslint-disable no-restricted-syntax */
import _ from 'lodash';

const nodesValidator = (currentNodes, correctNodes) => {
  if (currentNodes.length !== correctNodes.length) {
    return false;
  }

  for (let i = 0; i < currentNodes.length; i++) {
    //skip host
    if (currentNodes[i].id === '0') {
      continue;
    }
    const currentNode = currentNodes[i];
    const correctNode = correctNodes.find((node) => node.id === currentNode.id);

    if (!correctNode) {
      return false;
    }

    const excludeKeys = [
      'position',
      'draggable',
      'network',
      'hostPort',
      'mac',
      'port',
    ];

    for (const key in correctNode) {
      if (excludeKeys.includes(key)) {
        continue;
      }
      if (!_.isEqual(currentNode[key], correctNode[key])) {
        console.log('correct', correctNode[key]);
        console.log('current', currentNode[key]);
        return false;
      }
    }
  }

  return true; // All nodes match
};

export default nodesValidator;
