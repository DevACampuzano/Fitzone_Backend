import fs from "fs";
import { config } from "../../config";
import Handlebars from "handlebars";
import type { Attachment } from "nodemailer/lib/mailer";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  ...config.email,
});

export const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Conexión SMTP con Brevo verificada correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error conectando con Brevo:", error);
    return false;
  }
};

const createEmail = <R extends object>(file: string, replacements: R) => {
  try {
    const html = fs.readFileSync(`${__dirname}/${file}`, { encoding: "utf-8" });
    const template = Handlebars.compile(html);

    return template(replacements);
  } catch (error) {
    throw error;
  }
};

export const sendCustomEmail = async <R extends object>(
  subject: string,
  to: string[],
  file: string,
  replacements: R,
  attachments?: Attachment[]
) => {
  try {
    const html = createEmail(file, replacements);

    let info = await transporter.sendMail({
      from: config.email.auth.user,
      to,
      subject,
      html,
      attachments,
    });

    if (info.rejected.length > 0) {
      throw new Error(
        "Los siguientes destinatarios no recibieron la notificación: " +
          info.rejected.toString()
      );
    }

    return { message: "El correo electrónico ha sido enviado con éxito." };
  } catch (error) {
    throw error;
  }
};

export default sendCustomEmail;
