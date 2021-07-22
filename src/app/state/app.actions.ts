import { DatasetId } from '../models/dataset-id.enum';
import {Moment} from 'moment';
import {MultiselectProductOption} from './app.state';

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
    constructor(public endDate: Moment) {}
  }
  export class SelectProductNamesToDisplay {
    static readonly type = '[App] select product names to display';
    constructor(public productNamesToDisplay: MultiselectProductOption[]) { }
  }
}
