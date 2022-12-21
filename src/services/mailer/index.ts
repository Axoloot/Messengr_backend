import ejs from 'ejs';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fundybeta@gmail.com',
    pass: 'fecgzlgdinvsjcvf',
  },
});

const defaultMailOptions = {
  from: 'fundybeta@gmail.com',
  to: 'fundybeta@gmail.com',
  subject: 'Default subject',
  html: 'Default text',
};

const sendMail = async (to: string, subject: string, html: any, attachments: any = undefined) => {
  const mailOptions = {
    ...defaultMailOptions,
    to,
    subject,
    html,
    attachments,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const fillMjmlTemplate = async (template: any, data: any) => new Promise((resolve, reject) => {
  ejs.renderFile(`src/assets/templates/${template}.mjml`, { ...data }, {}, async (err, str) => {
    if (err) {
      console.error('Error rendering file', err);
      reject(err);
    }
    const { html } = mjml2html(str);
    resolve(html);
  });
});

const sendConfirmEmail = async (to: string, name: string, token: string) => {
  const content = await fillMjmlTemplate('confirm_email', { name, token });
  return sendMail(to, 'Confirmez votre adresse mail', content);
};

const sendForgotPasswordEmail = async (to: string, name: string, resetLink: string) => {
  const content = await fillMjmlTemplate('forgot_password', { name, resetLink });
  return sendMail(to, 'Réinitialisation du mot de passe', content);
};

export {
  sendConfirmEmail,
  sendForgotPasswordEmail,
}
