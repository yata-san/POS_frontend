"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stream;
    let controls;
    let isMounted = true;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          controls = codeReader.decodeFromVideoDevice(
            null,
            videoRef.current,
            (result, err) => {
              if (result && !scanned && isMounted) {
                setScanned(true);
                const code = result.getText();
                // JANコード（13桁）かチェック
                if (/^\d{13}$/.test(code)) {
                  stream.getTracks().forEach(track => track.stop());
                  if (controls && controls.stop) controls.stop();
                  router.push(`/product?code=${code}`);
                } else {
                  // 13桁以外は無視
                  setScanned(false);
                }
              }
            }
          );
        }
      } catch (err) {
        alert("カメラの起動に失敗しました: " + err.message);
      }
    };
    start();

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (controls && controls.stop) controls.stop();
    };
  }, [router, scanned]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      {/* タイトル枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-4 flex flex-col items-center mb-4 mt-8">
        <h1 className="text-[20px] font-bold text-black text-center">POP-UP STORE レジアプリ</h1>
      </div>
      {/* バーコードスキャナー枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-6 flex flex-col items-center mb-4">
        <span className="text-base font-semibold text-black mb-2">バーコードスキャナー</span>
        <div className="w-[291px] h-[159px] bg-[#828282] rounded-lg border-2 border-[#F5F5F5] flex items-center justify-center mb-4 overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <span className="text-xs text-black mb-4">カメラでバーコードをスキャンしてください</span>
        <button
          className="w-[290px] h-[38px] flex items-center justify-center bg-[#F3E89A] rounded shadow border border-[#747474] text-base font-bold text-black hover:bg-yellow-200 transition mt-2"
          onClick={() => router.push("/")}
        >
          閉じる
        </button>
      </div>
    </div>
  );
} 