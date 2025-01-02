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
      return false; // Node with this id doesn't exist in correct nodes
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
        // eslint-disable-next-line no-continue
        continue;
      }
      if (!_.isEqual(currentNode[key], correctNode[key])) {
        console.log('correct', correctNode[key]);
        console.log('current', currentNode[key]);
        return false; // Attribute doesn't match
      }
    }
  }

  return true; // All nodes match
};

export default nodesValidator;
