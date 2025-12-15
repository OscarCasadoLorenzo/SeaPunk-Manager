/**
 * Password strength validation and calculation utilities
 * Follows backend validation rules from AdminChangePasswordDto
 */

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordStrengthResult {
  score: number;
  label: string;
  color: string;
  requirements: PasswordRequirements;
  isValid: boolean;
}

/**
 * Calculate password strength based on requirements
 * Backend requires: 8+ chars, uppercase, lowercase, number, special char
 */
export function calculatePasswordStrength(
  password: string,
): PasswordStrengthResult {
  const requirements: PasswordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&#^()_+=\-[\]{}|;:'",.<>/\\`~]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const isValid = Object.values(requirements).every(Boolean);

  let label = "Very Weak";
  let color = "bg-red-500";

  if (score === 5) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score === 4) {
    label = "Good";
    color = "bg-yellow-500";
  } else if (score === 3) {
    label = "Fair";
    color = "bg-orange-500";
  } else if (score >= 1) {
    label = "Weak";
    color = "bg-red-400";
  }

  return { score, label, color, requirements, isValid };
}

/**
 * Password requirements display configuration
 * Used in UI components to show validation status
 */
export const PASSWORD_REQUIREMENTS = [
  {
    key: "minLength",
    label: "At least 8 characters",
  },
  {
    key: "hasUppercase",
    label: "One uppercase letter",
  },
  {
    key: "hasLowercase",
    label: "One lowercase letter",
  },
  {
    key: "hasNumber",
    label: "One number",
  },
  {
    key: "hasSpecial",
    label: "One special character",
  },
] as const;
