export const navigationMap: Map<string, string> = new Map([
  ['default-bridge', '/bridge'],
  ['bridge', '/host'],
  ['overlay', '/temp'],
  ['host', '/none'],
  ['none', '/macvlan'],
  ['macvlan', '/ipvlan'],
  ['ipvlan', '/overlay'],
]);

export const progressMap: Map<string, string> = new Map([
  ['1', '/default-bridge'],
  ['2', '/bridge'],
  ['3', '/host'],
  ['4', '/none'],
  ['5', '/macvlan'],
  ['6', '/ipvlan'],
  ['7', '/overlay'],
]);
