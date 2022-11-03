import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { sharedModules } from "../../../shared/shared-modules";
import { SearchPanelComponent } from "../../../components/search-panel/search-panel.component";
import {
  PaginatedDocumentListComponent
} from "../../../components/paginated-document-list/paginated-document-list.component";
import { Pageable, SearchParams } from "../../../models/model";
import { SearchService } from "../../../search.service";
import { finalize, Subject, switchMap, tap } from "rxjs";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  standalone: true,
  imports: [
    ...sharedModules,
    SearchPanelComponent,
    PaginatedDocumentListComponent
  ],
  host: {
    class: 'd-flex flex-column'
  }
})
export class AccueilComponent implements OnInit {
  private searchService = inject(SearchService);
  private searchParams?: SearchParams;

  @ViewChild(PaginatedDocumentListComponent) documentList!: PaginatedDocumentListComponent;
  searchLaunched = false;
  pageLoading = false;

  pageLoad = new Subject<{ params: SearchParams, pageable?: Pageable }>();

  ngOnInit() {
    this.pageLoad.pipe(
      tap(() => {
        this.searchLaunched = true;
      }),
      switchMap(({params, pageable}) => {
        this.pageLoading = true;
        return this.searchService.search({...params, ...pageable}).pipe(
          finalize(() => {
            this.pageLoading = false;
          })
        );
      })
    ).subscribe((page) => {
      this.documentList?.loadPage(page);
    })
  }

  doSearch(params: SearchParams) {
    this.searchParams = params;
    this.pageLoad.next({params: this.searchParams})
  }

  loadPage(pageable: Pageable) {
    if (this.searchParams) {
      this.pageLoad.next({params: this.searchParams, pageable})
    }
  }
}
