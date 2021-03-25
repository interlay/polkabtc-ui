import {
  CHANGE_ISSUE_STEP,
  RESET_ISSUE_WIZARD,
  CHANGE_ISSUE_ID,
  ADD_ISSUE_REQUEST,
  UPDATE_ISSUE_REQUEST,
  UPDATE_ALL_ISSUE_REQUESTS,
  CHANGE_SELECTED_ISSUE,
  UPDATE_ISSUE_PERIOD,
  UpdateAllIssueRequests,
  ChangeIssueStep,
  ResetIssueWizard,
  ChangeIssueId,
  AddIssueRequest,
  UpdateIssueRequest,
  ChangeSelectedIssue,
  UpdateIssuePeriod
} from '../types/actions.types';
import { IssueRequest } from '../types/issue.types';

export const changeIssueStepAction = (step: string): ChangeIssueStep => ({
  type: CHANGE_ISSUE_STEP,
  step
});

export const resetIssueWizardAction = (): ResetIssueWizard => ({
  type: RESET_ISSUE_WIZARD
});

export const changeIssueIdAction = (id: string): ChangeIssueId => ({
  type: CHANGE_ISSUE_ID,
  id
});

export const changeSelectedIssueAction = (request: IssueRequest): ChangeSelectedIssue => ({
  type: CHANGE_SELECTED_ISSUE,
  request
});

export const addIssueRequestAction = (request: IssueRequest): AddIssueRequest => ({
  type: ADD_ISSUE_REQUEST,
  request
});

export const updateIssueRequestAction = (request: IssueRequest): UpdateIssueRequest => ({
  type: UPDATE_ISSUE_REQUEST,
  request
});

export const updateAllIssueRequestsAction = (
  userDotAddress: string,
  issueRequests: IssueRequest[]
): UpdateAllIssueRequests => ({
  type: UPDATE_ALL_ISSUE_REQUESTS,
  userDotAddress,
  issueRequests
});

export const updateIssuePeriodAction = (period: number): UpdateIssuePeriod => ({
  type: UPDATE_ISSUE_PERIOD,
  period
});
