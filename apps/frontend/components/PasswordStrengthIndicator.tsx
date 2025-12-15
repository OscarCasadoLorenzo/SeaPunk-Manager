"use client";

import {
  PASSWORD_REQUIREMENTS,
  PasswordStrengthResult,
  getStrengthBarColor,
  getStrengthLabelColor,
  getRequirementsHeadingColor,
  getCheckmarkColor,
  getRequirementLabelColor,
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
          className={`text-xs font-medium ${getStrengthLabelColor(strength.score)}`}
        >
          {strength.label}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthBarColor(strength.score)}`}
          style={{
            width: `${(strength.score / 5) * 100}%`,
          }}
        />
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="mt-3 space-y-1">
          <p
            className={`text-xs font-medium mb-2 ${getRequirementsHeadingColor(strength.score)}`}
          >
            Requirements:
          </p>
          {PASSWORD_REQUIREMENTS.map(({ key, label }) => {
            const isMet =
              strength.requirements[key as keyof typeof strength.requirements];

            return (
              <div key={key} className="flex items-center text-xs">
                <span
                  className={`mr-2 font-semibold ${getCheckmarkColor(strength.score, isMet)}`}
                >
                  {isMet ? "✓" : "○"}
                </span>
                <span
                  className={`transition-colors ${getRequirementLabelColor(strength.score, isMet)}`}
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
