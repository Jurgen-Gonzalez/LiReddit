import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  // let testAccount = await nodemailer.createTestAccount();
  // console.log('testAccount', testAccount);
  console.log('I am here in sendEmail');
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "eklkdhvhodcdzjbw@ethereal.email",
      pass: "zzfjbQhV5qycWutWEC",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo " <foo@example.com>',
    to: to,
    subject: "Change Password",
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
