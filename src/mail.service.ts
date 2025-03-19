import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { render } from "@react-email/components";
import * as nodemailer from "nodemailer";
import React from "react";
import { MODULE_OPTIONS_TOKEN, OptionType } from "./mail.configuration";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: OptionType) {}

  async sendMail(to: string, subject: string, content: React.ReactElement) {
    if (this.options.type === "SMTP") {
      await this.sendMailSMTP(to, subject, content);
    } else if (this.options.type === "MS_GRAPH") {
      await this.sendMailMSGraph(to, subject, content);
    } else {
      this.logger.error("No valid API type specified");
      throw new Error("No valid API type specified");
    }
  }

  private async sendMailSMTP(to: string, subject: string, content: React.ReactElement) {
    const transporter = nodemailer.createTransport({
      host: this.options.smtp.host,
      port: this.options.smtp.port,
      secure: true,
      auth: {
        user: this.options.smtp.auth.user,
        pass: this.options.smtp.auth.pass,
      },
    });

    const html = await render(content);

    const options = {
      from: `${this.options.sender} <${this.options.from}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(options).catch((err) => {
      this.logger.error(err);
      throw err;
    });
  }

  private async sendMailMSGraph(to: string, subject: string, content: React.ReactElement) {
    const credential = new ClientSecretCredential(
      this.options.msGraph.tenantId,
      this.options.msGraph.clientId,
      this.options.msGraph.clientSecret,
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    const client = Client.initWithMiddleware({ authProvider });

    const html = await render(content);

    const sendMail = async () => {
      const mail = {
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: html,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
        },
      };

      try {
        await client.api(`/users/${this.options.from}/sendMail`).post(mail);
      } catch (error) {
        this.logger.error("Error sending email:", error);
      }
    };

    sendMail();
  }
}
