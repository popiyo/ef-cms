import { state } from 'cerebral';

/**
 * get the selected work items from state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the selectedWorkItems
 * @returns {object} a list of selected work items
 */
export const getPdfPreviewUrlAction = async ({ applicationContext, get }) => {
  const htmlMarkup = get(state.form.richText);
  if (!htmlMarkup) {
    throw new Error('No markup found in documentHtml');
  }

  //touch

  const pdfUrl = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtml({ applicationContext, htmlMarkup });

  return { pdfUrl };
};
