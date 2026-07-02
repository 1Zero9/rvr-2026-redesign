import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePricing, validateAndClassifyMembers } from '../lib/membership/pricing';

test('membership pricing applies the parent and two-child bundle', () => {
  const validated = validateAndClassifyMembers([
    { firstName: 'Parent', lastName: 'One', dateOfBirth: '1985-01-01', role: 'parent' },
    { firstName: 'Child', lastName: 'One', dateOfBirth: '2012-01-01' },
    { firstName: 'Child', lastName: 'Two', dateOfBirth: '2014-01-01' },
  ]);

  assert.ok('members' in validated);
  const pricing = calculatePricing(validated.members);
  assert.equal(pricing.totalAmountCents, 35_500);
  assert.equal(pricing.savingsCents, 39_500);
  assert.match(pricing.appliedOption ?? '', /1 Parent \+ 2 Children/);
});

test('membership validation rejects oversized family payloads', () => {
  const result = validateAndClassifyMembers(Array.from({ length: 21 }, () => ({})));
  assert.ok('errors' in result);
  assert.equal(result.errors[0]?.field, 'members');
});
