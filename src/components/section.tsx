import { Section as RESection, SectionProps } from "@react-email/components";
import { createElement, forwardRef } from "react";

const defaultStyle = {
  maxWidth: "650px",
  tableLayout: "fixed" as const,
};

const Section = forwardRef((props: SectionProps, ref: any) => {
  return createElement(
    RESection,
    {
      ...props,
      style: { ...defaultStyle, ...props.style },
      ref: ref,
    },
    props.children,
  );
});

export { Section };
