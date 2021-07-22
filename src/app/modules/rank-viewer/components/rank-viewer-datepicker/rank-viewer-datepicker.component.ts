import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Moment} from 'moment';
import * as moment from 'moment';

declare const $: any;

@Component({
  selector: 'dh-rank-viewer-datepicker',
  templateUrl: './rank-viewer-datepicker.component.html',
  styleUrls: ['./rank-viewer-datepicker.component.scss'],
})
export class RankViewerDatepickerComponent implements OnInit {

  @Input() selectedBegin!: Moment | null;
  @Input() selectedEnd!: Moment | null;

  @Output() beginChange: EventEmitter<Moment> = new EventEmitter<Moment>();
  @Output() endChange: EventEmitter<Moment> = new EventEmitter<Moment>();

  static readonly FORMAT_DISPLAYED = 'MM/DD/YYYY';

  ngOnInit(): void {
    const inputSelector = 'input[name="dh-datepicker-input"]';
    $(inputSelector).daterangepicker({
        startDate: this.selectedBegin,
        endDate: this.selectedEnd,
        minDate: this.selectedBegin,
        maxDate: this.selectedEnd
    });
    $(inputSelector).on('apply.daterangepicker', (ev: any, picker: any) => {
      this.onBeginChange(picker.startDate);
      this.onEndChange(picker.endDate);
    });

  }

  static getMomentDateToHumanReadable(date: Moment | string | null): string {
    return moment(date).utc(true).format(RankViewerDatepickerComponent.FORMAT_DISPLAYED);
  }

  getFormattedRange() {
    return (
        RankViewerDatepickerComponent.getMomentDateToHumanReadable(this.selectedBegin) + ' to '
        + RankViewerDatepickerComponent.getMomentDateToHumanReadable(this.selectedEnd)
    );
  }

  onBeginChange(beginDate: Moment | null) {
    this.beginChange.emit(beginDate as Moment);
  }

  onEndChange(endDate: Moment | null) {
    this.endChange.emit(endDate as Moment);
  }
}
