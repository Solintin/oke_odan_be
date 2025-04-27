import { createTransport } from "nodemailer";
import logger from "@src/utils/logger";
import { ApplicationError, BadRequestError } from "@src/errors";
import { googleConfig } from "@src/configs";
import { MailOptions, MailTemplates } from "@src/interfaces/mail.interface";
import path from "path";
import fs from "fs";
import Mail from "nodemailer/lib/mailer";
import Handlebars from "handlebars";

class MailUtil {
  private async createTransporter() {
    try {
      return createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: googleConfig.GOOGLE_EMAIL_USER,
          pass: googleConfig.GOOGLE_APP_PASSWORD,
        },
      });
    } catch (error) {
      logger.log("error", `Error creating email transporter: ${error}`);
      throw new ApplicationError(
        500,
        `Error creating email transporter: ${error}`
      );
    }
  }
  private async readTemplates(templateName: MailTemplates): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      "src",
      "resources",
      "templates",
      "emails",
      `${templateName}.html`
    );
    try {
      const file = fs.readFileSync(filePath, "utf-8");
      return file.toString();
    } catch (error) {
      logger.log(
        "error",
        `Error creating reading/creating email template: ${error}`
      );
      throw new ApplicationError(
        500,
        `Error creating reading/creating email template: ${error}`
      );
    }
  }
  private emailSubjectMapping = {
    [MailTemplates.volunteer_interest]: {
      subject: "FoodClique Volunteering Interest",
    },
  };

  public async sendMail(options: MailOptions) {
    const { to, from, subject, replacements, templateName } = options;
    const mailData: Mail.Options = {
      from: `${from ? from : googleConfig.GOOGLE_EMAIL_USER} <${
        googleConfig.GOOGLE_EMAIL_USER
      }>`,
      to,
      subject,
    };
    try {
      if (templateName) {
        const template = await this.readTemplates(templateName);
        const { subject } = this.emailSubjectMapping[templateName];

        const emailTemplates = Handlebars.compile(template);
        const html = emailTemplates({
          ...replacements,
        });
        mailData.html = html;
        mailData.subject = subject;
      } else {
        throw new BadRequestError("Email Template Not Found");
      }
      const transporter = await this.createTransporter();
      const info = await transporter.sendMail(mailData);

      logger.info(
        "info",
        `Email ${mailData.subject} with Id: (${info.messageId}) sent to ${to}:`
      );
    } catch (error) {
      logger.debug(`Error in sending mail: ${error}`);
      throw new ApplicationError(
        500,
        "Email could not be sent at this moment.",
        [error]
      );
    }
  }
}

export default new MailUtil();
