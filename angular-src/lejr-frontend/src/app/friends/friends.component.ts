import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../services/firebase.service";
import {ExpensesService} from "../services/expenses.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  public seanAmountOwing : number;

  public isIsabella : boolean;

  constructor(private fbService: FirebaseService, private expenseService: ExpensesService) {
    this.seanAmountOwing = 0;

    this.isIsabella = (localStorage.getItem("user") === "Isabella")
  }

  ngOnInit() {
    this.fbService.getAmountsOweing().on("value", snapshot => {
      this.seanAmountOwing = snapshot.val().amountOweing;
    });
  }

  onPayClick() {
    this.expenseService.transferMoney().subscribe(response => {
      console.log(response);
    });
  }

}
