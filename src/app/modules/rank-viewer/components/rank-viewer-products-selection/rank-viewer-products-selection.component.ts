import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultiselectProductOption} from '../../../../state/app.state';
import {DatasetId} from '../../../../models/dataset-id.enum';

@Component({
    selector: 'dh-rank-viewer-products-selection',
    templateUrl: './rank-viewer-products-selection.component.html',
    styleUrls: ['./rank-viewer-products-selection.component.scss'],
})
export class RankViewerProductsSelectionComponent implements OnInit {

    @Input() selectedProductsToDisplay!: any;
    @Input() multiselectProductNamesOptions!: any;
    @Input() selectedId: DatasetId | null = null;

    @Output() productNamesToDisplayChange: EventEmitter<MultiselectProductOption[]> = new EventEmitter<MultiselectProductOption[]>();

    dropdownSettings = {
        idField: 'name',
        textField: 'smallName',
        allowSearchFilter: true,
        itemsShowLimit: 30 // this lib perfs seems very weak, todo find a way to improve that, like back request on multiselect search
    };

    ngOnInit(): void {
    }

    onProductNamesToDisplayChange() {
        this.onEmitProductChanges(this.selectedProductsToDisplay as MultiselectProductOption[]);
    }

    onSelectAll() {
        this.onEmitProductChanges(this.multiselectProductNamesOptions as MultiselectProductOption[]);
    }

    onEmitProductChanges(productNamesOptions: MultiselectProductOption[]) {
        if (!productNamesOptions || productNamesOptions.length < 1) {
            this.productNamesToDisplayChange.emit([]);
        }
        this.productNamesToDisplayChange.emit(productNamesOptions);
    }

}
