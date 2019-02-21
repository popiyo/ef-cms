const User = require('../../entities/User');
const { UnauthorizedError } = require('../../../errors/errors');

const { getCasesByUser } = require('../getCasesByUser.interactor');
const {
  getCasesForRespondent,
} = require('../respondent/getCasesForRespondent.interactor');
const { getCasesByDocumentId } = require('../getCasesByDocumentId.interactor');
const { getCasesByStatus } = require('../getCasesByStatus.interactor');

/**
 *
 * @param documentId
 * @param userId
 * @returns {*}
 */
exports.getInteractorForGettingCases = ({ documentId, userId }) => {
  let user;
  try {
    user = new User({ userId });
  } catch (err) {
    throw new UnauthorizedError('Unauthorized');
  }
  switch (user.role) {
    case 'petitioner':
      return getCasesByUser;
    case 'respondent':
      return getCasesForRespondent;
    case 'docketclerk':
    case 'petitionsclerk':
    case 'seniorattorney':
    case 'intakeclerk':
      if (documentId) {
        return getCasesByDocumentId;
      } else {
        return getCasesByStatus;
      }
    default:
      throw new Error('invalid use case');
  }
};