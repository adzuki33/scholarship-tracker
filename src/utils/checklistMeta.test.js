import { describe, it, expect } from 'vitest';
import { priorityToLabel, labelToPriority, STATUS_OPTIONS, computeChecklistProgress } from './checklistMeta';

describe('priorityToLabel', () => {
  it('maps 1-2 to High, 3 to Medium, 4-5 to Low', () => {
    expect(priorityToLabel(1)).toBe('High');
    expect(priorityToLabel(2)).toBe('High');
    expect(priorityToLabel(3)).toBe('Medium');
    expect(priorityToLabel(4)).toBe('Low');
    expect(priorityToLabel(5)).toBe('Low');
  });
  it('defaults out-of-range/invalid to Medium', () => {
    expect(priorityToLabel(undefined)).toBe('Medium');
    expect(priorityToLabel(0)).toBe('Medium');
    expect(priorityToLabel(99)).toBe('Low');
  });
});

describe('labelToPriority', () => {
  it('maps labels back to canonical numbers', () => {
    expect(labelToPriority('High')).toBe(1);
    expect(labelToPriority('Medium')).toBe(3);
    expect(labelToPriority('Low')).toBe(5);
  });
  it('defaults unknown to 3', () => {
    expect(labelToPriority('whatever')).toBe(3);
  });
});

describe('STATUS_OPTIONS', () => {
  it('exposes the three canonical statuses in order', () => {
    expect(STATUS_OPTIONS.map((o) => o.value)).toEqual(['pending', 'in_progress', 'completed']);
  });
});

describe('computeChecklistProgress', () => {
  const item = (over) => ({ required: true, taskStatus: 'pending', ...over });

  it('counts required vs overall completion', () => {
    const items = [
      item({ required: true, taskStatus: 'completed' }),
      item({ required: true, taskStatus: 'pending' }),
      item({ required: false, conditional: true, taskStatus: 'completed' }),
    ];
    const p = computeChecklistProgress(items);
    expect(p.requiredDone).toBe(1);
    expect(p.requiredTotal).toBe(2);
    expect(p.overallDone).toBe(2);
    expect(p.overallTotal).toBe(3);
    expect(p.requiredPercent).toBe(50);
    expect(p.overallPercent).toBe(67);
  });

  it('handles empty list without dividing by zero', () => {
    const p = computeChecklistProgress([]);
    expect(p).toMatchObject({ requiredDone: 0, requiredTotal: 0, overallDone: 0, overallTotal: 0, requiredPercent: 0, overallPercent: 0 });
  });

  it('treats checked legacy items as done when taskStatus missing', () => {
    const p = computeChecklistProgress([{ required: true, checked: true }]);
    expect(p.requiredDone).toBe(1);
  });
});
