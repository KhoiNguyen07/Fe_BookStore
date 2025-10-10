import { useState, useEffect } from "react";

export default function CountdownTimer({
  durationMs = 10 * 60 * 1000,
  onExpire
}) {
  const [timeLeft, setTimeLeft] = useState(durationMs);

  useEffect(() => {
    // Kiểm tra trong localStorage có endTime chưa
    let endTime = localStorage.getItem("countdownEndTime");

    if (!endTime) {
      endTime = Date.now() + durationMs;
      localStorage.setItem("countdownEndTime", endTime);
    }

    const updateTimer = () => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        localStorage.removeItem("countdownEndTime"); // clear sau khi hết hạn
        if (onExpire) onExpire();
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [durationMs, onExpire]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const progressPercent = (timeLeft / durationMs) * 100;

  let barColor = "bg-green-500";
  if (progressPercent < 50) barColor = "bg-yellow-400";
  if (progressPercent < 20) barColor = "bg-red-500";

  return (
    <div className="w-full mx-auto text-center">
      <div className="text-black font-bold text-4xl mb-3">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-3 ${barColor} transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
