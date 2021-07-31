import nodemailer from 'nodemailer'

export default function (mocks) {
  if (mocks) return mocks.sendMail

  return async function sendMail (message) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWD
      }
    })
    console.log(`verifying STMP (${process.env.SMTP_CONN}) ...`)
    await transporter.verify()
    return transporter.sendMail(message)
  }

}