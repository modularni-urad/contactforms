import nodemailer from 'nodemailer'

export default function (mocks) {
  if (mocks) return mocks.sendMail

  return async function sendMail (message, config) {
    const transporter = nodemailer.createTransport({
      service: config.mailservice || 'Gmail',
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWD
      }
    })
    console.log(`verifying STMP (${process.env.SMTP_CONN}) ...`)
    await transporter.verify()
    return transporter.sendMail(message)
  }

}