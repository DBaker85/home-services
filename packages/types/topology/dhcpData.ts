export interface DhcpDataItem {
  ip: string;
  if?: "opt1" | "opt2" | "opt3";
  mac: string;
  type: "static" | "dynamic";
  online: string;
  state: string;
}

export interface DhcpData extends DhcpDataItem {
  cid?: string;
  starts: string;
  ends: string;
  hostname: string;
  descr?: string;
  staticmap_array_index?: number;
}

export interface MappedDhcpData {
  cid?: string;
  hostname: string;
  description?: string;
  data: DhcpDataItem[];
  previous: any[];
}
