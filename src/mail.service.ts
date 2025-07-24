import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { FileAttachment, Message } from "@microsoft/microsoft-graph-types";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { render } from "@react-email/components";
import * as nodemailer from "nodemailer";
import React from "react";
import { MODULE_OPTIONS_TOKEN, OptionType } from "./mail.configuration";

export interface MailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

interface GraphSendMailRequest {
  message: Message;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly options: OptionType) {}

  async sendMail(to: string, subject: string, content: React.ReactElement, attachments?: MailAttachment[]) {
    if (this.options.type === "SMTP") {
      await this.sendMailSMTP(to, subject, content, attachments);
    } else if (this.options.type === "MS_GRAPH") {
      await this.sendMailMSGraph(to, subject, content, attachments);
    } else {
      this.logger.error("No valid API type specified");
      throw new Error("No valid API type specified");
    }
  }

  private async sendMailSMTP(to: string, subject: string, content: React.ReactElement, attachments?: MailAttachment[]) {
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

    const options: nodemailer.SendMailOptions = {
      from: `${this.options.sender} <${this.options.from}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    };

    await transporter.sendMail(options).catch((err) => {
      this.logger.error(err);
      throw err;
    });
  }

  private async sendMailMSGraph(to: string, subject: string, content: React.ReactElement, attachments?: MailAttachment[]) {
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

    // https://learn.microsoft.com/en-us/graph/api/message-post-attachments?view=graph-rest-1.0&tabs=http
    let graphAttachments: FileAttachment[] = [];

    if (attachments) {
      graphAttachments = await Promise.all(
        attachments.map(async (att) => {
          let contentBytes: string;
          if (att.content) {
            const buf = typeof att.content === "string" ? Buffer.from(att.content) : att.content;
            contentBytes = buf.toString("base64");
          } else {
            throw new Error(`Attachment ${att.filename} has neither content nor path`);
          }

          return {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: att.filename,
            contentType: att.contentType,
            contentBytes,
          };
        }),
      );
    }

    const sendMail = async () => {
      const mail: GraphSendMailRequest = {
        message: {
          subject: subject,
          body: {
            contentType: "html",
            content: html,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
          attachments: graphAttachments,
        },
      };

      try {
        await client.api(`/users/${this.options.from}/sendMail`).post(mail);
      } catch (error) {
        this.logger.error("Error sending email:", error);
      }
    };

    await sendMail();
  }
}
