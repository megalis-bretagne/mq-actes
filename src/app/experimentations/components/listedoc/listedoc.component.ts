import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ViewModel } from 'src/app/models/acte.viewmodel';
import { acte, actes } from '../../../models/acte.viewmodel.examples'

interface Node {
  expandable: boolean;
  acte: ViewModel.Acte;
  level: number;
}

@Component({
  selector: 'app-listedoc',
  templateUrl: './listedoc.component.html',
  styleUrls: ['./listedoc.component.sass']
})
export class ListedocComponent implements OnInit {

  _un_acte = acte()
  _des_actes = actes()

  _actes = actes()
    .map(acte => {
      // @ts-ignore
      acte.children = [acte];
      return acte;
    });

  private _transformer = (acte: ViewModel.Acte, level: number) => {
    return {
      expandable: level == 0,
      acte: acte,
      level: level,
    }
  }

  treeControl = new FlatTreeControl<Node>(node => node.level, node => node.expandable)
  treeFlattener = new MatTreeFlattener(
    this._transformer, 
    node => node.level, 
    node => node.expandable, 
    node => {
      // @ts-ignore
      return node.children
    }
  )
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = this._actes
  }

  ngOnInit(): void {
  }

  hasChild(_: number, node: Node) {
    return node.expandable
  }
}