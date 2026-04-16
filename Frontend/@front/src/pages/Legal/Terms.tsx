import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10" style={{ background: '#0B1120' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors z-20"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div
        className="relative z-10 w-full max-w-[800px] rounded-[20px] border p-8 text-white"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#22D3EE' }}>Terms of Service</h1>
        <div className="space-y-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <p>Welcome to Arshaad. By accessing our platform, you agree to these terms.</p>
          <h2 className="text-xl font-bold mt-6" style={{ color: '#ffffff' }}>1. Use of the Platform</h2>
          <p>You must use this platform responsibly and legally. Any misuse will result in termination of your account.</p>
          <h2 className="text-xl font-bold mt-6" style={{ color: '#ffffff' }}>2. Accounts</h2>
          <p>When you create an account, you guarantee that the information is accurate. You are responsible for safeguarding your password.</p>
          <h2 className="text-xl font-bold mt-6" style={{ color: '#ffffff' }}>3. Changes</h2>
          <p>We reserve the right to modify these terms. We will notify you of any changes.</p>
        </div>
      </div>
    </div>
  )
}
