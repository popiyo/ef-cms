import { runCompute } from 'cerebral/test';
import { userContactEditProgressHelper } from './userContactEditProgressHelper';

describe('userContactEditProgressHelper', () => {
  it('returns expected data when state.userContactEditProgress contains completedCases and totalCases', () => {
    const result = runCompute(userContactEditProgressHelper, {
      state: {
        userContactEditProgress: {
          completedCases: 5,
          totalCases: 10,
        },
      },
    });
    expect(result).toMatchObject({
      completedCases: 5,
      percentComplete: 50,
      totalCases: 10,
    });
  });

  it('returns expected data when state.userContactEditProgress does not contain completedCases and totalCases', () => {
    const result = runCompute(userContactEditProgressHelper, {
      state: {
        userContactEditProgress: {},
      },
    });
    expect(result).toMatchObject({
      completedCases: 0,
      percentComplete: NaN,
      totalCases: 0,
    });
  });
});
