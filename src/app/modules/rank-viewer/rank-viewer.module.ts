import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankViewerRoutingModule } from './rank-viewer-routing.module';
import { RankViewerChartComponent } from './components/rank-viewer-chart/rank-viewer-chart.component';
import { RankViewerFiltersComponent } from './components/rank-viewer-filters/rank-viewer-filters.component';
import { RankViewerComponent } from './rank-viewer.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import {RankViewerDatepickerComponent} from './components/rank-viewer-datepicker/rank-viewer-datepicker.component';
import {RankViewerProductsSelectionComponent} from './components/rank-viewer-products-selection/rank-viewer-products-selection.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@NgModule({
    declarations: [
        RankViewerComponent,
        RankViewerFiltersComponent,
        RankViewerChartComponent,
        RankViewerDatepickerComponent,
        RankViewerProductsSelectionComponent
    ],
    imports: [
        CommonModule,
        ChartsModule,
        FormsModule,
        RankViewerRoutingModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: []
})
export class RankViewerModule { }
