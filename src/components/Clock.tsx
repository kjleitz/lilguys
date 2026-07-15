import { useEffect, useState } from "react";

/** A live ticking clock, in the classic "07:53:17 pm LST" style. */
function formatTime(date: Date): string {
  let hours = date.getHours();
  const suffix = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${suffix} LST`;
}

export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="clock">{formatTime(now)}</div>;
}
