import { Body, Container, Headline, Link, Logo, Section } from "@/components";
import { Head, Html, Preview, Text } from "@react-email/components";
import * as React from "react";

export type SimpleEMailProps = {
  headline: string;
  previewText: string;
  children: React.ReactNode;
};

const SimpleEMail = (props: SimpleEMailProps) => {
  const { headline, previewText, children } = props;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body>
        <Container>
          <Section style={{ marginBottom: "1em" }}>
            <Logo />
          </Section>
          <Section>
            <Headline>{headline}</Headline>
            {children}
            <Text>
              Wenn Sie Fragen haben oder Hilfe benötigen, wenden Sie sich bitte an unser Support-Team unter&nbsp;
              <Link href={"mailto:support@careville.de"}>support@careville.de</Link>.
            </Text>
            <Text>
              Mit freundlichen Grüßen,
              <br />
              Careville GmbH
            </Text>
          </Section>
        </Container>
        <Section style={{ margin: "0 auto" }}>
          <Text style={{ textAlign: "center", color: "#98A2B3" }}>
            Careville GmbH
            <br />
            Marienplatz 28a, 84130 Dingolfing
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export { SimpleEMail };
