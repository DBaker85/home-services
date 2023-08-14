export interface TopologyMeta {
  model?: string;
  ips: string[];
  ipType?: "static" | "dynamic";
  description?: string;
  cid?: string;
  interface?: string;
}

export interface TopologyObject extends TopologyMeta {
  mac: string;
  id: string;
  name: string;
  parent?: string;
}
