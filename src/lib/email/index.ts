import { emailLayout } from "./layout";
import { agentCreatedContent } from "./templates/agent-created";
import { agentDeletedContent } from "./templates/agent-deleted";
import { onboardingContent } from "./templates/onboarding";
import { meetingCreatedContent } from "./templates/meeting-created";
import { meetingDeletedContent } from "./templates/meeting-deleted";
import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Meet.AI" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
};

// helper function to build full agent email
export const sendAgentCreatedEmail = async ({
  to,
  username,
  agentName,
}: {
  to: string;
  username: string;
  agentName: string;
}) => {
  const content = agentCreatedContent({ username, agentName });

  const html = emailLayout({
    title: "Agent Created Successfully!",
    subtitle: "Your AI agent is ready to help you",
    content,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  });

  await sendEmail({ to, subject: "🎉 Agent Created", html });
};

export const sendAgentDeletedEmail = async ({
  to,
  username,
  agentName,
}: {
  to: string;
  username: string;
  agentName: string;
}) => {
  const content = agentDeletedContent({ username, agentName });

  const html = emailLayout({
    title: "Agent Deleted",
    subtitle: `${agentName} has been removed successfully`,
    content,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  });

  await sendEmail({ to, subject: `🗑️ Agent Deleted: ${agentName}`, html });
};

export const sendMeetingCreatedEmail = async ({
  to,
  username,
  agentName,
  meetingName,
  meetingId,
}: {
  to: string;
  username: string;
  agentName: string;
  meetingName: string;
  meetingId: string;
}) => {
  const content = meetingCreatedContent({
    username,
    agentName,
    meetingName,
    meetingId,
  });

  const html = emailLayout({
    title: "Meeting Scheduled 🎯",
    subtitle: "Your AI assistant is ready for action",
    content,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  });

  await sendEmail({ to, subject: `✅ Meeting Created: ${meetingName}`, html });
};

export const sendMeetingDeletedEmail = async ({
  to,
  username,
  meetingName,
  agentName,
}: {
  to: string;
  username: string;
  meetingName: string;
  agentName: string;
}) => {
  const content = meetingDeletedContent({ username, meetingName, agentName });

  const html = emailLayout({
    title: "Meeting Deleted",
    subtitle: `"${meetingName}" is no longer scheduled`,
    content,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  });

  await sendEmail({
    to,
    subject: `🗑️ Meeting "${meetingName}" Deleted`,
    html,
  });
};

export const sendOnboardingEmail = async ({
  to,
  username,
}: {
  to: string;
  username: string;
}) => {
  const content = onboardingContent({ username });

  const html = emailLayout({
    title: "Welcome to Meet.AI! 👋",
    subtitle: "Let’s help you get started",
    content,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  });

  await sendEmail({ to, subject: "🚀 Welcome to Meet.AI", html });
};
