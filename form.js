// Form.js

// Selecting DOM elements
const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: null,
  kind: null,
  price: null,
};

// Event listeners for steps

steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      // Remove active class from all circles
      circleSteps.forEach((circle) => circle.classList.remove("active"));
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      // Add active class only to the current circle
      circleSteps[currentStep - 1].classList.add("active");
    });
  }

  nextBtn.addEventListener("click", () => {
    document.querySelector(`.step-${currentStep}`).style.display = "none";
    // Remove active class from all circles
    circleSteps.forEach((circle) => circle.classList.remove("active"));
    if (currentStep < steps.length && validateForm()) {
      currentStep++;
      setTotal();
    }
    document.querySelector(`.step-${currentStep}`).style.display = "flex";
    // Add active class only to the current circle
    circleSteps[currentStep - 1].classList.add("active");
    summary(obj);
  });
});

// Function to display summary

function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");
  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${
    obj.kind ? "yearly" : "monthly"
  })`;
}

// Function to validate form inputs

function validateForm() {
  let valid = true;
  for (let i = 0; i < formInputs.length; i++) {
    const input = formInputs[i];
    const label = findLabel(input);
    const error = label.nextElementSibling;

    if (!input.value.trim()) {
      valid = false;
      input.classList.add("err");
      error.style.display = "flex";
    } else {
      // Check if input format is correct
      const inputType = input.getAttribute("type");
      const inputValue = input.value.trim();
      let formatValid = true;

      // Validate email format
      if (inputType === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        formatValid = emailRegex.test(inputValue);
      }

      // Validate phone number format
      if (inputType === "tel") {
        const phoneRegex =
          /^\+?([0-9]{1})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;

        formatValid = phoneRegex.test(inputValue);
      }

      if (!formatValid) {
        valid = false;
        input.classList.add("err");
        error.innerText = "Invalid format";
        error.style.display = "flex";
      } else {
        input.classList.remove("err");
        error.style.display = "none";
      }
    }
  }
  return valid;
}

// Function to find associated label for an input

function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
  }
}

// Event listeners for plan selection

plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".plan-priced");
    obj.plan = planName;
    obj.price = planPrice;
  });
});
// Event listener for plan type switcher

switcher.addEventListener("click", () => {
  const val = switcher.querySelector("input").checked;
  if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }
  switchPrice(val);
  obj.kind = val;
});
// Event listeners for addons

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addon.classList.add("ad-selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

// Function to switch price based on plan type

function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const prices = document.querySelectorAll(".plan-priced");
  if (checked) {
    prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
    setTime(true);
  } else {
    prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
    setTime(false);
  }
}
// Function to show selected addons

function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".servic-price");
  const serviceID = clone.querySelector(".selected-addon");
  if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}
// Function to calculate total cost

function setTotal() {
  const str = planPrice.innerHTML;
  const res = str.replace(/\D/g, "");
  const addonPrices = document.querySelectorAll(
    ".selected-addon .servic-price"
  );

  let val = 0;
  for (let i = 0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML;
    const res = str.replace(/\D/g, "");

    val += Number(res);
  }
  total.innerHTML = `$${val + Number(res)}/${time ? "yr" : "mo"}`;
}
// Function to set time (yearly/monthly)

function setTime(t) {
  return (time = t);
}
// Event listener for yearly/monthly switcher And changing Addon Price
const planType = document.querySelector(".switch input");
// Function to update Addon Price according to the plan
function updateAddonPrices(checked) {
  const month = [1, 2, 2];
  const year = [10, 20, 20];
  const addonPrices = document.querySelectorAll(".price");

  addonPrices.forEach((price, index) => {
    const priceValue = price.innerText.replace(/\D/g, "");
    const newPrice = checked ? `$${year[index]}/yr` : `$${month[index]}/mo`;
    price.innerText = "+" + newPrice;
  });

  setTime(checked);
}

planType.addEventListener("change", function () {
  updateAddonPrices(this.checked);
});
// Updating data in plan card
const planCards = document.querySelectorAll(".plan-card");
function updatePlanDetails() {
  planCards.forEach((card) => {
    const planInfo = card.querySelector(".plan-info");
    const planPrice = planInfo.querySelector(".plan-priced");
    const planName = planInfo.querySelector("b");

    const isYearly = planType.checked;

    if (isYearly) {
      const twoMonthsFree = document.createElement("p");
      twoMonthsFree.innerText = "2 months free";
      planInfo.appendChild(twoMonthsFree);
    } else {
      const twoMonthsFree = planInfo.querySelector("p");
      if (twoMonthsFree) {
        twoMonthsFree.remove();
      }
    }
  });
}
// Function to navigate to a specific step

planType.addEventListener("change", updatePlanDetails);

function goToStep(stepNumber) {
  document.querySelector(`.step-${currentStep}`).style.display = "none";
  circleSteps.forEach((circle) => circle.classList.remove("active"));
  currentStep = stepNumber;
  document.querySelector(`.step-${currentStep}`).style.display = "flex";
  circleSteps[currentStep - 1].classList.add("active");
}
// Set onclick attribute for a button to navigate to step 2

document
  .querySelector(".selection-container .prev-stp")
  .setAttribute("onclick", "goToStep(3)");
