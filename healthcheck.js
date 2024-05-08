import nodemailer from 'nodemailer'
import axios from 'axios'

const serviceURL = process.env.HEALTH_CHECK_SERVICE_URL
const serviceName = process.env.HEALTH_CHECK_SERVICE_NAME
const shouldPostToWebHook = process.env.HEALTH_CHECK_WEB_HOOK
const shouldSendEmail =
  process.env.HEALTH_CHECK_SMTP_HOST &&
  process.env.HEALTH_CHECK_SMTP_USER &&
  process.env.HEALTH_CHECK_SMTP_PASS &&
  process.env.HEALTH_CHECK_EMAIL_FROM &&
  process.env.HEALTH_CHECK_EMAIL_RECIPIENT

axios
  .get(serviceURL)
  .then(async function (response) {
    try {
      const body = response.data
      if (body.healthy === true) {
        process.exit(0)
      }
      await notify(`${serviceName} is unhealthy: ${body.error}`)
      process.exit(1)
    } catch (error) {
      await notify(
        `${serviceName} is potentially unhealthy - error: ${JSON.stringify(error)}`
      )
      process.exit(1)
    }
  })
  .catch(async (error) => {
    await notify(
      `${serviceName} is unhealthy and will restart after 3 tries. Error: ${error.message}`
    )
    process.exit(1)
  })

async function notify(message) {
  console.log(message)
  if (shouldSendEmail) await sendMail(message)
  if (shouldPostToWebHook) await postToWebHook(message)
}

async function postToWebHook(text) {
  await axios
    .post(process.env.HEALTH_CHECK_WEB_HOOK, { text })
    .catch((error) => {
      console.error(error)
    })
}

async function sendMail(message) {
  const messageParams = {
    from: process.env.HEALTH_CHECK_EMAIL_FROM,
    to: process.env.HEALTH_CHECK_EMAIL_RECIPIENT,
    subject: process.env.HEALTH_CHECK_EMAIL_SUBJECT,
    text: message
  }

  const mailTransport = {
    host: process.env.HEALTH_CHECK_SMTP_HOST,
    auth: {
      user: process.env.HEALTH_CHECK_SMTP_USER,
      pass: process.env.HEALTH_CHECK_SMTP_PASS
    },
    ...(process.env.HEALTH_CHECK_SMTP_PORT && {
      port: process.env.HEALTH_CHECK_SMTP_PORT
    })
  }

  const transporter = nodemailer.createTransport(mailTransport)

  try {
    await transporter.sendMail(messageParams)
  } catch (error) {
    console.log('the email send error: ')
    console.log(error)
  }
}
