import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner({ className }: { className?: string }) {
  return <FaSpinner className={`animate-spin w-4 h-4 ${className}`} />;
}
