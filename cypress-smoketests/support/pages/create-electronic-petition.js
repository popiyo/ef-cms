exports.hasIrsNotice = {
  NO: 1,
  YES: 0,
};

exports.filingTypes = {
  BUSINESS: 2,
  INDIVIDUAL: 0,
  OTHER: 3,
  PETITIONER_AND_SPOUSE: 1,
};

exports.goToStartCreatePetition = () => {
  cy.get('a#file-a-petition').click();
};

exports.goToWizardStep1 = () => {
  cy.get('a[href*="file-a-petition/step-1"]').click();
};

exports.goToWizardStep2 = () => {
  cy.get('button#submit-case').click();
};

exports.goToWizardStep3 = () => {
  cy.get('button#submit-case').click();
};

exports.goToWizardStep4 = () => {
  cy.get('button#submit-case').click();
};

exports.goToWizardStep5 = () => {
  cy.get('button#submit-case').click();
};

exports.submitPetition = () => {
  cy.get('button#submit-case').scrollIntoView().click();
};

exports.goToDashboard = () => {
  cy.get('a#button-back-to-dashboard').click();
};

exports.completeWizardStep1 = () => {
  cy.upload_file('w3-dummy.pdf', 'input#stin-file');
};

exports.completeWizardStep2 = (hasIrsNotice, caseType) => {
  cy.upload_file('w3-dummy.pdf', 'input#petition-file');
  cy.get('#irs-notice-radios').scrollIntoView();
  cy.get(`label#hasIrsNotice-${hasIrsNotice}`).click();
  cy.get('#case-type').scrollIntoView().select(caseType);
};

exports.completeWizardStep3 = filingType => {
  cy.get(`label#filing-type-${filingType}`).scrollIntoView().click();

  if (filingType === this.filingTypes.PETITIONER_AND_SPOUSE) {
    cy.get('label#is-spouse-deceased-0').click();
    cy.get('input#use-same-address-above')
      .scrollIntoView()
      .check({ force: true });

    cy.get('input#secondaryName').type('Annalise');
    cy.get('input#secondaryInCareOf').type('Sam');
  }

  cy.get('input#name').scrollIntoView().type('John');
  cy.get('input[name="contactPrimary.address1"]')
    .scrollIntoView()
    .type('111 South West St.');
  cy.get('input[name="contactPrimary.city"]').scrollIntoView().type('Orlando');
  cy.get('select[name="contactPrimary.state"]').scrollIntoView().select('AL');
  cy.get('input[name="contactPrimary.postalCode"]')
    .scrollIntoView()
    .type('12345');
  cy.get('input#phone').scrollIntoView().type('1111111111');
};

exports.completeWizardStep4 = () => {
  cy.get('label#procedure-type-0').scrollIntoView().click();
  cy.get('#preferred-trial-city').scrollIntoView().select('Mobile, Alabama');
};
