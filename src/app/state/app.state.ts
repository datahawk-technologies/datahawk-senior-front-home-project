import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AppActions} from './app.actions';
import {DatasetId} from '../models/dataset-id.enum';
import {ProductRank} from '../models/product-rank.type';
import {BedroomFurnitureBSROverTime} from '../../assets/dataset/BSR/bedroom-furniture.dataset';
import {MattressesAndBoxSpringsBSROverTime} from '../../assets/dataset/BSR/mattresses-and-box-springs.dataset';
import {FurnitureBSROverTime} from '../../assets/dataset/BSR/furniture.dataset';
import * as moment from 'moment';
import {Moment} from 'moment';
import {patch} from '@ngxs/store/operators';

const initialSelectedDatasetId = DatasetId.BSR_FURNITURE;
const initialDataSet = FurnitureBSROverTime;
const initialFirstDate = getFirstDate(initialDataSet);
const initialLastDate = getFirstDate(initialDataSet, true);

export let mapDatasetIdContentAssociation: any = {};
mapDatasetIdContentAssociation[DatasetId.BSR_FURNITURE] = FurnitureBSROverTime;
mapDatasetIdContentAssociation[DatasetId.BSR_BEDROOM_FURNITURE] = BedroomFurnitureBSROverTime;
mapDatasetIdContentAssociation[DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS] = MattressesAndBoxSpringsBSROverTime;


/**
 * Transform a string date format to a moment date
 * @param date string to transform, ex: '11/30/2019'
 * @param format optional format, default to 'MM/DD/YYYY';
 */
export function getMomentUsableDate(date: string, format: string = 'MM/DD/YYYY'): Moment {
  return moment(date, format).utc(true);
}

export function getDataForDateRange(datasetId: DatasetId, beginDate?: Moment, endDate?: Moment): ProductRank[] {
  const dataset: ProductRank[] = mapDatasetIdContentAssociation[datasetId];
  if (!beginDate) {
    beginDate = getFirstDate(dataset);
  }
  if (!endDate) {
    endDate = getFirstDate(dataset, true);
  }
  return dataset.filter((p) =>
      getMomentUsableDate(p.date).isAfter(beginDate) &&
      getMomentUsableDate(p.date).isBefore(endDate)
  );
}

function getFirstDate(dataset: ProductRank[], lastDate: boolean = false): Moment {
  const sortedDataset = dataset.sort((pa, pb) => {
    const pad = getMomentUsableDate(pa.date);
    const pbd = getMomentUsableDate(pb.date);
    return pad.isAfter(pbd) ? 1 : -1;
  });
  return lastDate ? getMomentUsableDate(sortedDataset[sortedDataset.length - 1].date) : getMomentUsableDate(sortedDataset[0].date);
}

interface DateRangeModel {
  begin: Moment,
  end: Moment
}

export interface AppStateModel {
  dataset: { [key in DatasetId]: ProductRank[] };
  selectedDatasetId: DatasetId;
  selectedDateRange: DateRangeModel
}

const defaults: AppStateModel = {
  dataset: {
    [DatasetId.BSR_FURNITURE]: getDataForDateRange(DatasetId.BSR_FURNITURE),
    [DatasetId.BSR_BEDROOM_FURNITURE]: getDataForDateRange(DatasetId.BSR_BEDROOM_FURNITURE),
    [DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS]: getDataForDateRange(DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS),
  },
  selectedDateRange: {
    begin: initialFirstDate,
    end: initialLastDate
  },
  selectedDatasetId: initialSelectedDatasetId
}

@State<AppStateModel>({
  name: 'app',
  defaults
})
@Injectable()
export class AppState {
  constructor() {
  }

  @Selector()
  public static selectedDataset(state: AppStateModel): ProductRank[] {
    return state.dataset[state.selectedDatasetId];
  }

  @Selector()
  public static selectedDatasetId(state: AppStateModel): DatasetId {
    return state.selectedDatasetId;
  }

  @Selector()
  public static selectedBeginDate(state: AppStateModel): Moment {
    return state.selectedDateRange.begin;
  }

  @Selector()
  public static selectedEndDate(state: AppStateModel): Moment {
    return state.selectedDateRange.end;
  }

  @Action(AppActions.SelectDataset)
  selectDataset({ patchState }: StateContext<AppStateModel>, { datasetId }: AppActions.SelectDataset) {
    patchState({ selectedDatasetId: datasetId });
  }

  @Action(AppActions.SelectBeginDate)
  selectBeginDate(ctx: StateContext<AppStateModel>, { beginDate }: AppActions.SelectBeginDate) {
    const state = ctx.getState();
    const newDataSet = {...state.dataset};
    newDataSet[state.selectedDatasetId] = getDataForDateRange(
        state.selectedDatasetId,
        beginDate,
        state.selectedDateRange.end
    );
    ctx.setState(
        patch({
          selectedDateRange: {
            ...state.selectedDateRange,
            begin: beginDate
          }
        })
    );
  }

  @Action(AppActions.SelectEndDate)
  selectEndDate(ctx: StateContext<AppStateModel>, { endDate }: AppActions.SelectEndDate) {
    const state = ctx.getState();
    const newDataSet = {...state.dataset};
    newDataSet[state.selectedDatasetId] = getDataForDateRange(
        state.selectedDatasetId,
        state.selectedDateRange.begin,
        endDate
    );
    ctx.setState(
        patch({
          dataset: newDataSet,
          selectedDateRange: {
            ...state.selectedDateRange,
            end: endDate
          }
        })
    );
  }
}
