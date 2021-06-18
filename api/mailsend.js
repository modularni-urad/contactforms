import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWD
  }
})

export default async function (mocks) {
  if (mocks) return mocks.sendMail

  console.log(`verifying STMP (${process.env.SMTP_CONN}) ...`)
  await transporter.verify()
  return function sendMail (message) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (err) => {
        return err ? reject(err) : resolve()
      })
    })
  }

}