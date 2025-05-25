document.addEventListener("DOMContentLoaded",function(){
    const searchButton = document.getElementById("inputbutton");
    const usernameInput = document.getElementById("text-input");
    const statscontainer = document.querySelector(".statscontainer")
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const statscard = document.querySelector(".stats-card");

    function validateUsername(username){
        if(username.trim()=== ""){
            alert("Username is empty")
            return false
        }
        const regex = /^[a-zA-Z0-9-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
             const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const data = await response.json();
            console.log("Logging data :",data);
            displayUserData(data);
        }
        catch{
            statscontainer.innerHTML = `<p>NO DATA FOUND </p>`
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled= false;
        }
        function updateProgress(solved,total,label,circle){
            const progressDegree = (solved/total)*100;
            circle.style.setProperty("--progress-degree",`${progressDegree}%`);
            label.textContent = `${solved}/${total}`;
           
        }
        function displayUserData(data){
            const totalQues= data.totalQuestions;
            const totalEasyQues= data.totalEasy;
            const totalMediumQues = data.totalMedium;
            const totalHardQues = data.totalHard;

            const solvedTotalQues = data.totalSolved;
            const EasySolved = data.easySolved;
            const MediumSolved = data.mediumSolved;
            const HardSolved = data.hardSolved;

            updateProgress(EasySolved,totalEasyQues,easyLabel,easyProgressCircle);
            updateProgress(MediumSolved,totalMediumQues,mediumLabel,mediumProgressCircle);
            updateProgress(HardSolved,totalHardQues,hardLabel,hardProgressCircle);

            const cardsData = [
                {
                    label : "Overall Submissions", value:data.totalSolved
                },
                {
                    label : "Overall Easy Submissions", value:EasySolved
                },
                {
                    label : "Overall Medium Submissions", value:MediumSolved
                },
                {
                    label : "Overall Hard Submissions", value:data.hardSolved
                },
            ];
            console.log("CARDS KA DATA :",cardsData);
            statscard.innerHTML = cardsData.map(
                data =>
                    `<div class = "card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>`
                
            ).join("")
                }

            
        }
        
    
    searchButton.addEventListener('click',function(){
        const username = usernameInput.value ;
        console.log("login username :",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})