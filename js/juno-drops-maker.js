var isAutoDropsStopped = false;
var repeatDrop = false;
let offsetX, offsetY, x, y, isControlPanelDragging = false;

var c = 0;
var i = 0;


// make it possible for the mailer to specify the drop amount
const dropAmount = 6000


function setDropUIElements(){
  document.querySelector(".nav").remove();
  document.querySelector(".content").style.left = "270px";

  // the main left side container
  const container = document.createElement("div");
  container.style.width = "270px";
  container.style.height = "100%";
  container.style.position = "absolute";
  container.style.backgroundColor = "black";
  container.style.padding = "10px";
  container.style.background = '#00549a';

  // the first textarea section
  const textareaSection1 = document.createElement("div");
  textareaSection1.innerHTML = `
  	  <h1 style="font-weight:bold;color:white;text-align:center;margin:10px">AUTO DROP MAKER</h1>
      <!-- <input type="checkbox" id="reverse"> Reverse -->
      <!-- <input type="checkbox" id="multipart"> Multipart -->
      <br /><br />
      <!-- <textarea id="nr" rows="1" placeholder="Enter text here"></textarea> -->
    `;

  // the second textarea section
  const textareaSection2 = document.createElement("div");
  textareaSection2.innerHTML = `
      <textarea id="CreativeLh" style="width=100%" placeholder="Creative (With Negative Text)"></textarea>
      <textarea id="my-ips-input"  placeholder="Ips"></textarea>
      <textarea id="my-froms-input"  placeholder="Froms"></textarea>
      <!-- <textarea id="my-negas-input" placeholder="Negatives"></textarea> --> 
      <textarea id="my-negas-input" placeholder="Negatives"></textarea>
      <input type="checkbox" id="active"> Auto Generate Negative
      <br/><br/>
      <textarea id="my-starts-input" placeholder="Starts"></textarea>
      <input type="number" id="my-drops-count" placeholder="Drops Count" />
      
      <input style="margin-top: 30px; font-size: 25px; background: 4CAF50; padding: 15px 32px; color: white; min-width:100%" id="start-drops-btn" type="submit" value="START" />
    `;
  
  	// listen to the auto generate negative checkbox and enable/disable the textarea for negative files accordingly
  	const autoGenerateNegativeCheckbox = textareaSection2.querySelector("#active");
  	autoGenerateNegativeCheckbox.addEventListener("change", function (){
    	if(autoGenerateNegativeCheckbox.checked){
          textareaSection2.querySelector("#my-negas-input").disabled = true;
          textareaSection2.querySelector("#my-negas-input").style.opacity = 0.6;
          textareaSection2.querySelector("#CreativeLh").placeholder = "Creative (Without Negative Text)";
        }else{
          textareaSection2.querySelector("#my-negas-input").disabled = false;
          textareaSection2.querySelector("#my-negas-input").style.opacity = 1;
          textareaSection2.querySelector("#CreativeLh").placeholder = "Creative (With Negative Text)";
        }
    })
  
	textareaSection2.querySelector("#my-ips-input").addEventListener("change", function (){
		const ipss = textareaSection2.querySelector("#my-ips-input")
		if(ipss.value){
			startshs = []
			for(var i = 0; i < ipss.value.split("\n").length * dropAmount; i += dropAmount){
				startshs.push(i)
			}
			textareaSection2.querySelector("#my-starts-input").value = startshs.join("\n");
          	textareaSection2.querySelector("#my-drops-count").value = startshs.length;
		}
	});
  
    // Append sections to the container
    container.appendChild(textareaSection1);
    container.appendChild(textareaSection2);

    // Append the container to the body
    const firstChild = document.querySelector(".center").firstChild;
    document.querySelector(".center").insertBefore(container, firstChild);
}



try {
  
	function initAutoDrops(){
		setDropUIElements()  
		document.getElementById("start-drops-btn").addEventListener("click", () => oklh());
		document.querySelectorAll(".send")[3].setAttribute("id", "sentlh");
	}
	  
	// Function to show a custom popup with an OK, Cancel buttons
	async function showCustomPopup(mainLoopIndex) {
		const ipsInput = document.getElementById("my-ips-input");
		const fromsInput = document.getElementById("my-froms-input");
		const startsFromLineInput = document.getElementById("my-starts-input");
		const negasInput = document.getElementById("my-negas-input");
		const dropsCountInput = document.getElementById("my-drops-count");
		const dropsCount = parseInt(dropsCountInput.value);
		var startshs = startsFromLineInput.value.split("\n");
      	var ips = ipsInput.value.split("\n")
        var fromss = fromsInput.value.split("\n")
		
	  return new Promise((resolve, reject) => {
		const popupContainer = document.createElement('div');
        popupContainer.style.minHeight = '500px';
        popupContainer.style.width = '500px';
		popupContainer.style.position = 'fixed';
        if(x){
          popupContainer.style.left = `${x}px`;
        }else{
          popupContainer.style.left = '0';
        }
        if(y){
          	popupContainer.style.top = `${y}px`;
        }else{
			popupContainer.style.top = '0';
        }        

		
		//popupContainer.style.transform = 'translate(-50%, -50%)';
		popupContainer.style.padding = '0 0 20px 0';
		//popupContainer.style.backgroundImage = 'url("https://cdn.wallpapersafari.com/70/22/0H2I8T.jpg")';
        //popupContainer.style.backgroundRepeat = 'no-repeat';
        //popupContainer.style.backgroundSize = 'cover';
        popupContainer.style.background = '#00549a';
		popupContainer.style.border = '1px solid #ccc';
		popupContainer.style.display = 'flex';
        popupContainer.style.flexDirection = 'column';
		popupContainer.style.justifyContent = 'space-between';
		popupContainer.style.alignItems = 'start';
		popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
		popupContainer.style.border = 'solid black 3px';
        
        const draggableHandle = document.createElement("div")
        draggableHandle.style.height = "30px"
        draggableHandle.style.marginBottom = "50px"
        draggableHandle.style.width = "100%"
        draggableHandle.style.background = "#dddddd"
        draggableHandle.style.display = "flex"
        draggableHandle.style.justifyContent = "center"
        draggableHandle.style.alignItems = "center"
        
         const handleBar = document.createElement("div")
         handleBar.style.height = "4px"
        handleBar.style.width = "150px"
        handleBar.style.background = "#000000"
        
        draggableHandle.appendChild(handleBar)
        
         draggableHandle.addEventListener('mousedown', (e) => {
      isControlPanelDragging = true;

      // initial offset
      offsetX = e.clientX - popupContainer.getBoundingClientRect().left;
      offsetY = e.clientY - popupContainer.getBoundingClientRect().top;

      
      draggableHandle.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isControlPanelDragging) return;
      
      x = e.clientX - offsetX;
      y = e.clientY - offsetY;
      
      popupContainer.style.left = `${x}px`;
      popupContainer.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isControlPanelDragging) {
        isControlPanelDragging = false;
        
        draggableHandle.style.cursor = 'grab';
        document.body.style.userSelect = 'unset';
      }
    });
        
        
        
        
        const actionButtonsContainer = document.createElement("div")
        actionButtonsContainer.style.width = '100%';
        actionButtonsContainer.style.margin = '0 20px';
        actionButtonsContainer.style.minWidth = '100%';
        actionButtonsContainer.style.display = 'flex';
        //actionButtonsContainer.style.flexDirection = 'column';
        actionButtonsContainer.style.marginBottom = '20px';
		
		const popupDropDetails = document.createElement('div');
        popupDropDetails.style.margin = '0 20px';
		popupDropDetails.innerHTML = `
		<table id="junodropsinfo" style="width: 460px; height: 100%; background: #f5f5f5; color: #000000; overflow:scroll;">
			<thead><tr style="background:#eeeeee;"><th>Id</th><th>IP</th><th>From</th><th>Start</th><th>Status</th><th></th></tr></thead>
			<tbody></tbody>
		</table></br>`
		
        
		for(var j = 0; j < mainLoopIndex; j++){
        	popupDropDetails.querySelector("tbody").innerHTML += `
			<tr style="padding:5px;background: #00ee00aa;">
				<td style="color: #000000;">${j+1}</td>
				<td style="color: #000000;">${ips[j]}</td>
                <td style="color: #000000;">${fromss[j]}</td>
                <td style="color: #000000;">${startshs[j]}</td>
                <td style="color: #000000;">Dropped</td>
                <td style="color: #000000;">➡️</td>
			</tr>`;
        }
		
		popupDropDetails.querySelector("tbody").innerHTML += `
		<tr style="padding:5px; background:#00ee0055;">
        	<td style="color: #000000;">${mainLoopIndex+1}</td>
			<td style="color: #000000;">${ips[mainLoopIndex]}</td>
            <td style="color: #000000;">${fromss[mainLoopIndex]}</td>
			<td style="color: #000000;">${startshs[mainLoopIndex]}</td>
			<td style="color: #000000;">Next</td>
            <td style="color: #000000;">⬅️</td>
		</tr>`;
		
        if(mainLoopIndex < ips.length){
          for(var h = mainLoopIndex+1; h < ips.length; h++){
        	popupDropDetails.querySelector("tbody").innerHTML += `
			<tr style="padding:5px;">
				<td style="color: #000000;">${h+1}</td>
                <td style="color: #000000;">${ips[h]}</td>
                <td style="color: #000000;">${fromss[h]}</td>
                <td style="color: #000000;">${startshs[h]}</td>
                <td style="color: #000000;">Upcoming</td>
                <td style="color: #000000;">⬅️</td>
			</tr>`;
        	} 
        }
		

		const okButton = document.createElement('button');
		// Apply epic styles
		okButton.style.backgroundColor = '#4CAF50';
        okButton.style.width = '100%';
		okButton.style.border = 'none';
		okButton.style.color = 'white';
		okButton.style.padding = '15px 32px';
		okButton.style.textAlign = 'center';
		okButton.style.textDecoration = 'none';
		okButton.style.display = 'flex';
        okButton.style.justifyContent = 'center';
		okButton.style.alignItems = 'center';
		okButton.style.fontSize = '16px';
		okButton.style.margin = '0 10px';
        okButton.title = "Launch Next Drop"
		okButton.style.transition = 'background-color 0.3s';
		// Add hover effect
		okButton.addEventListener('mouseover', function () {
		  okButton.style.backgroundColor = '#45a049';
		});

		okButton.addEventListener('mouseout', function () {
		  okButton.style.backgroundColor = '#4CAF50';
		});
		okButton.addEventListener('click', () => {
		  document.body.removeChild(popupContainer);
		  resolve("next");
		});
                
        okButton.innerHTML = `
        	<img style="display:inline;" src="https://pbs.twimg.com/media/GGZ_e44WcAAOShQ?format=png" width="40" />
        `
        
        
		actionButtonsContainer.appendChild(okButton);
		
		//----------
        
        
        const repeatButton = document.createElement('button');
        repeatButton.setAttribute("id", "juno-repeat-btn")
		repeatButton.style.backgroundColor = '#dddd00';
		repeatButton.style.border = 'none';
        repeatButton.style.width = '100%';
		repeatButton.style.color = 'white';
		repeatButton.style.display = 'flex';
        repeatButton.style.justifyContent = 'center';
		repeatButton.style.alignItems = 'center';        
		repeatButton.style.padding = '15px 32px';
		repeatButton.style.textAlign = 'center';
		repeatButton.style.textDecoration = 'none';
		repeatButton.style.fontSize = '16px';
		repeatButton.style.margin = '0 10px';
		repeatButton.style.transition = 'background-color 0.3s';
		repeatButton.title = 'Repeat Prev Drop';
        
		repeatButton.addEventListener('mouseover', function () {
		  repeatButton.style.backgroundColor = '#eeee00';
		});
		repeatButton.addEventListener('mouseout', function () {
		  repeatButton.style.backgroundColor = '#dddd00';
		});
        
		repeatButton.addEventListener('click', () => {
		  document.body.removeChild(popupContainer);
		  resolve("repeat");
		});
        
        repeatButton.innerHTML = `
        	<img style="display:inline;" src="https://pbs.twimg.com/media/GGZ_chKW0AAsUtd?format=png" width="40" />
        `
		actionButtonsContainer.appendChild(repeatButton);
		
		//----------
		
		const cancelButton = document.createElement('button');
		// Apply epic styles
		cancelButton.style.backgroundColor = '#ff0000';
		cancelButton.style.border = 'none';
		cancelButton.style.color = 'white';
        cancelButton.style.width = '100%';
		cancelButton.style.padding = '15px 32px';
		cancelButton.style.textAlign = 'center';
		cancelButton.style.textDecoration = 'none';
		cancelButton.style.display = 'flex';
        cancelButton.style.justifyContent = 'center';
		cancelButton.style.alignItems = 'center';
		cancelButton.style.fontSize = '16px';
		repeatButton.style.margin = '0 10px';
		cancelButton.style.transition = 'background-color 0.3s';
		cancelButton.title = 'Stop Auto Drops';
		// Add hover effect
		cancelButton.addEventListener('mouseover', function () {
		  cancelButton.style.backgroundColor = '#dd0000'; // Darker green on hover
		});

		cancelButton.addEventListener('mouseout', function () {
		  cancelButton.style.backgroundColor = '#ff0000';
		});
        
        cancelButton.innerHTML = `
            <img style="display:inline;" src="https://pbs.twimg.com/media/GGZ_ZkRXwAAsgLL?format=png" width="40" />
        `

		cancelButton.addEventListener('click', () => {
		  // stop everything
		  var stopAll = confirm("Are you sure you want to stop all of the auto Drops? you're gonna have to start all over again!");
		  if(stopAll){
			  isAutoDropsStopped = true;
			  document.body.removeChild(popupContainer);
			  reject();
		  }
		  
		});
        
		actionButtonsContainer.appendChild(cancelButton);
		
        //------------
        

        const upperWrapper = document.createElement("div")
        upperWrapper.style.display = "flex";
        upperWrapper.style.justifyContent = "center";
        upperWrapper.style.alignItems = "center";
        upperWrapper.style.width = "100%";
        upperWrapper.appendChild(draggableHandle)
        upperWrapper.appendChild(actionButtonsContainer)
        
        popupContainer.appendChild(upperWrapper);
        popupContainer.appendChild(popupDropDetails);
		
		document.body.appendChild(popupContainer);
	  });
	}


	// Function to manually trigger the next drop
	async function proceedToNextDrop(index) {
	  return await showCustomPopup(index);
	}
	  
	// Function that contains the main loop
	async function oklh() {
	  try {
		const ipsInput = document.getElementById("my-ips-input");
		const fromsInput = document.getElementById("my-froms-input");
		const startsFromLineInput = document.getElementById("my-starts-input");
		const negasInput = document.getElementById("my-negas-input");
		const dropsCountInput = document.getElementById("my-drops-count");
		const dropsCount = parseInt(dropsCountInput.value);
		
		console.log("Beginning...");
		console.log("drops count", dropsCount);
		dropsCountInput.value = 0;

		const fromLh = document.querySelector("#fromName");
		const IPSelectorLh = document.querySelector("#IPSelector");
		const LocateLh = document.querySelector("#restMTA");
		const stratLineFromLh = document.querySelector("#stratLineFrom");
		const SendLh = document.getElementById("sentlh");
		const BackLh = document.querySelector(".ion-android-arrow-back");

		const ipsInputs = ipsInput.value
		  .split("\n")
		  .map((ip) => ip.replaceAll("\t", "").trim());
		const fromsInputs = fromsInput.value.split("\n");
		
		
		
		if(startsFromLineInput.value){
			startshs = startsFromLineInput.value.split("\n");
		}else{
			for(var i = 0; i < ipsInputs.length * dropAmount; i += dropAmount){
				startshs.push(i)
			}
		}
		
		const negativesNames = negasInput.value.split("\n");

		console.log("ips", ipsInputs);
		console.log("froms", fromsInputs);
		console.log("starts", startshs);
		console.log("neggas", negativesNames);

		// main drops loop
		for (let i = 0; i < dropsCount; i++) {
			
			
		  if(isAutoDropsStopped){
			  break;
		  }else{
			  try{
				var result = await proceedToNextDrop(i);
                if(result === "repeat"){
					console.log("Repeating---------------------------")
                  	if (BackLh) BackLh.click();
                    IPSelectorLh.value = ipsInputs[i-1];
                    LocateLh.click();
                    fromLh.value = fromsInputs[i-1];
                    stratLineFromLh.value = startshs[i-1];
                    setCreative(i, negativesNames[i-1]);
                    SendLh.click();
                    alert(`Drop #${i} has been repeated.`);
                  	i--;
                  	continue;
                }
			  }catch(e){
                alert("Error")
                console.log("Error---------------------------")
                console.log(e);
                console.log(e.toString());
                console.log("Error---------------------------")
				  isAutoDropsStopped = true;
				  break;
			  }
			  console.log("Next ---------------------------")
			  if (BackLh) BackLh.click();
			  IPSelectorLh.value = ipsInputs[i];
			  LocateLh.click();
			  fromLh.value = fromsInputs[i];
			  stratLineFromLh.value = startshs[i];
			  setCreative(i, negativesNames[i]);
			  SendLh.click();
			  alert(`Drop #${i + 1} has been performed.`);  
		  }
		  
		}
		if(isAutoDropsStopped){
			alert(`Drops Successfully Stopped!`);
			isAutoDropsStopped = false
		}
	  } catch (e) {
		console.error("error--------");
		console.error(e);
		console.error("error--------");
	  }
	}


	function setCreative(i, negativesName) {
		var active = document.getElementById("active");
		if (active.checked) {
		  addNegativeToCreative(i);
		}else{
		  setNegative(negativesName)
		}
	}
	  
	  
	function setNegative(negaName){
	  const selectElement = document.getElementById('negativeFile');
	  for (var i = 0; i < selectElement.options.length; i++) {
		  if (selectElement.options[i].textContent === negaName) {
			  selectElement.selectedIndex = i;
              console.log("Negative file set to " + selectElement.options[i].textContent)
			  break;
		  }
	  }
	}
	  

	function addNegativeToCreative(i) {
		console.log("creating negative #"+i.toString()+"...");
		const negativePart = `
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >



	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	  <div id="divCheckbox" style="visibility: hidden; display:inline;"> 

	<SCRIPT>

	www.yyuziliigwqfsluvsxomnoblgcccfrplpj.edu/wjpebvcpqoekyffgufctuszeigukihieujttgzgnp    lon.jjhrtr
	www.qknhvsjalyupfxkhziwuxxwwyqswghvniv.edu/hyouyzssqbizgopohytpapwsrpzzopbbgitmohtmg    lon.sxrwts
	www.pqhmqngcebvtiuryxqpglbmdftijndepck.edu/eujkemhavciazesqjtppjvgvffphvyiadbkgkighr    lon.xjybej
	www.gunbcvdwqarabpobxujqbvbgzwtiluvifv.edu/ypwltymiukkghfwyvlrcitkssqlokyuvhajmupzda    lon.majuxx





	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft


	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft


	<![ngtag]>




	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft



	www.ozrcdjcpxdjzonqnxkngbikiungsbehirm.edu/rjpanydjuwhjmqomnuajgihrlgyoxpznnsnnjdhvu    lon.tgahcw
	www.grwtlewxwozetqttqhtqujntvtlbwhlplf.edu/gqhoupkidclkaruyffxfkmkqkdnqxlvprfkpcpkpy    lon.qzugis
	www.zxihdzucmmcrggzvkghasnlxyecsjtvlny.edu/idugpaiyrcmywqmqsypragucaczvharvfqscqmzfj    lon.wmqtfw

	[ngtag2]

	www.jltmmmnjmckkslwpytxzggeeyvchepqleg.edu/sxisszielmxfealvzudtpkeyuyhkvkupdgxbhezox    lon.ccvcgx
	www.bxirtbuqysavpkrltlfeijrjdadqcayxxd.edu/bastskjdgnrklopuqkcgoogwlsxbiksylcqtfzjea    lon.wmlern
	www.jltmmmnjmckkslwpytxzggeeyvchepqleg.edu/sxisszielmxfealvzudtpkeyuyhkvkupdgxbhezox    lon.ccvcgx
	www.bxirtbuqysavpkrltlfeijrjdadqcayxxd.edu/bastskjdgnrklopuqkcgoogwlsxbiksylcqtfzjea    lon.wmlern

	www.jltmmmnjmckkslwpytxzggeeyvchepqleg.edu/sxisszielmxfealvzudtpkeyuyhkvkupdgxbhezox    lon.ccvcgx
	www.bxirtbuqysavpkrltlfeijrjdadqcayxxd.edu/bastskjdgnrklopuqkcgoogwlsxbiksylcqtfzjea    lon.wmlern

	</SCRIPT>


	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >



	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >
	<!  __Random_com[10,20,lun]__Random_com[10,20,lun]__Random_com[10,20,lun]   >

	  <div id="divCheckbox" style="visibility: hidden; display:inline;"> 

	<SCRIPT>

	www.yyuziliigwqfsluvsxomnoblgcccfrplpj.edu/wjpebvcpqoekyffgufctuszeigukihieujttgzgnp    lon.jjhrtr
	www.qknhvsjalyupfxkhziwuxxwwyqswghvniv.edu/hyouyzssqbizgopohytpapwsrpzzopbbgitmohtmg    lon.sxrwts
	www.pqhmqngcebvtiuryxqpglbmdftijndepck.edu/eujkemhavciazesqjtppjvgvffphvyiadbkgkighr    lon.xjybej
	www.gunbcvdwqarabpobxujqbvbgzwtiluvifv.edu/ypwltymiukkghfwyvlrcitkssqlokyuvhajmupzda    lon.majuxx





	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft


	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft


	<![ngtag]>




	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft



	www.ozrcdjcpxdjzonqnxkngbikiungsbehirm.edu/rjpanydjuwhjmqomnuajgihrlgyoxpznnsnnjdhvu    lon.tgahcw
	www.grwtlewxwozetqttqhtqujntvtlbwhlplf.edu/gqhoupkidclkaruyffxfkmkqkdnqxlvprfkpcpkpy    lon.qzugis
	www.zxihdzucmmcrggzvkghasnlxyecsjtvlny.edu/idugpaiyrcmywqmqsypragucaczvharvfqscqmzfj    lon.wmqtfw

	[ngtag2]

	www.jltmmmnjmckkslwpytxzggeeyvchepqleg.edu/sxisszielmxfealvzudtpkeyuyhkvkupdgxbhezox    lon.ccvcgx
	www.bxirtbuqysavpkrltlfeijrjdadqcayxxd.edu/bastskjdgnrklopuqkcgoogwlsxbiksylcqtfzjea    lon.wmlern
	www.jltmmmnjmckkslwpytxzggeeyvchepqleg.edu/sxisszielmxfealvzudtpkeyuyhkvkupdgxbhezox    lon.ccvcgx
	www.bxirtbuqysavpkrltlfeijrjdadqcayxxd.edu/bastskjdgnrklopuqkcgoogwlsxbiksylcqtfzjea    lon.wmlern

	www.jltmmmnjmckkslwpytxzggeeyvchepqleg.edu/sxisszielmxfealvzudtpkeyuyhkvkupdgxbhezox    lon.ccvcgx
	www.bxirtbuqysavpkrltlfeijrjdadqcayxxd.edu/bastskjdgnrklopuqkcgoogwlsxbiksylcqtfzjea    lon.wmlern

	</SCRIPT>





	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	 
	<!Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??  __Random_com[5,10,l]__Random_com[2,4,l]__Random_com[10,12,l]__Random_com[5,44,l]__Random_com[4,3,l]__Random_com[20,3,l]__Random_com[5,3,l]__Random_com[5,7,l]__Random_com[5,9,l]   Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<Style> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	</Style> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<!Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??  __Random_com[5,10,l]__Random_com[2,4,l]__Random_com[10,12,l]__Random_com[5,44,l]__Random_com[4,3,l]__Random_com[20,3,l]__Random_com[5,3,l]__Random_com[5,7,l]__Random_com[5,9,l]   Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<!Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??  __Random_com[5,10,l]__Random_com[2,4,l]__Random_com[10,12,l]__Random_com[5,44,l]__Random_com[4,3,l]__Random_com[20,3,l]__Random_com[5,3,l]__Random_com[5,7,l]__Random_com[5,9,l]   Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<Style> 
	www.yyuziliigwqfsluvsxomnoblgcccfrplpj.edu/wjpebvcpqoekyffgufctuszeigukihieujttgzgnp    lon.jjhrtr 
	www.qknhvsjalyupfxkhziwuxxwwyqswghvniv.edu/hyouyzssqbizgopohytpapwsrpzzopbbgitmohtmg    lon.sxrwts 
	------------------------------------------------------------------------------ 
	www.pqhmqngcebvtiuryxqpglbmdftijndepck.edu/eujkemhavciazesqjtppjvgvffphvyiadbkgkighr    lon.xjybej 
	www.gunbcvdwqarabpobxujqbvbgzwtiluvifv.edu/ypwltymiukkghfwyvlrcitkssqlokyuvhajmupzda    lon.majuxx 
	[ngtag] 
	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur 
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu 
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft 
	------------------------------------------------------------------------------ 
	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur 
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu 
	 
	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur 
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu 
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft 
	 
	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur 
	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur 
	****************************************************************************** 
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu 
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft 
	****************************************************************************** 
	www.rfbaxrkugenvwtrlwtofqkhvlovogltlur.edu/lziqocfimidvnueiwfnpqlkizynubupkikzjfgvuc    lon.ptxjur 
	www.qmemtxsscksehkdunrojjvfvmvehgplbex.edu/lujtlfxthqczkxyadcvnmkvcusynqoxrhdiinrsgg    lon.ijurcu 
	www.hlrhdxfoznfzpxcfqoxlibtcfdfmhpnyzr.edu/xfbocaipzkybtjuapgnfqdnvyhuyxookcialiiepn    lon.oitnft 
	 </Style> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	<Style> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	</Style> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<!Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??  __Random_com[5,10,l]__Random_com[2,4,l]__Random_com[10,12,l]__Random_com[5,44,l]__Random_com[4,3,l]__Random_com[20,3,l]__Random_com[5,3,l]__Random_com[5,7,l]__Random_com[5,9,l]   Ã�???????????????Ã�??????????????Ã�?????????????Ã�????????????Ã�???????????Ã�??????????Ã�?????????Ã�????????Ã�???????Ã�??????Ã�?????Ã�????Ã�???Ã�??Ã�?Ã�Â¢??> 
	<!     
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	__Random_com[10,12,l] 
	> 
	<Style> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	__Random_com[19,20,l]@__Random_com[19,20,l].com 
	</Style> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]> 
	 
	<!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]><!__Random_com[1,3,ln]>`;

		var creativeLh = document.getElementById("CreativeLh").value;

		//var j = Math.floor(Math.random() * (5 - 0) + 0);
		//document.getElementById('nr').value = i + '-' + j;

		document.getElementById("message").value =
		  creativeLh + "\n\n\n" + processNegative(negativePart);
		//if (i > 58) i = 0;
	  }


	function processNegative(negativePart) {
		const neagtive = generateRandomTextWithRandomMeaningfulText();
		var nega = negativePart.replaceAll("[ngtag]", neagtive);
		return nega;
	  }


	function generateRandomTextWithRandomMeaningfulText(minSize = 30 * 1024, maxSize = 200 * 1024) {
		//const minSize = 30 * 1024; // 30KB in bytes
		//const maxSize = 1200 * 1024; // 1200KB in bytes
		function shuffleArray(array) {
		  for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			// Swap array[i] and array[j]
			[array[i], array[j]] = [array[j], array[i]];
		  }
		}
		const characters =
		  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const codeCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";

		const meaningfulTextList = [
		  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		  "The quick brown fox jumps over the lazy dog.",
		  "In God we trust, all others bring data.",
		  "To be or not to be, that is the question.",
		  "This is an example of meaningful text.",
		  "Life is what happens when you’re busy making other plans.",
		  "Keep calm and carry on.",
		  "The only thing we have to fear is fear itself.",
		  "Houston, we have a problem.",
		  "May the Force be with you.",
		  "One small step for man, one giant leap for mankind.",
		  "A penny for your thoughts.",
		  "When in Rome, do as the Romans do.",
		  "Hakuna Matata.",
		  "You can't handle the truth.",
		  "I feel the need... the need for speed.",
		  "There’s no place like home.",
		  "Just keep swimming.",
		  "I'm king of the world!",
		  "Frankly, my dear, I don't give a damn.",
		  "Here's looking at you, kid.",
		  "I'll be back.",
		  "Life is like a box of chocolates.",
		  "You talking to me?",
		  "Go ahead, make my day.",
		  "Bond. James Bond.",
		  "There's no crying in baseball.",
		  "You had me at hello.",
		  "I am your father.",
		  "I coulda been a contender.",
		  "You've got to ask yourself one question: Do I feel lucky? Well, do you, punk?",
		  "Love means never having to say you're sorry.",
		  "There's no such thing as a free lunch.",
		  "Show me the money!",
		  "Say hello to my little friend.",
		  "E.T. phone home.",
		  "I'll have what she's having.",
		  "Fasten your seatbelts, it's going to be a bumpy night.",
		  "Houston, we have a problem.",
		  "You complete me.",
		  "You had me at hello.",
		  "To infinity and beyond!",
		  "Shaken, not stirred.",
		  "Here's Johnny!",
		  "I'll be back.",
		  "I see dead people.",
		  "I'm the king of the world!",
		  "I'm king of the world!",
		  "I am Iron Man.",
		  "I am Groot.",
		  "I have nothing to declare except my genius.",
		  "The stuff that dreams are made of.",
		  "There's no place like home.",
		  "I'm having an old friend for dinner.",
		  "I'm ready for my close-up.",
		  "I'm ready, I'm ready!",
		  "I'll get you, my pretty, and your little dog too!",
		  "I'm not bad. I'm just drawn that way.",
		  "To be or not to be, that is the question.",
		  "My precious.",
		  "This is the start of a beautiful friendship.",
		  "That's not a knife. That's a knife.",
		];

		// Generate a random size within the specified range
		const textSize =
		  Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

		let randomText = "";

		while (randomText.length < textSize) {
		  if (Math.random() < 0.5) {
			// Add random character or code const
			randomIndex = Math.floor(
			  Math.random() * (characters.length + codeCharacters.length),
			);
			if (randomIndex < characters.length) {
			  randomText += characters[randomIndex];
			} else {
			  randomText += codeCharacters[randomIndex - characters.length];
			}
		  } else {
			// Add a random meaningful content instance const
			randomMeaningfulTextIndex = Math.floor(
			  Math.random() * meaningfulTextList.length,
			);
			var words = meaningfulTextList[randomMeaningfulTextIndex].split(" ");
			shuffleArray(words)
			randomText += words.join("");
		  }
		}
		return randomText;
	  } // Generate and log a random text within the specified size range












// script init ---------------------------------------------------------------------------------------

initAutoDrops()

// script init ---------------------------------------------------------------------------------------




} catch (e) {
  console.log("ERROR==============");
  console.log(e);
  console.log("ERROR==============");
}
