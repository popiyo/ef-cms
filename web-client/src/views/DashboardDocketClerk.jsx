import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';

export default connect(
  {},
  function DashboardDocketClerk() {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Docket Clerk Dashboard</h1>
        <SuccessNotification />
        <ErrorNotification />
      </section>
    );
  },
);
