import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkCompletesDocketEntryQcAndSendsMessage = test => {
  return it('docketclerk completes docket entry QC for the proposed stipulated decision and sends a message to the ADC', async () => {
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const proposedStipulatedDecision = workQueueFormatted.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );
    test.proposedStipDecisionDocumentId =
      proposedStipulatedDecision.document.documentId;

    await test.runSequence('gotoEditDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: proposedStipulatedDecision.document.documentId,
    });

    await test.runSequence('openCompleteAndSendMessageModalSequence');
    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('modal.form.attachments').length).toEqual(1);

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toSection',
      value: 'adc',
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '6805d1ab-18d0-43ec-bafb-654e83405416', //adc
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'please sign this',
    });

    test.testMessageSubject = `your message, ma'am ${Date.now()}`;

    await test.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: test.testMessageSubject,
    });

    await test.runSequence('completeDocketEntryQCAndSendMessageSequence');

    await refreshElasticsearchIndex();
  });
};
