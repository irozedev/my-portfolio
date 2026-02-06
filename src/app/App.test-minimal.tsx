// MINIMAL TEST VERSION - DO NOT USE IN PRODUCTION
// This is to test if Figma Make can build the project

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#00d9ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '48px', margin: 0 }}>✅ BUILD SUCCESSFUL</h1>
      <p style={{ fontSize: '24px', margin: 0 }}>roze.live v2.1.0</p>
      <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
        If you see this - Figma Make build is working!
      </p>
      <div style={{ marginTop: '40px', padding: '20px', background: '#111', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>Domain: {window.location.hostname}</p>
        <p style={{ margin: 0, fontSize: '14px' }}>Time: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
