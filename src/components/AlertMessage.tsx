'use client';

interface AlertMessageProps {
  isVisible: boolean;
}

export default function AlertMessage({ isVisible }: AlertMessageProps) {
  if (!isVisible) return null;

  return (
    <div className="
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      bg-red-500/95 text-white
      px-12 py-6 rounded-2xl
      text-2xl font-bold text-center
      z-[1000]
      animate-pulse
    ">
      POSTURE ALERT!<br />
      Sit up straight!
    </div>
  );
}