import { ButtonProps, Button as REButton } from "@react-email/components";
import { createElement, forwardRef, Ref } from "react";

const defaultStyle = {
  backgroundColor: "#2D9C65",
  borderRadius: "4px",
  color: "#FFFFFF",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  fontWeight: 600,
  padding: "10px 20px",
};

const Button = forwardRef((props: ButtonProps, ref: Ref<HTMLAnchorElement>) => {
  return createElement(
    REButton,
    {
      ...props,
      style: { ...defaultStyle, ...props.style },
      ref: ref,
    },
    props.children,
  );
});

export { Button };
