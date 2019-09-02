import { mapValueHelper } from './mapValueHelper';
import { state } from 'cerebral';

export const workQueueHelper = get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const userSection = get(state.user.section);
  const userRole = get(state.user.role);
  const userRoleMap = mapValueHelper(userRole);
  const { myInboxUnreadCount, qcUnreadCount } = get(state.notifications);
  const workQueueIsMessages = get(state.workQueueIsMessages);
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showInProgress = workQueueToDisplay.box === 'inProgress';
  const showOutbox = workQueueToDisplay.box === 'outbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const sectionInboxCount = get(state.sectionInboxCount);
  const myUnreadCount = workQueueIsMessages
    ? myInboxUnreadCount
    : qcUnreadCount;
  const workQueueType = workQueueIsMessages ? 'Messages' : 'Document QC';
  const isDisplayingQC = !workQueueIsMessages;
  const userIsPetitionsClerk = userRole === 'petitionsclerk';
  const userIsDocketClerk = userRole === 'docketclerk';
  const userIsOther = !['docketclerk', 'petitionsclerk'].includes(userRole);
  const workQueueTitle = `${
    showIndividualWorkQueue
      ? 'My'
      : userIsOther && !workQueueIsMessages
      ? 'Docket'
      : 'Section'
  } ${workQueueType}`;

  return {
    assigneeColumnTitle: isDisplayingQC ? 'Assigned To' : 'To',
    currentBoxView: workQueueToDisplay.box,
    getQueuePath: ({ box, queue }) => {
      return `/${
        workQueueIsMessages ? 'messages' : 'document-qc'
      }/${queue}/${box}`;
    },
    hideCaseStatusColumn: userIsPetitionsClerk && isDisplayingQC,
    hideFiledByColumn: !(isDisplayingQC && userIsPetitionsClerk),
    hideFromColumn: isDisplayingQC,
    hideIconColumn: !workQueueIsMessages && userIsOther,
    hideSectionColumn: isDisplayingQC,
    inboxCount: showIndividualWorkQueue ? myUnreadCount : sectionInboxCount,
    linkToDocumentMessages: !isDisplayingQC,
    sentTitle: workQueueIsMessages
      ? 'Sent'
      : userIsDocketClerk
      ? 'Processed'
      : 'Served',
    showAssignedToColumn:
      (isDisplayingQC &&
        !showIndividualWorkQueue &&
        (showInbox || showInProgress) &&
        !userIsOther) ||
      !isDisplayingQC,
    showBatchedForIRSTab:
      userIsPetitionsClerk && workQueueIsMessages === false,
    showInProgresssTab: isDisplayingQC && userIsDocketClerk,
    showInbox,
    showIndividualWorkQueue,
    showMessageContent: !isDisplayingQC,
    showMessagesSentFromColumn: !isDisplayingQC,
    showMyQueueToggle:
      workQueueIsMessages || userIsDocketClerk || userIsPetitionsClerk,
    showOutbox,
    showProcessedByColumn: isDisplayingQC && userIsDocketClerk && showOutbox,
    showReceivedColumn: isDisplayingQC,
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionSentTab:
      workQueueIsMessages || userIsDocketClerk || userIsPetitionsClerk,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSelectColumn:
      (isDisplayingQC && (userIsPetitionsClerk || userIsDocketClerk)) ||
      (workQueueIsMessages && !isDisplayingQC),
    showSendToBar: selectedWorkItems.length > 0,
    showSentColumn: !isDisplayingQC,
    showServedColumn: userIsPetitionsClerk && isDisplayingQC,
    showStartCaseButton:
      (!!userRoleMap.petitionsclerk || !!userRoleMap.docketclerk) &&
      isDisplayingQC,
    workQueueIsMessages,
    workQueueTitle,
    workQueueType,
  };
};
