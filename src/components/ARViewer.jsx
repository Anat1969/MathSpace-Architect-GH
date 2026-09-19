import { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

export default function ARViewer({ mobiusEnabled, fibonacciEnabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const animRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        setError('לא ניתן לגשת למצלמה. אנא אשר גישה למצלמה.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    if (!cameraActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      time += 0.02;

      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (mobiusEnabled) {
        drawMobiusStrip(ctx, canvas.width, canvas.height, time);
      }

      if (fibonacciEnabled) {
        drawFibonacciGrid(ctx, canvas.width, canvas.height, time);
      }
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [cameraActive, mobiusEnabled, fibonacciEnabled]);

  return (
    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-border/30 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground text-center px-4">{error}</p>
        </div>
      )}
      {!cameraActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        </div>
      )}
      <div className="absolute top-3 left-3 flex gap-2">
        {mobiusEnabled && (
          <span className="text-xs bg-purple-500/80 text-white px-2 py-1 rounded-full font-space">
            Möbius
          </span>
        )}
        {fibonacciEnabled && (
          <span className="text-xs bg-amber-500/80 text-white px-2 py-1 rounded-full font-space">
            Fibonacci
          </span>
        )}
      </div>
    </div>
  );
}

function drawMobiusStrip(ctx, w, h, time) {
  const cx = w / 2;
  const cy = h / 2;
  const size = Math.min(w, h) * 0.3;

  ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2;
    const halfT = t / 2 + time;

    const r = size * (1 + 0.3 * Math.cos(halfT));
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t) * 0.4;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Second edge of the strip
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
  ctx.beginPath();
  for (let i = 0; i <= 200; i++) {
    const t = (i / 200) * Math.PI * 2;
    const halfT = t / 2 + time + Math.PI;

    const r = size * (1 + 0.3 * Math.cos(halfT));
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t) * 0.4 + 15;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Connecting lines
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const halfT1 = t / 2 + time;
    const halfT2 = t / 2 + time + Math.PI;
    const r1 = size * (1 + 0.3 * Math.cos(halfT1));
    const r2 = size * (1 + 0.3 * Math.cos(halfT2));

    ctx.beginPath();
    ctx.moveTo(cx + r1 * Math.cos(t), cy + r1 * Math.sin(t) * 0.4);
    ctx.lineTo(cx + r2 * Math.cos(t), cy + r2 * Math.sin(t) * 0.4 + 15);
    ctx.stroke();
  }
}

function drawFibonacciGrid(ctx, w, h, time) {
  const cx = w / 2;
  const cy = h / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 1;

  // Fibonacci spiral
  ctx.beginPath();
  for (let i = 0; i < 300; i++) {
    const angle = i * goldenAngle + time * 0.5;
    const r = Math.sqrt(i) * 8;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fibonacci dots
  ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
  for (let i = 0; i < 80; i++) {
    const angle = i * goldenAngle + time * 0.5;
    const r = Math.sqrt(i) * 8;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grid squares (golden rectangles)
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
  const fib = [1, 1, 2, 3, 5, 8, 13, 21];
  let gx = cx - 50;
  let gy = cy - 50;
  const scale = 6;

  for (let i = 0; i < fib.length - 1; i++) {
    const s = fib[i] * scale;
    ctx.strokeRect(gx, gy, s, s);
    if (i % 4 === 0) gx += s;
    else if (i % 4 === 1) gy += s;
    else if (i % 4 === 2) gx -= fib[i + 1] * scale;
    else gy -= fib[i + 1] * scale;
  }
}