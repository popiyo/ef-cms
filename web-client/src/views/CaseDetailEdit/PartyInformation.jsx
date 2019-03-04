import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Contacts } from '../StartCase/Contacts';

export const PartyInformation = connect(
  {
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseDetailEditHelper: state.caseDetailEditHelper,
    token: state.token,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
  },
  ({
    autoSaveCaseSequence,
    baseUrl,
    caseDetail,
    caseDetailEditHelper,
    token,
    updateCasePartyTypeSequence,
    updateCaseValueSequence,
  }) => {
    return (
      <div className="blue-container document-detail-one-third">
        <div className="usa-form-group">
          <label htmlFor="party-type">Party Type</label>
          <select
            className="usa-input-inline"
            id="party-type"
            name="partyType"
            value={caseDetail.partyType}
            onChange={e => {
              updateCasePartyTypeSequence({
                key: e.target.name,
                value: e.target.value,
              });
              autoSaveCaseSequence();
            }}
          >
            {Object.keys(caseDetailEditHelper.partyTypes).map(partyType => (
              <option
                key={partyType}
                value={caseDetailEditHelper.partyTypes[partyType]}
              >
                {caseDetailEditHelper.partyTypes[partyType]}
              </option>
            ))}
          </select>
        </div>

        {caseDetailEditHelper.showOwnershipDisclosureStatement &&
          caseDetailEditHelper.ownershipDisclosureStatementDocumentId && (
            <React.Fragment>
              <div className="usa-form-group">
                <label htmlFor="ods-link">Ownership Disclosure Statement</label>
                <a
                  href={`${baseUrl}/documents/${
                    caseDetailEditHelper.ownershipDisclosureStatementDocumentId
                  }/documentDownloadUrl?token=${token}`}
                  aria-label="View PDF"
                >
                  <FontAwesomeIcon icon="file-pdf" />
                  Ownership Disclosure Statement
                </a>
              </div>
              <div className="usa-form-group">
                <input
                  id="order-for-ods"
                  type="checkbox"
                  name="orderForOds"
                  checked={caseDetail.orderForOds}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: e.target.name,
                      value: e.target.checked ? true : false,
                    });
                    autoSaveCaseSequence();
                  }}
                />
                <label htmlFor="order-for-ods">
                  Order for Ownership Disclosure Statement
                </label>
              </div>
            </React.Fragment>
          )}

        <Contacts
          parentView="CaseDetail"
          bind="caseDetail"
          emailBind="caseDetail.contactPrimary"
          onChange="updateCaseValueSequence"
          onBlur="autoSaveCaseSequence"
          contactsHelper="caseDetailEditContactsHelper"
          showPrimaryContact={caseDetailEditHelper.showPrimaryContact}
          showSecondaryContact={caseDetailEditHelper.showSecondaryContact}
        />
      </div>
    );
  },
);
