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
      {/* Strength Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">
          Password Strength:
        </span>
        <span className="text-xs font-medium text-gray-700">
          {strength.label}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{
            width: `${(strength.score / 5) * 100}%`,
          }}
        />
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Requirements:
          </p>
          {PASSWORD_REQUIREMENTS.map(({ key, label }) => (
            <div key={key} className="flex items-center text-xs">
              <span
                className={`mr-2 ${
                  strength.requirements[
                    key as keyof typeof strength.requirements
                  ]
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {strength.requirements[
                  key as keyof typeof strength.requirements
                ]
                  ? "✓"
                  : "○"}
              </span>
              <span
                className={
                  strength.requirements[
                    key as keyof typeof strength.requirements
                  ]
                    ? "text-gray-700"
                    : "text-gray-500"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
