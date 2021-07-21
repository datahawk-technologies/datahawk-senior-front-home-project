import { DatasetId } from '../models/dataset-id.enum';
import {Moment} from 'moment';

export namespace AppActions {
  export class SelectDataset {
    static readonly type = '[App] select dataset';
    constructor(public datasetId: DatasetId) { }
  }
  export class SelectBeginDate {
    static readonly type = '[App] select begin date';
    constructor(public beginDate: Moment) { }
  }
  export class SelectEndDate {
    static readonly type = '[App] select end date';
    constructor(public endDate: Moment) { }
  }
}
