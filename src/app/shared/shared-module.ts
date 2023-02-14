import { NgModule } from "@angular/core";

// mat imports
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
// ag grid imports
import { AgGridModule } from "ag-grid-angular";
import { NumericOnlyDirective } from "./directives/numeric-only.directive";
import { ColorPickerModule } from "ngx-color-picker";

@NgModule({
    declarations: [
        NumericOnlyDirective
    ],
    exports: [
        // mat imports
        MatTabsModule,
        MatIconModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatDialogModule,
        MatToolbarModule,
        MatSidenavModule,
        MatStepperModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatButtonToggleModule,
        DragDropModule,
        MatMenuModule,
        MatTooltipModule,
        MatGridListModule,
        MatAutocompleteModule,

        MatAutocompleteModule,
        MatGridListModule,
        // ag grid imports
        AgGridModule,
        NumericOnlyDirective,

        ColorPickerModule
    ],

    imports: []
})
export class SharedModule { }
