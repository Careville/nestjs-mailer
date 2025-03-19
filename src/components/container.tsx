import { Container as REContainer, ContainerProps as REContainerProps } from "@react-email/components";
import { createElement, forwardRef, Ref } from "react";

const defaultStyle = {
  maxWidth: "650px",
  border: "1px solid #EAECF0",
  background: "#FFFFFF",
  padding: "1.5em 2em",
  tableLayout: "fixed",
};

const invisibleStyle = {};

type ContainerProps = REContainerProps & {
  invisible?: boolean;
};

const Container = forwardRef((props: ContainerProps, ref: Ref<HTMLTableElement>) => {
  const { invisible } = props;

  return createElement(
    REContainer,
    {
      ...props,
      style: { ...(!invisible ? defaultStyle : invisibleStyle), ...props.style },
      ref: ref,
    },
    props.children,
  );
});

export { Container };
