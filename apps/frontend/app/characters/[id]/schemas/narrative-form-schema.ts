import { z } from 'zod';

// Narrative form validation schema
export const narrativeFormSchema = z.object({
  physicalDescription: z.string().optional(),
  externalProfile: z.string().optional(),
  internalProfile: z.string().optional(),
  background: z.string().optional(),
  specialties: z.string().optional(),
});

export type NarrativeFormData = z.infer<typeof narrativeFormSchema>;
