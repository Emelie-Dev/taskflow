import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const email = fs.readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../Public/Templates/Email.html'
  ),
  'utf-8'
);
const verifyEmail = fs.readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../Public/Templates/verifyEmail.html'
  ),
  'utf-8'
);

const welcomeEmail = fs.readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../Public/Templates/welcome.html'
  ),
  'utf-8'
);

const resetEmail = fs.readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../Public/Templates/resetPassword.html'
  ),
  'utf-8'
);

class Email {
  constructor(user, url) {
    this.url = url;
    this.to = user.email;
    this.username = user.username;
    this.from =
      process.env.NODE_ENV.trim() === 'production'
        ? process.env.SENDGRID_FROM
        : process.env.MAILTRAP_FROM;
  }

  // Creates Transporter
  createNewTransport() {
    if (process.env.NODE_ENV.trim() === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  // Sends the mail
  async send(template, subject) {
    // Render HTML

    const html = email
      .replace('{{SUBJECT}}', subject)
      .replace('{{CONTENT}}', template);

    // Define email options

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // create transport and send email

    await this.createNewTransport().sendMail(mailOptions);
  }

  // Sends verification email
  async sendEmailVerification() {
    const template = verifyEmail
      .replace('{{USERNAME}}', this.username)
      .replace('{{URL}}', this.url);

    await this.send(template, 'Verify Your Email');
  }

  async sendWelcome() {
    const template = welcomeEmail
      .replace('{{USERNAME}}', this.username)
      .replace('{{URL}}', this.url);
    await this.send(template, 'Welcome to the TaskFlow Family');
  }

  async sendPasswordReset() {
    const template = resetEmail
      .replace('{{USERNAME}}', this.username)
      .replace('{{URL}}', this.url);

    await this.send(template, 'Reset your Password');
  }
}

export default Email;
