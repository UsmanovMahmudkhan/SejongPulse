"""
services/email.py — SendGrid email service
All email sending goes through this module. No Zapier.
"""
import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL", "noreply@sejongpulse.ac.kr")


def send_welcome_email(to_email: str, pseudonym: str) -> bool:
    """
    Send a welcome email after successful signup.
    Returns True on success, False on failure.
    """
    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject="Welcome to Sejong Pulse 🎓",
            html_content=f"""
            <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #960018; font-size: 32px; margin: 0;">Sejong Pulse</h1>
                <p style="color: #64748b; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px;">University Social Platform</p>
              </div>
              <div style="background: #f8f9fa; border-radius: 24px; padding: 32px;">
                <h2 style="color: #1a1c1d; font-size: 22px; margin-top: 0;">Welcome, {pseudonym}! 👋</h2>
                <p style="color: #475569; line-height: 1.7;">
                  Your Sejong Pulse account is ready. You're now part of the exclusive Sejong University campus network — 
                  restricted to verified students only.
                </p>
                <ul style="color: #475569; line-height: 2;">
                  <li>📡 Browse and post in the <strong>Global Pulse Feed</strong></li>
                  <li>🔍 Discover fellow students in the <strong>Discovery Stack</strong></li>
                  <li>💬 Chat in real-time via <strong>Flash Chats</strong></li>
                  <li>🤖 Ask your AI <strong>Academic Advisor</strong> anything</li>
                </ul>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
                This email was sent because you signed up for Sejong Pulse with your Sejong University email.
              </p>
            </div>
            """,
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        logger.info(f"Welcome email sent to {to_email} — status {response.status_code}")
        return response.status_code in (200, 201, 202)
    except Exception as e:
        logger.error(f"Failed to send welcome email to {to_email}: {e}")
        return False


def send_password_reset_email(to_email: str, reset_link: str) -> bool:
    """Send a password reset email."""
    try:
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject="Reset your Sejong Pulse password",
            html_content=f"""
            <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #960018;">Sejong Pulse</h1>
              <p>You requested a password reset. Click the link below (expires in 1 hour):</p>
              <a href="{reset_link}" style="display: inline-block; background: #960018; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                Reset Password
              </a>
              <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
            """,
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        logger.info(f"Password reset email sent to {to_email} — status {response.status_code}")
        return response.status_code in (200, 201, 202)
    except Exception as e:
        logger.error(f"Failed to send password reset email to {to_email}: {e}")
        return False
