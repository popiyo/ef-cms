import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsPetitionerInformation } from './journey/docketClerkEditsPetitionerInformation';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkEditsServiceIndicatorForPractitioner } from './journey/docketClerkEditsServiceIndicatorForPractitioner';
import { docketClerkEditsServiceIndicatorForRespondent } from './journey/docketClerkEditsServiceIndicatorForRespondent';
import { docketClerkServesOrderOnPaperParties } from './journey/docketClerkServesOrderOnPaperParties';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk edits service indicators for petitioner, practitioner, and respondent', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkEditsPetitionerInformation(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkEditsServiceIndicatorForPetitioner(test);
  docketClerkEditsServiceIndicatorForPractitioner(test);
  docketClerkEditsServiceIndicatorForRespondent(test);
  // create an order to serve - it should be served to 3 paper service parties now
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrderOnPaperParties(test, 0);
});
