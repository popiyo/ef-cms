import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { gotoDashboardSequence } from './gotoDashboardSequence';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const completeDocumentSigningSequence = [
  clearAlertsAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsAction],
    success: [
      completeDocumentSigningAction,
      setDocumentIdAction,
      ...createWorkItemSequence,
      clearPDFSignatureDataAction,
      ...gotoDashboardSequence,
      clearFormAction,
    ],
  },
];
