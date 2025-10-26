# Hook Refactoring Progress

## ✅ Completed

- [x] useAttributes.ts - Fully refactored to use useApiQuery/useApiMutation
- [x] useAuraGifts.ts - Fully refactored to use useApiQuery/useApiMutation
- [x] useCharacters.ts - Fully refactored to use useApiQuery/useApiMutation
- [x] useCombatStats.ts - Fully refactored to use useApiQuery/useApiMutation

## 🔄 Pending Refactor

- [ ] useCharacterData.ts
- [x] useCharacterHealth.ts - ✅ Completed
- [x] useCharacterRelations.ts - ✅ Completed
- [x] useDomains.ts - ✅ Completed
- [x] useEffects.ts - ✅ Completed
- [x] useEssences.ts - ✅ Completed
- [x] useInventories.ts - ✅ Completed
- [x] useNarratives.ts - ✅ Completed
- [x] usePlayers.ts - ✅ Completed
- [x] useUsers.ts - ✅ Completed

## Verification Steps

For each file:

1. Replace service calls with useApiQuery/useApiMutation
2. Update query keys to match API endpoint pattern
3. Verify cache invalidation patterns
4. Test functionality in the application
5. Check for TypeScript errors
6. Verify proper error handling

## Notes

- All mutations should use proper cache invalidation
- Query keys should follow consistent pattern
- Types should be properly imported and used
- Error handling should be consistent across all hooks
