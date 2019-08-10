import { get } from 'http';
import { path, state } from 'cerebral';

/**
 * sets a scanner source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.props the cerebral props object used for getting the props.scannerSourceName
 * @param {Function} providers.store the cerebral store used for setting state.scanner.scannerSourceName
 * @returns {Promise} async action
 */
export const isFileAttachedAction = async ({ get, path }) => {
  return get(state.form.primaryDocumentFile) ? path.yes() : path.no();
};
