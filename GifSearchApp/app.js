const api_key = "JIPaL3biwf5lYZxtdF59IPOL6Vst5PNk"
var no_of_newss = 90;

function createnewsCard(title, owner, url){
	if(owner == "") owner="public";

	return `
	<div class="card newscard" style="width: 18rem;">
		<img src="${url}" class="card-img-top" alt="...">
		<div class="card-body">
			<h5 class="card-title">${title}</h5>
			<p class="card-text">by ${owner}</p>
		</div>
	</div>
	`;
}

document.addEventListener("DOMContentLoaded", init);
      function init() {
        document.getElementById("searchbtn").addEventListener("click", ev => {
		ev.preventDefault(); //to stop the page reload
		document.getElementById("canvas").innerHTML = "";
		//getting search and formulating url query
		let url = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&limit=${no_of_newss}&q=`;
		let str = document.getElementById("searchbar").value.trim();
		url = url.concat(str);

		//create rows and columns
		no_of_rows = no_of_newss/3;

		for(i=0; i<no_of_rows; i++){
			document.getElementById("canvas").innerHTML += `
			<div class="row" id="r${i}">
				<div class="column" id="r${i}c1">
				
				</div>
				<div class="column" id="r${i}c2">
				
				</div>
				<div class="column" id="r${i}c3">
				
				</div>
			</div>
			`;
		}
		fetch(url)
			.then(response => response.json())
			.then(content => {
				newsobs = [];
				content.data.forEach(news => {
					imgurl = news.images['downsized'].url
					newsObject = createnewsCard(news.title, news.username, imgurl);
					newsobs.push(newsObject);
				});
				c=0;
				i=0;
				while(c<no_of_newss){
					slot1 = document.getElementById(`r${i}c1`);
					slot2 = document.getElementById(`r${i}c2`);
					slot3 = document.getElementById(`r${i}c3`);
					(newsobs[c]) ? slot1.innerHTML+=newsobs[c]  : slot1.innerHTML+="";
					(newsobs[c+1]) ? slot2.innerHTML+=newsobs[c+1]  : slot1.innerHTML+="";
					(newsobs[c+2]) ? slot3.innerHTML+=newsobs[c+2]  : slot1.innerHTML+="";
					c+=3;
					i++;
				}
			})
			.catch(err => {
				console.error(err);
			});
		});
	}