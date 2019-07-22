const { get } = require('../requests');

/**
 * get eligible cases for trial session
 *
 * @param applicationContext
 * @param trialSessionId
 * @returns {Promise<*>}
 */
exports.getEligibleCasesForTrialSessionInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return get({
    applicationContext,
    endpoint: `/api/trial-sessions/${trialSessionId}/eligible-cases`,
  });
};