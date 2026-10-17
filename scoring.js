const presets = {
  A: {
    hours: 3,
    minutes: 30,
    golfPoints: 28,
    beers: 6,
    description: "Sample profile: a 3h 30m triathlon, 28 Stableford points and 6 beers."
  },
  B: {
    hours: 2,
    minutes: 20,
    golfPoints: 14,
    beers: 2,
    description: "Sample profile: a 2h 20m triathlon, 14 Stableford points and 2 beers."
  }
};

const form = document.getElementById("scoreForm");
const scoreInputs = [
  document.getElementById("triHours"),
  document.getElementById("triMins"),
  document.getElementById("golfPoints"),
  document.getElementById("beerCount")
];
const errorMessage = document.getElementById("scoreError");
const presetButtons = document.querySelectorAll(".preset-button");

function setPreset(presetKey) {
  const preset = presets[presetKey];
  document.getElementById("triHours").value = preset.hours;
  document.getElementById("triMins").value = preset.minutes;
  document.getElementById("golfPoints").value = preset.golfPoints;
  document.getElementById("beerCount").value = preset.beers;

  presetButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.preset === presetKey));
  });

  document.getElementById("profileDescription").textContent = preset.description;
  calculateScore();
}

function formatMinutes(value) {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${Math.abs(value)} mins`;
}

function calculateScore() {
  const validValues = scoreInputs.map((input) => input.valueAsNumber);
  const isValid = form.checkValidity() && validValues.every(Number.isInteger);

  errorMessage.hidden = isValid;
  if (!isValid) {
    document.getElementById("finalTimeDisplay").textContent = "—";
    document.getElementById("totalMinutesDisplay").textContent =
      "Correct the values within their stated limits to calculate your result.";
    document.getElementById("triBaseBreakdown").textContent = "—";
    const golfBreakdown = document.getElementById("golfBreakdown");
    golfBreakdown.textContent = "—";
    golfBreakdown.classList.remove("is-penalty", "is-bonus");
    document.getElementById("beerBreakdown").textContent = "—";
    return;
  }

  const [hours, minutes, golfPoints, beers] = validValues;
  const triathlonMinutes = hours * 60 + minutes;
  const golfAdjustment = (36 - golfPoints) * 2;
  const beerBonus = beers * 15;
  const finalMinutes = triathlonMinutes + golfAdjustment - beerBonus;
  const absoluteMinutes = Math.abs(finalMinutes);
  const resultHours = Math.floor(absoluteMinutes / 60);
  const resultMinutes = absoluteMinutes % 60;
  const resultSign = finalMinutes < 0 ? "−" : "";
  const golfBreakdown = document.getElementById("golfBreakdown");

  document.getElementById("finalTimeDisplay").textContent =
    `${resultSign}${resultHours}h ${resultMinutes}m`;
  document.getElementById("totalMinutesDisplay").textContent =
    `(${finalMinutes} total adjusted minute${Math.abs(finalMinutes) === 1 ? "" : "s"})`;
  document.getElementById("triBaseBreakdown").textContent =
    `+${triathlonMinutes} mins`;
  document.getElementById("golfLabel").textContent =
    `Golf adjustment (${golfPoints} pts)`;
  document.getElementById("beerLabel").textContent =
    `Beer bonus (${beers} beer${beers === 1 ? "" : "s"})`;
  golfBreakdown.textContent =
    golfAdjustment === 0 ? "0 mins (even par)" : formatMinutes(golfAdjustment);
  golfBreakdown.classList.toggle("is-penalty", golfAdjustment > 0);
  golfBreakdown.classList.toggle("is-bonus", golfAdjustment < 0);
  document.getElementById("beerBreakdown").textContent = `−${beerBonus} mins`;
}

presetButtons.forEach((button) => {
  button.addEventListener("click", () => setPreset(button.dataset.preset));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateScore();
});

scoreInputs.forEach((input) => {
  input.addEventListener("input", () => {
    presetButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    document.getElementById("profileDescription").textContent = "Custom competitor profile.";
    calculateScore();
  });
});

calculateScore();
