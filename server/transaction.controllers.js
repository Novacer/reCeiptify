const { default: axios } = require('axios');
const firebase = require('firebase');
const shortid = require('shortid');
const _ = require('lodash');

module.exports = {
  transfer: (req, res, next) => {
    const { amount, currency, fromAccountId, toAccountId } = req.body;
    const db = firebase.database();
    const tdUrl = "https://api.td-davinci.com/api/transfers";
    const tdKey = process.env.TD_KEY;

    axios.post(tdUrl, { ...req.body, description: 'LEJR' }, { headers: { Authorization: tdKey } })
      .then((response) => {
        const { data } = response;
        const { id: tdTransactionId, ...otherData } = data.result;
        const transactionId = shortid.generate();
        const transaction = {
          ...otherData,
          tdTransactionId,
          id: transactionId,
        };
        console.log(transaction);
        db.ref('/transactions/' + transactionId).set(transaction)
          .then(() => res.json(transaction));
      })
      .catch(err => console.log(err));
  },

  fetchAll: (req, res) => {
    const db = firebase.database();
    db.ref('/transactions').once('value')
      .then((snapshot) => {
        const transactions = Object.values(snapshot.val());
        res.json(transactions);
      });
  },

  reimburse: (req, res) => {
    const { userId } = req.params;
    const db = firebase.database();

    db.ref('/expenses').once('value')
      .then((expenses) => {
        const userExpenses = Object.values(expenses.val())
          .filter(e => e.userId === userId);
        const sum = _.sumBy(userExpenses, 'amount');
        res.json({ amount: sum, userId });
      })
  }
}
