export const agentDeletedContent = ({
  username,
  agentName,
}: {
  username: string;
  agentName: string;
}) => `
<p>Hey ${username},</p>

<p>🧹 <strong>${agentName}</strong> has officially clocked out... for good.</p>

<p>Your AI agent has been deleted from our system and is no longer available to assist you. Whether it was a bittersweet goodbye or just a tidy-up moment — we salute the service it provided.</p>

<ul style="margin-top:20px; padding-left:20px;">
  <li>📁 All memory traces and data tied to <strong>${agentName}</strong> have been securely removed</li>
  <li>🧘‍♂️ No background processes are running — your cloud is peaceful again</li>
  <li>🚫 The agent won’t respond, join meetings, or offer suggestions anymore</li>
</ul>

<p>If this was intentional, you're all set. If it wasn’t, no worries — creating a new agent is just a few clicks away.</p>

<div style="text-align:center; margin:32px 0;">
  <a href="https://yourdomain.com/dashboard/agents" style="background:#059669; color:white; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">Create a New Agent</a>
</div>

<p style="margin-top:24px;">If you didn’t delete this agent and think something’s off, reach out to us — no judgment, just support.</p>

<p>Until next time,<br/>The Meet.AI Team</p>
`;
