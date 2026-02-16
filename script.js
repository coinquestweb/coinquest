// Variables globales
let coins = 0;
let currentLevel = 1;
let playerName = "";
let playerAge = "";
let playerGoal = "";
let challengesCompleted = 0;
let currentChallengeIndex = 0;
let levelCompleted = false;

// Niveles configurables
const LEVELS = {
  1: { name: "Aprendiz de Ahorro", coins: 40, challenges: 5 },
  2: { name: "Explorador de Gastos", coins: 60, challenges: 5 },
  3: { name: "Guardián del Presupuesto", coins: 80, challenges: 5 },
  4: { name: "Pequeño Inversor", coins: 100, challenges: 5 },
  5: { name: "Cazador de Ofertas", coins: 120, challenges: 5 },
  6: { name: "Emprendedor en Ciernes", coins: 140, challenges: 5 },
  7: { name: "Magnate Financiero", coins: 160, challenges: 5 }
};

// Base de datos de preguntas por nivel
const CHALLENGES = {
  1: [
    {
      type: "budget",
      question: "Tienes $20 para la semana. Como los distribuyes?",
      inputs: [
        { id: "comida", label: "Comida", placeholder: "$" },
        { id: "transporte", label: "Transporte", placeholder: "$" },
        { id: "entretenimiento", label: "Entretenimiento", placeholder: "$" },
        { id: "ahorro", label: "Ahorro", placeholder: "$" }
      ],
      validate: (values) => {
        const total = Object.values(values).reduce((a, b) => a + (Number(b) || 0), 0);
        return total === 20;
      }
    },
    {
      type: "quiz",
      question: "Que es mejor para tu futuro?",
      options: [
        { text: "Ahorrar para una meta", correct: true },
        { text: "Gastar todo ahora", correct: false }
      ]
    },
    {
      type: "classification",
      question: "Es este gasto necesario?",
      items: [
        { text: "Comida", correct: true },
        { text: "Videojuegos", correct: false },
        { text: "Agua", correct: true },
        { text: "Golosinas", correct: false }
      ]
    },
    {
      type: "calculation",
      question: "Si ahorras $5 cada dia, cuanto tendras en una semana?",
      answer: 35
    },
    {
      type: "decision",
      question: "Tu amigo te pide prestados $10. Que haces?",
      options: [
        { text: "Prestarselos sin pensar", correct: false },
        { text: "Pensarlo y acordar como te pagara", correct: true },
        { text: "Decir que no", correct: false }
      ]
    }
  ],
  
  2: [
    {
      type: "budget",
      question: "Tienes $50. Necesitas comprar comida ($20), pagar transporte ($10) y quieres un juguete ($25). Como administras?",
      inputs: [
        { id: "comida", label: "Comida (minimo $20)", placeholder: "20" },
        { id: "transporte", label: "Transporte (minimo $10)", placeholder: "10" },
        { id: "juguete", label: "Juguete ($25)", placeholder: "0-25" },
        { id: "ahorro", label: "Ahorro", placeholder: "Resto" }
      ],
      validate: (values) => {
        const comida = Number(values.comida) || 0;
        const transporte = Number(values.transporte) || 0;
        const juguete = Number(values.juguete) || 0;
        const ahorro = Number(values.ahorro) || 0;
        const total = comida + transporte + juguete + ahorro;
        return comida >= 20 && transporte >= 10 && total === 50;
      }
    },
    {
      type: "quiz",
      question: "Cual es la mejor forma de ahorrar?",
      options: [
        { text: "Ahorrar lo que sobra", correct: false },
        { text: "Ahorrar primero apenas recibes dinero", correct: true }
      ]
    },
    {
      type: "classification",
      question: "Gasto necesario o innecesario?",
      items: [
        { text: "Medicinas", correct: true },
        { text: "Cine", correct: false },
        { text: "Ropa", correct: true },
        { text: "Comida rapida", correct: false }
      ]
    },
    {
      type: "calculation",
      question: "Si ahorras $10 cada dia por 5 dias, cuanto tienes?",
      answer: 50
    },
    {
      type: "decision",
      question: "Viste un juguete de $30 pero solo tienes $25. Que haces?",
      options: [
        { text: "Pedir prestado", correct: false },
        { text: "Esperar y ahorrar $5 mas", correct: true }
      ]
    }
  ],
  
  3: [
    {
      type: "spending",
      question: "Tienes 100 monedas. Quieres gastar 30 monedas para obtener una pista especial?",
      cost: 30,
      hint: "La pista te ayudara en el siguiente desafio."
    },
    {
      type: "budget",
      question: "Tienes $100. Debes pagar: comida ($30), transporte ($20), servicios ($25). Cuanto puedes ahorrar?",
      inputs: [
        { id: "comida", label: "Comida ($30)", placeholder: "30" },
        { id: "transporte", label: "Transporte ($20)", placeholder: "20" },
        { id: "servicios", label: "Servicios ($25)", placeholder: "25" },
        { id: "ahorro", label: "Ahorro", placeholder: "Resto" }
      ],
      validate: (values) => {
        const comida = Number(values.comida) || 0;
        const transporte = Number(values.transporte) || 0;
        const servicios = Number(values.servicios) || 0;
        const ahorro = Number(values.ahorro) || 0;
        const total = comida + transporte + servicios + ahorro;
        return comida === 30 && transporte === 20 && servicios === 25 && total === 100;
      }
    },
    {
      type: "quiz",
      question: "Que es una emergencia financiera?",
      options: [
        { text: "Una enfermedad o accidente", correct: true },
        { text: "Un videojuego nuevo", correct: false }
      ]
    },
    {
      type: "calculation",
      question: "Ganas $20 por semana y ahorras $5. Cuanto ahorras en 4 semanas?",
      answer: 20
    },
    {
      type: "decision",
      question: "Se descompuso tu celular. Tienes $80 ahorrados. La reparacion cuesta $50. Que haces?",
      options: [
        { text: "Usar todos los ahorros", correct: false },
        { text: "Usar $50 y dejar $30 ahorrados", correct: true }
      ]
    }
  ],
  
  4: [
    {
      type: "investment",
      question: "Inviertes 50 monedas en una limonada. Vendes y ganas 30 monedas mas. Cuanto tienes?",
      answer: 80
    },
    {
      type: "investment",
      question: "Inviertes $100 y ganas 20% de interes. Cuanto ganaste?",
      answer: 20
    },
    {
      type: "budget",
      question: "Tienes $200. Quieres invertir 50% y ahorrar 50%. Cuanto inviertes y cuanto ahorras?",
      inputs: [
        { id: "inversion", label: "Inversion (50%)", placeholder: "100" },
        { id: "ahorro", label: "Ahorro (50%)", placeholder: "100" }
      ],
      validate: (values) => {
        const inversion = Number(values.inversion) || 0;
        const ahorro = Number(values.ahorro) || 0;
        return inversion === 100 && ahorro === 100;
      }
    },
    {
      type: "quiz",
      question: "Que es mejor para hacer crecer tu dinero?",
      options: [
        { text: "Guardarlo en una alcancia", correct: false },
        { text: "Invertirlo en un negocio", correct: true }
      ]
    },
    {
      type: "calculation",
      question: "Inviertes $30 y ganas $15. Cuanto tienes ahora?",
      answer: 45
    }
  ],
  
  5: [
    {
      type: "shopping",
      question: "Un juego cuesta $60 en tienda A y $45 en tienda B. Cuanto ahorras comprando en la B?",
      answer: 15
    },
    {
      type: "budget",
      question: "Tienes $150 para comprar: regalo mama ($40), regalo papa ($40), tu regalo ($30) y el resto ahorrar. Cuanto ahorras?",
      inputs: [
        { id: "mama", label: "Regalo mama ($40)", placeholder: "40" },
        { id: "papa", label: "Regalo papa ($40)", placeholder: "40" },
        { id: "propio", label: "Tu regalo ($30)", placeholder: "30" },
        { id: "ahorro", label: "Ahorro", placeholder: "Resto" }
      ],
      validate: (values) => {
        const mama = Number(values.mama) || 0;
        const papa = Number(values.papa) || 0;
        const propio = Number(values.propio) || 0;
        const ahorro = Number(values.ahorro) || 0;
        const total = mama + papa + propio + ahorro;
        return mama === 40 && papa === 40 && propio === 30 && total === 150;
      }
    },
    {
      type: "quiz",
      question: "Cuando es mejor comprar algo?",
      options: [
        { text: "Aprovechar ofertas y descuentos", correct: true },
        { text: "Apenas lo ves sin pensar", correct: false }
      ]
    },
    {
      type: "calculation",
      question: "Un articulo cuesta $80 pero tiene 25% de descuento. Cuanto pagas?",
      answer: 60
    },
    {
      type: "decision",
      question: "Viste zapatos en oferta de $50 a $35. Cuanto ahorras?",
      options: [
        { text: "$15", correct: true },
        { text: "$20", correct: false }
      ]
    }
  ],
  
  6: [
    {
      type: "business_idea",
      question: "Describe una idea de negocio para tu comunidad:",
      minLength: 10
    },
    {
      type: "investment",
      question: "Tu negocio de limonada: inviertes $20 en limones y vendes $45. Cuanto ganaste?",
      answer: 25
    },
    {
      type: "budget",
      question: "Para tu negocio necesitas: ingredientes ($30), publicidad ($15), envases ($10). Tienes $70. Cuanto te queda?",
      inputs: [
        { id: "ingredientes", label: "Ingredientes ($30)", placeholder: "30" },
        { id: "publicidad", label: "Publicidad ($15)", placeholder: "15" },
        { id: "envases", label: "Envases ($10)", placeholder: "10" },
        { id: "resto", label: "Resto", placeholder: "Ganancia" }
      ],
      validate: (values) => {
        const ingredientes = Number(values.ingredientes) || 0;
        const publicidad = Number(values.publicidad) || 0;
        const envases = Number(values.envases) || 0;
        const resto = Number(values.resto) || 0;
        const total = ingredientes + publicidad + envases + resto;
        return ingredientes === 30 && publicidad === 15 && envases === 10 && total === 70;
      }
    },
    {
      type: "quiz",
      question: "Que necesitas para un negocio exitoso?",
      options: [
        { text: "Un buen producto y clientes", correct: true },
        { text: "Solo mucho dinero", correct: false }
      ]
    },
    {
      type: "calculation",
      question: "Vendes 20 limonadas a $3 cada una. Cuanto ganaste?",
      answer: 60
    }
  ],
  
  7: [
    {
      type: "final_challenge",
      question: "Nivel Final. Tienes $500 para administrar. Como lo harías?",
      task: "Explica como administrarías $500 (ahorro, inversion, gastos)",
      minLength: 15
    },
    {
      type: "investment",
      question: "Inviertes $200 y ganas 15%. Cuanto ganaste?",
      answer: 30
    },
    {
      type: "budget",
      question: "Presupuesto mensual: comida $150, transporte $80, ahorro $100, inversion $70. Cuanto gastas en total?",
      inputs: [
        { id: "comida", label: "Comida ($150)", placeholder: "150" },
        { id: "transporte", label: "Transporte ($80)", placeholder: "80" },
        { id: "ahorro", label: "Ahorro ($100)", placeholder: "100" },
        { id: "inversion", label: "Inversion ($70)", placeholder: "70" }
      ],
      validate: (values) => {
        const comida = Number(values.comida) || 0;
        const transporte = Number(values.transporte) || 0;
        const ahorro = Number(values.ahorro) || 0;
        const inversion = Number(values.inversion) || 0;
        return comida === 150 && transporte === 80 && ahorro === 100 && inversion === 70;
      }
    },
    {
      type: "quiz",
      question: "Que lograste al llegar al nivel 7?",
      options: [
        { text: "Aprender a administrar dinero", correct: true },
        { text: "Solo jugar", correct: false }
      ]
    },
    {
      type: "calculation",
      question: "Tienes $500. Gastas 40% y ahorras 60%. Cuanto ahorras?",
      answer: 300
    }
  ]
};

// Inicializacion
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
  
  const perfilForm = document.getElementById("perfilForm");
  if (perfilForm) {
    perfilForm.addEventListener("submit", iniciarJuego);
  }
  
  agregarEstiloAnimacion();
});

function iniciarJuego(e) {
  e.preventDefault();
  
  const nombre = document.getElementById("nombre").value.trim();
  const edad = document.getElementById("edad").value;
  const meta = document.getElementById("meta").value;
  
  if(!nombre || !edad || !meta) {
    showCoachMessage("Completa todos los campos para comenzar", "warning");
    return;
  }
  
  playerName = nombre;
  playerAge = edad;
  playerGoal = meta;
  
  document.getElementById("perfil").classList.remove("active");
  document.getElementById("juego").classList.add("active");
  
  document.getElementById("playerInfo").innerHTML = `
    <strong>${playerName}</strong> (${playerAge} años)<br>
    <small>Meta: ${meta === 'ahorrar' ? 'Ahorrar' : 'Emprender'}</small>
  `;
  
  currentLevel = 1;
  currentChallengeIndex = 0;
  coins = 0;
  updateCoins();
  updateProgress();
  loadLevel();
  
  showCoachMessage(`Bienvenido ${playerName}. Completa 5 desafios por nivel para ganar monedas.`);
}

function loadLevel() {
  const levelDisplay = document.getElementById("currentLevel");
  if (levelDisplay) levelDisplay.textContent = currentLevel;
  
  updateProgress();
  
  const levelChallenges = CHALLENGES[currentLevel];
  
  if (!levelChallenges || currentLevel > 7) {
    mostrarPantallaFinal();
    return;
  }
  
  if (currentChallengeIndex >= levelChallenges.length) {
    completeLevel();
    return;
  }
  
  const challenge = levelChallenges[currentChallengeIndex];
  if (!challenge) {
    completeLevel();
    return;
  }
  
  displayChallenge(challenge);
}

function displayChallenge(challenge) {
  const area = document.getElementById("challengeArea");
  if (!area) return;
  
  let html = `
    <h3>Nivel ${currentLevel}: ${LEVELS[currentLevel].name}</h3>
    <p class="challenge-question" style="font-size: 1.3rem; margin: 20px 0;">${challenge.question}</p>
  `;
  
  switch(challenge.type) {
    case "budget":
      html += '<div class="budget-inputs" style="display: grid; gap: 15px; margin: 20px 0;">';
      challenge.inputs.forEach(input => {
        html += `
          <div class="input-group" style="text-align: left;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">${input.label}</label>
            <input type="number" id="${input.id}" placeholder="${input.placeholder}" min="0" style="width: 100%; padding: 12px; border-radius: 10px; border: 2px solid #764ba2; font-size: 1.1rem;">
          </div>
        `;
      });
      html += '</div>';
      html += `<button class="btn btn-primary" onclick="validateBudget(${currentLevel}, ${currentChallengeIndex})" style="font-size: 1.2rem; padding: 15px 30px;">Verificar Presupuesto</button>`;
      break;
      
    case "quiz":
    case "decision":
      html += '<div class="quiz-options" style="display: grid; gap: 15px; margin: 20px 0;">';
      challenge.options.forEach((option, index) => {
        html += `
          <button class="btn btn-secondary" onclick="checkQuizAnswer(${currentLevel}, ${currentChallengeIndex}, ${index})" style="font-size: 1.2rem; padding: 15px;">
            ${option.text}
          </button>
        `;
      });
      html += '</div>';
      break;
      
    case "classification":
      html += '<div class="classification-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">';
      challenge.items.forEach((item, index) => {
        html += `
          <button class="btn btn-secondary" onclick="classifyItem(${currentLevel}, ${currentChallengeIndex}, ${index})" style="font-size: 1.2rem; padding: 15px;">
            ${item.text}
          </button>
        `;
      });
      html += '</div>';
      break;
      
    case "calculation":
    case "investment":
      html += `
        <div class="input-group" style="margin: 20px 0;">
          <input type="number" id="calculationAnswer" placeholder="Escribe tu respuesta" min="0" style="width: 100%; padding: 15px; border-radius: 10px; border: 2px solid #764ba2; font-size: 1.2rem;">
        </div>
        <button class="btn btn-primary" onclick="checkCalculation(${currentLevel}, ${currentChallengeIndex})" style="font-size: 1.2rem; padding: 15px 30px;">Verificar</button>
      `;
      break;
      
    case "shopping":
      html += `
        <div class="input-group" style="margin: 20px 0;">
          <input type="number" id="shoppingAnswer" placeholder="Cuanto ahorras?" min="0" style="width: 100%; padding: 15px; border-radius: 10px; border: 2px solid #764ba2; font-size: 1.2rem;">
        </div>
        <button class="btn btn-primary" onclick="checkShopping(${currentLevel}, ${currentChallengeIndex})" style="font-size: 1.2rem; padding: 15px 30px;">Verificar</button>
      `;
      break;
      
    case "spending":
      html += `
        <div style="background: linear-gradient(135deg, #ffd700, #ffa500); padding: 20px; border-radius: 20px; margin: 20px 0;">
          <p style="font-size: 2rem; margin-bottom: 10px;">Monedas actuales: ${coins}</p>
        </div>
        <div style="display: grid; gap: 15px;">
          <button class="btn btn-primary" onclick="spendCoins(${challenge.cost}, '${challenge.hint}')" style="font-size: 1.3rem; padding: 20px;">
            Gastar ${challenge.cost} monedas por una pista
          </button>
          <button class="btn btn-secondary" onclick="continueWithoutSpending()" style="font-size: 1.2rem; padding: 15px;">
            Continuar sin gastar
          </button>
        </div>
      `;
      break;
      
    case "business_idea":
    case "final_challenge":
      html += `
        <div style="margin: 20px 0;">
          <textarea id="ideaText" placeholder="Escribe aqui tu idea..." rows="4" style="width: 100%; padding: 15px; border-radius: 10px; border: 2px solid #764ba2; font-size: 1.1rem;"></textarea>
        </div>
        <button class="btn btn-primary" onclick="validateIdea(${currentLevel}, ${currentChallengeIndex})" style="font-size: 1.2rem; padding: 15px 30px;">Enviar Idea</button>
      `;
      break;
  }
  
  html += `
    <div style="margin-top: 30px;">
      <button class="btn btn-secondary" onclick="showMenuModal()" style="font-size: 1rem; padding: 10px 20px;">Menu Principal</button>
    </div>
  `;
  
  area.innerHTML = html;
}

function validateBudget(level, challengeIndex) {
  const challenge = CHALLENGES[level][challengeIndex];
  if (!challenge) return;
  
  const values = {};
  let allFilled = true;
  
  challenge.inputs.forEach(input => {
    const inputElement = document.getElementById(input.id);
    if (inputElement) {
      values[input.id] = inputElement.value;
      if (inputElement.value === "") {
        allFilled = false;
      }
    } else {
      allFilled = false;
    }
  });
  
  if (!allFilled) {
    showCoachMessage("Completa todos los campos primero", "warning");
    return;
  }
  
  const numericValues = {};
  challenge.inputs.forEach(input => {
    numericValues[input.id] = Number(values[input.id]) || 0;
  });
  
  if (challenge.validate(numericValues)) {
    setTimeout(() => completeChallenge(), 500);
  } else {
    showCoachMessage("Continua con el siguiente desafio", "info");
    setTimeout(() => continueToNext(), 1000);
  }
}

function checkQuizAnswer(level, challengeIndex, optionIndex) {
  const challenge = CHALLENGES[level][challengeIndex];
  if (!challenge) return;
  
  const option = challenge.options[optionIndex];
  
  if (option.correct) {
    setTimeout(() => completeChallenge(), 500);
  } else {
    showCoachMessage("Continua con el siguiente desafio", "info");
    setTimeout(() => continueToNext(), 1000);
  }
}

function classifyItem(level, challengeIndex, itemIndex) {
  const challenge = CHALLENGES[level][challengeIndex];
  if (!challenge) return;
  
  const item = challenge.items[itemIndex];
  
  if (item.correct) {
    setTimeout(() => completeChallenge(), 500);
  } else {
    showCoachMessage("Continua con el siguiente desafio", "info");
    setTimeout(() => continueToNext(), 1000);
  }
}

function checkCalculation(level, challengeIndex) {
  const challenge = CHALLENGES[level][challengeIndex];
  if (!challenge) return;
  
  const answerInput = document.getElementById("calculationAnswer");
  if (!answerInput || answerInput.value === "") {
    showCoachMessage("Escribe una respuesta primero", "warning");
    return;
  }
  
  const userAnswer = Number(answerInput.value);
  
  if (userAnswer === challenge.answer) {
    setTimeout(() => completeChallenge(), 500);
  } else {
    showCoachMessage("Continua con el siguiente desafio", "info");
    setTimeout(() => continueToNext(), 1000);
  }
}

function checkShopping(level, challengeIndex) {
  const challenge = CHALLENGES[level][challengeIndex];
  if (!challenge) return;
  
  const answerInput = document.getElementById("shoppingAnswer");
  if (!answerInput || answerInput.value === "") {
    showCoachMessage("Escribe una respuesta primero", "warning");
    return;
  }
  
  const userAnswer = Number(answerInput.value);
  
  if (userAnswer === challenge.answer) {
    setTimeout(() => completeChallenge(), 500);
  } else {
    showCoachMessage("Continua con el siguiente desafio", "info");
    setTimeout(() => continueToNext(), 1000);
  }
}

function validateIdea(level, challengeIndex) {
  const challenge = CHALLENGES[level][challengeIndex];
  if (!challenge) return;
  
  const ideaText = document.getElementById("ideaText");
  if (!ideaText || ideaText.value.trim() === "") {
    showCoachMessage("Escribe tu idea primero", "warning");
    return;
  }
  
  const idea = ideaText.value.trim();
  
  if (idea.length >= (challenge.minLength || 10)) {
    setTimeout(() => completeChallenge(), 500);
  } else {
    showCoachMessage(`Escribe al menos ${challenge.minLength || 10} caracteres`, "warning");
    return;
  }
}

function spendCoins(amount, hint) {
  if (coins >= amount) {
    coins -= amount;
    updateCoins();
    showCoachMessage(`Pista: ${hint}`);
    closeModal();
    setTimeout(() => completeChallenge(), 2000);
  } else {
    showCoachMessage(`No tienes suficientes monedas. Necesitas ${amount} monedas.`, "warning");
  }
}

function continueWithoutSpending() {
  showCoachMessage("Continua con el siguiente desafio", "info");
  setTimeout(() => continueToNext(), 1000);
}

function completeChallenge() {
  const challengeReward = 20;
  coins += challengeReward;
  updateCoins();
  
  animateCoins();
  challengesCompleted++;
  
  const levelChallenges = CHALLENGES[currentLevel];
  
  if (currentChallengeIndex + 1 >= (levelChallenges ? levelChallenges.length : 0)) {
    setTimeout(() => completeLevel(), 1000);
  } else {
    currentChallengeIndex++;
    setTimeout(() => loadLevel(), 1000);
  }
}

function continueToNext() {
  const levelChallenges = CHALLENGES[currentLevel];
  
  if (currentChallengeIndex + 1 >= (levelChallenges ? levelChallenges.length : 0)) {
    setTimeout(() => completeLevel(), 1000);
  } else {
    currentChallengeIndex++;
    setTimeout(() => loadLevel(), 1000);
  }
}

function completeLevel() {
  levelCompleted = true;
  
  const levelCoins = LEVELS[currentLevel].coins;
  coins += levelCoins;
  updateCoins();
  
  const modal = document.getElementById("levelCompleteModal");
  if (!modal) return;
  
  const messageElem = document.getElementById("levelCompleteMessage");
  const coinsElem = document.getElementById("coinsEarnedMessage");
  
  if (messageElem) {
    messageElem.innerHTML = `
      Completaste el Nivel ${currentLevel}<br>
      <span style="font-size: 1.5rem; display: block; margin: 10px 0; color: #ffd700;">
        ${LEVELS[currentLevel].name}
      </span>
    `;
  }
  
  if (coinsElem) {
    coinsElem.innerHTML = `
      <span style="font-size: 2rem;">+${levelCoins} monedas</span><br>
      <span style="font-size: 1.2rem;">Total: ${coins} monedas</span>
    `;
  }
  
  modal.style.display = "block";
}

function nextLevel() {
  closeModal();
  
  if (currentLevel < 7) {
    currentLevel++;
    currentChallengeIndex = 0;
    challengesCompleted = 0;
    loadLevel();
    showCoachMessage(`Nivel ${currentLevel}: ${LEVELS[currentLevel].name}`);
  } else {
    mostrarPantallaFinal();
  }
}

function repeatLevel() {
  closeModal();
  currentChallengeIndex = 0;
  challengesCompleted = 0;
  loadLevel();
  showCoachMessage("Intentalo de nuevo");
}

function mostrarPantallaFinal() {
  // Cuando termina el nivel 7, mostramos la pantalla final segun monedas
  const modal = document.getElementById("microFundModal");
  const fundMessage = document.getElementById("fundMessage");
  
  if (!modal || !fundMessage) return;
  
  if (coins >= 1000) {
    // Cumplio la meta
    fundMessage.innerHTML = `
      Felicidades ${playerName}<br>
      <span style="font-size: 2rem; display: block; margin: 15px 0;">${coins} monedas</span>
      Has alcanzado la meta de 1000 monedas.
    `;
    
    // Personalizar el modal para exito
    modal.innerHTML = `
      <div class="modal-content special" style="background: linear-gradient(135deg, #4CAF50, #45a049);">
        <h2 style="color: white; font-size: 2rem;">Meta Cumplida</h2>
        <p style="font-size: 1.3rem; margin: 20px 0; color: white;">${fundMessage.innerHTML}</p>
        <p style="color: white; margin-bottom: 30px;">Puedes aplicar al Micro Fund.</p>
        <button class="btn btn-large btn-primary" onclick="applyMicroFund()" style="background: white; color: #4CAF50; font-size: 1.3rem; margin-bottom: 10px;">
          Apply for Micro Fund
        </button>
        <button class="btn btn-large btn-secondary" onclick="goToMenu()" style="background: transparent; border: 2px solid white; color: white;">
          Menu Principal
        </button>
      </div>
    `;
  } else {
    // No cumplio la meta
    fundMessage.innerHTML = `
      Lo siento ${playerName}<br>
      <span style="font-size: 2rem; display: block; margin: 15px 0;">${coins} monedas</span>
      No alcanzaste la meta de 1000 monedas.
    `;
    
    // Personalizar el modal para fracaso
    modal.innerHTML = `
      <div class="modal-content" style="background: linear-gradient(135deg, #f44336, #d32f2f);">
        <h2 style="color: white; font-size: 2rem;">Meta no cumplida</h2>
        <p style="font-size: 1.3rem; margin: 20px 0; color: white;">${fundMessage.innerHTML}</p>
        <p style="color: white; margin-bottom: 30px;">Vuelve a intentarlo para desbloquear el Micro Fund.</p>
        <button class="btn btn-large btn-secondary" onclick="goToMenu()" style="background: white; color: #f44336; font-size: 1.3rem;">
          Menu Principal
        </button>
      </div>
    `;
  }
  
  modal.style.display = "block";
}

function applyMicroFund() {
  alert(`Felicidades ${playerName}. Has demostrado ser un excelente administrador financiero.`);
  closeModal();
  goToMenu();
}

function updateCoins() {
  const coinsElement = document.getElementById("coins");
  if (coinsElement) {
    coinsElement.textContent = coins;
  }
}

function updateProgress() {
  const progress = (currentLevel / 7) * 100;
  const progressBar = document.getElementById("progress");
  if (progressBar) {
    progressBar.style.width = progress + "%";
  }
}

function showCoachMessage(message, type = "info") {
  const coachDiv = document.getElementById("coach");
  if (!coachDiv) return;
  
  coachDiv.innerHTML = `
    <div class="coach-avatar">${type === "warning" ? "⚠" : "●"}</div>
    <div class="coach-text" style="font-size: 1.1rem;">${message}</div>
  `;
  
  coachDiv.style.animation = "none";
  setTimeout(() => {
    coachDiv.style.animation = "slideIn 0.5s";
  }, 10);
}

function animateCoins() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const coin = document.createElement("div");
      coin.textContent = "🪙";
      coin.style.position = "fixed";
      coin.style.left = Math.random() * window.innerWidth + "px";
      coin.style.top = "-50px";
      coin.style.fontSize = (20 + Math.random() * 30) + "px";
      coin.style.zIndex = "9999";
      coin.style.pointerEvents = "none";
      coin.style.animation = `coinFall ${1 + Math.random()}s linear`;
      document.body.appendChild(coin);
      
      setTimeout(() => {
        if (coin.parentNode) coin.remove();
      }, 2000);
    }, i * 100);
  }
}

function showMenuModal() {
  const modal = document.getElementById("menuModal");
  if (modal) modal.style.display = "block";
}

function resumeGame() {
  closeModal();
}

function goToMenu() {
  closeModal();
  document.getElementById("juego").classList.remove("active");
  document.getElementById("perfil").classList.add("active");
  
  coins = 0;
  currentLevel = 1;
  currentChallengeIndex = 0;
  challengesCompleted = 0;
  updateCoins();
  updateProgress();
  
  document.getElementById("perfilForm").reset();
}

function closeModal() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = "none";
  });
}

function agregarEstiloAnimacion() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes coinFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .loader.hidden {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s;
    }
    
    .btn {
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    
    input, select, textarea {
      font-family: 'Quicksand', sans-serif;
    }
    
    .modal {
      display: none;
    }
  `;
  document.head.appendChild(style);
}
