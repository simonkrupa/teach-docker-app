const navigationMap: Map<string, string> = new Map([
  ['bridge', '/default-bridge'],
  ['default-bridge', '/host'],
  ['overlay', '/temp'], //TODO add ending
  ['host', '/none'],
  ['none', '/macvlan'],
  ['macvlan', '/ipvlan'],
  ['ipvlan', '/overlay'],
]);

export default navigationMap;
