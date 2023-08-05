let currentPage = 1;
let totalPages = 1;
let data;
let originalData;
const genderFilterSelect = document.getElementById("filter");

function fetchData(pageNumber) {
  const filterValue = genderFilterSelect.value; // Get the selected gender filter
  fetch(
    `http://localhost:3001/api/users?page=${pageNumber}${
      filterValue ? "&gender=" + filterValue : ""
    }`
  )
    .then((response) => response.json())
    .then((userData) => {
      data = userData;
      originalData = [...userData.users]; // Store the fetched data in the data variable
      display(data.users);
      currentPage = parseInt(data.currentPage); // Ensure currentPage is a number
      totalPages = data.totalPages;
      updatePaginationButtons();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function applyFilter() {
  const filterValue = genderFilterSelect.value;
  if (filterValue === "") {
    display(originalData); // Display the original data when the filter is cleared
  } else {
    const filteredData = originalData.filter(
      (user) => user.gender.toLowerCase() === filterValue.toLowerCase()
    );
    display(filteredData); // Display the filtered data based on the selected filter
  }

  // Update the totalPages based on the filtered data length
  totalPages = Math.ceil(data.users.length / 10);
  updatePaginationButtons();
}

genderFilterSelect.addEventListener("change", applyFilter);
function display(data) {
  let tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  data.forEach((element) => {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");
    let td7 = document.createElement("td");
    let td8 = document.createElement("td");
    let td9 = document.createElement("td");
    let td10 = document.createElement("td");
    let td11 = document.createElement("td");
    let td12 = document.createElement("td");
    let td13 = document.createElement("td");

    td1.innerText = element.gender;
    td2.innerText = element.title;
    td3.innerText = element.first_name;
    td4.innerText = element.last_name;
    td5.innerText = element.city;
    td6.innerText = element.state;
    td7.innerText = element.country;
    td8.innerText = element.postcode;
    td9.innerText = element.email;
    td10.innerText = element.username;
    td11.innerText = element.dob_date;
    td12.innerText = element.dob_age;
    td13.innerText = element.cell;

    tr.append(
      td1,
      td2,
      td3,
      td4,
      td5,
      td6,
      td7,
      td8,
      td9,
      td10,
      td11,
      td12,
      td13
    );
    tbody.append(tr);
  });
}

function updatePaginationButtons() {
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

const prevButton = document.getElementById("prev");
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    fetchData(currentPage - 1);
  }
});

const nextButton = document.getElementById("next");
nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    fetchData(currentPage + 1);
  }
});

const goToPageButton = document.getElementById("goToPage");
const pageNumberInput = document.getElementById("pageNumberInput");
goToPageButton.addEventListener("click", () => {
  const pageNumber = parseInt(pageNumberInput.value);
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    fetchData(pageNumber);
  }
});
fetchData(currentPage);
