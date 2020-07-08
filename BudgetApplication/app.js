//DOM Elements
const transactionbox = document.getElementById("txb");
const w_details = document.getElementById("witdetails");
const w_amt = document.getElementById("witamt");
const d_details = document.getElementById("depdetails");
const d_amt = document.getElementById("depamt");
const txd = document.getElementById("tx_dep");
const txw = document.getElementById("tx_wit");
const budget = document.getElementById("n-budget");
const expense = document.getElementById("n-expense");
const balance = document.getElementById("n-balance");
const debtnotifier = document.getElementById("debtnotif");

class ExpenseTrackerApp{

	//Constructor
	constructor(txr=undefined, txc=undefined){
		if(txc && txr){
			this.transactionRecord = txr;
			this.txcount = txc;
		}else{
			this.transactionRecord = [];
			this.txcount = 0;
		}
	}

	//Custom function to truncate decimal places without rounding off
	toFixedWithoutRounding(x, n){
		let fractionalpart, integerpart, d_index;
		x = x.toString();
		d_index = x.indexOf(".");
		if(d_index < 0){ //Whole number
			integerpart = x;
			fractionalpart = '00';
		}else{ //Decimal
			integerpart = x.substring(0, d_index);
			fractionalpart = x.substring(d_index+1, x.length).substring(0,n);
		}
		return `${integerpart}.${fractionalpart}`;
	}

	//converts the text into numeric money format
	formatAmount(txamount){
		let amt = "";
		let d = "";
		if(txamount===""){
			return 0;
		}
		for(let x of txamount){
			switch(x){
				case ",":
					continue;
				case "$":
					continue;
				case "M":
					d="M";
					break;
				case "K":
					d="K";
					break;	
				case "B":
					d="B";
					break;
				case "T":
					d="T";
					break
				case "m":
					d="M";
					break;
				case "k":
					d="K";
					break;	
				case "b":
					d="B";
					break;
				case "t":
					d="T";
					break
				default:
					amt+=x;
			}
		}
		amt = parseFloat(amt);
		switch(d){
			case "M":
				amt*=1000000;
				break;
			case "K":
				amt*=1000;
				break;	
			case "B":
				amt*=1000000000;
				break;
			case "T":
				amt*=1000000000000;
				break;
			default:
				amt = amt;
		}
		return amt;
	}

	//Creates a transaction record and updates the dom
	createTransactionRecord(txname, txamount, txtype, txtimestamp, rx=undefined){
		//Restorations
		if(rx){
			let txid = rx['tx_id'];
			let col = (txtype === 'Withdrawal') ? 'danger' : 'success';
			let obj = `
				<a href="#" id="tx-${txid}" class="list-group-item list-group-item-action flex-column align-items-start bg-dark text-light mb-1">
					<div class="d-flex w-100 justify-content-between">
						<div><h5 class="mb-1">${txname}</h5></div>
						<div>
							<button data-txid="${txid}" class="m-1 del" onclick="app.deleteTransaction(this)"><img src="https://img.icons8.com/color/28/000000/erase.png"/></button>
							<small>${txtimestamp}</small>
						</div>
					</div>
					<h2 class="mb-1 text-${col}">&#8377;${txamount}</h2>
					<small>${txtype} Transaction</small>
				</a>
			`;
			transactionbox.innerHTML += obj;
			return true;
		}

		let txid=this.txcount;
		let tx_obj = {
			'tx_id': txid,
			'tx_name': txname,
			'txamount': this.formatAmount(txamount),
			'txtype': txtype,
			'txtimestamp': txtimestamp
		};
		this.transactionRecord.push(tx_obj);
		let col = (txtype === 'Withdrawal') ? 'danger' : 'success';
		let obj = `
			<a href="#" id="tx-${txid}" class="list-group-item list-group-item-action flex-column align-items-start bg-dark text-light mb-1">
				<div class="d-flex w-100 justify-content-between">
					<div><h5 class="mb-1">${txname}</h5></div>
					<div>
						<button data-txid="${txid}" class="m-1 del" onclick="app.deleteTransaction(this)"><img src="static/erase.png"/></button>
						<small>${txtimestamp}</small>
					</div>
				</div>
				<h2 class="mb-1 text-${col}">&#8377;${txamount}</h2>
				<small>${txtype} Transaction</small>
			</a>
		`;
		transactionbox.innerHTML += obj;
		this.txcount++;
		this.compute();
	}

	//recalculates balance tally
	compute(){
		let M = 1000000;
		let B = 1000000000;
		let T = 1000000000000;
		let bd = 0;
		let ex = 0;
		this.transactionRecord.forEach(e => {
			if(e.txtype === "Deposit"){
				bd += e.txamount;
			}else if(e.txtype === "Withdrawal"){
				ex += e.txamount;
			}
		});
		let bal = bd-ex;

		//showing the real values
		document.getElementById("rbud").innerHTML = `&#8377;${bd}`;
		document.getElementById("rex").innerHTML = `&#8377;${ex}`;
		document.getElementById("rbal").innerHTML = `&#8377;${bal}`;

		bd =  (bd>T) ? `${this.toFixedWithoutRounding((bd/T),2)}T` : (bd>B) ? `${this.toFixedWithoutRounding((bd/B),2)}B` : (bd>M) ? `${this.toFixedWithoutRounding((bd/M),2)}M` : this.toFixedWithoutRounding(bd,2);
		ex = (ex>T) ? `${this.toFixedWithoutRounding((ex/T),2)}T` : (ex>B) ? `${this.toFixedWithoutRounding((ex/B),2)}B` : (ex>M) ? `${this.toFixedWithoutRounding((ex/M),2)}M` : this.toFixedWithoutRounding(ex,2);
		console.log(bal);
		if(bal<0){
			console.log(bal);
			debtnotifier.innerHTML = "DEBT"
			bal = (bal<-T) ? `${this.toFixedWithoutRounding((bal/T),2)}T` : (bal<-B) ? `${this.toFixedWithoutRounding((bal/B),2)}B` : (bal<-M) ? `${this.toFixedWithoutRounding((bal/M),2)}M` : this.toFixedWithoutRounding(bal,2);
		}else{
			debtnotifier.innerHTML = ""
			bal = (bal>T) ? `${this.toFixedWithoutRounding((bal/T),2)}T` : (bal>B) ? `${this.toFixedWithoutRounding((bal/B),2)}B` : (bal>M) ? `${this.toFixedWithoutRounding((bal/M),2)}M` : this.toFixedWithoutRounding(bal,2);
		}
		console.log(bal);
		budget.innerHTML = `&#8377;${bd}`;
		expense.innerHTML = `&#8377;${ex}`;
		balance.innerHTML = `&#8377;${bal}`;

		//save app state
		this.saveAppState();
	}

	deleteTransaction(el){
		let txid = el.dataset.txid;
		document.getElementById(`tx-${txid}`).remove();
		this.transactionRecord.forEach(tx => {
			if(tx['tx_id'] == txid){
				tx['txtype'] = (tx['txtype'] == "Deposit") ? 'CancelledTransaction<D>' : 'CancelledTransaction<W>';
			}
		});
		this.compute();
	}
	
	restoreCancelledTransactions(){
		let c=0;
		this.transactionRecord.forEach(tx => {
			if(tx['txtype'] == "CancelledTransaction<D>" || tx['txtype'] == "CancelledTransaction<W>"){
				c++;
				tx['txtype'] = (tx['txtype'] == "CancelledTransaction<D>") ? 'Deposit' : 'Withdrawal';
				this.createTransactionRecord(tx['tx_name'], tx['txamount'], tx['txtype'], tx['txtimestamp'], tx);
			}
		});
		this.compute();
		if(c==0) alert("No Transactions have been cancelled.")
	}
	
	deleteTransactionData(){
		this.txcount=0;
		this.transactionRecord.forEach(tx => {
			let el = document.getElementById(`tx-${tx['tx_id']}`);
			(el) ? document.getElementById(`tx-${tx['tx_id']}`).remove() : console.log("CancelledTX");
		});
		this.transactionRecord = [];
		this.compute();
		this.deleteAppState();
	}
	
	//Saves the current app to localStorage
	saveAppState(){
		this.deleteAppState();
		localStorage.setItem("tx_count", this.txcount);
		localStorage.setItem("transaction_records", JSON.stringify(this.transactionRecord));
	}

	//Deletes the current app state from Localstorage
	deleteAppState(){
		localStorage.removeItem("tx_count");
		localStorage.removeItem("transaction_records");
	}
}

//declaration of application instance from start or from a localStorage image;
let app;
if(localStorage.getItem("tx_count") && localStorage.getItem("transaction_records")){
	app = new ExpenseTrackerApp(JSON.parse(localStorage.getItem("transaction_records")), localStorage.getItem("tx_count"));
	app.transactionRecord.forEach(e => {
		console.log(e);
		if(e.txtype ==="Deposit" || e.txtype ==="Withdrawal"){
			app.createTransactionRecord(e.tx_name, e.txamount, e.txtype, e.txtimestamp, e);
		}
	});
	app.compute();
}else{
	app = new ExpenseTrackerApp();
}

//Initiate Deposit Transaction
txd.onclick = () => {
	app.createTransactionRecord(d_details.value, d_amt.value, "Deposit", Date().toLocaleString())
	d_details.value = "";
	d_amt.value = "";
}

//Initiate Withdrawal Transaction
txw.onclick = () => {
	app.createTransactionRecord(w_details.value, w_amt.value, "Withdrawal", Date().toLocaleString())
	w_details.value = "";
	w_amt.value = "";
}

