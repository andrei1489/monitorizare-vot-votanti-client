import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { incidentsLoaded } from './actions';
import { INCIDENTS } from './constants';
import { getNextPage } from './selectors';

import request from 'utils/request';

export function* getIncidents() {
  const nextPage = yield select(getNextPage());
  const requestURL = `http://portal-votanti-uat.azurewebsites.net/api/incidents?limit=20&page=${nextPage}`;

  try {
    const incidentsResponse = yield call(request, requestURL);
    yield put(incidentsLoaded(incidentsResponse));
  } catch (err) {
    // to do when failed
  }
}

export function* getIncidentsWatcher() {
  yield fork(takeLatest, INCIDENTS, getIncidents);
}

export function* incidents() {
  const watcher = yield fork(getIncidentsWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  incidents,
];
