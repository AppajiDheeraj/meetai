export const agentCreatedContent = ({
  username,
  agentName,
}: {
  username: string;
  agentName: string;
}) => `
<p>Hey ${username},</p>

<p>🤖 Meet your new digital sidekick: <strong>${agentName}</strong>!</p>

<p>Your AI agent has just been born in the cloud and is already sharpening its virtual skills to assist you like a pro. Whether it’s running meetings, offering knowledge bombs, or remembering conversations better than most humans — it’s here to make your life easier (and a little cooler 😎).</p>

<ul style="margin-top:20px; padding-left:20px;">
  <li>📅 Schedules and manages meetings without complaining</li>
  <li>📚 Offers expert-level insights faster than you can say "AI"</li>
  <li>🧠 Remembers everything (unless you tell it to forget... which you can!)</li>
</ul>

<div style="text-align:center; margin:32px 0;">
  <a href="https://meetai-pearl.vercel.app/agents" style="background:#10b981; color:white; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">🚀 Meet Your Agent</a>
</div>

<p>We’re excited for you to see what <strong>${agentName}</strong> can do. Think of it as your tireless, super-intelligent assistant — minus the coffee addiction ☕.</p>

<p style="margin-top:24px;">If you didn’t create this agent, no worries — just ignore this email. The robots haven’t become sentient... yet 🤖⚠️</p>

<p>Cheers,<br/>The Meet.AI Team</p>

`;
