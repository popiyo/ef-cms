import { state } from 'cerebral';

/**
 * redirects to the draft documents page
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 *
 * @returns {object} object with a path
 */
export const skipSigningOrderAction = ({ get, store }) => {
  const isCreatingOrder = get(state.isCreatingOrder);
  if (isCreatingOrder) {
    store.unset(state.isCreatingOrder);
    return {
      alertSuccess: {
        message:
          'Your document has been successfully created and attached to this message',
      },
    };
  }

  const { caseId, documents } = get(state.caseDetail);
  const documentId = get(state.documentId);
  const order = documents.find(d => d.documentId === documentId);

  return {
    alertSuccess: {
      message: `${order.documentTitle} updated.`,
    },
    path: `/case-detail/${caseId}/draft-documents`,
  };
};
