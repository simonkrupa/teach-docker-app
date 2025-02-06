function parseIpLinkOutput(output) {
  const interfaces = [];
  const lines = output.trim().split('\n');

  let currentInterface = null;

  lines.forEach((line) => {
    // Match interface lines (e.g., "1: lo:" or "23: eth0@if24:")
    const interfaceMatch = line.match(
      /^(\d+): (\S+): <([^>]+)> mtu (\d+) .* state (\S+)/,
    );
    if (interfaceMatch) {
      // If it's a new interface, start a new object
      const [, id, name, flags, mtu, state] = interfaceMatch;
      currentInterface = {
        id: parseInt(id, 10),
        name,
        flags: flags.split(','),
        mtu: parseInt(mtu, 10),
        state,
        details: {},
      };
      interfaces.push(currentInterface);
    } else if (currentInterface) {
      // Match additional details (e.g., MAC address or link type)
      const macMatch = line.match(/link\/(\S+) ([\da-f:]+) brd ([\da-f:]+)/);
      if (macMatch) {
        const [, type, mac, broadcast] = macMatch;
        currentInterface.details = { type, mac, broadcast };
      }
    }
  });

  return interfaces;
}

function getVethIdFromName(name: string): number | null {
  const match = name.match(/(\D+)(\d+)$/);
  if (match) {
    const numericId = match[2]; // The second group contains the numeric ID
    return parseInt(numericId, 10);
  }
  console.error('Could not extract numeric ID');
  return null;
}

export { parseIpLinkOutput, getVethIdFromName };
