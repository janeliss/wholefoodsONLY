import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import './Scanner.css';

interface ScannerCardProps {
  onScan: (barcode: string) => void;
}

export default function ScannerCard({ onScan }: ScannerCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader
      .decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current!,
        (result, err) => {
          if (result) {
            reader.reset();
            onScan(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            // Ignore not-found frames, they're normal during scanning
          }
        },
      )
      .catch((err: Error) => {
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera permissions or enter a barcode manually.'
            : 'Could not access camera. Try entering a barcode manually.',
        );
      });

    return () => {
      reader.reset();
    };
  }, [onScan]);

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const code = manualCode.trim();
      if (code) {
        readerRef.current?.reset();
        onScan(code);
      }
    },
    [manualCode, onScan],
  );

  return (
    <div className="scanner-card">
      <div className="scanner-hero">
        <div className="scanner-hero-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 012-2h2" />
            <path d="M17 3h2a2 2 0 012 2v2" />
            <path d="M21 17v2a2 2 0 01-2 2h-2" />
            <path d="M7 21H5a2 2 0 01-2-2v-2" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
        </div>
        <h2>Scan a product</h2>
        <p>Point your camera at any barcode</p>
      </div>

      <div className="scanner">
        {!cameraError ? (
          <div className="scanner-viewport">
            <video ref={videoRef} className="scanner-video" />
            <div className="scanner-overlay">
              <div className="scanner-frame" />
            </div>
            <p className="scanner-hint">Point at a barcode</p>
          </div>
        ) : (
          <div className="camera-error">
            <p>{cameraError}</p>
          </div>
        )}

        <div className="scanner-divider">
          <span>or enter barcode manually</span>
        </div>

        <form className="manual-entry" onSubmit={handleManualSubmit}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 0049000006346"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="manual-input"
          />
          <button type="submit" className="btn" disabled={!manualCode.trim()}>
            Look Up
          </button>
        </form>
      </div>
    </div>
  );
}
