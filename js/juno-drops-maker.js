function setDropUIElements(){
  document.querySelector(".nav").remove();
  document.querySelector(".content").style.left = "270px";

  // Create the main container
  const container = document.createElement("div");
  container.style.width = "270px";
  container.style.height = "100%";
  container.style.position = "absolute";
  container.style.backgroundColor = "black";
  container.style.padding = "10px";

  // Create the first textarea section
  const textareaSection1 = document.createElement("div");
  textareaSection1.innerHTML = `
      <input type="checkbox" id="active"> Add Generative Negative
      <!-- <input type="checkbox" id="reverse"> Reverse -->
      <!-- <input type="checkbox" id="multipart"> Multipart -->
      <br /><br />
      <!-- <textarea id="nr" rows="1" placeholder="Enter text here"></textarea> -->
    `;

  // Create the second textarea section
  const textareaSection2 = document.createElement("div");
  textareaSection2.innerHTML = `
      <textarea id="CreativeLh" style="width=100%" placeholder="Creative (With Negative Text)"></textarea>
      <textarea id="my-ips-input"  placeholder="Ips"></textarea>
      <textarea id="my-froms-input"  placeholder="Froms"></textarea>
      <!-- <textarea id="my-negas-input" placeholder="Negatives"></textarea> --> 
      <textarea id="my-starts-input" placeholder="Starts"></textarea>
      <textarea id="my-negas-input" placeholder="Neggas"></textarea>
      <input type="number" id="my-drops-count" placeholder="Drops Count" />
      
      <input style="margin-top: 30px; font-size: 25px; background: blue; padding: 20px; color: white;" id="start-drops-btn" type="submit" value="Start" />
    `;

  // Append sections to the container
  container.appendChild(textareaSection1);
  container.appendChild(textareaSection2);

  // Append the container to the body
  const firstChild = document.querySelector(".center").firstChild;
  document.querySelector(".center").insertBefore(container, firstChild);
}


var isAutoDropsStopped = false;
var c = 0;
var i = 0;


try {
  
	function initAutoDrops(){
		setDropUIElements()  
		
		document.getElementById("start-drops-btn").addEventListener("click", () => oklh());
		
		document.querySelectorAll(".send")[3].setAttribute("id", "sentlh");
	}
	  
	// Function to show a custom popup with an OK, Cancel buttons
	async function showCustomPopup(message) {
	  return new Promise((resolve, reject) => {
		const popupContainer = document.createElement('div');
		popupContainer.style.position = 'fixed';
		popupContainer.style.top = '50%';
		popupContainer.style.left = '50%';
		popupContainer.style.transform = 'translate(-50%, -50%)';
		popupContainer.style.padding = '10px';
		popupContainer.style.background = 'white';
		popupContainer.style.border = '1px solid #ccc';
		popupContainer.style.display = 'flex';
		popupContainer.style.justifyContent = 'center';
		popupContainer.style.alignItems = 'center';
		popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
		popupContainer.style.border = 'solid black 3px';
		
		const popupMessage = document.createElement('div');
		popupMessage.textContent = message;
		popupContainer.appendChild(popupMessage);

		const okButton = document.createElement('button');
		// Apply epic styles
		okButton.style.backgroundColor = '#4CAF50'; // Green background color
		okButton.style.border = 'none';
		okButton.style.color = 'white';
		okButton.style.padding = '15px 32px';
		okButton.style.textAlign = 'center';
		okButton.style.textDecoration = 'none';
		okButton.style.display = 'inline-block';
		okButton.style.fontSize = '16px';
		okButton.style.margin = '4px 2px';
		okButton.style.transition = 'background-color 0.3s';
		okButton.textContent = 'Launch Next Drop';
		// Add hover effect
		okButton.addEventListener('mouseover', function () {
		  okButton.style.backgroundColor = '#45a049';
		});

		okButton.addEventListener('mouseout', function () {
		  okButton.style.backgroundColor = '#4CAF50';
		});
		okButton.addEventListener('click', () => {
		  document.body.removeChild(popupContainer);
		  resolve();
		});
		popupContainer.appendChild(okButton);
		
		//----------
		
		const cancelButton = document.createElement('button');
		// Apply epic styles
		cancelButton.style.backgroundColor = '#ff0000';
		cancelButton.style.border = 'none';
		cancelButton.style.color = 'white';
		cancelButton.style.padding = '15px 32px';
		cancelButton.style.textAlign = 'center';
		cancelButton.style.textDecoration = 'none';
		cancelButton.style.display = 'inline-block';
		cancelButton.style.fontSize = '16px';
		cancelButton.style.margin = '4px 2px';
		cancelButton.style.transition = 'background-color 0.3s';
		cancelButton.textContent = 'Stop Auto Drops';
		// Add hover effect
		cancelButton.addEventListener('mouseover', function () {
		  cancelButton.style.backgroundColor = '#dd0000'; // Darker green on hover
		});

		cancelButton.addEventListener('mouseout', function () {
		  cancelButton.style.backgroundColor = '#ff0000';
		});
		cancelButton.addEventListener('click', () => {
		  // stop everything
		  var stopAll = confirm("Are you sure you want to stop all of the auto Drops? you're gonna have to start all over again!");
		  if(stopAll){
			  isAutoDropsStopped = true;
			  document.body.removeChild(popupContainer);
			  reject();
		  }
		  
		});
		popupContainer.appendChild(cancelButton);
		//------------

		document.body.appendChild(popupContainer);
	  });
	}


	// Function to manually trigger the next drop
	async function proceedToNextDrop() {
	  await showCustomPopup('Press OK to proceed to the next drop.');
	}
	  
	// Function that contains the main loop
	async function oklh() {
	  try {
		console.log("Beginning...");
		const ipsInput = document.getElementById("my-ips-input");
		const fromsInput = document.getElementById("my-froms-input");
		const startsFromLineInput = document.getElementById("my-starts-input");
		const negasInput = document.getElementById("my-negas-input");
		const dropsCountInput = document.getElementById("my-drops-count");
		
		const dropAmount = 6000

		const dropsCount = parseInt(dropsCountInput.value);
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
		
		
		var startshs = []
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
				await proceedToNextDrop();  
			  }catch(e){
				  isAutoDropsStopped = true;
				  break;
			  }
			  
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
