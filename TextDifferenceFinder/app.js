/*
	Steps to Perform (Algorithm Idea):
	
	1. Tokenization: Split the text in each TextArea by spaces and form words and save in 2 arrays
		(a) Clean up the words => Remove leading and trailing spaces
		(b) convert all new lines into spaces
	2. Loop through Original List
		=> forEach word in OL => {
			(a) search word in NL
			(b) if(word, is at same index in OL & NL => unchanged => unchanged list => no color<NL> )
			(c) if(word, is at a different index in NL => shuffled => shuffled list => grey<NL> )
			(d) if(word, is not present at all in NL => removed => removed list => red<OL>)
		}
	3. Perform a CheckSum on NL => {
		(a) find the length of NL
		(b) Iterate from 0 to len(NL)-1 as i => {
			check if i is in {unchanged, shuffled or removed} list => if not => add to added list
		}
		(c) for every index in added list => green<NL>
	}
	4. Highlighting => 
		Highlight words at specific indexes in NL & OL depending upon individual list components
	5. Return Status => {
		if(unchanged, shuffled, removed or added list has data) => Operation Performed
		else => The 2 paragraphs are exactly identical
	}
	6. Done
*/

//Make element references
OT = document.getElementById("otext");
NT = document.getElementById("ntext");
comparebtn = document.getElementById("compare");

//Helper functions
function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function findDifferences(O, N, o_indexes, n_indexes){
	//Declarations
	unchanged_list = [];
	shuffled_list = [];
	removed_list = [];
	added_list = [];

	len_O = O.length;
	len_N = N.length;
	//1(a) Cleaning up the words
	for(i=0; i<len_O; i++) O[i] = O[i].trim();
	for(i=0; i<len_N; i++) N[i] = N[i].trim();

	//Main Loop
	O.forEach(word => {
		o_i = o_indexes[word][0];
		if(n_indexes[word].length > 0){
			n_i = n_indexes[word][0];
			//console.log(o_i, n_i);
			if(o_i == n_i){
				//Unchanged
				//console.log("Unchanged Word<NT>: '" + N[n_indexes[word][0]] + "'");
				unchanged_list.push(n_i);
			}else{
				//Shuffled
				//console.log("Shuffled Word<NT>: '" + N[n_indexes[word][0]] + "'");
				shuffled_list.push(n_i);
			}
			n_indexes[word] = n_indexes[word].slice(1, len_N);
		}else{
			//console.log("Removed Word<OT>: '" +  O[o_indexes[word][0]] + "'");
			removed_list.push(o_i);
		}
		o_indexes[word] = o_indexes[word].slice(1, len_O);
	});

	//Perform Checksum
	for(i=0; i<len_N; i++){
		if(unchanged_list.includes(i) || shuffled_list.includes(i)) continue;
		else {
			added_list.push(i);
		}
	}

	//Return the lists
	return {
		'O':O,
		'N':N,
		'Unchanged': unchanged_list,
		'Shuffled': shuffled_list,
		'Added': added_list,
		'Removed': removed_list
	}
}

function highlighter(differences){
	//Make Changes counter update its values
	document.getElementById("adisp").innerHTML = differences['Added'].length;
	document.getElementById("rdisp").innerHTML = differences['Removed'].length;
	document.getElementById("sdisp").innerHTML = differences['Shuffled'].length;

	//Add original text to the new div
	odiv = document.getElementById("od");
	ndiv = document.getElementById("nd");
	odiv.innerHTML = "";
	ndiv.innerHTML = "";

	oin={}, nin = {};
	differences['O'].forEach(word => oin[word] = getAllIndexes(differences['O'], word));
	differences['O'].forEach(word => nin[word] = getAllIndexes(differences['N'], word));
	//console.log(oin);
	//console.log(nin);


	differences['N'].forEach(word => {
		if( nin[word] != undefined && nin[word].length > 0){
			if(differences['Shuffled'].includes(nin[word][0]) || differences['Unchanged'].includes(nin[word][0])){
				if(differences['Shuffled'].includes(nin[word][0])){
					ndiv.innerHTML += `<span id="rearranged">${word}</span> `;
				}else if(differences['Unchanged'].includes(nin[word][0])){
					ndiv.innerHTML += `<span>${word}</span> `;
				}
			}else{
				ndiv.innerHTML += `<span id="added">${word}</span> `;
			}
			nin[word] = nin[word].slice(1, differences['N'].length);
		}else{
			ndiv.innerHTML += `<span id="added">${word}</span> `;
		}
	});

	//Add new text to the orig div
	differences['O'].forEach(word => {
		if(differences['Removed'].includes(oin[word][0])){
			odiv.innerHTML += `<span id="removed">${word}</span> `;
		}else{
			odiv.innerHTML += `<span>${word}</span> `;
		}
		oin[word] = oin[word].slice(1, differences['O'].length);
	});
}
	
comparebtn.onclick = () => {
	document.getElementById("holder").classList.add('vertalign');
	//1. Tokenization (and cleanup of all newlines to spaces)
	var OA = OT.value.replace(/\n/g, " ").split(" ")
	var NA = NT.value.replace(/\n/g, " ").split(" ")

	//Make a word count dictionary
	o_indexes={}, n_indexes = {};
	OA.forEach(word => o_indexes[word] = getAllIndexes(OA, word));
	OA.forEach(word => n_indexes[word] = getAllIndexes(NA, word));
	//console.log(o_indexes);
	//console.log(n_indexes);

	differences = findDifferences(OA, NA, o_indexes, n_indexes);
	//console.log(differences);
	highlighter(differences);

	if(differences['Removed'].length > 0 ||
	   differences['Added'].length > 0 ||
	   differences['Shuffled'].length > 0
	){}
	else alert("The 2 documents are exactly equal")

}