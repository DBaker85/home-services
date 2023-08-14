import Tree from "react-d3-tree";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@mui/material/Drawer";
import { Orientation } from "types/react-d3-tree";

import { RootState } from "./store";
import { selectDevice, startConnecting, closeDrawer } from "./slices";
import { useCenteredTree } from "./hooks";
import {
  CustomTreeLinkDatum,
  CustomTreeNodeDatum,
  getDynamicPathClass,
} from "./utils";
import {
  TopologyNodeElementProps,
  renderCustomNode,
} from "./components/custom-node/custom-node";
import { Loader } from "./components/loader/loader";
import { DeviceDetails } from "./components/device-details/device-details";

import "./App.scss";

export default function OrgChartTree() {
  const { dimensions, translate, depthFactor, containerRef } =
    useCenteredTree();
  const isFirstRender = useRef(true);
  const dispatch = useDispatch();
  const { isConnected } = useSelector((state: RootState) => state.socket);
  const { hasData: hasTopologyData, topology } = useSelector(
    (state: RootState) => state.topology
  );
  const { hasData: hasEdgesData, edges } = useSelector(
    (state: RootState) => state.edges
  );

  const drawerOpen = useSelector((state: RootState) => state.ui.drawerOpen);

  const handleClick = (node: CustomTreeNodeDatum) => {
    dispatch(selectDevice(node));
  };

  useEffect(() => {
    if (isFirstRender.current) {
      dispatch(startConnecting());
      isFirstRender.current = false;
    }
  });

  if (!isConnected || !hasTopologyData || !hasEdgesData) {
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <main style={{ width: "100%", height: "100%" }}>
        <div id="treeWrapper" ref={containerRef}>
          <Tree
            data={topology}
            dimensions={dimensions}
            translate={translate}
            separation={{
              siblings: 2,
              nonSiblings: 4,
            }}
            nodeSize={{ x: 200, y: 200 }}
            depthFactor={depthFactor}
            renderCustomNodeElement={(nodeDatum: TopologyNodeElementProps) =>
              renderCustomNode(nodeDatum, handleClick)
            }
            pathClassFunc={(
              link: CustomTreeLinkDatum,
              orientation: Orientation
            ) => getDynamicPathClass({ link, orientation, edges })}
            zoom={0.1}
            enableLegacyTransitions
          />
        </div>
      </main>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => dispatch(closeDrawer())}
      >
        <DeviceDetails />
      </Drawer>
    </div>
  );
}
