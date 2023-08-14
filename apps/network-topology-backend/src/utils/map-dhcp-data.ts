import { type DhcpData, type MappedDhcpData } from "types/topology";

export const mapDhcpdata = (dhcpData: DhcpData[]): MappedDhcpData[] => {
  const preparedDhcpData = dhcpData.map((dhcp) => {
    const otherData = dhcpData
      .filter((d) => d.mac !== dhcp.mac)
      .filter((d) => d.cid !== undefined && d.cid === dhcp.cid)
      .map((d) => ({
        ip: d.ip,
        if: d.if,
        mac: d.mac,
        type: d.type,
        online: d.online,
        state: d.state,
      }));

    return {
      cid: dhcp.cid,
      hostname: dhcp.hostname,
      description: dhcp.descr,
      data: [
        {
          ip: dhcp.ip,
          if: dhcp.if,
          mac: dhcp.mac,
          type: dhcp.type,
          online: dhcp.online,
          state: dhcp.state,
        },

        ...otherData,
      ],
      previous: [],
    };
  });

  // remove duplicates based on mac or ip in the data array
  const uniqueDhcpData = preparedDhcpData.filter(
    (dhcp, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.data[0].mac === dhcp.data[0].mac || t.data[0].ip === dhcp.data[0].ip
      )
  );

  return uniqueDhcpData;
};
