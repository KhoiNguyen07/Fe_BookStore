import React, { useEffect, useState } from "react";
import { useLanguage } from "~/contexts/LanguageProvider";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) {
      setIsFinished(true);
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const { t } = useLanguage();

  if (!targetDate) return <p className="">{t("common.countdown.checkBack")}</p>;

  return (
    <div className="w-full">
      {isFinished ? (
        <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 border border-red-200">
          <div className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
              ⏰
            </div>
            <div>
              <p className="text-red-600 text-xl md:text-2xl font-bold">
                {t("common.countdown.dealExpired")}
              </p>
              <p className="text-red-500 text-sm">
                {t("common.countdown.checkBack")}
              </p>
            </div>
          </div>
        </div>
      ) : timeLeft ? (
        <div className="w-full">
          {/* Timer header */}
          <div className="text-center mb-4">
            <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
              ⚡ {t("common.countdown.limitedOffer")}
            </h4>
            <p className="text-sm text-gray-600">
              {t("common.countdown.dontMiss")}
            </p>
          </div>

          {/* Countdown display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-white">
                <div className="text-2xl md:text-3xl font-bold leading-tight">
                  {timeLeft.days}
                </div>
                <div className="text-xs md:text-sm opacity-90 font-medium">
                  {t("common.countdown.days")}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-white">
                <div className="text-2xl md:text-3xl font-bold leading-tight">
                  {timeLeft.hours}
                </div>
                <div className="text-xs md:text-sm opacity-90 font-medium">
                  {t("common.countdown.hours")}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-white">
                <div className="text-2xl md:text-3xl font-bold leading-tight">
                  {timeLeft.minutes}
                </div>
                <div className="text-xs md:text-sm opacity-90 font-medium">
                  {t("common.countdown.minutes")}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl md:rounded-2xl p-3 md:p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-white">
                <div className="text-2xl md:text-3xl font-bold leading-tight">
                  {timeLeft.seconds}
                </div>
                <div className="text-xs md:text-sm opacity-90 font-medium">
                  {t("common.countdown.seconds")}
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/50 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {t("common.countdown.hurry")}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 rounded-2xl bg-gray-100">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
