import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailOptions } from "../interfaces/options";
dotenv.config();

export default class EmailRepository {
  async send(mailOptions: EmailOptions): Promise<void> {
    const from = process.env.EMAIL_USER;
    if (!from) return;
    const domain = from.split("@")[1];
    const service = domain.split(".")[0].toLowerCase();
    const options = {
      service,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    const { email, username, eventTitle, eventId } = mailOptions;

    const to = email;
    const subject = `¡${username} te ha invitado a un evento!`;
    const html = `${username} te invitó a ${eventTitle} del Club del Plan: <a href="https://elclubdelplan.netlify.app/redireccionar?id=${eventId}">Haz click aquí</a> para entrar`;

    const transporter = nodemailer.createTransport(options);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  }
}
