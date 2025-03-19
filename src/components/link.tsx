import { LinkProps, Link as RELink } from "@react-email/components";
import { createElement, forwardRef } from "react";

const defaultStyle = {
  color: "#2D9C65",
  textDecoration: "underline",
};

const Link = forwardRef((props: LinkProps, ref: any) => {
  return createElement(
    RELink,
    {
      ...props,
      style: { ...defaultStyle, ...props.style },
      ref: ref,
    },
    props.children,
  );
});

export { Link };
