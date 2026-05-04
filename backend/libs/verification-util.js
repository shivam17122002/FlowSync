import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail, isSendGridConfigured } from "../libs/send-email.js";

const isDevelopment = process.env.NODE_ENV !== "production";

export async function createVerificationToken(userId, purpose, expiresIn) {
  const token = jwt.sign({ userId, purpose }, process.env.JWT_SECRET, { expiresIn });
  const expiresAt = new Date(Date.now() + parseExpiryToMs(expiresIn));
  await Verification.create({ userId, token, expiresAt });
  return { token, expiresAt };
}

export async function deleteExistingVerification(userId) {
  const existing = await Verification.findOne({ userId });
  if (existing) await Verification.findByIdAndDelete(existing._id);
}

export async function getValidVerification(userId) {
  const existing = await Verification.findOne({ userId });
  if (existing && existing.expiresAt > new Date()) return existing;
  return null;
}

export function buildVerificationLink(token, type = "verify-email") {
  return `${process.env.FRONTEND_URL}/${type}?token=${token}`;
}

export async function sendVerificationEmail(email, link, subject, devMsg, devExtra) {
  const emailBody = `<p>Click <a href="${link}">here</a> to proceed</p>`;
  const isEmailSent = await sendEmail(email, subject, emailBody);
  if (!isEmailSent) {
    if (isDevelopment && !isSendGridConfigured) {
      return { dev: true, response: { message: devMsg, ...devExtra, devMode: true } };
    }
    return { error: true, response: { message: `Failed to send ${subject.toLowerCase()}` } };
  }
  return { dev: false };
}

function parseExpiryToMs(expiresIn) {
  // supports '1h', '15m', etc.
  const match = expiresIn.match(/(\d+)([hm])/);
  if (!match) return 3600000; // default 1h
  const value = parseInt(match[1], 10);
  return match[2] === 'h' ? value * 60 * 60 * 1000 : value * 60 * 1000;
}
