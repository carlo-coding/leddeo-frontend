import { useEffect, useState } from "react";

interface CountdownTimerProps {
  date: string;
}

function CountdownTimer({ date }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(date);

  const calculateTimeLeft = (endDate: string) => {
    const totalSeconds =
      (new Date(endDate).getTime() - new Date().getTime()) / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;
  };

  const removeOneSecond = (endDate: string) => {
    let date = new Date(endDate);
    date.setTime(date.getTime() - 100);
    return date.toISOString();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((time) => removeOneSecond(time));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{calculateTimeLeft(timeLeft)}</span>;
}
export default CountdownTimer;
