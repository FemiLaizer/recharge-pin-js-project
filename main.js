let phoneNumber = document.getElementById("phone-number");
let simNetwork = document.querySelector("#sim-network");
let cardPin = document.querySelector("#card-pin");
let generateOnKeyPress = document.querySelectorAll(".generate-input");
let pin = "";
let pinDate;
let customersFromLocalStorage;

// Create list for customers
const customers = [
  {
    phoneNumber: "",
    simNetwork: "",
    pinGenerated: [{
      pin: "",
      date: ""
    }],
    pinLoaded: [{
      pin: "",
      date: ""
    }]
  }
];

let temp = {
  phoneNumber: "",
  simNetwork: "",
  pinGenerated: [],
  pinLoaded: []
};

const tempGenerated = {
  pin: "",
  date: ""
};

const currentLoaded = {
  pin: "",
  date: ""
};

// restore files from localStorage if it is not empty once window is loaded
onload = function () {

  if (localStorage.length !== 0) {
    customersFromLocalStorage = JSON.parse(localStorage.getItem("customers"));
    customers.push(...customersFromLocalStorage);
    // console.log(customers);
  } else {
    localStorage.setItem("customers", JSON.stringify(customers));
    console.log(customersFromLocalStorage);
  }
};

let eraseGeneratedValues = () => {
  temp = {
    phoneNumber: "",
    simNetwork: "",
    pinGenerated: [],
    pinLoaded: []
  };
  pin = "";
  phoneNumber.value = "";
  simNetwork.value = "Select Sim Network...";
}

function storeCreatedPin() {

  pinDate = new Date();
  tempGenerated.date = pinDate;
  tempGenerated.pin = pin;

  let currentGenerated = Object.assign({}, tempGenerated);

  for (let item of customers) {
    if (item.phoneNumber === phoneNumber.value) {
      // console.log("Phone number already exist");
      item.pinGenerated.push(currentGenerated);

      // return;
    }
  }

  temp.pinGenerated.push(currentGenerated);
  temp.phoneNumber = phoneNumber.value;
  temp.simNetwork = simNetwork.value;

  let customer = Object.assign({}, temp);

  customers.push(customer);
  localStorage.setItem("customers", JSON.stringify(customers));
  eraseGeneratedValues();
}

function checkCreatedPin() {
  customers.forEach(list => {
    for (let itemPin of list.pinGenerated) {
      if (itemPin.pin === pin) {
        createPin();
        console.log("Same Pin Generated");
      } else {
        console.log("New Pin Generated");
        storeCreatedPin();

      }
    }
  })
}

function createPin(line, sim) {
  let phone = line.split(""),
    network = sim.toLowerCase(),
    simCode = [],
    letters = "0abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < letters.length; i++) {
    if (network.includes(letters[i])) {
      simCode.push(i);
    }
  }

  let pinSource = phone.concat(simCode), n = pinSource.length;
  console.log(pinSource)

  const randomDigits = () => {
    return Math.floor(Math.random() * n);
  }

  for (let i = 0; i < n; i++) {
    pin += pinSource[randomDigits()];
    if (network === "mtn") {
      if (pin.length === 12) {
        break;
      }
    } else if (network === "airtel" || network === "glo") {
      if (pin.length === 14) {
        break;
      }
    } else if (network === "etisalat") {
      if (pin.length === 16) {
        break;
      }
    }
  }
  console.log(`Network: ${network} Pin: ${pin} Pin-Length: ${pin.length}`)
  checkCreatedPin();
}

function validateInput() {

  if (phoneNumber.value.length === 11 &&
    Number(phoneNumber.value) &&
    simNetwork.value !== "Select Sim Network...") {
    createPin(phoneNumber.value, simNetwork.value);
  } else {
    console.log("Enter valid input");
  }
}

generateOnKeyPress.forEach(item => {
  item.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      validateInput();
    }
  });
});

function loadPin() {
  cardPin.value !== ""
    ? console.log(cardPin.value)
    : console.log("No Pin entered");
}

/*

        */