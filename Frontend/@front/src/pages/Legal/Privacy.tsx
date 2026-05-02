import { useNavigate } from "react-router-dom";

export default function Privacy() {
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
        <h1 className="text-3xl font-extrabold mb-4" style={{ color: '#22D3EE' }}>Privacy Policy</h1>
        <div className="space-y-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <p>At Arshaad, we take your privacy seriously. This policy explains how we collect and use your data.</p>
          <h2 className="text-xl font-bold mt-6" style={{ color: '#ffffff' }}>1. Data Collection</h2>
          <p>We collect information you provide, such as name and email, as well as usage data to improve our service.</p>
          <h2 className="text-xl font-bold mt-6" style={{ color: '#ffffff' }}>2. Data Use</h2>
          <p>Your data is used to provide, maintain, and improve the platform. We do not sell your data to third parties.</p>
          <h2 className="text-xl font-bold mt-6" style={{ color: '#ffffff' }}>3. Security</h2>
          <p>We implement security measures to protect your information, although no system can be completely secure.</p>
        </div>
      </div>
    </div>
  )
}
