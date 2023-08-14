import { CustomNodeElementProps } from "types/react-d3-tree";
import { CustomTreeNodeDatum } from "../../utils/types";

import "./custom-node.scss";

export interface TopologyNodeElementProps extends CustomNodeElementProps {
  nodeDatum: CustomTreeNodeDatum;
}

export const renderCustomNode = (
  { nodeDatum }: TopologyNodeElementProps,
  handleClick: (node: CustomTreeNodeDatum) => void
) => {
  const image = `/icons/devices/${nodeDatum.meta.model}.png`;

  return (
    <svg
      width="320"
      height="260"
      viewBox="0 0 320 260"
      x="-160"
      y="-110"
      onClick={() => handleClick(nodeDatum)}
    >
      <rect
        width="100%"
        height="100%"
        rx="10"
        ry="10"
        className="hover"
        stroke="none"
      />
      <image x="20" y="20" width="280" height="180" xlinkHref={image} />
      <text
        x="50%"
        y="90%"
        dominantBaseline="middle"
        textAnchor="middle"
        style={{ fontSize: "30px" }}
      >
        {nodeDatum.name}
      </text>
    </svg>
  );
};
