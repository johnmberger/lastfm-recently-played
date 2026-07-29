import { useEffect, useId, useState } from "react";

interface EarwormLogoProps {
  className?: string;
  /** When true, plays the sound-wave undulation */
  crawling?: boolean;
  /** Stop animating after this many ms (home page intro) */
  stopAfterMs?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-14 aspect-[140/72]",
  md: "w-28 aspect-[140/72]",
  lg: "w-36 aspect-[140/72]",
};

const SEGMENTS = 12;
const START_X = 12;
const SPACING = 8;
const BASE_Y = 36;
const AMP = 11;
const WAVE_DUR = "1.6s";
const FRAMES = 24;

/** Tail smaller → mid plump → neck into head */
function segmentRadius(i: number) {
  const t = i / (SEGMENTS - 1);
  // ease toward a thicker midsection
  const mid = 1 - Math.abs(t - 0.55) * 1.1;
  return 6.2 + mid * 3.4;
}

function waveOffset(segmentIndex: number, frame: number) {
  const phase =
    (segmentIndex / (SEGMENTS - 1)) * Math.PI * 2 +
    (frame / FRAMES) * Math.PI * 2;
  return AMP * Math.sin(phase);
}

function cyValues(segmentIndex: number) {
  const values = Array.from({ length: FRAMES }, (_, f) =>
    (BASE_Y + waveOffset(segmentIndex, f)).toFixed(1)
  );
  values.push(values[0]);
  return values.join(";");
}

function translateValues(segmentIndex: number) {
  const values = Array.from({ length: FRAMES }, (_, f) =>
    `0 ${waveOffset(segmentIndex, f).toFixed(1)}`
  );
  values.push(values[0]);
  return values.join(";");
}

/** Smooth underlay path through segment centers for a given frame */
function bodyPath(frame: number) {
  const pts = Array.from({ length: SEGMENTS }, (_, i) => ({
    x: START_X + i * SPACING,
    y: BASE_Y + waveOffset(i, frame),
  }));

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = ((prev.x + curr.x) / 2).toFixed(1);
    d += ` Q ${cpx} ${prev.y.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return d;
}

function bodyPathValues() {
  const values = Array.from({ length: FRAMES }, (_, f) => bodyPath(f));
  values.push(values[0]);
  return values.join(";");
}

/**
 * Continuous worm body: thick gradient underlay + overlapping
 * tapered segments, all locked to the same sine phase.
 */
export default function EarwormLogo({
  className = "",
  crawling = true,
  stopAfterMs,
  size = "md",
}: EarwormLogoProps) {
  const uid = useId().replace(/:/g, "");
  const [isWaving, setIsWaving] = useState(crawling || Boolean(stopAfterMs));

  useEffect(() => {
    if (!stopAfterMs) {
      setIsWaving(crawling);
      return;
    }

    setIsWaving(true);
    const timer = setTimeout(() => setIsWaving(false), stopAfterMs);
    return () => clearTimeout(timer);
  }, [crawling, stopAfterMs]);

  const headGrad = `headFill-${uid}`;
  const headIndex = SEGMENTS - 1;
  const headX = START_X + headIndex * SPACING + 5;
  const restHeadY = waveOffset(headIndex, 0);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 140 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={headGrad} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* continuous underlay — fills gaps so segments read as one body */}
        <path
          d={bodyPath(0)}
          stroke={`url(#${headGrad})`}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {isWaving && (
            <animate
              attributeName="d"
              values={bodyPathValues()}
              dur={WAVE_DUR}
              repeatCount="indefinite"
              calcMode="linear"
            />
          )}
        </path>

        {/* overlapping tapered segments on top for soft “rings” */}
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const cx = START_X + i * SPACING;
          const restY = BASE_Y + waveOffset(i, 0);
          return (
            <circle
              key={i}
              cx={cx}
              cy={restY}
              r={segmentRadius(i)}
              fill={`url(#${headGrad})`}
            >
              {isWaving && (
                <animate
                  attributeName="cy"
                  values={cyValues(i)}
                  dur={WAVE_DUR}
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              )}
            </circle>
          );
        })}

        {/* head shares last segment phase */}
        <g
          transform={
            isWaving ? undefined : `translate(0 ${restHeadY.toFixed(1)})`
          }
        >
          {isWaving && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={translateValues(headIndex)}
              dur={WAVE_DUR}
              repeatCount="indefinite"
              calcMode="linear"
            />
          )}

          <circle cx={headX} cy={BASE_Y} r="11" fill={`url(#${headGrad})`} />

          <circle cx={headX + 4} cy={BASE_Y - 3} r="2.8" fill="#0f172a" />
          <circle cx={headX - 3} cy={BASE_Y - 4} r="2.8" fill="#0f172a" />
          <circle cx={headX + 4.8} cy={BASE_Y - 4} r="1" fill="white" />
          <circle cx={headX - 2.2} cy={BASE_Y - 5} r="1" fill="white" />

          <path
            d={`M${headX - 4} ${BASE_Y + 4}c2.2 2 6.5 2 8.8 0`}
            stroke="#0f172a"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d={`M${headX - 11} ${BASE_Y - 6}c0-7 5.5-11.5 11-11.5S${headX + 11} ${BASE_Y - 13} ${headX + 11} ${BASE_Y - 6}`}
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            x={headX - 13.5}
            y={BASE_Y - 8}
            width="4.5"
            height="7"
            rx="1.8"
            fill="#ffffff"
          />
          <rect
            x={headX + 9}
            y={BASE_Y - 8}
            width="4.5"
            height="7"
            rx="1.8"
            fill="#ffffff"
          />
        </g>
      </svg>
    </div>
  );
}
