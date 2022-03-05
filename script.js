"use strict";
window.addEventListener("DOMContentLoaded", start);

const url1 = "https://petlatkea.dk/2021/hogwarts/students.json";

function start() {
  registeredbtn();
  loadJSON();
}
let allStudents = [];
const Student = {
  name: "",
  house: "",
  gender: "",
  prefect: false,
  squad: false,
};

const setting = {
  filterBy: "",
  sortBy: "name",
  sortDir: "asc",
};
function registeredbtn() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectsort));
}

function loadJSON() {
  fetch(url1)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  // TODO: This might not be the function we want to call first--
  //fixed function
  buildList();

  // displayStudent(allStudents);

  // TODO: MISSING CODE HERE !!!

  // console.log(allStudents)
}
function prepareObject(jsonObject) {
  const student = Object.create(Student);
  const uname = jsonObject.fullname.trimStart().split(" ");

  const firstname =
    uname[0].charAt(0).toUpperCase() + uname[0].substring(1).toLowerCase();

  const lastname = uname[1];

  const finalname = firstname + " " + lastname;

  const gen =
    jsonObject.gender.charAt(0).toUpperCase() +
    jsonObject.gender.substring(1).toLowerCase();

  // const gnder=jsonObject.gender.chartAt(0).toUpperCase()+jsonObject.gender.substring(1).toLowerCase();
  const ghar = jsonObject.house.trimStart();
  const home = ghar.charAt(0).toUpperCase() + ghar.substring(1).toLowerCase();

  student.name = finalname;
  student.gender = gen;
  student.house = home;
  return student;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  // filterList(filter);
  setfilter(filter);
}
function setfilter(filter) {
  setting.filterBy = filter;
  buildList();
}
function filterList(filteredList) {
  //   let filteredList = allAnimals;
  if (setting.filterBy === "Slytherin") {
    filteredList = allStudents.filter(issly);
  } else if (setting.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(ishuff);
  } else if (setting.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(israv);
  } else if (setting.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isgry);
  } else if (setting.filterBy === "Boy") {
    filteredList = allStudents.filter(isBoy);
  } else if (setting.filterBy === "Girl") {
    filteredList = allStudents.filter(isGirl);
  } else if (setting.filterBy === "squad") {
    filteredList = allStudents.filter(isTrue);
  }

  console.log(filteredList);
  return filteredList;
}

// return filteredList;

const isTrue = function (student) {
  if (student.squad === "true") {
    return true;
  }
};
const isBoy = function (student) {
  if (student.gender === "Boy") {
    return true;
  }
};
const isGirl = function (student) {
  if (student.gender === "Girl") {
    return true;
  }
};

const issly = function (student) {
  if (student.house === "Slytherin") {
    return true;
  }
};
const ishuff = function (student) {
  if (student.house === "Hufflepuff") {
    return true;
  }
};
const israv = function (student) {
  if (student.house === "Ravenclaw") {
    return true;
  }
};
const isgry = function (student) {
  if (student.house === "Gryffindor") {
    return true;
  }
};

function selectsort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  const OldElement = document.querySelector(`[data-sort='${setting.sortBy}']`);
  OldElement.classList.remove("sortby");

  //indicate active sort
  event.target.classList.add("sortby");
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  setting.sortBy = sortBy;
  setting.sortDir = sortDir;
  buildList();
}
function sortList(sortedlist) {
  let direction = 1;
  if (setting.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedlist = sortedlist.sort(sortByproperty);

  function sortByproperty(studentA, studentB) {
    if (studentA[setting.sortBy] < studentB[setting.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedlist;
}
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}
function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // console.log(student)
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  // clone.querySelector("[data-field=prefect]").textContent = student.prefect;
  // clone.querySelector("[data-field=star]").textContent = student.star;
  clone.querySelector("[data-field=name]").textContent = student.name;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  if (student.squad == true) {
    clone.querySelector("[data-field=squad]").textContent = "🌟";
  } else {
    clone.querySelector("[data-field=squad]").textContent = "☆";
  }
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", clickStar);
  function clickStar() {
    if (student.squad == true) {
      student.squad = false;
    } else {
      student.squad = true;
    }
    buildList();
  }

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone
    .querySelector("[data-field=prefect]")
    .addEventListener("click", clickWinner);
  function clickWinner() {
    if (student.prefect == true) {
      student.prefect = false;
    } else {
      trymakePrefect(student);
    }
    buildList();
  }

  clone.querySelector("[data-field='name']")
    .addEventListener("click", clickName);
  function clickName() {

    document.querySelector("#popUp").classList.remove("hide");
    document
      .querySelector("#popUp .closebutton")
      .addEventListener("click", closeDialog);

    function closeDialog() {
      document.querySelector("#popUp").classList.add("hide");
      document
        .querySelector("#popUp .closebutton")
        .removeEventListener("click", closeDialog);
    }
  }

  document.querySelector("#list tbody").appendChild(clone);
}

function trymakePrefect(selectedstudent) {
  const prefect = allStudents.filter((student) => student.prefect);
  const numberofprefect = prefect.length;
  const other = prefect
    .filter((student) => student.house === selectedstudent.house)
    .shift();
  const other1 = prefect
    .filter((student) => student.gender === selectedstudent.gender)
    .shift();
  if (other !== undefined) {
    removeOther(other);
  } else if (numberofprefect >= 2) {
    removeAorB(prefect[0], prefect[1]);
  } else {
    makePrefect(selectedstudent);
  }

  function removeOther(other) {
    //ask the user to ignore or remove other

    document.querySelector("#removeother").classList.remove("hide");
    document
      .querySelector("#removeother .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#removeother #remove_other")
      .addEventListener("click", removebtn);

    function closeDialog() {
      document.querySelector("#removeother").classList.add("hide");
      document
        .querySelector("#removeother .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#removeother #remove_other")
        .removeEventListener("click", removebtn);
    }
    function removebtn() {
      removePrefect(other);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(prefectA, prefectB) {
    //if ReomveA
    document.querySelector("#remove_AorB").classList.remove("hide");
    document
      .querySelector("#remove_AorB .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove_AorB #remove_a")
      .addEventListener("click", removea);
    document
      .querySelector("#remove_AorB #remove_b")
      .addEventListener("click", removeb);
    document.querySelector("#remove_AorB [data-field=prefectA]").textContent =
      prefectA.name;
    document.querySelector("#remove_AorB [data-field=prefectB]").textContent =
      prefectB.name;
    function closeDialog() {
      document.querySelector("#remove_AorB").classList.add("hide");
      document
        .querySelector("#remove_AorB .closebutton")
        .removeEventListener("click", closeDialog);

      document
        .querySelector("#remove_AorB #remove_a")
        .removeEventListener("click", removea);
      document
        .querySelector("#remove_AorB #remove_b")
        .removeEventListener("click", removeb);
    }

    function removea() {
      removePrefect(prefectA);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }

    function removeb() {
      removePrefect(prefectB);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }
  }
  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

//creating search box (using w3school)
function myFunction() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("list");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

document.querySelector("#expell").addEventListener("click", expell);

function expell() {
  const close = document.querySelector("#expell");
  for (let i = 0; i < close.length; i++) {
    close[i].addEventListener("click", () => {
      close[i].parentElement.style.display = "none";
    });
  }
}
const squad=document.querySelector("[data-field='squad']",sqd)
function sqd(){
    const newlist=filter.newitems();
    sqd(newlist);
}
function newitems(){
if(Student.squad===true){
return true;
}
}
