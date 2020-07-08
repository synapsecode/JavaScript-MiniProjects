//Initialize the Global State Variables
var BMI_Height = 120;
var BMI_Weight = 30;
var BMI_bmi = 21
var BMI_Category = "Healthy";

//HTML Elements
bmi_display = document.getElementById("bmi-d");
w_display = document.getElementById("ws");
h_display = document.getElementById("hs");
c_display = document.getElementById("category");
w_slider = document.getElementById("wslider");
h_slider = document.getElementById("hslider");

//Update LocalStorage Function
function updateStorage() {
	localStorage.clear();
	localStorage.setItem('BMI_height', BMI_Height);
	localStorage.setItem('BMI_weight', BMI_Weight);
	localStorage.setItem('BMI_bmi', BMI_bmi);
	localStorage.setItem('BMI_category', BMI_Category);
}

function displayData(){
	h_display.innerHTML = BMI_Height + " cm";
	w_display.innerHTML = BMI_Weight + " kg";
	bmi_display.innerHTML = BMI_bmi;
	bmi_display.style.color = "black";
	c_display.innerHTML = "You are " + BMI_Category + "!";
	h_slider.value = BMI_Height;
	w_slider.value = BMI_Weight;
}


//Window OnLoad Event Handler
window.addEventListener('load', function () {
	// If there is data in the localstorage
	if(localStorage.length > 0){
		//Reinitialize  Global Variables to localStorage value
		BMI_Height = localStorage.getItem('BMI_height');
		BMI_Weight = localStorage.getItem('BMI_weight');
		BMI_bmi = localStorage.getItem('BMI_bmi');
		BMI_Category = localStorage.getItem('BMI_category');
	}

	//Display Data from the Global Variables
	displayData();
});


//Calculate BMI Function
function calculateBMI(){
	//calculation
	BMI = (BMI_Weight)/Math.pow((BMI_Height/100), 2);
	//Rounding Off
	if(Math.ceil(BMI) - BMI <= BMI - Math.floor(BMI)){
		BMI = Math.ceil(BMI);
	}else{
		BMI = Math.floor(BMI);
	}
	BMI_bmi = BMI; //Update Global Variable

	//figure out categories and change display color
	if(BMI_bmi>=30){
		BMI_Category = "Obese";
		bmi_display.classList.remove("text-success");
		bmi_display.classList.remove("text-primary");
		bmi_display.classList.remove("text-warning");
		bmi_display.classList.add("text-danger");
	}else if(BMI_bmi >= 25 && BMI_bmi < 30){
		BMI_Category = "Overweight"	
		bmi_display.classList.remove("text-success");
		bmi_display.classList.remove("text-primary");
		bmi_display.classList.remove("text-danger");
		bmi_display.classList.add("text-warning");
	}else if(BMI_bmi >= 19 && BMI_bmi < 25){
		BMI_Category = "Healthy"
		bmi_display.classList.remove("text-danger");
		bmi_display.classList.remove("text-primary");
		bmi_display.classList.remove("text-warning");
		bmi_display.classList.add("text-success");
	}else if(BMI_bmi<19){
		BMI_Category = "Underweight"
		bmi_display.classList.remove("text-success");
		bmi_display.classList.remove("text-danger");
		bmi_display.classList.remove("text-warning");
		bmi_display.classList.add("text-primary");
	}

	//Display Data
	displayData();

	//Update Local Storage
	updateStorage();
}

//Add Slider Event Handlers
h_slider.addEventListener("change", function(){
	BMI_Height = this.value;
	calculateBMI();
});
w_slider.addEventListener("change", function(){
	BMI_Weight = this.value;
	calculateBMI();
});