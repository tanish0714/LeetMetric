document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("inputbutton");
  const usernameInput = document.getElementById("text-input");
  const statscontainer = document.querySelector(".statscontainer");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const statscard = document.querySelector(".stats-card");

  // Validate username: non-empty and alphanumeric with dashes allowed, max 15 chars
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username is empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  // Update circular progress bar and label text
  function updateProgress(solved, total, label, circle) {
    const progressDegree = total === 0 ? 0 : (solved / total) * 360; // use 360deg for circle
    circle.style.setProperty("--progress-degree", `${progressDegree}deg`);
    label.textContent = `${solved}/${total}`;
  }

  // Display user data in progress circles and cards
  function displayUserData(data) {
    const totalEasyQues = data.totalEasy || 0;
    const totalMediumQues = data.totalMedium || 0;
    const totalHardQues = data.totalHard || 0;

    const easySolved = data.easySolved || 0;
    const mediumSolved = data.mediumSolved || 0;
    const hardSolved = data.hardSolved || 0;

    updateProgress(easySolved, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(mediumSolved, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(hardSolved, totalHardQues, hardLabel, hardProgressCircle);

    const cardsData = [
      { label: "Overall Submissions", value: data.totalSolved || 0 },
      { label: "Overall Easy Submissions", value: easySolved },
      { label: "Overall Medium Submissions", value: mediumSolved },
      { label: "Overall Hard Submissions", value: hardSolved },
    ];

    statscard.innerHTML = cardsData
      .map(
        (item) => `
      <div class="card">
        <h4>${item.label}</h4>
        <p>${item.value}</p>
      </div>`
      )
      .join("");
  }

  // Fetch user details from API
  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const data = await response.json();
      console.log("Logging data:", data);
      displayUserData(data);
    } catch (error) {
      statscontainer.innerHTML = `<p>NO DATA FOUND</p>`;
      console.error(error);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  // On clicking search button
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Login username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
