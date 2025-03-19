import { ConfigurableModuleBuilder } from "@nestjs/common";

type BaseMailServerConfig = {
  type: "SMTP" | "MS_GRAPH";
  from: string;
  sender: string;
};

type SMTPConfig = BaseMailServerConfig & {
  type: "SMTP";
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  msGraph?: never;
};

type MSGraphConfig = BaseMailServerConfig & {
  type: "MS_GRAPH";
  smtp?: never;
  msGraph: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
  };
};

export type MailServerConfigs = SMTPConfig | MSGraphConfig;

export type ExtrasConfiguration = {
  isGlobal?: boolean;
};

export type OptionType = MailServerConfigs & Partial<ExtrasConfiguration>;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<MailServerConfigs>()
    .setExtras<ExtrasConfiguration>({ isGlobal: false }, (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }))
    .build();
