"use client";

import {
  PASSWORD_REQUIREMENTS,
  PasswordStrengthResult,
} from "@/lib/password-utils";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrengthResult;
  showRequirements?: boolean;
}

/**
 * Reusable password strength indicator component
 * Displays strength bar and requirements checklist
 */
export function PasswordStrengthIndicator({
  strength,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-2">
      {/* Strength Bar with Color-Coded Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">
          Password Strength:
        </span>
        <span
          className={`text-xs font-medium ${
            strength.score === 0
              ? "text-gray-500"
              : strength.score === 1
                ? "text-red-600"
                : strength.score === 2
                  ? "text-red-500"
                  : strength.score === 3
                    ? "text-orange-500"
                    : strength.score === 4
                      ? "text-yellow-500"
                      : "text-green-500"
          }`}
        >
          {strength.label}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          style={{
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor:
              strength.score === 0
                ? "#d1d5db"
                : strength.score === 1
                  ? "#dc2626"
                  : strength.score === 2
                    ? "#ef4444"
                    : strength.score === 3
                      ? "#f97316"
                      : strength.score === 4
                        ? "#eab308"
                        : "#22c55e",
          }}
          className="h-full transition-all duration-300"
        />
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="mt-3 space-y-1">
          <p
            className={`text-xs font-medium mb-2 ${
              strength.score === 0
                ? "text-gray-600"
                : strength.score === 1
                  ? "text-red-600"
                  : strength.score === 2
                    ? "text-red-600"
                    : strength.score === 3
                      ? "text-orange-600"
                      : strength.score === 4
                        ? "text-yellow-600"
                        : "text-green-600"
            }`}
          >
            Requirements:
          </p>
          {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
            const isMet =
              strength.requirements[key as keyof typeof strength.requirements];

            return (
              <div key={key} className="flex items-center text-xs">
                <span
                  className={`mr-2 font-semibold ${
                    isMet
                      ? strength.score === 5
                        ? "text-green-600"
                        : strength.score === 4
                          ? "text-yellow-600"
                          : strength.score === 3
                            ? "text-orange-600"
                            : "text-amber-600"
                      : "text-gray-300"
                  }`}
                >
                  {isMet ? "✓" : "○"}
                </span>
                <span
                  className={`transition-colors ${
                    isMet
                      ? strength.score === 5
                        ? "text-green-700 font-medium"
                        : strength.score === 4
                          ? "text-yellow-700 font-medium"
                          : strength.score === 3
                            ? "text-orange-700 font-medium"
                            : "text-amber-700 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
