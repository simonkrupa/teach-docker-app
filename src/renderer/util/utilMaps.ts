export const navigationMap: Map<string, string> = new Map([
  ['bridge', '/default-bridge'],
  ['default-bridge', '/host'],
  ['overlay', '/temp'],
  ['host', '/none'],
  ['none', '/macvlan'],
  ['macvlan', '/ipvlan'],
  ['ipvlan', '/overlay'],
]);

export const progressMap: Map<string, string> = new Map([
  ['1', '/bridge'],
  ['2', '/default-bridge'],
  ['3', '/host'],
  ['4', '/none'],
  ['5', '/macvlan'],
  ['6', '/ipvlan'],
  ['7', '/overlay'],
]);
