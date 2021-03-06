const { post } = require('../requests');

/**
 * saveSignedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.originalDocumentId the id of the original (unsigned) document
 * @param {string} providers.signedDocumentId the id of the signed document
 * @param {string} providers.nameForSigning name
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveSignedDocumentInteractor = ({
  applicationContext,
  docketNumber,
  nameForSigning,
  originalDocumentId,
  parentMessageId,
  signedDocumentId,
}) => {
  return post({
    applicationContext,
    body: {
      nameForSigning,
      parentMessageId,
      signedDocumentId,
    },
    endpoint: `/case-documents/${docketNumber}/${originalDocumentId}/sign`,
  });
};
