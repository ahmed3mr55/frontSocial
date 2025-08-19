"use client";
import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Alert from "@/app/Components/Alert";
import Spinner from "@/app/Components/Spinner";

export default function QRCodeScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);
  const lastScannedRef = useRef(null);

  const startScanner = () => {
    setError(null);
    const config = { fps: 10, qrbox: 250 };
    html5QrcodeScannerRef.current = new Html5Qrcode(scannerRef.current.id);
    html5QrcodeScannerRef.current
      .start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
      .catch((err) => setError(err.message));
  };

  const onScanSuccess = async (decodedText) =>{
    if (lastScannedRef.current === decodedText) {
      return;
    }

    lastScannedRef.current = decodedText;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/qrcode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ qrcodeToken: decodedText }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login via QR failed");

      // Stop scanner after success
      await html5QrcodeScannerRef.current.stop();
      setIsOpen(false);
      location.href = "/";
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        lastScannedRef.current = null;
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const onScanFailure = (errorMessage) => {
    // تجاهل الأخطاء المتكررة
    console.warn("QR scan failed:", errorMessage);
  };

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.stop().catch(() => {});
    }
  }, [isOpen]);

  return (
    <>
      <button
        className="mt-4 px-4 py-2 w-full z-50 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        onClick={() => setIsOpen(true)}
      >
        Login via QR Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <div className="flex flex-col items-center overflow-hidden">
              <h3 className="text-lg font-semibold mb-4">Scan QR to Login</h3>
              {loading && <Spinner />}
              {error && <Alert type="error" message={error} />}
              <div
                id="qr-scanner"
                ref={scannerRef}
                className="w-full rounded-lg overflow-hidden"
              />
              <button
                className="mt-4 px-4 py-2 w-full z-50 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
