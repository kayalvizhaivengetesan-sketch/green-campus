import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getFlora, getFauna, addQRCode } from '../../utils/storage';
import QRCode from 'react-qr-code';
import { Download, QrCode as QrIcon, CheckCircle, AlertCircle } from 'lucide-react';
import './Admin.css';

const QRCodeManagement = () => {
  const [floraList, setFloraList] = useState([]);
  const [faunaList, setFaunaList] = useState([]);
  
  const [selectedType, setSelectedType] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState('');
  
  const [qrData, setQrData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const qrRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const flora = await getFlora();
      const fauna = await getFauna();
      setFloraList(flora);
      setFaunaList(fauna);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Reset selection and qr when type changes
    setSelectedRecordId('');
    setQrData(null);
    setMessage({ type: '', text: '' });
  }, [selectedType]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleGenerateQR = (e) => {
    e.preventDefault();
    if (!selectedType) {
      showMessage('error', 'Please select a category.');
      return;
    }
    if (!selectedRecordId) {
      showMessage('error', 'Please select a record.');
      return;
    }

    const list = selectedType === 'Flora' ? floraList : faunaList;
    const record = list.find(item => item.id === selectedRecordId || String(item.id) === String(selectedRecordId));
    
    if (!record) return;

    // Use full URL for the QR code value
    const baseUrl = window.location.origin;
    const routeUrl = `/${selectedType.toLowerCase()}/${selectedRecordId}`;
    const targetUrl = `${baseUrl}${routeUrl}`;
    
    const newQrData = {
      recordType: selectedType,
      recordId: selectedRecordId,
      recordName: record.commonName,
      scientificName: record.scientificName,
      qrCodeURL: targetUrl,
      routeUrl: routeUrl,
      status: 'Active'
    };
    
    setQrData(newQrData);

    // Save to database
    const storageRecord = {
      recordType: newQrData.recordType,
      recordId: newQrData.recordId,
      qrUrl: targetUrl,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };
    addQRCode(storageRecord);
    
    showMessage('success', 'QR Code generated successfully!');
  };

  const handleDownload = () => {
    if (!qrData || !qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      const safeName = qrData.recordName.replace(/\s+/g, '_');
      downloadLink.download = `${safeName}_QR_Code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      showMessage('success', 'QR Code downloaded successfully!');
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const currentList = selectedType === 'Flora' ? floraList : (selectedType === 'Fauna' ? faunaList : []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="admin-page-title">QR Code Management</h1>
        
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} style={{
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#34d399' : '#f87171'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}
        
        <div className="grid-2">
          {/* Generator Form */}
          <div className="card admin-panel-card">
            <h2 className="mb-4">Generate QR Code</h2>
            <form onSubmit={handleGenerateQR}>
              <div className="form-group">
                <label className="form-label">Select Category</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="Flora" 
                      checked={selectedType === 'Flora'}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    Flora
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="Fauna" 
                      checked={selectedType === 'Fauna'}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    Fauna
                  </label>
                </div>
              </div>
              
              <div className="form-group mt-3">
                <label className="form-label">Select Record</label>
                <select 
                  className="form-control" 
                  value={selectedRecordId}
                  onChange={(e) => setSelectedRecordId(e.target.value)}
                >
                  <option value="">{selectedType ? `-- Select ${selectedType} --` : '-- Select Category First --'}</option>
                  {currentList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.commonName} ({item.scientificName})
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100 mt-4"
              >
                <QrIcon size={18} /> Generate QR Code
              </button>
            </form>
          </div>
          
          {/* QR Code Display */}
          <div className="card admin-panel-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '350px' }}>
            <h2 className="mb-4">QR Code Preview</h2>
            {qrData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  ref={qrRef} 
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    display: 'inline-block'
                  }}
                >
                  <QRCode 
                    value={qrData.qrCodeURL} 
                    size={200}
                    level="H"
                  />
                </div>
                
                <div className="mt-4 w-100" style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%' }}>
                  <h4 style={{ marginBottom: '0.75rem', color: '#111827', fontSize: '1rem' }}>Record Details:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Category:</span>
                    <span>{qrData.recordType}</span>
                    
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Record Name:</span>
                    <span>{qrData.recordName}</span>
                    
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Scientific Name:</span>
                    <span style={{ fontStyle: 'italic' }}>{qrData.scientificName}</span>
                    
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>QR Code URL:</span>
                    <span style={{ wordBreak: 'break-all' }}>{qrData.routeUrl}</span>
                    
                    <span style={{ fontWeight: '600', color: '#4b5563' }}>Status:</span>
                    <span style={{ color: '#059669', fontWeight: '600' }}>{qrData.status}</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary mt-4"
                  onClick={handleDownload}
                  style={{ width: '100%' }}
                >
                  <Download size={18} /> Download QR Code
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#9ca3af' }}>
                <QrIcon size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>Select a record and click generate to view QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeManagement;

