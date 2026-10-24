import nodemailer from 'nodemailer';
import { createEvent } from 'ics';
import fs from 'fs';

class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  
  async sendInterviewInvite(
    candidateEmail: string,
    candidateName: string,
    interviewDate: Date,
    meetingLink: string,
    jobTitle: string
  ): Promise<void> {
    try {
      // Create calendar event
      const event = {
        start: [
          interviewDate.getFullYear(),
          interviewDate.getMonth() + 1,
          interviewDate.getDate(),
          interviewDate.getHours(),
          interviewDate.getMinutes()
        ] as [number, number, number, number, number],
        duration: { hours: 1 },
        title: `Interview: ${jobTitle}`,
        description: `Interview for ${jobTitle} position\n\nMeeting Link: ${meetingLink}`,
        location: meetingLink,
        status: 'CONFIRMED' as const,
        busyStatus: 'BUSY' as const,
        organizer: { name: 'Recruitment Team', email: process.env.SMTP_USER! }
      };
      
      const { error, value } = createEvent(event);
      
      if (error) {
        console.error('Calendar event creation error:', error);
      }
      
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: candidateEmail,
        subject: `Interview Invitation - ${jobTitle}`,
        html: `
          <h2>Interview Invitation</h2>
          <p>Dear ${candidateName},</p>
          <p>We are pleased to invite you for an interview for the <strong>${jobTitle}</strong> position.</p>
          <p><strong>Date & Time:</strong> ${interviewDate.toLocaleString()}</p>
          <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
          <p>Please confirm your attendance by replying to this email.</p>
          <p>Best regards,<br>Recruitment Team</p>
        `,
        icalEvent: value ? {
          method: 'REQUEST',
          content: value
        } : undefined
      };
      
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Interview invite sent to ${candidateEmail}`);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send interview invitation');
    }
  }
  
  async sendApplicationConfirmation(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: candidateEmail,
        subject: `Application Received - ${jobTitle}`,
        html: `
          <h2>Application Received</h2>
          <p>Dear ${candidateName},</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position.</p>
          <p>We have received your application and will review it shortly.</p>
          <p>You will hear from us within 5-7 business days.</p>
          <p>Best regards,<br>Recruitment Team</p>
        `
      };
      
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }
}

export default new EmailService();
