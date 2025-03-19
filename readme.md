# @careville/nestjs-mailer

A simple NestJS module for sending careville styled emails using various providers (e.g. SMTP, Microsoft Graph). Supports React-based email templates via [react-email](https://react.email).

## Installation

```bash
npm install @careville/nestjs-mailer
```

## Usage

In your NestJS application’s root module (e.g. AppModule), import the mail module with any configuration options you need:

```typescript
import { Module } from '@nestjs/common';
import { MailModule } from '@careville/nestjs-mailer';

@Module({
  imports: [
    MailModule.register({
      isGlobal: true,
      type: "MS_GRAPH",
      sender: process.env.MAIL_SENDER,
      from: process.env.MAIL_FROM,
      msGraph: {
        tenantId: process.env.MS_GRAPH_TENANT_ID,
        clientId: process.env.MS_GRAPH_CLIENT_ID,
        clientSecret: process.env.MS_GRAPH_CLIENT_SECRET,
      },
    }),
  ]
})
```

```typescript
@Injectable()
export class MyService {
  constructor(private readonly mailService: MailService) {}

  async sendEmail() {
    await this.mailService.sendMail("to@example.de", "Example Subject", "ReactElement")
  }
}
```

## Publishing & Build
This package is built with Rollup. To build locally:

```bash
npm install
npm run build
```

