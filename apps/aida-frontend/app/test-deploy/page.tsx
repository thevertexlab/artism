export default function TestDeploy() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Deployment Test Success!</h1>
      <p>If you can see this page, the deployment is working.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
} 