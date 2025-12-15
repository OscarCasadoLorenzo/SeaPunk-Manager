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

/**
 * Color palette for password strength scores
 * Ensures consistent colors across all components
 */
const STRENGTH_COLORS = {
  bar: {
    0: "bg-gray-300",
    1: "bg-red-600",
    2: "bg-red-500",
    3: "bg-orange-500",
    4: "bg-yellow-500",
    5: "bg-green-500",
  },
  label: {
    0: "text-gray-500",
    1: "text-red-600",
    2: "text-red-500",
    3: "text-orange-500",
    4: "text-yellow-500",
    5: "text-green-500",
  },
  checkmark: {
    0: "text-gray-300",
    1: "text-amber-600",
    2: "text-amber-600",
    3: "text-orange-600",
    4: "text-yellow-600",
    5: "text-green-600",
  },
  heading: {
    0: "text-gray-600",
    1: "text-red-600",
    2: "text-red-600",
    3: "text-orange-600",
    4: "text-yellow-600",
    5: "text-green-600",
  },
  requirementLabel: {
    0: "text-gray-400",
    1: "text-amber-700 font-medium",
    2: "text-amber-700 font-medium",
    3: "text-orange-700 font-medium",
    4: "text-yellow-700 font-medium",
    5: "text-green-700 font-medium",
  },
} as const;

/**
 * Get Tailwind class for progress bar background color
 */
export function getStrengthBarColor(score: number): string {
  return STRENGTH_COLORS.bar[
    Math.min(score, 5) as keyof typeof STRENGTH_COLORS.bar
  ];
}

/**
 * Get Tailwind class for strength label text color
 */
export function getStrengthLabelColor(score: number): string {
  return STRENGTH_COLORS.label[
    Math.min(score, 5) as keyof typeof STRENGTH_COLORS.label
  ];
}

/**
 * Get Tailwind class for requirements heading color
 */
export function getRequirementsHeadingColor(score: number): string {
  return STRENGTH_COLORS.heading[
    Math.min(score, 5) as keyof typeof STRENGTH_COLORS.heading
  ];
}

/**
 * Get Tailwind class for checkmark icon color
 */
export function getCheckmarkColor(score: number, isMet: boolean): string {
  if (!isMet) return STRENGTH_COLORS.checkmark[0];
  return STRENGTH_COLORS.checkmark[
    Math.min(score, 5) as keyof typeof STRENGTH_COLORS.checkmark
  ];
}

/**
 * Get Tailwind class for requirement label text color
 */
export function getRequirementLabelColor(
  score: number,
  isMet: boolean,
): string {
  if (!isMet) return STRENGTH_COLORS.requirementLabel[0];
  return STRENGTH_COLORS.requirementLabel[
    Math.min(score, 5) as keyof typeof STRENGTH_COLORS.requirementLabel
  ];
}
