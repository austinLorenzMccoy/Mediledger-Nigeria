import { useState, useEffect, useCallback } from "react";

// ============================================================
// THEME TOKENS — Adire-inspired: deep forest + warm terracotta
// ============================================================
const THEME = {
  forest: "#0D2B1F",
  forestMid: "#143824",
  forestLight: "#1F5233",
  terra: "#C9572A",
  terraLight: "#E8754A",
  gold: "#D4A843",
  goldLight: "#F0C96B",
  mint: "#4EC99A",
  mintDark: "#2A8C68",
  cream: "#F5EDD8",
  creamDark: "#E8D9B8",
  ink: "#0A1E14",
  textPrimary: "#F0EBE0",
  textMuted: "#9DB8A5",
  border: "rgba(78,201,154,0.18)",
  glass: "rgba(13,43,31,0.72)",
};

// ============================================================
// GLOBAL STYLES INJECTED
// ============================================================
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  html { scroll-behavior: smooth; }

  body {
    background: ${THEME.forest};
    color: ${THEME.textPrimary};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${THEME.forestMid}; }
  ::-webkit-scrollbar-thumb { background: ${THEME.mintDark}; border-radius: 3px; }

  /* ---- Adire geometric SVG pattern overlay ---- */
  .adire-bg {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%234EC99A' stroke-width='0.5' opacity='0.12'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z'/%3E%3Cpath d='M30 20L40 30L30 40L20 30Z'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3Ccircle cx='60' cy='0' r='2'/%3E%3Ccircle cx='0' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .hero-bg {
    background: 
      linear-gradient(135deg, rgba(13,43,31,0.88) 0%, rgba(10,30,20,0.72) 60%, rgba(201,87,42,0.25) 100%),
      url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=80') center/cover no-repeat;
    position: relative;
  }

  /* Animate sidebar */
  .sidebar { transition: width 0.32s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }

  /* Card hover */
  .card-hover {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .card-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(78,201,154,0.15);
    border-color: rgba(78,201,154,0.45) !important;
  }

  /* Stat number counter animation */
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .count-anim { animation: countUp 0.6s ease both; }

  /* Fade in page */
  @keyframes fadeIn {
    from { opacity:0; transform: translateY(16px); }
    to { opacity:1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn 0.45s ease both; }

  /* Pulse badge */
  @keyframes pulse {
    0%, 100% { opacity:1; transform: scale(1); }
    50% { opacity:0.6; transform: scale(1.3); }
  }
  .pulse { animation: pulse 2s infinite; }

  /* Collapse label slide */
  @keyframes slideDown {
    from { opacity:0; max-height:0; }
    to { opacity:1; max-height:200px; }
  }
  .collapse-open { animation: slideDown 0.28s ease forwards; }
  @keyframes slideUp {
    from { opacity:1; max-height:200px; }
    to { opacity:0; max-height:0; }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .sidebar-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      height: 100vh !important;
      z-index: 200 !important;
    }
    .main-content { margin-left: 0 !important; }
    .hide-mobile { display: none !important; }
  }

  .token { font-family: 'Space Mono', monospace; }
  h1,h2,h3 { font-family: 'Cormorant Garamond', serif; }
  
  input, select, textarea {
    background: ${THEME.forestMid};
    border: 1px solid ${THEME.border};
    color: ${THEME.textPrimary};
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
  }
  input:focus, select:focus { border-color: ${THEME.mint}; }

  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }

  a { text-decoration: none; color: inherit; }
`;

// ============================================================
// ICONS (inline SVG)
// ============================================================
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    vault: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="8" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="16"/><line x1="8" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="16" y2="12"/></svg>,
    consent: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M12 18a2 2 0 012 2v.5"/><path d="M12 18a2 2 0 01-2 2V20"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="4"/></svg>,
    emergency: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M3 12h3m15 0h-3M12 3v3m0 15v-3M5.636 5.636l2.121 2.121m8.485 8.485l2.121 2.121M5.636 18.364l2.121-2.121m8.485-8.485l2.121-2.121"/><circle cx="12" cy="12" r="4"/><path d="M12 10v4M10 12h4"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    token: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-7h2m4 0h2M8.5 8.5l1.5 1.5m4 4l1.5 1.5m0-7l-1.5 1.5m-4 4L8.5 15.5"/></svg>,
    collapse: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>,
    expand: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    notification: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  };
  return icons[name] || null;
};

// ============================================================
// HASHPACK / WALLETCONNECT MOCK MANAGER
// (In production: replace with @hashgraph/hedera-wallet-connect DAppConnector)
// ============================================================
const WALLET_STATES = { DISCONNECTED: "disconnected", CONNECTING: "connecting", CONNECTED: "connected" };

const mockConnect = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.08) {
        resolve({
          accountId: "0.0." + (4000000 + Math.floor(Math.random() * 999999)),
          network: "testnet",
          balance: (Math.random() * 800 + 50).toFixed(2),
          publicKey: "302a300506032b6570032100" + [...Array(32)].map(() => Math.floor(Math.random()*256).toString(16).padStart(2,"0")).join(""),
        });
      } else {
        reject(new Error("User rejected the connection request."));
      }
    }, 2200);
  });

// ============================================================
// WALLET MODAL
// ============================================================
const WalletModal = ({ onClose, onConnected }) => {
  const [step, setStep] = useState("choose"); // choose | qr | connecting | error
  const [error, setError] = useState("");
  const [account, setAccount] = useState(null);

  const handleConnect = async (method) => {
    setStep("connecting");
    setError("");
    try {
      const result = await mockConnect();
      setAccount(result);
      setStep("success");
      setTimeout(() => {
        onConnected(result);
        onClose();
      }, 1400);
    } catch (e) {
      setError(e.message);
      setStep("error");
    }
  };

  // QR code SVG (decorative — real WalletConnect provides its own QR)
  const QRCode = () => (
    <svg width={180} height={180} viewBox="0 0 180 180" style={{ borderRadius: 8 }}>
      <rect width={180} height={180} fill={THEME.forestMid} rx={8}/>
      {/* corners */}
      {[[8,8],[138,8],[8,138]].map(([x,y],i)=>(
        <g key={i} transform={`translate(${x},${y})`}>
          <rect width={34} height={34} rx={4} fill="none" stroke={THEME.mint} strokeWidth={3}/>
          <rect x={6} y={6} width={22} height={22} rx={2} fill={THEME.mint}/>
          <rect x={10} y={10} width={14} height={14} rx={1} fill={THEME.forestMid}/>
        </g>
      ))}
      <g transform="translate(138,138)">
        <rect width={34} height={34} rx={4} fill="none" stroke={THEME.mint} strokeWidth={3}/>
        <rect x={6} y={6} width={22} height={22} rx={2} fill={THEME.mint}/>
        <rect x={10} y={10} width={14} height={14} rx={1} fill={THEME.forestMid}/>
      </g>
      {/* data dots */}
      {[...Array(8)].map((_,r)=>[...Array(8)].map((_,c)=>{
        const skip = (r<3&&c<3)||(r<3&&c>4)||(r>4&&c<3)||(r>4&&c>4);
        if(skip) return null;
        const on = Math.random()>0.4;
        return on ? <rect key={`${r}-${c}`} x={48+c*11} y={48+r*11} width={8} height={8} rx={1.5} fill={THEME.mint} opacity={0.85}/> : null;
      }))}
      <text x={90} y={172} textAnchor="middle" fill={THEME.textMuted} fontSize={8} fontFamily="monospace">WalletConnect v2</text>
    </svg>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(5,15,10,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: "100%", maxWidth: 440, borderRadius: 16,
        background: THEME.ink, border: `1px solid ${THEME.border}`,
        overflow: "hidden", animation: "fadeIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.terra})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="shield" size={16} color={THEME.forest}/>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Connect Wallet</div>
              <div style={{ fontSize: 11, color: THEME.textMuted, fontFamily: "'Space Mono', monospace" }}>Hedera Testnet</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: THEME.textMuted, display: "flex", padding: 4 }}>
            <Icon name="close" size={18}/>
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {step === "choose" && (
            <div>
              <p style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
                Connect your HashPack wallet to access your health vault, sign consent transactions, and earn $HEAL tokens.
              </p>

              {/* HashPack via WalletConnect */}
              <button onClick={() => handleConnect("walletconnect")} style={{
                width: "100%", padding: "16px 18px", borderRadius: 10, marginBottom: 12,
                background: `linear-gradient(135deg, ${THEME.forestMid}, ${THEME.forestLight})`,
                border: `1px solid ${THEME.mint}40`,
                display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.2s", textAlign: "left",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = THEME.mint}
              onMouseOut={e => e.currentTarget.style.borderColor = `${THEME.mint}40`}>
                {/* HashPack logo approximation */}
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #8B5CF6, #4F46E5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 800, color: "#fff",
                }}>H</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: THEME.textPrimary }}>HashPack</div>
                  <div style={{ fontSize: 12, color: THEME.textMuted }}>via WalletConnect v2</div>
                </div>
                <span style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 12,
                  background: `${THEME.mint}22`, color: THEME.mint,
                  fontFamily: "'Space Mono', monospace",
                }}>RECOMMENDED</span>
              </button>

              {/* QR option */}
              <button onClick={() => setStep("qr")} style={{
                width: "100%", padding: "14px 18px", borderRadius: 10, marginBottom: 20,
                background: THEME.forestMid, border: `1px solid ${THEME.border}`,
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                transition: "border-color 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = `${THEME.mint}50`}
              onMouseOut={e => e.currentTarget.style.borderColor = THEME.border}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: `${THEME.gold}22`, border: `1px solid ${THEME.gold}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={THEME.gold} strokeWidth="1.8">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                    <rect x="18" y="18" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/>
                    <rect x="18" y="14" width="3" height="3"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: THEME.textPrimary }}>Scan QR Code</div>
                  <div style={{ fontSize: 12, color: THEME.textMuted }}>Connect any WalletConnect wallet</div>
                </div>
              </button>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 12, color: THEME.textMuted }}>
                  Don't have HashPack?{" "}
                  <a href="https://www.hashpack.app/" target="_blank" rel="noreferrer"
                    style={{ color: THEME.mint, borderBottom: `1px solid ${THEME.mint}50` }}>
                    Download here
                  </a>
                </span>
              </div>
            </div>
          )}

          {step === "qr" && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 20 }}>
                Scan this QR code with your HashPack mobile app or any WalletConnect-compatible wallet.
              </p>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <QRCode />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: THEME.textMuted, marginBottom: 20, wordBreak: "break-all" }}>
                wc:1a2b3c4d5e6f...@2?relay-protocol=irn&symKey=abc123def456
              </div>
              <button onClick={() => handleConnect("qr")} style={{
                width: "100%", padding: "12px", borderRadius: 8,
                background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
                border: "none", color: THEME.forest, fontWeight: 600, fontSize: 14,
              }}>Simulate Connection</button>
              <button onClick={() => setStep("choose")} style={{
                marginTop: 10, background: "none", border: "none",
                color: THEME.textMuted, fontSize: 13, width: "100%",
              }}>← Back</button>
            </div>
          )}

          {step === "connecting" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: `${THEME.mint}18`, border: `2px solid ${THEME.mint}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse 1.5s infinite",
              }}>
                <Icon name="shield" size={28} color={THEME.mint}/>
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Connecting to HashPack…</div>
              <div style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 20 }}>
                Please approve the connection request in your wallet.
              </div>
              <div style={{
                display: "flex", gap: 6, justifyContent: "center",
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: THEME.mint,
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            </div>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: `${THEME.mint}22`, border: `2px solid ${THEME.mint}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="consent" size={28} color={THEME.mint}/>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: THEME.mint, marginBottom: 6 }}>Wallet Connected!</div>
              <div className="token" style={{ fontSize: 12, color: THEME.textMuted }}>{account?.accountId}</div>
              <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 4 }}>{account?.balance} HBAR · Testnet</div>
            </div>
          )}

          {step === "error" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: `${THEME.terra}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="close" size={28} color={THEME.terra}/>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: THEME.terra, marginBottom: 8 }}>Connection Failed</div>
              <div style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 20 }}>{error}</div>
              <button onClick={() => setStep("choose")} style={{
                padding: "10px 28px", borderRadius: 7,
                background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
                border: "none", color: THEME.forest, fontWeight: 600,
              }}>Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// WALLET BUTTON (header + landing)
// ============================================================
const WalletButton = ({ wallet, onOpen, onDisconnect, compact = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (wallet) {
    return (
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowMenu(s => !s)} style={{
          padding: compact ? "7px 14px" : "9px 18px",
          borderRadius: 7,
          background: `${THEME.mint}15`, border: `1px solid ${THEME.mint}50`,
          color: THEME.mint,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 500,
          transition: "all 0.2s",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: THEME.mint, display: "inline-block",
          }}/>
          <span className="token" style={{ fontSize: 12 }}>
            {wallet.accountId.slice(0, 5)}…{wallet.accountId.slice(-4)}
          </span>
          {!compact && <span style={{ color: THEME.textMuted, fontSize: 11 }}>{parseFloat(wallet.balance).toFixed(0)} ℏ</span>}
        </button>
        {showMenu && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 200,
            background: THEME.ink, border: `1px solid ${THEME.border}`,
            borderRadius: 10, overflow: "hidden", minWidth: 220,
            animation: "fadeIn 0.15s ease",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${THEME.border}` }}>
              <div style={{ fontSize: 11, color: THEME.textMuted, marginBottom: 4 }}>Connected via HashPack</div>
              <div className="token" style={{ fontSize: 12, color: THEME.mint }}>{wallet.accountId}</div>
              <div style={{ fontSize: 11, color: THEME.textMuted, marginTop: 2 }}>{wallet.balance} HBAR · Testnet</div>
            </div>
            <div style={{ padding: 8 }}>
              <button onClick={() => { navigator.clipboard?.writeText(wallet.accountId); setShowMenu(false); }} style={{
                width: "100%", padding: "9px 12px", borderRadius: 6, textAlign: "left",
                background: "transparent", border: "none", color: THEME.textMuted, fontSize: 13,
              }}>Copy Account ID</button>
              <button onClick={() => { onDisconnect(); setShowMenu(false); }} style={{
                width: "100%", padding: "9px 12px", borderRadius: 6, textAlign: "left",
                background: "transparent", border: "none", color: THEME.terra, fontSize: 13,
              }}>Disconnect Wallet</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={onOpen} style={{
      padding: compact ? "7px 14px" : "9px 20px", borderRadius: 7,
      background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
      border: "none", color: THEME.forest,
      fontSize: compact ? 13 : 14, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 7,
      transition: "opacity 0.2s",
    }} onMouseOver={e => e.currentTarget.style.opacity="0.88"}
       onMouseOut={e => e.currentTarget.style.opacity="1"}>
      <Icon name="lock" size={14} color={THEME.forest}/>
      Connect HashPack
    </button>
  );
};

// ============================================================
// NAV ITEMS
// ============================================================
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "vault", label: "Health Vault", icon: "vault" },
  { id: "consent", label: "Consent Hub", icon: "consent" },
  { id: "ai", label: "AI Guardian", icon: "ai" },
  { id: "emergency", label: "Emergency", icon: "emergency" },
  { id: "tokens", label: "$HEAL Tokens", icon: "token" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// ============================================================
// LANDING PAGE
// ============================================================
const LandingPage = ({ onEnter, wallet, onOpenWallet, onDisconnectWallet }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(13,43,31,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${THEME.border}` : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.terra})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="shield" size={18} color={THEME.forest} />
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, letterSpacing: 1 }}>
            MediLedger<span style={{ color: THEME.terra }}>NG</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <WalletButton wallet={wallet} onOpen={onOpenWallet} onDisconnect={onDisconnectWallet} />
          <button onClick={onEnter} style={{
            padding: "9px 24px", borderRadius: 6,
            background: THEME.terra, border: "none",
            color: "#fff", fontSize: 14, fontWeight: 600,
          }}>Launch App</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg adire-bg" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Adire diamond decoration */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234EC99A' stroke-width='0.4' opacity='0.08'%3E%3Cpolygon points='40,4 76,40 40,76 4,40'/%3E%3Cpolygon points='40,16 64,40 40,64 16,40'/%3E%3Cpolygon points='40,28 52,40 40,52 28,40'/%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }} />

        <div className="fade-in" style={{ animationDelay: "0.1s", marginBottom: 16 }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3,
            color: THEME.mint, textTransform: "uppercase",
            padding: "6px 14px", border: `1px solid ${THEME.mint}`,
            borderRadius: 20, opacity: 0.85,
          }}>Powered by Hedera · Built for Nigeria</span>
        </div>

        <h1 className="fade-in" style={{
          animationDelay: "0.2s",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
          fontWeight: 700, lineHeight: 1.12,
          maxWidth: 820,
          marginBottom: 24,
        }}>
          Your Health Records.<br/>
          <span style={{ color: THEME.terra }}>Your Sovereignty.</span><br/>
          <span style={{ color: THEME.mint }}>Your Economy.</span>
        </h1>

        <p className="fade-in" style={{
          animationDelay: "0.35s",
          fontSize: 17, color: THEME.textMuted, maxWidth: 560,
          lineHeight: 1.7, marginBottom: 40,
        }}>
          Nigeria's first decentralized health data ecosystem — secured by zero-knowledge proofs,
          governed by patients, and powered by Hedera blockchain.
        </p>

        <div className="fade-in" style={{ animationDelay: "0.45s", display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={onEnter} style={{
            padding: "14px 36px", borderRadius: 8,
            background: `linear-gradient(135deg, ${THEME.terra}, ${THEME.terraLight})`,
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: `0 8px 32px rgba(201,87,42,0.4)`,
            transition: "transform 0.2s",
          }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.04)"}
             onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
            Enter Dashboard <Icon name="arrow" size={16} color="#fff"/>
          </button>
          <button style={{
            padding: "14px 36px", borderRadius: 8,
            background: "transparent",
            border: `1px solid ${THEME.border}`,
            color: THEME.textPrimary, fontSize: 16,
          }}>View Whitepaper</button>
        </div>

        {/* Metrics strip */}
        <div className="fade-in" style={{
          animationDelay: "0.6s",
          marginTop: 72, display: "flex", gap: 0,
          flexWrap: "wrap", justifyContent: "center",
          border: `1px solid ${THEME.border}`, borderRadius: 12,
          background: THEME.glass, backdropFilter: "blur(12px)",
          overflow: "hidden",
        }}>
          {[
            { v: "200K+", l: "Patients Onboarded" },
            { v: "₦2.1B", l: "Data Revenue Distributed" },
            { v: "47", l: "Partner Hospitals" },
            { v: "99.98%", l: "Uptime Guaranteed" },
          ].map((m, i) => (
            <div key={i} style={{
              padding: "24px 36px", textAlign: "center",
              borderRight: i < 3 ? `1px solid ${THEME.border}` : "none",
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: THEME.gold }}>{m.v}</div>
              <div style={{ fontSize: 12, color: THEME.textMuted, marginTop: 4, letterSpacing: 0.5 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="adire-bg" style={{ padding: "100px 40px", background: THEME.forestMid }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 16 }}>
              Built for <span style={{ color: THEME.terra }}>Africa's</span> Healthcare Future
            </h2>
            <p style={{ color: THEME.textMuted, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
              Five pillars that protect your most sensitive data while unlocking its economic potential.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              { icon: "lock", title: "ZK Health Vaults", desc: "Prove medical conditions without revealing records. AES-256 + zk-SNARKs keep your data mathematically secure.", color: THEME.mint },
              { icon: "token", title: "Earn $HEAL Tokens", desc: "Get paid in Hedera tokens when researchers access your anonymized data. Your records, your revenue.", color: THEME.gold },
              { icon: "chart", title: "AI Diagnostics", desc: "Federated learning across 10,000+ patient records delivers early disease detection without data exposure.", color: THEME.terra },
              { icon: "emergency", title: "Emergency Protocol", desc: "Critical data like blood type and allergies broadcast to nearby hospitals in under 300ms during emergencies.", color: THEME.terraLight },
              { icon: "globe", title: "HL7 FHIR Standard", desc: "Interoperable with 190+ countries' health systems using global healthcare data standards.", color: THEME.goldLight },
            ].map((f, i) => (
              <div key={i} className="card-hover" style={{
                padding: 28, borderRadius: 12,
                background: THEME.glass, border: `1px solid ${THEME.border}`,
                backdropFilter: "blur(8px)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, marginBottom: 16,
                  background: `${f.color}22`, border: `1px solid ${f.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={f.icon} size={20} color={f.color} />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: THEME.textMuted, fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 40px", textAlign: "center",
        background: `linear-gradient(135deg, ${THEME.forest} 0%, ${THEME.forestLight} 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${THEME.terra}18, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: 16, position: "relative" }}>
          Ready to own your health data?
        </h2>
        <p style={{ color: THEME.textMuted, marginBottom: 36, position: "relative" }}>
          Join 200,000+ Nigerians already on the ecosystem.
        </p>
        <button onClick={onEnter} style={{
          padding: "16px 48px", borderRadius: 8, position: "relative",
          background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
          border: "none", color: THEME.forest, fontSize: 16, fontWeight: 700,
          boxShadow: `0 8px 32px rgba(78,201,154,0.35)`,
        }}>
          Get Started Free →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "40px", background: THEME.ink,
        borderTop: `1px solid ${THEME.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>
          MediLedger<span style={{ color: THEME.terra }}>NG</span>
        </div>
        <div style={{ color: THEME.textMuted, fontSize: 13 }}>
          © 2025 MediLedger Nigeria. Built on Hedera. NDPR & HIPAA Compliant.
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Docs", "GitHub"].map(l => (
            <span key={l} style={{ color: THEME.textMuted, fontSize: 13, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const SIDEBAR_OPEN = 240;
const SIDEBAR_CLOSED = 64;

const Sidebar = ({ active, setActive, collapsed, setCollapsed, onGoHome, isMobile, mobileOpen, setMobileOpen }) => {
  const width = collapsed ? SIDEBAR_CLOSED : SIDEBAR_OPEN;

  const sidebarStyle = {
    width,
    minHeight: "100vh",
    background: THEME.ink,
    borderRight: `1px solid ${THEME.border}`,
    display: "flex", flexDirection: "column",
    position: "fixed", top: 0, left: 0, zIndex: 150,
    transition: "width 0.32s cubic-bezier(0.4,0,0.2,1)",
    overflow: "hidden",
  };

  if (isMobile) {
    sidebarStyle.transform = mobileOpen ? "translateX(0)" : "translateX(-100%)";
    sidebarStyle.width = SIDEBAR_OPEN;
    sidebarStyle.transition = "transform 0.32s cubic-bezier(0.4,0,0.2,1)";
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 149,
        }} />
      )}
      <div style={sidebarStyle}>
        {/* Logo */}
        <div style={{
          padding: "20px 16px",
          display: "flex", alignItems: "center",
          gap: 10, borderBottom: `1px solid ${THEME.border}`,
          minHeight: 64, overflow: "hidden",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.terra})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }} onClick={onGoHome}>
            <Icon name="shield" size={16} color={THEME.forest} />
          </div>
          {!collapsed && (
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600,
              whiteSpace: "nowrap", overflow: "hidden",
              animation: "fadeIn 0.2s ease",
            }}>
              MediLedger<span style={{ color: THEME.terra }}>NG</span>
            </span>
          )}
          {!isMobile && (
            <button onClick={() => {
              const next = !collapsed;
              setCollapsed(next);
              try { localStorage.setItem("ml_sidebar_collapsed", String(next)); } catch(e) {}
            }} style={{
              marginLeft: "auto", background: "none", border: "none",
              color: THEME.textMuted, display: "flex", flexShrink: 0,
              padding: 4, borderRadius: 4,
            }}>
              <Icon name={collapsed ? "expand" : "collapse"} size={16} />
            </button>
          )}
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} style={{
              marginLeft: "auto", background: "none", border: "none",
              color: THEME.textMuted, display: "flex", padding: 4,
            }}>
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        {/* Home link */}
        <button onClick={onGoHome} style={{
          margin: "12px 10px 4px",
          padding: "9px 12px", borderRadius: 8,
          background: "transparent", border: `1px dashed ${THEME.border}`,
          color: THEME.textMuted, display: "flex", alignItems: "center",
          gap: 10, fontSize: 13, textAlign: "left",
          transition: "all 0.2s",
          overflow: "hidden", whiteSpace: "nowrap",
        }} onMouseOver={e => { e.currentTarget.style.borderColor = THEME.mint; e.currentTarget.style.color = THEME.mint; }}
           onMouseOut={e => { e.currentTarget.style.borderColor = THEME.border; e.currentTarget.style.color = THEME.textMuted; }}>
          <Icon name="home" size={16} />
          {!collapsed && <span>← Back to Home</span>}
        </button>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => {
                setActive(item.id);
                if (isMobile) setMobileOpen(false);
              }} style={{
                width: "100%", padding: "10px 12px",
                marginBottom: 2, borderRadius: 8,
                display: "flex", alignItems: "center", gap: 12,
                background: isActive ? `${THEME.mint}15` : "transparent",
                border: isActive ? `1px solid ${THEME.mint}30` : "1px solid transparent",
                color: isActive ? THEME.mint : THEME.textMuted,
                fontSize: 14, textAlign: "left", cursor: "pointer",
                transition: "all 0.18s",
                overflow: "hidden", whiteSpace: "nowrap",
              }} onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = `${THEME.mint}08`; e.currentTarget.style.color = THEME.textPrimary; }}}
                 onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = THEME.textMuted; }}}>
                <div style={{ flexShrink: 0, display: "flex" }}>
                  <Icon name={item.icon} size={18} />
                </div>
                {!collapsed && <span style={{ animation: "fadeIn 0.15s ease" }}>{item.label}</span>}
                {!collapsed && item.id === "emergency" && (
                  <span className="pulse" style={{
                    marginLeft: "auto", width: 7, height: 7, borderRadius: "50%",
                    background: THEME.terra, flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: "12px 10px",
          borderTop: `1px solid ${THEME.border}`,
          display: "flex", alignItems: "center", gap: 10,
          overflow: "hidden",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${THEME.terra}, ${THEME.gold})`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            fontSize: 12, fontWeight: 600, color: "#fff",
          }}>AO</div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>Adaeze Okafor</div>
              <div className="token" style={{ fontSize: 10, color: THEME.mint }}>ID: 0.0.4829102</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================================
// DASHBOARD PAGES
// ============================================================

const StatCard = ({ label, value, sub, icon, color, delay = 0 }) => (
  <div className="card-hover count-anim" style={{
    padding: 24, borderRadius: 12,
    background: THEME.forestMid, border: `1px solid ${THEME.border}`,
    animationDelay: `${delay}s`,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: `${color}22`, border: `1px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={18} color={color} />
      </div>
      <span style={{ fontSize: 10, color: THEME.textMuted, fontFamily: "'Space Mono', monospace" }}>LIVE</span>
    </div>
    <div style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: THEME.mint, marginTop: 6 }}>{sub}</div>}
  </div>
);

const OverviewPage = () => (
  <div className="fade-in">
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: 6 }}>
        Good morning, <span style={{ color: THEME.terra }}>Adaeze</span> 👋
      </h2>
      <p style={{ color: THEME.textMuted, fontSize: 14 }}>Here's your health data overview for today.</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
      <StatCard label="$HEAL Earned" value="₦18,400" sub="+₦820 this week" icon="token" color={THEME.gold} delay={0.05} />
      <StatCard label="Active Consents" value="3" sub="2 expiring soon" icon="consent" color={THEME.mint} delay={0.1} />
      <StatCard label="Vault Security" value="100%" sub="ZK proof active" icon="lock" color={THEME.mint} delay={0.15} />
      <StatCard label="AI Insights" value="2 New" sub="Early detection alerts" icon="ai" color={THEME.terraLight} delay={0.2} />
    </div>

    {/* Activity */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      <div style={{ padding: 24, borderRadius: 12, background: THEME.forestMid, border: `1px solid ${THEME.border}` }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Recent Vault Activity</h3>
        {[
          { t: "Lagos University Teaching Hospital", d: "Blood test results uploaded", time: "2h ago", color: THEME.mint },
          { t: "Consent Granted", d: "Nigerian Institute of Medical Research", time: "1d ago", color: THEME.gold },
          { t: "AI Alert", d: "Vitamin D deficiency risk detected", time: "3d ago", color: THEME.terra },
          { t: "Emergency Tag Updated", d: "Blood type O+ confirmed", time: "5d ago", color: THEME.mint },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, marginBottom: 14,
            paddingBottom: 14, borderBottom: i < 3 ? `1px solid ${THEME.border}` : "none",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: a.color,
              flexShrink: 0, marginTop: 5,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{a.t}</div>
              <div style={{ fontSize: 12, color: THEME.textMuted, marginTop: 2 }}>{a.d}</div>
            </div>
            <div style={{ fontSize: 11, color: THEME.textMuted, whiteSpace: "nowrap", fontFamily: "'Space Mono', monospace" }}>{a.time}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 12, background: THEME.forestMid, border: `1px solid ${THEME.border}` }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Consent Requests</h3>
        {[
          { org: "NG Cancer Research Centre", type: "Genomic Data", tokens: "₦4,200/mo" },
          { org: "AfDB Health Initiative", type: "Lab Results", tokens: "₦1,800/mo" },
        ].map((r, i) => (
          <div key={i} style={{
            padding: 16, borderRadius: 8, marginBottom: 12,
            border: `1px solid ${THEME.border}`, background: THEME.glass,
          }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{r.org}</div>
            <div style={{ fontSize: 12, color: THEME.textMuted, marginBottom: 12 }}>{r.type} access requested</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: THEME.gold }}>{r.tokens}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{
                  padding: "5px 14px", borderRadius: 5, border: `1px solid ${THEME.border}`,
                  background: "transparent", color: THEME.textMuted, fontSize: 12,
                }}>Decline</button>
                <button style={{
                  padding: "5px 14px", borderRadius: 5, border: "none",
                  background: THEME.mint, color: THEME.forest, fontSize: 12, fontWeight: 600,
                }}>Approve</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VaultPage = () => (
  <div className="fade-in">
    <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", marginBottom: 8 }}>Health Vault</h2>
    <p style={{ color: THEME.textMuted, marginBottom: 28, fontSize: 14 }}>Your encrypted medical records secured with zk-SNARKs on Hedera.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {[
        { cat: "Laboratory Results", count: 12, updated: "2 days ago", icon: "chart", color: THEME.mint, proof: "ZK Proven" },
        { cat: "Imaging & Scans", count: 4, updated: "1 week ago", icon: "ai", color: THEME.gold, proof: "Encrypted" },
        { cat: "Prescriptions", count: 8, updated: "3 days ago", icon: "lock", color: THEME.terra, proof: "ZK Proven" },
        { cat: "Genomic Data", count: 1, updated: "2 months ago", icon: "shield", color: THEME.goldLight, proof: "Encrypted" },
        { cat: "Allergies & Tags", count: 5, updated: "Today", icon: "emergency", color: THEME.terraLight, proof: "Public Tag" },
        { cat: "Vaccinations", count: 9, updated: "6 months ago", icon: "consent", color: THEME.mint, proof: "Verified" },
      ].map((v, i) => (
        <div key={i} className="card-hover" style={{
          padding: 22, borderRadius: 10,
          background: THEME.forestMid, border: `1px solid ${THEME.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `${v.color}22`, border: `1px solid ${v.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={v.icon} size={17} color={v.color} />
            </div>
            <span style={{
              fontSize: 10, padding: "3px 8px", borderRadius: 12,
              background: `${v.color}22`, color: v.color,
              fontFamily: "'Space Mono', monospace",
            }}>{v.proof}</span>
          </div>
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{v.cat}</div>
          <div style={{ fontSize: 12, color: THEME.textMuted }}>{v.count} records · Updated {v.updated}</div>
          <button style={{
            marginTop: 14, width: "100%", padding: "8px",
            borderRadius: 6, border: `1px solid ${THEME.border}`,
            background: "transparent", color: THEME.textMuted, fontSize: 13,
          }}>View Records</button>
        </div>
      ))}
    </div>
  </div>
);

const TokensPage = () => (
  <div className="fade-in">
    <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", marginBottom: 8 }}>$HEAL Token Dashboard</h2>
    <p style={{ color: THEME.textMuted, marginBottom: 28, fontSize: 14 }}>Earn tokens when researchers access your anonymized data.</p>
    
    <div style={{
      padding: 28, borderRadius: 14, marginBottom: 24,
      background: `linear-gradient(135deg, ${THEME.terra}22, ${THEME.gold}15)`,
      border: `1px solid ${THEME.gold}40`,
    }}>
      <div style={{ fontSize: 12, color: THEME.gold, fontFamily: "'Space Mono', monospace", marginBottom: 8 }}>TOTAL BALANCE</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 700, color: THEME.gold }}>₦18,400</div>
      <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 4 }}>≈ 2,840 $HEAL · Hedera ID: 0.0.4829102</div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
      {[
        { label: "This Month", val: "₦820", change: "+12%", color: THEME.mint },
        { label: "Active Streams", val: "3", change: "Ongoing", color: THEME.gold },
        { label: "Pending Payout", val: "₦1,200", change: "In 2 days", color: THEME.terra },
      ].map((s, i) => (
        <div key={i} style={{ padding: 20, borderRadius: 10, background: THEME.forestMid, border: `1px solid ${THEME.border}` }}>
          <div style={{ color: THEME.textMuted, fontSize: 13, marginBottom: 8 }}>{s.label}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: s.color }}>{s.val}</div>
          <div style={{ fontSize: 12, color: THEME.textMuted, marginTop: 4 }}>{s.change}</div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsPage = ({ wallet, onOpenWallet, onDisconnectWallet }) => {
  const [notif, setNotif] = useState(true);
  const [emergency, setEmergency] = useState(true);
  const [research, setResearch] = useState(false);

  const Toggle = ({ on, setOn }) => (
    <button onClick={() => setOn(!on)} style={{
      width: 44, height: 24, borderRadius: 12, border: "none",
      background: on ? THEME.mint : THEME.border,
      position: "relative", transition: "background 0.2s", cursor: "pointer",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3, left: on ? 22 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: on ? THEME.forest : THEME.textMuted,
        transition: "left 0.2s",
      }} />
    </button>
  );

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", marginBottom: 8 }}>Settings</h2>
      <p style={{ color: THEME.textMuted, marginBottom: 28, fontSize: 14 }}>Manage your account, privacy, and notification preferences.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Profile */}
        <div style={{ padding: 24, borderRadius: 12, background: THEME.forestMid, border: `1px solid ${THEME.border}` }}>
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: THEME.textMuted, display: "block", marginBottom: 6 }}>Full Name</label>
              <input defaultValue="Adaeze Okafor" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: THEME.textMuted, display: "block", marginBottom: 6 }}>Email</label>
              <input defaultValue="adaeze@email.com" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: THEME.textMuted, display: "block", marginBottom: 6 }}>Phone</label>
              <input defaultValue="+234 801 234 5678" />
            </div>
            <button style={{
              padding: "10px", borderRadius: 7, border: "none",
              background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
              color: THEME.forest, fontWeight: 600, fontSize: 14,
            }}>Save Changes</button>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ padding: 24, borderRadius: 12, background: THEME.forestMid, border: `1px solid ${THEME.border}` }}>
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Privacy & Preferences</h3>
          {[
            { label: "Consent Notifications", desc: "Get alerts for new data access requests", val: notif, set: setNotif },
            { label: "Emergency Protocol", desc: "Allow emergency access to blood type & allergies", val: emergency, set: setEmergency },
            { label: "Research Data Pool", desc: "Join anonymized research dataset programs", val: research, set: setResearch },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              paddingBottom: 16, marginBottom: 16,
              borderBottom: i < 2 ? `1px solid ${THEME.border}` : "none",
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: THEME.textMuted, marginTop: 3 }}>{p.desc}</div>
              </div>
              <Toggle on={p.val} setOn={p.set} />
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div style={{ padding: 24, borderRadius: 12, background: THEME.forestMid, border: `1px solid ${THEME.border}` }}>
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Hedera Wallet</h3>
          {wallet ? (
            <>
              <div style={{ padding: 16, borderRadius: 8, background: THEME.glass, border: `1px solid ${THEME.mint}40`, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: THEME.mint, display: "inline-block" }}/>
                  <span style={{ fontSize: 12, color: THEME.mint, fontWeight: 500 }}>Connected via HashPack</span>
                </div>
                <div className="token" style={{ fontSize: 13, color: THEME.gold, marginBottom: 4 }}>{wallet.accountId}</div>
                <div style={{ fontSize: 12, color: THEME.textMuted }}>{wallet.balance} HBAR · {wallet.network}</div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: THEME.forestLight + "44", marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: THEME.textMuted, marginBottom: 4 }}>Public Key</div>
                <div className="token" style={{ fontSize: 10, color: THEME.textMuted, wordBreak: "break-all", lineHeight: 1.6 }}>
                  {wallet.publicKey?.slice(0, 32)}…
                </div>
              </div>
              <div style={{ fontSize: 13, color: THEME.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
                $HEAL payouts are auto-transferred to your wallet every 7 days.
              </div>
              <button onClick={onDisconnectWallet} style={{
                width: "100%", padding: "10px", borderRadius: 7,
                border: `1px solid ${THEME.terra}`,
                background: "transparent", color: THEME.terra, fontSize: 14,
              }}>Disconnect Wallet</button>
            </>
          ) : (
            <>
              <div style={{
                padding: 20, borderRadius: 8, textAlign: "center",
                background: THEME.glass, border: `1px dashed ${THEME.border}`,
                marginBottom: 16,
              }}>
                <Icon name="lock" size={28} color={THEME.textMuted}/>
                <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 10, lineHeight: 1.6 }}>
                  No wallet connected. Connect HashPack to sign consent transactions and receive $HEAL tokens.
                </div>
              </div>
              <button onClick={onOpenWallet} style={{
                width: "100%", padding: "11px", borderRadius: 7,
                background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
                border: "none", color: THEME.forest, fontWeight: 600, fontSize: 14,
              }}>Connect HashPack Wallet</button>
              <a href="https://www.hashpack.app/" target="_blank" rel="noreferrer" style={{
                display: "block", textAlign: "center", marginTop: 12,
                fontSize: 12, color: THEME.textMuted,
              }}>Don't have HashPack? Download here →</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title, icon, desc }) => (
  <div className="fade-in" style={{ textAlign: "center", paddingTop: 60 }}>
    <div style={{
      width: 72, height: 72, borderRadius: 18, margin: "0 auto 24px",
      background: `${THEME.mint}18`, border: `1px solid ${THEME.mint}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon name={icon} size={32} color={THEME.mint} />
    </div>
    <h2 style={{ fontSize: 26, marginBottom: 12 }}>{title}</h2>
    <p style={{ color: THEME.textMuted, maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>{desc}</p>
  </div>
);

// ============================================================
// 404 PAGE
// ============================================================
const NotFoundPage = ({ onGoHome, onGoDashboard }) => (
  <div style={{
    minHeight: "100vh", background: THEME.forest,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    textAlign: "center", padding: 40,
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <div className="adire-bg" style={{
      position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none",
    }} />
    <div style={{ position: "relative" }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(6rem, 20vw, 12rem)",
        fontWeight: 700, lineHeight: 1,
        color: THEME.terra, opacity: 0.15,
        userSelect: "none",
      }}>404</div>
      <div style={{ marginTop: -60, position: "relative" }}>
        <Icon name="shield" size={48} color={THEME.mint} />
      </div>
      <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginTop: 24, marginBottom: 12 }}>
        Record Not Found
      </h1>
      <p style={{ color: THEME.textMuted, fontSize: 15, marginBottom: 36, maxWidth: 380 }}>
        This page doesn't exist in our health ledger. Let's get you back on track.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onGoDashboard} style={{
          padding: "12px 28px", borderRadius: 7,
          background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
          border: "none", color: THEME.forest, fontWeight: 600, fontSize: 15,
        }}>Go to Dashboard</button>
        <button onClick={onGoHome} style={{
          padding: "12px 28px", borderRadius: 7,
          border: `1px solid ${THEME.border}`,
          background: "transparent", color: THEME.textPrimary, fontSize: 15,
        }}>Back to Home</button>
      </div>
    </div>
  </div>
);

// ============================================================
// DASHBOARD SHELL
// ============================================================
const Dashboard = ({ onGoHome, wallet, onOpenWallet, onDisconnectWallet }) => {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("ml_sidebar_collapsed") === "true"; } catch { return false; }
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isMobile ? 0 : (collapsed ? SIDEBAR_CLOSED : SIDEBAR_OPEN);

  const renderPage = () => {
    switch (active) {
      case "overview": return <OverviewPage />;
      case "vault": return <VaultPage />;
      case "tokens": return <TokensPage />;
      case "settings": return <SettingsPage wallet={wallet} onOpenWallet={onOpenWallet} onDisconnectWallet={onDisconnectWallet} />;
      case "consent": return <PlaceholderPage title="Consent Hub" icon="consent" desc="Manage fine-grained permissions for who can access which parts of your health record, for how long, and at what price." />;
      case "ai": return <PlaceholderPage title="AI Health Guardian" icon="ai" desc="Federated learning engine analyzes encrypted records across partner hospitals to surface early disease detection insights." />;
      case "emergency": return <PlaceholderPage title="Emergency Protocol" icon="emergency" desc="Configure critical data tags (blood type, allergies, emergency contacts) that are instantly accessible to first responders via Hedera HCS." />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        active={active} setActive={setActive}
        collapsed={collapsed} setCollapsed={setCollapsed}
        onGoHome={onGoHome}
        isMobile={isMobile} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1, minWidth: 0,
        transition: "margin-left 0.32s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Top bar */}
        <header style={{
          height: 64, padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${THEME.border}`,
          background: THEME.ink, position: "sticky", top: 0, zIndex: 90,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button onClick={() => setMobileOpen(true)} style={{
                background: "none", border: "none", color: THEME.textMuted,
                display: "flex", padding: 4,
              }}>
                <Icon name="menu" size={22} />
              </button>
            )}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600 }}>
              {NAV_ITEMS.find(n => n.id === active)?.label || "Dashboard"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <WalletButton wallet={wallet} onOpen={onOpenWallet} onDisconnect={onDisconnectWallet} compact />
            <div style={{ position: "relative" }}>
              <Icon name="notification" size={20} color={THEME.textMuted} />
              <span style={{
                position: "absolute", top: -3, right: -3, width: 8, height: 8,
                borderRadius: "50%", background: THEME.terra,
              }} />
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${THEME.terra}, ${THEME.gold})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600,
            }}>AO</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1, padding: "32px 28px",
          maxWidth: 1200, width: "100%",
        }}>
          {/* Wallet connection banner */}
          {!wallet && (
            <div style={{
              padding: "14px 20px", borderRadius: 10, marginBottom: 24,
              background: `${THEME.terra}12`, border: `1px solid ${THEME.terra}40`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="lock" size={16} color={THEME.terra}/>
                <span style={{ fontSize: 13, color: THEME.textPrimary }}>
                  Connect your HashPack wallet to sign transactions and access your full health vault.
                </span>
              </div>
              <button onClick={onOpenWallet} style={{
                padding: "8px 18px", borderRadius: 6,
                background: `linear-gradient(135deg, ${THEME.mint}, ${THEME.mintDark})`,
                border: "none", color: THEME.forest, fontWeight: 600, fontSize: 13,
                whiteSpace: "nowrap",
              }}>Connect Now</button>
            </div>
          )}
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// ============================================================
// APP ROUTER
// ============================================================
export default function App() {
  const [route, setRoute] = useState("landing"); // landing | dashboard | 404
  const [wallet, setWallet] = useState(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleConnected = (account) => {
    setWallet(account);
  };

  const handleDisconnect = () => setWallet(null);

  const sharedWalletProps = {
    wallet,
    onOpenWallet: () => setWalletModalOpen(true),
    onDisconnectWallet: handleDisconnect,
  };

  return (
    <>
      {walletModalOpen && (
        <WalletModal
          onClose={() => setWalletModalOpen(false)}
          onConnected={handleConnected}
        />
      )}
      {route === "landing" && (
        <LandingPage onEnter={() => setRoute("dashboard")} {...sharedWalletProps} />
      )}
      {route === "dashboard" && (
        <Dashboard onGoHome={() => setRoute("landing")} {...sharedWalletProps} />
      )}
      {route === "404" && (
        <NotFoundPage onGoHome={() => setRoute("landing")} onGoDashboard={() => setRoute("dashboard")} />
      )}
    </>
  );
}
