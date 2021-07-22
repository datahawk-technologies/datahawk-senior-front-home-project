import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatasetId } from '../../../../models/dataset-id.enum';
import {Moment} from 'moment';

@Component({
  selector: 'dh-rank-viewer-filters',
  templateUrl: './rank-viewer-filters.component.html',
  styleUrls: ['./rank-viewer-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankViewerFiltersComponent implements OnInit {
  @Input() selectedId: DatasetId | null = null;
  @Input() datasetIds: DatasetId[] | null = [];

  @Output() datasetSelect: EventEmitter<DatasetId> = new EventEmitter<DatasetId>();

  ngOnInit(): void {
  }

  onDatasetClick(datasetId: string) {
    this.datasetSelect.emit(datasetId as DatasetId);
  }
}
