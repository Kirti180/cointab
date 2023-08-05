const display_pag1 = document.getElementById("display_pag1");
const fetch_users = document.getElementById("fetch_users");
const delete_users = document.getElementById("delete_users");
const user_Details = document.getElementById("user_Details");
let isFetching = false;

function fetchData() {
  // If a fetch is already ongoing, return without doing anything
  if (isFetching) {
    Swal.fire({
      icon: "warning",
      title: "Fetch in Progress",
      text: "A fetch is already in progress. Please wait for it to complete.",
    });
    return;
  }

  // Set the isFetching flag to true to indicate fetch is starting
  isFetching = true;

  fetch("http://localhost:3001/fetch-users")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      display(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      // Reset the isFetching flag to false after fetch completes
      isFetching = false;
    });
}

function fetchdelete() {
  // If a fetch is already ongoing, return without doing anything
  if (isFetching) {
    alert("A fetch is already in progress.");
    return;
  }
  // Use SweetAlert for confirmation
  Swal.fire({
    title: "Are you sure?",
    text: "This action is irreversible. Do you want to delete all users?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      isFetching = true;

      fetch("http://localhost:3001/delete-users", { method: "GET" })
        .then((response) => {
          if (response.ok) {
            return response.text(); // If the response is successful, return the response body as text
          } else {
            throw new Error("Network response was not ok.");
          }
        })
        .then((message) => {
          console.log(message);
          display_pag1.innerHTML = "<h1>No User Found</h1>"; // Clear the displayed data
        })
        .catch((error) => {
          console.error("Error deleting users:", error);
        })
        .finally(() => {
          // Reset the isFetching flag to false after fetch completes
          isFetching = false;
        });
    } else {
      // User clicked "Cancel," do not proceed with deletion
      return;
    }
  });
}

function display(data) {
  display_pag1.innerHTML = "";
  data.forEach((ele) => {
    let main_card = document.createElement("div");
    main_card.setAttribute("id", "main_card");
    let card = document.createElement("div");
    card.setAttribute("id", "card");
    let imgdiv = document.createElement("div");
    let name = document.createElement("h2");
    let location = document.createElement("p");
    let number = document.createElement("p");
    let image = document.createElement("img");
    image.setAttribute("src", ele.picture_large);
    location.innerHTML = ele.state + ", " + ele.country;
    number.innerHTML = ele.cell;
    name.innerHTML = ele.title + " " + ele.first_name + " " + ele.last_name;
    imgdiv.append(image);
    card.append(name, location, number);
    main_card.append(imgdiv, card);
    display_pag1.append(main_card);
  });
}
fetch_users.addEventListener("click", () => {
  fetchData();
});

delete_users.addEventListener("click", () => {
  fetchdelete();
});
user_Details.addEventListener("click", () => {
  window.location.href = "./page2.html";
});
