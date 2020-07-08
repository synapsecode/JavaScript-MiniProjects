const api_key = "JIPaL3biwf5lYZxtdF59IPOL6Vst5PNk"
var no_of_newss = 40;

function createNewsCard(title, link, url){
	if(url == "https://raw.githubusercontent.com/theuitown/COROAPIWEB/master/20200328_183732_0000.png" ||
		url == "https://static.newsnationtv.com/nntv-eng-web/images/lazy-loading.png"){
		url = "https://fmshooter.com/wp-content/uploads/2020/01/virus.jpg";
	}
	return `
	<div class="card newscard" style="width: 18rem;">
		<img src="${url}" class="card-img-top" alt="...">
		<div class="card-body">
			<h5 class="card-title">${title}</h5><br>
			<a href="${link}" class="btn btn-danger">Read More</a>
		</div>
	</div>
	`;
}

document.addEventListener("DOMContentLoaded", init);

function init() {
	document.getElementById("canvas").innerHTML = "";
	//getting search and formulating url query
	let url = "https://cryptic-ravine-96718.herokuapp.com/";

	//creating the news body skeleton
	for(i=0; i<no_of_newss; i++){
		document.getElementById("canvas").innerHTML += `
		<div class="row" id="r${i}">
		</div>
		`;
	}

	//getting the news articles
	fetch(url)
		.then(response => response.json())
		.then(content => {
			newsobs = [];
			for(i=0; i<no_of_newss; i++){
				e = content['news'][i];
				slot1 = document.getElementById(`r${i}`);
				newsObject = createNewsCard(e.title, e.link, e.img);
				slot1.innerHTML+=newsObject;
			}
		})
		.catch(err => {
			console.error(err);
		});


	
	fetch("https://api.covid19api.com/summary")
	.then(response => response.json())
	.then(content => {
		//World Count
		document.getElementById("wa_c").innerHTML = (content["Global"]['TotalConfirmed'] - (content["Global"]['TotalDeaths'] + content['Global']['TotalRecovered']));
		document.getElementById("wr_c").innerHTML = content['Global']['TotalRecovered'];
		document.getElementById("wd_c").innerHTML = content["Global"]['TotalDeaths'];
		document.getElementById("wt_c").innerHTML = content["Global"]['TotalConfirmed'];

		//India Count
		document.getElementById("a_c").innerHTML = (content["Countries"]["76"]['TotalConfirmed'] - (content["Countries"]["76"]['TotalDeaths'] + content['Countries']["76"]['TotalRecovered']));
		document.getElementById("c_c").innerHTML = content['Countries']["76"]['TotalRecovered'];
		document.getElementById("t_c").innerHTML = content["Countries"]["76"]['TotalConfirmed'];
		document.getElementById("d_c").innerHTML = content["Countries"]["76"]['TotalDeaths'];

	}).catch(err=> {
		console.log(err);
		alert("Too Many Requests have been made to the API. Please wait for sometime")	
	});
	
}
	