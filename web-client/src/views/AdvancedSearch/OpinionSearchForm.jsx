import { Button } from '../../ustc-ui/Button/Button';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OpinionSearchByKeyword } from './OpinionSearchByKeyword';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpinionSearchForm = connect(
  {
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,

    validationErrors: state.validationErrors,
  },
  function OpinionSearchForm({
    clearAdvancedSearchFormSequence,
    submitAdvancedSearchSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="header-with-blue-background grid-row">
          <h3>Search Opinions</h3>
        </div>
        <div className="blue-container order-search-container">
          <form
            className="grid-container grid-row"
            onSubmit={e => {
              e.preventDefault();
              submitAdvancedSearchSequence();
            }}
          >
            <div className="grid-col" id="order-basic">
              <OpinionSearchByKeyword validationErrors={validationErrors} />

              <NonMobile>
                <div className="grid-row margin-top-1">
                  <div className="tablet:grid-col-12">
                    <Button
                      className="margin-bottom-0"
                      id="advanced-search-button"
                      type="submit"
                    >
                      Search
                    </Button>
                    <Button
                      link
                      className="padding-0 ustc-button--mobile-inline"
                      onClick={e => {
                        e.preventDefault();
                        clearAdvancedSearchFormSequence({
                          formType: 'opinionSearch',
                        });
                      }}
                    >
                      Clear Search
                    </Button>
                  </div>
                </div>
              </NonMobile>
            </div>
          </form>
        </div>
      </>
    );
  },
);
