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

export const mapDatasetIdContentAssociation: any = {};
mapDatasetIdContentAssociation[DatasetId.BSR_FURNITURE] = FurnitureBSROverTime;
mapDatasetIdContentAssociation[DatasetId.BSR_BEDROOM_FURNITURE] = BedroomFurnitureBSROverTime;
mapDatasetIdContentAssociation[DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS] = MattressesAndBoxSpringsBSROverTime;

const initialSelectedDatasetId = DatasetId.BSR_FURNITURE;

/**
 * Transform a string date format to a moment date
 * @param date string to transform, ex: '11/30/2019'
 * @param format optional format, default to 'MM/DD/YYYY';
 */
export function getMomentUsableDate(date: string, format: string = 'MM/DD/YYYY'): Moment {
  return moment(date, format).utc(true);
}

export function getDataForDateRange(
    datasetId: DatasetId,
    beginDate?: Moment,
    endDate?: Moment,
    productNamesToDisplay?: MultiselectProductOption[]
): ProductRank[] {
  const dataset: ProductRank[] = mapDatasetIdContentAssociation[datasetId];
  if (!beginDate) {
    beginDate = getBoundaryDate(dataset);
  }
  if (!endDate) {
    endDate = getBoundaryDate(dataset, true);
  }
  if (!productNamesToDisplay) {
    productNamesToDisplay = [];
    // productNamesToDisplay = dataset.map(d => d.name);;
  }

  return (
      dataset.filter(p =>
          getMomentUsableDate(p.date).isAfter(beginDate) &&
          getMomentUsableDate(p.date).isBefore(endDate) &&
          productNamesToDisplay?.some(product => {
            return product.name.toLowerCase() === p.name.toLowerCase()
          })
      )
  );
}

function getBoundaryDate(dataset: ProductRank[], lastDate: boolean = false): Moment {
  const sortedDataset = dataset.sort((pa, pb) => {
    const pad = getMomentUsableDate(pa.date);
    const pbd = getMomentUsableDate(pb.date);
    return pad.isAfter(pbd) ? 1 : -1;
  });
  if (!sortedDataset || sortedDataset.length < 1) {
    return moment();
  }
  return lastDate ? getMomentUsableDate(sortedDataset[sortedDataset.length - 1].date) : getMomentUsableDate(sortedDataset[0]?.date);
}

export function getMultiselectOptionsByDatasetId(dId: DatasetId): MultiselectProductOption[] {
  return initialAppStateDataset[dId].map(d => ({
    smallName: d.name.substr(0, Math.min(10, d.name.length)) + '...',
    name: d.name
  }));
}

interface DateRangeModel {
  begin: Moment,
  end: Moment
}

export interface MultiselectProductOption {
  smallName: string,
  name: string
}

export interface AppStateModel {
  multiselectProductNamesOptions: MultiselectProductOption[];
  dataset: { [key in DatasetId]: ProductRank[] };
  productNamesToDisplay: MultiselectProductOption[];
  selectedDatasetId: DatasetId;
  selectedDateRange: DateRangeModel
}

export const initialAppStateDataset: { [key in DatasetId]: ProductRank[] } = {
  [DatasetId.BSR_FURNITURE]: mapDatasetIdContentAssociation[DatasetId.BSR_FURNITURE],
  [DatasetId.BSR_BEDROOM_FURNITURE]: mapDatasetIdContentAssociation[DatasetId.BSR_BEDROOM_FURNITURE],
  [DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS]: mapDatasetIdContentAssociation[DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS],
};

const defaults: AppStateModel = {
  multiselectProductNamesOptions: getMultiselectOptionsByDatasetId(initialSelectedDatasetId),
  dataset: {
    [DatasetId.BSR_FURNITURE]: getDataForDateRange(DatasetId.BSR_FURNITURE),
    [DatasetId.BSR_BEDROOM_FURNITURE]: getDataForDateRange(DatasetId.BSR_BEDROOM_FURNITURE),
    [DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS]: getDataForDateRange(DatasetId.BSR_MATTRESSES_AND_BOX_SPRINGS),
  },
  productNamesToDisplay: [],
  selectedDateRange: {
    begin: getBoundaryDate(mapDatasetIdContentAssociation[initialSelectedDatasetId]),
    end: getBoundaryDate(mapDatasetIdContentAssociation[initialSelectedDatasetId], true),
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
  public static selectedMultiselectProductOptions(state: AppStateModel): MultiselectProductOption[] {
    return state.multiselectProductNamesOptions;
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
  public static allProductNames(state: AppStateModel): MultiselectProductOption[] {
    return state.productNamesToDisplay;
  }

  @Selector()
  public static selectedProductNames(state: AppStateModel): MultiselectProductOption[] {
    return state.productNamesToDisplay;
  }

  @Selector()
  public static selectedEndDate(state: AppStateModel): Moment {
    return state.selectedDateRange.end;
  }

  @Action(AppActions.SelectDataset)
  selectDataset({ patchState }: StateContext<AppStateModel>, { datasetId }: AppActions.SelectDataset) {
    patchState({
      selectedDatasetId: datasetId,
      multiselectProductNamesOptions: getMultiselectOptionsByDatasetId(datasetId)
    });
  }

  @Action(AppActions.SelectBeginDate)
  selectBeginDate(ctx: StateContext<AppStateModel>, { beginDate }: AppActions.SelectBeginDate) {
    const state = ctx.getState();
    const newDataSet = {...state.dataset};
    newDataSet[state.selectedDatasetId] = getDataForDateRange(
        state.selectedDatasetId,
        beginDate,
        state.selectedDateRange.end,
        state.productNamesToDisplay
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

  @Action(AppActions.SelectProductNamesToDisplay)
  selectProductNamesToDisplay(ctx: StateContext<AppStateModel>, { productNamesToDisplay }: AppActions.SelectProductNamesToDisplay) {
    const state = ctx.getState();
    const newDataSet = {...state.dataset};
    newDataSet[state.selectedDatasetId] = getDataForDateRange(
        state.selectedDatasetId,
        state.selectedDateRange.begin,
        state.selectedDateRange.end,
        productNamesToDisplay
    );
    ctx.setState(
        patch({
          dataset: newDataSet,
          productNamesToDisplay: productNamesToDisplay
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
        endDate,
        state.productNamesToDisplay
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
