import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import openDocumentBlob from './openDocumentBlob';
import SuccessNotification from './SuccessNotification';
import PartyInformation from './PartyInformation';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    helper: state.caseDetailHelper,
    submitSendToIrsSequence: sequences.submitToIrsSequence,
    submitUpdateCaseSequence: sequences.submitUpdateCaseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    viewDocumentSequence: sequences.viewDocumentSequence,
  },
  function CaseDetail({
    caseDetail,
    currentTab,
    helper,
    submitSendToIrsSequence,
    submitUpdateCaseSequence,
    updateCaseValueSequence,
    updateCurrentTabSequence,
    updateFormValueSequence,
    viewDocumentSequence,
  }) {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket number: {caseDetail.docketNumber}
          </h1>
          <p>
            {caseDetail.petitioners[0].name} v. Commissioner of Internal
            Revenue, Respondent
          </p>
          <p>
            <span
              className="usa-label case-status-label"
              aria-label={'status: ' + caseDetail.status}
            >
              <span aria-hidden="true">{caseDetail.status}</span>
            </span>
          </p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          <nav className="horizontal-tabs">
            <ul role="tabslist">
              <li
                role="presentation"
                className={currentTab == 'Docket Record' ? 'active' : ''}
              >
                <button
                  role="tab"
                  className="tab-link"
                  aria-selected={currentTab === 'Docket Record'}
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Docket Record' })
                  }
                  id="docket-record-tab"
                >
                  Docket Record
                </button>
              </li>
              <li className={currentTab == 'Case Information' ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  aria-selected={currentTab === 'Case Information'}
                  id="case-info-tab"
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Case Information' })
                  }
                >
                  Case Information
                </button>
              </li>
            </ul>
          </nav>
          {currentTab == 'Docket Record' && (
            <div className="tab-content" role="tabpanel">
              {!helper.showIrsServedDate && (
                <button
                  className="usa-button"
                  id="send-to-irs"
                  onClick={() => submitSendToIrsSequence()}
                >
                  Send to IRS
                </button>
              )}
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Date filed</th>
                    <th>Title</th>
                    <th>Filed by</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {caseDetail.documents.map((document, idx) => (
                    <tr key={idx}>
                      <td className="responsive-title">
                        <span className="responsive-label">Activity date</span>
                        {document.createdAtFormatted}
                      </td>
                      <td>
                        <span className="responsive-label">Title</span>
                        <button
                          className="pdf-link"
                          aria-label="View PDF"
                          onClick={() =>
                            viewDocumentSequence({
                              documentId: document.documentId,
                              callback: openDocumentBlob,
                            })
                          }
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {document.documentType}
                        </button>
                      </td>
                      <td>
                        <span className="responsive-label">Filed by</span>
                        {document.filedBy}
                      </td>
                      <td>
                        <span className="responsive-label">Status</span>
                        {document.isStatusServed && (
                          <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                        )}
                        {helper.showDocumentStatus && (
                          <span>{document.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {helper.showPaymentRecord && (
                    <tr>
                      <td>{caseDetail.payGovDateFormatted}</td>
                      <td>Filing fee paid</td>
                      <td />
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <PartyInformation />
              <div>
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Petition fee</legend>
                  {helper.showPaymentRecord && (
                    <React.Fragment>
                      <p className="label">Paid by pay.gov</p>
                      <p>{caseDetail.payGovId}</p>
                    </React.Fragment>
                  )}
                  {helper.showPaymentOptions && (
                    <ul className="usa-unstyled-list">
                      <li>
                        <input
                          id="paygov"
                          type="radio"
                          name="paymentType"
                          value="payGov"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="paygov">Paid by pay.gov</label>
                        {helper.showPayGovIdInput && (
                          <React.Fragment>
                            <label htmlFor="paygovid">Payment ID</label>
                            <input
                              id="paygovid"
                              type="text"
                              name="payGovId"
                              value={caseDetail.payGovId || ''}
                              onChange={e => {
                                updateCaseValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                              }}
                            />
                            <button
                              id="update-case-page-end"
                              onClick={() => submitUpdateCaseSequence()}
                            >
                              Save updates
                            </button>
                          </React.Fragment>
                        )}
                      </li>
                    </ul>
                  )}
                </fieldset>
              </div>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);