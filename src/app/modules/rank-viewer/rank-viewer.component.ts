import {Component, OnInit} from '@angular/core';
import {CHART_OPTIONS} from '../../models/chart-options';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../state/app.state';
import {Observable} from 'rxjs';
import {ProductRank} from '../../models/product-rank.type';
import {ChartOptions} from 'chart.js';
import {DatasetId} from '../../models/dataset-id.enum';
import {AppActions} from '../../state/app.actions';

@Component({
  selector: 'dh-rank-viewer',
  templateUrl: './rank-viewer.component.html',
  styleUrls: ['./rank-viewer.component.scss']
})
export class RankViewerComponent implements OnInit {

  // setting "!" after attribut declaration tell to typescript that we wont init that property
  @Select(AppState.selectedDataset) selectedDataset$!: Observable<ProductRank[]>;
  @Select(AppState.selectedDatasetId) selectedDatasetId$!: Observable<DatasetId>;

  chartsOptions: ChartOptions = CHART_OPTIONS;
  datasetIds: DatasetId[] = Object.values(DatasetId);

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
  }

  onDatasetSelection(datasetId: DatasetId) {
    this.store.dispatch(new AppActions.SelectDataset(datasetId));
  }

}
