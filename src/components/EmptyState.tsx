import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "nothing here yet",
  message = "couldn't fetch results right now. try again in a bit.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="panel p-8 max-w-xl mx-auto text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <Image
          src="/music-note.svg"
          alt=""
          width={72}
          height={72}
          className="opacity-60"
        />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-dark-300 mb-6">{message}</p>
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="px-5 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-400 transition-colors"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
