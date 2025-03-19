import { BodyProps, Body as REBody } from "@react-email/components";
import { createElement } from "react";

const defaultStyle = {
  fontSize: "16px",
  fontWeight: "400",
  fontFamily:
    "'Roboto', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  color: "#000000",
  backgroundImage: "linear-gradient(#F5F5F5,#F5F5F5)",
  bgColor: "#F5F5F5 !important",
};

const Body = (props: BodyProps) => {
  return createElement(
    REBody,
    {
      ...props,
      style: { ...defaultStyle, ...props.style },
    },
    props.children,
  );
};

export { Body };
