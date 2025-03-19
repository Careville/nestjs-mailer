import { Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "./mail.configuration";
import { MailService } from "./mail.service";

@Module({
  imports: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule extends ConfigurableModuleClass {}
