const STORAGE_KEY = "blr-property-visit-scores-v1";

const properties = [
  {
    id: "L013",
    projectName: "ElmAvenues",
    builder: "Sobha",
    area: "Yelahanka",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.39,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L001",
    projectName: "NorthGateResidences",
    builder: "Prestige",
    area: "SahakaraNagar",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.46,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L011",
    projectName: "RunwayEnclave",
    builder: "Prestige",
    area: "Yelahanka",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.42,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L027",
    projectName: "TerraceOne",
    builder: "Prestige",
    area: "Yelahanka",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.23,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L002",
    projectName: "CedarPark",
    builder: "Brigade",
    area: "SahakaraNagar",
    configuration: "4BHK Row House",
    priceAllInCr: 2.49,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L028",
    projectName: "CanopyRows",
    builder: "Brigade",
    area: "SahakaraNagar",
    configuration: "3BHK Row House",
    priceAllInCr: 2.41,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L020",
    projectName: "NorthernArc",
    builder: "Godrej",
    area: "Yelahanka",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.47,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking", "Kid/Senior Spaces"],
  },
  {
    id: "L021",
    projectName: "JasmineBlocks",
    builder: "ShapoorjiPallonji",
    area: "Yelahanka",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.26,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking"],
  },
  {
    id: "L007",
    projectName: "OliveMews",
    builder: "Assetz",
    area: "SahakaraNagar",
    configuration: "4BHK Row House",
    priceAllInCr: 2.45,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking"],
  },
  {
    id: "L016",
    projectName: "AeroVista",
    builder: "Assetz",
    area: "Yelahanka",
    configuration: "3BHK Apartment",
    priceAllInCr: 2.28,
    status: "Under Construction",
    amenities: ["Clubhouse", "Power Backup", "Security", "Parking"],
  },
];

const criteria = [
  "Road access by scooty (peak traffic realism)",
  "Cauvery water reliability and backup clarity",
  "Construction quality and finishing confidence",
  "Legal and documentation confidence (RERA, Khata, approvals)",
  "All-in cost transparency (hidden charges check)",
  "Lifestyle fit (daily essentials, gym/cafe access)",
];

const siteQuestions = [
  "What is the exact possession timeline, and what are delay penalty terms?",
  "What is the complete all-in cost breakup including GST, registration, and corpus?",
  "Is Cauvery connection active/planned, and what is tanker dependency in summer?",
  "Can you share RERA number, plan approvals, and Khata/document pack?",
  "What are monthly maintenance and one-time handover charges?",
  "What are the road bottlenecks during weekday peak hours from this gate?",
];

function readState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateScore(itemState) {
  if (!itemState || !itemState.ratings) return null;
  const values = criteria
    .map((_, idx) => Number(itemState.ratings[idx] || 0))
    .filter((value) => value > 0);
  if (!values.length) return null;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Number(avg.toFixed(2));
}

function updateRating(propertyId, criterionIndex, value) {
  const currentState = readState();
  currentState[propertyId] = currentState[propertyId] || { ratings: [], notes: "" };
  currentState[propertyId].ratings = currentState[propertyId].ratings || [];
  currentState[propertyId].ratings[criterionIndex] = String(value);
  writeState(currentState);
  render();
}

function wireCardTabs(cardRoot) {
  const tabs = Array.from(cardRoot.querySelectorAll(".card-tab"));
  const panels = Array.from(cardRoot.querySelectorAll(".tab-panel"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tabTarget;
      tabs.forEach((item) => item.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      const activePanel = cardRoot.querySelector(`.tab-panel[data-tab-panel="${target}"]`);
      if (activePanel) activePanel.classList.add("active");
    });
  });
}

function render() {
  const state = readState();
  const cards = document.querySelector("#propertyCards");
  const template = document.querySelector("#propertyCardTemplate");
  const rankingBody = document.querySelector("#rankingTable tbody");

  cards.innerHTML = "";
  rankingBody.innerHTML = "";

  const ranking = properties
    .map((property) => ({
      property,
      score: calculateScore(state[property.id]),
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  ranking.forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.property.projectName}</td>
      <td>${entry.property.builder}</td>
      <td>${entry.property.area}</td>
      <td>${entry.property.priceAllInCr.toFixed(2)}</td>
      <td>${entry.score === null ? "-" : entry.score + " / 5"}</td>
    `;
    rankingBody.appendChild(tr);
  });

  properties.forEach((property) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".property-card");
    const cardState = state[property.id] || {};
    const projectName = node.querySelector(".project-name");
    const projectMeta = node.querySelector(".project-meta");
    const details = node.querySelector(".project-details");
    const questions = node.querySelector(".question-list");
    const grid = node.querySelector(".score-grid");
    const notes = node.querySelector("textarea");
    const scoreValue = node.querySelector(".score-value");

    projectName.textContent = property.projectName;
    projectMeta.textContent = `${property.builder} | ${property.area}`;
    details.textContent = `${property.configuration} | ${property.status} | Price: ₹${property.priceAllInCr.toFixed(
      2,
    )} Cr | Amenities: ${property.amenities.join(", ")}`;

    siteQuestions.forEach((question) => {
      const li = document.createElement("li");
      li.textContent = question;
      questions.appendChild(li);
    });

    criteria.forEach((criterion, idx) => {
      const row = document.createElement("div");
      row.className = "score-row";

      const label = document.createElement("label");
      label.textContent = criterion;

      const buttonGroup = document.createElement("div");
      buttonGroup.className = "score-buttons";
      buttonGroup.setAttribute("role", "group");
      buttonGroup.setAttribute("aria-label", `${property.projectName} ${criterion}`);

      const selectedValue = Number(cardState.ratings?.[idx] || 0);

      for (let i = 1; i <= 5; i += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "score-btn";
        button.textContent = String(i);
        button.dataset.propertyId = property.id;
        button.dataset.criterionIndex = String(idx);
        button.dataset.value = String(i);
        if (selectedValue === i) {
          button.classList.add("selected");
        }
        button.addEventListener("click", () => updateRating(property.id, idx, i));
        buttonGroup.appendChild(button);
      }

      row.appendChild(label);
      row.appendChild(buttonGroup);
      grid.appendChild(row);
    });

    notes.value = cardState.notes || "";
    notes.addEventListener("change", (event) => {
      const currentState = readState();
      currentState[property.id] = currentState[property.id] || { ratings: [], notes: "" };
      currentState[property.id].notes = event.target.value;
      writeState(currentState);
    });

    const score = calculateScore(cardState);
    scoreValue.textContent = score === null ? "Not rated" : `${score} / 5`;

    wireCardTabs(card);
    cards.appendChild(node);
  });
}

document.querySelector("#resetAll").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  render();
});

render();
