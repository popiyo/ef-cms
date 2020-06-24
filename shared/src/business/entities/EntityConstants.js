const courtIssuedEventCodes = require('../../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');
const { flatten, sortBy } = require('lodash');

// a number (100 to 9999) followed by a - and a 2 digit year
const DOCKET_NUMBER_MATCHER = /^([1-9]\d{2,4}-\d{2})$/;

// city, state, optional unique ID (generated automatically in testing files)
const TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

const SERVED_PARTIES_CODES = ['R', 'B', 'P'];

const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

const CHIEF_JUDGE = 'Chief Judge';

const DOCKET_NUMBER_SUFFIXES = ['W', 'P', 'X', 'R', 'SL', 'L', 'S'];

const CASE_STATUS_TYPES = {
  assignedCase: 'Assigned - Case', // Case has been assigned to a judge
  assignedMotion: 'Assigned - Motion', // Someone has requested a judge for the case
  calendared: 'Calendared', // Case has been scheduled for trial
  cav: 'CAV', // Core alternative valuation
  closed: 'Closed', // Judge has made a ruling to close the case
  generalDocket: 'General Docket - Not at Issue', // Submitted to the IRS
  generalDocketReadyForTrial: 'General Docket - At Issue (Ready for Trial)', // Case is ready for trial
  jurisdictionRetained: 'Jurisdiction Retained', // Jurisdiction of a case is retained by a specific judge — usually after the case is on a judge’s trial calendar
  new: 'New', // Case has not been QCed
  onAppeal: 'On Appeal', // After the trial, the case has gone to the appeals court
  rule155: 'Rule 155', // Where the Court has filed or stated its opinion or issued a dispositive order determining the issues in a case, it may withhold entry of its decision for the purpose of permitting the parties to submit computations pursuant to the Court’s determination of the issues, showing the correct amount to be included in the decision.
  submitted: 'Submitted', // Submitted to the judge for decision
};

const DOCUMENT_RELATIONSHIPS = [
  'primaryDocument',
  'primarySupportingDocument',
  'secondaryDocument',
  'secondarySupportingDocument',
  'supportingDocument',
];

const ORDER_DOCUMENT_TYPES = [
  'O',
  'OAJ',
  'OAL',
  'OAP',
  'OAPF',
  'OAR',
  'OAS',
  'OASL',
  'OAW',
  'OAX',
  'OCA',
  'OD',
  'ODD',
  'ODL',
  'ODP',
  'ODR',
  'ODS',
  'ODSL',
  'ODW',
  'ODX',
  'OF',
  'OFAB',
  'OFFX',
  'OFWD',
  'OFX',
  'OIP',
  'OJR',
  'OODS',
  'OPFX',
  'OPX',
  'ORAP',
  'OROP',
  'OSC',
  'OSCP',
  'OST',
  'OSUB',
  'OAD',
  'ODJ',
];

const DOCUMENT_NOTICE_EVENT_CODES = ['NOT'];
const DOCUMENT_EXTERNAL_CATEGORIES = Object.keys(documentMapExternal);
const DOCUMENT_EXTERNAL_CATEGORIES_MAP = documentMapExternal;
const DOCUMENT_INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
const DOCUMENT_INTERNAL_CATEGORY_MAP = documentMapInternal;
const COURT_ISSUED_EVENT_CODES = courtIssuedEventCodes;
const OPINION_EVENT_CODES = ['MOP', 'SOP', 'TCOP'];

const OPINION_DOCUMENT_TYPES = [
  {
    documentType: 'MOP - Memorandum Opinion',
  },
  {
    documentType: 'Summary Opinion',
  },
  {
    documentType: 'TCOP - T.C. Opinion',
  },
];

const SCENARIOS = [
  'Standard',
  'Nonstandard A',
  'Nonstandard B',
  'Nonstandard C',
  'Nonstandard D',
  'Nonstandard E',
  'Nonstandard F',
  'Nonstandard G',
  'Nonstandard H',
  'Type A',
  'Type B',
  'Type C',
  'Type D',
  'Type E',
  'Type F',
  'Type G',
  'Type H',
];

const TRANSCRIPT_EVENT_CODE = 'TRAN';

const OBJECTIONS_OPTIONS = ['No', 'Yes', 'Unknown'];

const CONTACT_CHANGE_DOCUMENT_TYPES = [
  'Notice of Change of Address',
  'Notice of Change of Telephone Number',
  'Notice of Change of Address and Telephone Number',
];

const TRACKED_DOCUMENT_TYPES = {
  application: {
    category: 'Application',
  },
  motion: {
    category: 'Motion',
  },
  orderToShowCause: {
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  proposedStipulatedDecision: {
    documentType: 'Proposed Stipulated Decision',
    eventCode: 'PSDE',
  },
};

const INITIAL_DOCUMENT_TYPES = {
  applicationForWaiverOfFilingFee: {
    documentType: 'Application for Waiver of Filing Fee',
    eventCode: 'APW',
  },
  ownershipDisclosure: {
    documentType: 'Ownership Disclosure Statement',
    eventCode: 'DISC',
  },
  petition: {
    documentType: 'Petition',
    eventCode: 'P',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
  stin: {
    documentType: 'Statement of Taxpayer Identification',
    eventCode: 'STIN',
  },
};

const NOTICE_OF_DOCKET_CHANGE = {
  documentTitle: 'Notice of Docket Change for Docket Entry No. [Index]',
  documentType: 'Notice of Docket Change',
  eventCode: 'NODC',
};

const NOTICE_OF_TRIAL = {
  documentTitle: 'Notice of Trial on [Date] at [Time]',
  documentType: 'Notice of Trial',
  eventCode: 'NDT',
};

const STANDING_PRETRIAL_NOTICE = {
  documentTitle: 'Standing Pretrial Notice',
  documentType: 'Standing Pretrial Notice',
  eventCode: 'SPTN',
};

const STANDING_PRETRIAL_ORDER = {
  documentTitle: 'Standing Pretrial Order',
  documentType: 'Standing Pretrial Order',
  eventCode: 'SPTO',
};

const SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfDocketChange: NOTICE_OF_DOCKET_CHANGE,
  noticeOfTrial: NOTICE_OF_TRIAL,
  standingPretrialNotice: STANDING_PRETRIAL_NOTICE,
  standingPretrialOrder: STANDING_PRETRIAL_ORDER,
};

const SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

const EVENT_CODES = [
  INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
  INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  INITIAL_DOCUMENT_TYPES.petition.eventCode,
  INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
  INITIAL_DOCUMENT_TYPES.stin.eventCode,
  NOTICE_OF_DOCKET_CHANGE.eventCode,
  NOTICE_OF_TRIAL.eventCode,
  STANDING_PRETRIAL_NOTICE.eventCode,
  STANDING_PRETRIAL_ORDER.eventCode,
  'MISL',
  'FEE',
  'FEEW',
  'MGRTED',
  'MIND',
  'MINC',
];

const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Not Paid',
  WAIVED: 'Waived',
};

const PROCEDURE_TYPES = ['Regular', 'Small']; // This is the order that they appear in the UI

const STATUS_TYPES_WITH_ASSOCIATED_JUDGE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
];

const STATUS_TYPES_MANUAL_UPDATE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.generalDocket,
  CASE_STATUS_TYPES.generalDocketReadyForTrial,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.onAppeal,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
];

const ANSWER_DOCUMENT_CODES = [
  'A',
  'AAAP',
  'AAPN',
  'AATP',
  'AATS',
  'AATT',
  'APA',
  'ASAP',
  'ASUP',
  'ATAP',
  'ATSP',
];

const CASE_CAPTION_POSTFIX = 'v. Commissioner of Internal Revenue, Respondent';

const AUTOMATIC_BLOCKED_REASONS = {
  dueDate: 'Due Date',
  pending: 'Pending Item',
  pendingAndDueDate: 'Pending Item and Due Date',
};

const CASE_TYPES_MAP = {
  cdp: 'CDP (Lien/Levy)',
  deficiency: 'Deficiency',
  djExemptOrg: 'Declaratory Judgment (Exempt Organization)',
  djRetirementPlan: 'Declaratory Judgment (Retirement Plan)',
  innocentSpouse: 'Innocent Spouse',
  interestAbatement: 'Interest Abatement',
  other: 'Other',
  partnershipSection1101: 'Partnership (BBA Section 1101)',
  partnershipSection6226: 'Partnership (Section 6226)',
  partnershipSection6228: 'Partnership (Section 6228)',
  passport: 'Passport',
  whistleblower: 'Whistleblower',
  workerClassification: 'Worker Classification',
};

const CASE_TYPES = Object.values(CASE_TYPES_MAP);

const ROLES = {
  adc: 'adc',
  admin: 'admin',
  admissionsClerk: 'admissionsclerk',
  chambers: 'chambers',
  clerkOfCourt: 'clerkofcourt',
  docketClerk: 'docketclerk',
  floater: 'floater',
  inactivePractitioner: 'inactivePractitioner',
  irsPractitioner: 'irsPractitioner',
  irsSuperuser: 'irsSuperuser',
  judge: 'judge',
  petitioner: 'petitioner',
  petitionsClerk: 'petitionsclerk',
  privatePractitioner: 'privatePractitioner',
  trialClerk: 'trialclerk',
};

const FILING_TYPES = {
  [ROLES.petitioner]: ['Myself', 'Myself and my spouse', 'A business', 'Other'],
  [ROLES.privatePractitioner]: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

const ANSWER_CUTOFF_AMOUNT_IN_DAYS = 45;

const ANSWER_CUTOFF_UNIT = 'day';

const COUNTRY_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
};

const US_STATES = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

const US_STATES_OTHER = [
  'AA',
  'AE',
  'AP',
  'AS',
  'FM',
  'GU',
  'MH',
  'MP',
  'PR',
  'PW',
  'VI',
];

const PARTY_TYPES = {
  conservator: 'Conservator',
  corporation: 'Corporation',
  custodian: 'Custodian',
  donor: 'Donor',
  estate: 'Estate with an executor/personal representative/fiduciary/etc.',
  estateWithoutExecutor:
    'Estate without an executor/personal representative/fiduciary/etc.',
  guardian: 'Guardian',
  nextFriendForIncompetentPerson:
    'Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)',
  nextFriendForMinor:
    'Next friend for a minor (without a guardian, conservator, or other like fiduciary)',
  partnershipAsTaxMattersPartner: 'Partnership (as the Tax Matters Partner)',
  partnershipBBA:
    'Partnership (as a partnership representative under the BBA regime)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than Tax Matters Partner)',
  petitioner: 'Petitioner',
  petitionerDeceasedSpouse: 'Petitioner & deceased spouse',
  petitionerSpouse: 'Petitioner & spouse',
  survivingSpouse: 'Surviving spouse',
  transferee: 'Transferee',
  trust: 'Trust',
};

const BUSINESS_TYPES = {
  corporation: PARTY_TYPES.corporation,
  partnershipAsTaxMattersPartner: PARTY_TYPES.partnershipAsTaxMattersPartner,
  partnershipBBA: PARTY_TYPES.partnershipBBA,
  partnershipOtherThanTaxMatters: PARTY_TYPES.partnershipOtherThanTaxMatters,
};

const ESTATE_TYPES = {
  estate: PARTY_TYPES.estate,
  estateWithoutExecutor: PARTY_TYPES.estateWithoutExecutor,
  trust: PARTY_TYPES.trust,
};

const OTHER_TYPES = {
  conservator: PARTY_TYPES.conservator,
  custodian: PARTY_TYPES.custodian,
  guardian: PARTY_TYPES.guardian,
  nextFriendForIncompetentPerson: PARTY_TYPES.nextFriendForIncompetentPerson,
  nextFriendForMinor: PARTY_TYPES.nextFriendForMinor,
};

const ORDER_TYPES = [
  {
    documentType: 'Order',
    eventCode: 'O',
  },
  {
    documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
    documentType: 'Order of Dismissal for Lack of Jurisdiction',
    eventCode: 'ODJ',
  },
  {
    documentTitle: 'Order of Dismissal',
    documentType: 'Order of Dismissal',
    eventCode: 'OD',
  },
  {
    documentTitle: 'Order of Dismissal and Decision',
    documentType: 'Order of Dismissal and Decision',
    eventCode: 'ODD',
  },
  {
    documentTitle: 'Order to Show Cause',
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  {
    documentTitle: 'Order and Decision',
    documentType: 'Order and Decision',
    eventCode: 'OAD',
  },
  {
    documentTitle: 'Decision',
    documentType: 'Decision',
    eventCode: 'DEC',
  },
  {
    documentType: 'Notice',
    eventCode: 'NOT',
  },
];

const COMMON_CITIES = [
  { city: 'Birmingham', state: 'Alabama' },
  { city: 'Mobile', state: 'Alabama' },
  { city: 'Anchorage', state: 'Alaska' },
  { city: 'Phoenix', state: 'Arizona' },
  { city: 'Little Rock', state: 'Arkansas' },
  { city: 'Los Angeles', state: 'California' },
  { city: 'San Diego', state: 'California' },
  { city: 'San Francisco', state: 'California' },
  { city: 'Denver', state: 'Colorado' },
  { city: 'Hartford', state: 'Connecticut' },
  { city: 'Washington', state: 'District of Columbia' },
  { city: 'Jacksonville', state: 'Florida' },
  { city: 'Miami', state: 'Florida' },
  { city: 'Tampa', state: 'Florida' },
  { city: 'Atlanta', state: 'Georgia' },
  { city: 'Honolulu', state: 'Hawaii' },
  { city: 'Boise', state: 'Idaho' },
  { city: 'Chicago', state: 'Illinois' },
  { city: 'Indianapolis', state: 'Indiana' },
  { city: 'Des Moines', state: 'Iowa' },
  { city: 'Louisville', state: 'Kentucky' },
  { city: 'New Orleans', state: 'Louisiana' },
  { city: 'Baltimore', state: 'Maryland' },
  { city: 'Boston', state: 'Massachusetts' },
  { city: 'Detroit', state: 'Michigan' },
  { city: 'St. Paul', state: 'Minnesota' },
  { city: 'Jackson', state: 'Mississippi' },
  { city: 'Kansas City', state: 'Missouri' },
  { city: 'St. Louis', state: 'Missouri' },
  { city: 'Helena', state: 'Montana' },
  { city: 'Omaha', state: 'Nebraska' },
  { city: 'Las Vegas', state: 'Nevada' },
  { city: 'Reno', state: 'Nevada' },
  { city: 'Albuquerque', state: 'New Mexico' },
  { city: 'Buffalo', state: 'New York' },
  { city: 'New York City', state: 'New York' },
  { city: 'Winston-Salem', state: 'North Carolina' },
  { city: 'Cincinnati', state: 'Ohio' },
  { city: 'Cleveland', state: 'Ohio' },
  { city: 'Columbus', state: 'Ohio' },
  { city: 'Oklahoma City', state: 'Oklahoma' },
  { city: 'Portland', state: 'Oregon' },
  { city: 'Philadelphia', state: 'Pennsylvania' },
  { city: 'Pittsburgh', state: 'Pennsylvania' },
  { city: 'Columbia', state: 'South Carolina' },
  { city: 'Knoxville', state: 'Tennessee' },
  { city: 'Memphis', state: 'Tennessee' },
  { city: 'Nashville', state: 'Tennessee' },
  { city: 'Dallas', state: 'Texas' },
  { city: 'El Paso', state: 'Texas' },
  { city: 'Houston', state: 'Texas' },
  { city: 'Lubbock', state: 'Texas' },
  { city: 'San Antonio', state: 'Texas' },
  { city: 'Salt Lake City', state: 'Utah' },
  { city: 'Richmond', state: 'Virginia' },
  { city: 'Seattle', state: 'Washington' },
  { city: 'Spokane', state: 'Washington' },
  { city: 'Charleston', state: 'West Virginia' },
  { city: 'Milwaukee', state: 'Wisconsin' },
];

const SMALL_CITIES = [
  { city: 'Fresno', state: 'California' },
  { city: 'Tallahassee', state: 'Florida' },
  { city: 'Pocatello', state: 'Idaho' },
  { city: 'Peoria', state: 'Illinois' },
  { city: 'Wichita', state: 'Kansas' },
  { city: 'Shreveport', state: 'Louisiana' },
  { city: 'Portland', state: 'Maine' },
  { city: 'Billings', state: 'Montana' },
  { city: 'Albany', state: 'New York' },
  { city: 'Syracuse', state: 'New York' },
  { city: 'Bismarck', state: 'North Dakota' },
  { city: 'Aberdeen', state: 'South Dakota' },
  { city: 'Burlington', state: 'Vermont' },
  { city: 'Roanoke', state: 'Virginia' },
  { city: 'Cheyenne', state: 'Wyoming' },
  ...COMMON_CITIES,
];

const TRIAL_CITIES = {
  ALL: SMALL_CITIES,
  REGULAR: COMMON_CITIES,
  SMALL: SMALL_CITIES,
};

const TRIAL_CITY_STRINGS = SMALL_CITIES.map(
  location => `${location.city}, ${location.state}`,
);

const SESSION_TERMS = ['Winter', 'Fall', 'Spring', 'Summer'];

const SESSION_TYPES = [
  'Regular',
  'Small',
  'Hybrid',
  'Special',
  'Motion/Hearing',
];

const SESSION_STATUS_GROUPS = {
  all: 'All',
  closed: 'Closed',
  new: 'New',
  open: 'Open',
};

const MAX_FILE_SIZE_MB = 250; // megabytes
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // bytes -> megabytes

const ADC_SECTION = 'adc';
const ADMISSIONS_SECTION = 'admissions';
const CHAMBERS_SECTION = 'chambers';
const CLERK_OF_COURT_SECTION = 'clerkofcourt';
const DOCKET_SECTION = 'docket';
const IRS_SYSTEM_SECTION = 'irsSystem';
const PETITIONS_SECTION = 'petitions';
const TRIAL_CLERKS_SECTION = 'trialClerks';

const ARMENS_CHAMBERS_SECTION = 'armensChambers';
const ASHFORDS_CHAMBERS_SECTION = 'ashfordsChambers';
const BUCHS_CHAMBERS_SECTION = 'buchsChambers';
const CARLUZZOS_CHAMBERS_SECTION = 'carluzzosChambers';
const COHENS_CHAMBERS_SECTION = 'cohensChambers';
const COLVINS_CHAMBERS_SECTION = 'colvinsChambers';
const COPELANDS_CHAMBERS_SECTION = 'copelandsChambers';
const FOLEYS_CHAMBERS_SECTION = 'foleysChambers';
const GALES_CHAMBERS_SECTION = 'galesChambers';
const GERBERS_CHAMBERS_SECTION = 'gerbersChambers';
const GOEKES_CHAMBERS_SECTION = 'goekesChambers';
const GUSTAFSONS_CHAMBERS_SECTION = 'gustafsonsChambers';
const GUYS_CHAMBERS_SECTION = 'guysChambers';
const HALPERNS_CHAMBERS_SECTION = 'halpernsChambers';
const HOLMES_CHAMBERS_SECTION = 'holmesChambers';
const JACOBS_CHAMBERS_SECTION = 'jacobsChambers';
const JONES_CHAMBERS_SECTION = 'jonesChambers';
const KERRIGANS_CHAMBERS_SECTION = 'kerrigansChambers';
const LAUBERS_CHAMBERS_SECTION = 'laubersChambers';
const LEYDENS_CHAMBERS_SECTION = 'leydensChambers';
const MARVELS_CHAMBERS_SECTION = 'marvelsChambers';
const MORRISONS_CHAMBERS_SECTION = 'morrisonsChambers';
const NEGAS_CHAMBERS_SECTION = 'negasChambers';
const PANUTHOS_CHAMBERS_SECTION = 'panuthosChambers';
const PARIS_CHAMBERS_SECTION = 'parisChambers';
const PUGHS_CHAMBERS_SECTION = 'pughsChambers';
const RUWES_CHAMBERS_SECTION = 'ruwesChambers';
const THORNTONS_CHAMBERS_SECTION = 'thorntonsChambers';
const TOROS_CHAMBERS_SECTION = 'torosChambers';
const URDAS_CHAMBERS_SECTION = 'urdasChambers';
const VASQUEZS_CHAMBERS_SECTION = 'vasquezsChambers';
const WELLS_CHAMBERS_SECTION = 'wellsChambers';

const SECTIONS = sortBy([
  ADC_SECTION,
  ADMISSIONS_SECTION,
  CHAMBERS_SECTION,
  CLERK_OF_COURT_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  TRIAL_CLERKS_SECTION,
]);

const CHAMBERS_SECTIONS = sortBy([
  ARMENS_CHAMBERS_SECTION,
  ASHFORDS_CHAMBERS_SECTION,
  BUCHS_CHAMBERS_SECTION,
  CARLUZZOS_CHAMBERS_SECTION,
  COHENS_CHAMBERS_SECTION,
  COLVINS_CHAMBERS_SECTION,
  COPELANDS_CHAMBERS_SECTION,
  FOLEYS_CHAMBERS_SECTION,
  GALES_CHAMBERS_SECTION,
  GERBERS_CHAMBERS_SECTION,
  GOEKES_CHAMBERS_SECTION,
  GUSTAFSONS_CHAMBERS_SECTION,
  GUYS_CHAMBERS_SECTION,
  HALPERNS_CHAMBERS_SECTION,
  HOLMES_CHAMBERS_SECTION,
  JACOBS_CHAMBERS_SECTION,
  JONES_CHAMBERS_SECTION,
  KERRIGANS_CHAMBERS_SECTION,
  LAUBERS_CHAMBERS_SECTION,
  LEYDENS_CHAMBERS_SECTION,
  MARVELS_CHAMBERS_SECTION,
  MORRISONS_CHAMBERS_SECTION,
  NEGAS_CHAMBERS_SECTION,
  PANUTHOS_CHAMBERS_SECTION,
  PARIS_CHAMBERS_SECTION,
  PUGHS_CHAMBERS_SECTION,
  RUWES_CHAMBERS_SECTION,
  THORNTONS_CHAMBERS_SECTION,
  URDAS_CHAMBERS_SECTION,
  TOROS_CHAMBERS_SECTION,
  VASQUEZS_CHAMBERS_SECTION,
  TOROS_CHAMBERS_SECTION,
  WELLS_CHAMBERS_SECTION,
]);

const TRIAL_STATUS_TYPES = [
  'Set for Trial',
  'Dismissed',
  'Continued',
  'Rule 122',
  'A Basis Reached',
  'Settled',
  'Recall',
  'Taken Under Advisement',
];

const SCAN_MODES = {
  DUPLEX: 'duplex',
  FEEDER: 'feeder',
  FLATBED: 'flatbed',
};

const EMPLOYER_OPTIONS = ['IRS', 'DOJ', 'Private'];

const PRACTITIONER_TYPE_OPTIONS = ['Attorney', 'Non-Attorney'];

const ADMISSIONS_STATUS_OPTIONS = [
  'Active',
  'Suspended',
  'Disbarred',
  'Resigned',
  'Deceased',
  'Inactive',
];

const DEFAULT_PROCEDURE_TYPE = PROCEDURE_TYPES[0];

const CASE_SEARCH_MIN_YEAR = 1986;
const CASE_SEARCH_PAGE_SIZE = 5;

// TODO: event codes need to be reorganized
const ALL_EVENT_CODES = flatten([
  ...Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
  ...Object.values(DOCUMENT_INTERNAL_CATEGORY_MAP),
])
  .map(item => item.eventCode)
  .concat(
    EVENT_CODES,
    COURT_ISSUED_EVENT_CODES.map(item => item.eventCode),
    OPINION_EVENT_CODES,
    ORDER_DOCUMENT_TYPES,
    ORDER_TYPES.map(item => item.eventCode),
  )
  .sort();

const ALL_DOCUMENT_TYPES = (() => {
  const allFilingEvents = flatten([
    ...Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
    ...Object.values(DOCUMENT_INTERNAL_CATEGORY_MAP),
  ]);
  const filingEventTypes = allFilingEvents.map(t => t.documentType);
  const orderDocTypes = ORDER_TYPES.map(t => t.documentType);
  const courtIssuedDocTypes = COURT_ISSUED_EVENT_CODES.map(t => t.documentType);
  const initialTypes = Object.keys(INITIAL_DOCUMENT_TYPES).map(
    t => INITIAL_DOCUMENT_TYPES[t].documentType,
  );
  const signedTypes = Object.keys(SIGNED_DOCUMENT_TYPES).map(
    t => SIGNED_DOCUMENT_TYPES[t].documentType,
  );
  const systemGeneratedTypes = Object.keys(SYSTEM_GENERATED_DOCUMENT_TYPES).map(
    t => SYSTEM_GENERATED_DOCUMENT_TYPES[t].documentType,
  );

  const documentTypes = [
    ...initialTypes,
    ...PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
    ...filingEventTypes,
    ...orderDocTypes,
    ...courtIssuedDocTypes,
    ...signedTypes,
    ...systemGeneratedTypes,
  ];

  return documentTypes;
})();

module.exports = {
  ADC_SECTION,
  ADMISSIONS_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_CUTOFF_UNIT,
  ANSWER_DOCUMENT_CODES,
  AUTOMATIC_BLOCKED_REASONS,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_SEARCH_MIN_YEAR,
  CASE_SEARCH_PAGE_SIZE,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  CHIEF_JUDGE,
  CLERK_OF_COURT_SECTION,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DEFAULT_PROCEDURE_TYPE,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  DOCUMENT_EXTERNAL_CATEGORIES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_INTERNAL_CATEGORIES,
  DOCUMENT_INTERNAL_CATEGORY_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EVENT_CODES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  IRS_SYSTEM_SECTION,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  NOTICE_OF_DOCKET_CHANGE,
  NOTICE_OF_TRIAL,
  OBJECTIONS_OPTIONS,
  OPINION_DOCUMENT_TYPES,
  OPINION_EVENT_CODES,
  ORDER_DOCUMENT_TYPES,
  ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  ROLES,
  SCAN_MODES,
  SCENARIOS,
  SECTIONS,
  SERVED_PARTIES_CODES,
  SERVICE_INDICATOR_TYPES,
  SESSION_STATUS_GROUPS,
  SESSION_TERMS,
  SESSION_TYPES,
  SIGNED_DOCUMENT_TYPES,
  STANDING_PRETRIAL_NOTICE,
  STANDING_PRETRIAL_ORDER,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRACKED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_CITY_STRINGS,
  TRIAL_CLERKS_SECTION,
  TRIAL_LOCATION_MATCHER,
  TRIAL_STATUS_TYPES,
  US_STATES,
  US_STATES_OTHER,
};
