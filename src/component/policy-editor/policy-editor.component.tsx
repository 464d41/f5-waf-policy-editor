import * as React from "react";
import Box from "@mui/material/Box";
import { usePolicyEditorState } from "../../store/policy-editor/policy-editor.hooks";
import { PolicyEditorPageFactory } from "./controls/policy-editor.page.factory";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import SplitPane, { Pane } from "react-split-pane";
import { useStyles } from "../../utils/styles.hook";
import { useEffect, useState } from "react";
import { CurrentPolicyPaneComponent } from "../shared/current-policy-pane.component";

const CurrentPageContainer = withStyles((theme) =>
  createStyles({
    root: {
      position: "relative",
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
    },
  })
)(Box);

const ParseErrorOverlay = withStyles((theme) =>
  createStyles({
    root: {
      position: "absolute",
      backgroundColor: theme.palette.error.main,
      opacity: 0.5,
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      borderRadius: theme.shape.borderRadius,
      zIndex: 2,
    },
  })
)(Box);

export const PolicyEditorComponent: React.VoidFunctionComponent = () => {
  const { currentPage, jsonParseError } = usePolicyEditorState();

  const styles = useStyles();
  const pageFactory = new PolicyEditorPageFactory();

  const [pageHeight, setPageHeight] = useState<number>(500);
  const [maxSize, setMaxSize] = useState<number>(window.innerHeight - 200);

  useEffect(() => {
    function handleResize() {
      setMaxSize(window.innerHeight - 200);
      setPageHeight(Math.min(window.innerHeight - 200, pageHeight));
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <React.Fragment>
      <div className={styles.editorContainer}>
        <SplitPane
          defaultSize={500}
          maxSize={maxSize}
          split="horizontal"
          onChange={(newSize) => {
            setPageHeight(newSize);
          }}
        >
          <Pane style={{ overflow: "scroll" }}>
            <CurrentPageContainer
              style={{
                height: "100%",
              }}
            >
              {pageFactory.createPage(currentPage)}
              {jsonParseError && <ParseErrorOverlay />}
            </CurrentPageContainer>
          </Pane>
          <Pane
            style={{
              height: `calc(100vh - 122px - ${pageHeight}px)`,
              overflow: "scroll",
            }}
          >
            <CurrentPolicyPaneComponent title="JSON" fullPolicy={false} />
          </Pane>
        </SplitPane>
      </div>
    </React.Fragment>
  );
};
