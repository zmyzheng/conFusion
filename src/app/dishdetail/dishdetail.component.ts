import { Component, OnInit, Input, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  // @Input()
  dish: Dish;

  dishIds: number[];
  prev: number;
  next: number;

  errMess: string;

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    // let id = +this.route.snapshot.params['id'];
    // this.dishservice.getDish(id)
    //   .subscribe(dish => this.dish = dish);
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);

    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))  //监测params的变化
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]; //index=0 prev=最后一个
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }


  goBack(): void {
    this.location.back();
  }

}
