export interface Topology {
  edges: Edge[];
  vertices: Vertex[];
}

export interface Edge {
  channel?: number;
  downlinkMac: string;
  essid: string;
  experienceScore?: number;
  protocol?: string;
  radioBand?: string;
  type?: string;
  uplinkMac: string;
}

export interface Vertex {
  allowedInVisualProgramming: boolean;
  mac: string;
  name: string;
  type: string;
  unifiDevice?: boolean;
  model?: string;
  state?: number;
  wifiRadios?: WifiRadio[];
}

export interface WifiRadio {
  channel: number;
  protocol: string;
  radioBand: string;
}
