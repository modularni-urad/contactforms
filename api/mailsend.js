import nodemailer from 'nodemailer'
const transporterMock = { 
  sendMail: (data, cb) => {
    console.log(data)
    cb()
  }
}

const transporter = process.env.NODE_ENV === 'test'
  ? transporterMock
  : nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "******@gmail.com",
      pass: "gmail_password"
    }
  })

export function sendMail (message) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (err) => {
      return err ? reject(err) : resolve()
    })
  })
}