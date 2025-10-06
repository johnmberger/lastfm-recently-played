import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No data available",
  message = "We couldn't fetch any results right now. Please try again later.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="glass-card p-8 max-w-xl mx-auto text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <Image
          src="/music-note.svg"
          alt="Empty"
          width={72}
          height={72}
          className="opacity-60"
        />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-dark-300 mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
