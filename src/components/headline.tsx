import { Text, TextProps } from "@react-email/components";
import { createElement } from "react";

const defaultStyle = {
  fontSize: "1.5em",
  fontWeight: 600,
};

const Headline = (props: TextProps) => {
  return createElement(
    Text,
    {
      style: { ...defaultStyle, ...props.style },
    },
    props.children,
  );
};

export { Headline };
