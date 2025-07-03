export const onboardingContent = ({ username }: { username: string }) => `
  <p>Hey ${username},</p>

  <p>🎉 Welcome to <strong>Meet.AI</strong> — where meetings get smarter, and your to-do list gets shorter (well, hopefully 😉).</p>

  <p>You’ve just unlocked the ability to:</p>

  <ul style="margin-top:20px; padding-left:20px;">
    <li>🤖 Create powerful AI agents tailored to your workflow</li>
    <li>📅 Set up and automate intelligent meetings</li>
    <li>💡 Let your assistant handle the context, memory, and heavy lifting</li>
  </ul>

  <div style="text-align:center; margin:32px 0;">
    <a href="https://meetai-pearl.vercel.app/meetings" style="background:#10b981; color:white; padding:14px 28px; border-radius:8px; text-decoration:none; font-weight:600; display:inline-block;">🚀 Go to Dashboard</a>
  </div>

  <p>Your AI sidekick is ready — all you need to do is put it to work.</p>

  <p>If this wasn’t you, don’t worry — we won’t let any rogue robots in 🤖🚫</p>

  <p>Cheers,<br />The Meet.AI Team</p>
`;
