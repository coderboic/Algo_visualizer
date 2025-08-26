const TestPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#3b82f6' }}>Algorithm Visualizer - Debug Test</h1>
      <p>This is a test page to verify React is working correctly.</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('React is working!')}
        >
          Test Button
        </button>
      </div>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>If you can see this page and the button works, React is rendering correctly.</p>
        <p>Backend should be running on: <a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>
      </div>
    </div>
  );
};

export default TestPage;
