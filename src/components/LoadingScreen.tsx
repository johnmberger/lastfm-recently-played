import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center z-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Main Loading Spinner */}
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 animate-pulse-ring"></div>
            {/* Inner pulsing ring */}
            <div
              className="absolute inset-2 rounded-full border-4 border-accent-500/50 animate-pulse-ring"
              style={{ animationDelay: "0.5s" }}
            ></div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white animate-fade-in">
            What Is John Listening To?
          </h1>
          <p
            className="text-dark-300 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Loading your music stalking experience...
          </p>
          <div
            className="flex items-center justify-center gap-2 mt-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
