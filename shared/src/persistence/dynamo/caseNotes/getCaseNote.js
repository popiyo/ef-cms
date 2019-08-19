const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

/**
 * getCaseDeadlinesByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get the case deadlines for
 * @returns {Promise} the promise of the persistence call to get the records
 */
exports.getCaseNote = async ({ applicationContext, caseId, userId }) => {
  return await client
    .get({
      Key: {
        pk: `case-note|${caseId}`,
        sk: `${userId}`,
      },
      applicationContext,
    })
    .then(stripInternalKeys);
};
