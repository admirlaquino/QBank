let quizData = [], currentIndex = 0, answers = [];
  let numItems = localStorage.getItem("numItems") || 5;
  document.getElementById("num-items").value = numItems;

  function saveSettings() {
    numItems = document.getElementById("num-items").value;
    localStorage.setItem("numItems", numItems);
    alert("Settings saved!");
  }

  function startQuiz() {
  showLoading(() => {
    const selectedCategory = document.getElementById("category").value;
    numItems = parseInt(localStorage.getItem("numItems") || 5);
    let combined = [];

    if (selectedCategory === "All") {
      for (const cat in questionBank) combined.push(...questionBank[cat]);
    } else {
      combined = questionBank[selectedCategory] || [];
    }

    const randomSet = shuffle(combined).slice(0, numItems);
    quizData = randomSet;
    answers = Array(quizData.length).fill(null);
    currentIndex = 0;

    document.getElementById("settings").style.display = "none";
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    renderQuestion();
  });
}


  function renderQuestion() {
    const q = quizData[currentIndex];
    const choices = shuffle([q[1], q[2], q[3], q[4]]);
    const savedAnswer = answers[currentIndex];
    document.getElementById("question").textContent = q[0];
    document.getElementById("page-number").textContent = `Question ${currentIndex + 1} of ${quizData.length}`;
    const container = document.getElementById("choices");
    container.innerHTML = "";
    document.getElementById("explanation").textContent = "";

    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;

      if (savedAnswer !== null) {
        btn.classList.add("disabled");
        if (savedAnswer === q[1]) {
          if (choice === savedAnswer) btn.classList.add("correct");
        } else {
          if (choice === savedAnswer) btn.classList.add("wrong");
          if (choice === q[1]) btn.classList.add("right-answer");
        }
      } else {
        btn.onclick = () => selectAnswer(choice, q[1], container, q[5]);
      }

      container.appendChild(btn);
    });

    if (savedAnswer !== null) {
      document.getElementById("explanation").textContent = q[5] || "";
    }

    document.getElementById("prevBtn").style.display = currentIndex > 0 ? "inline-block" : "none";
    document.getElementById("nextBtn").textContent = currentIndex === quizData.length - 1 ? "Submit" : "Next";
  }

  function selectAnswer(choice, correctAnswer, container, explanation) {
    answers[currentIndex] = choice;
    Array.from(container.children).forEach(b => {
      b.classList.add("disabled");
      if (choice === correctAnswer && b.textContent === choice) {
        b.classList.add("correct");
      } else if (choice !== correctAnswer) {
        if (b.textContent === choice) {
          b.classList.add("wrong");
        }
        if (b.textContent === correctAnswer) {
          b.classList.add("right-answer");
        }
      }
    });
    document.getElementById("explanation").textContent = explanation || "";
  }

  function nextQuestion() {
  if (answers[currentIndex] === null && currentIndex !== quizData.length - 1) {
    alert("Please select an answer before proceeding.");
    return;
  }

  if (currentIndex === quizData.length - 1) {
    showLoading(showResult);
  } else {
    currentIndex++;
    renderQuestion();
  }
}


  function prevQuestion() {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  }

  function showResult() {
    const correct = answers.filter((a, i) => a === quizData[i][1]).length;
    const percent = (correct / quizData.length) * 100;
    const result = `You scored ${correct}/${quizData.length} (${percent.toFixed(0)}%) - ${percent >= 75 ? "PASSED" : "FAILED"}`;
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    document.getElementById("score-text").textContent = result;
    
     if (percent >= 75) launchConfetti();
     
  }

  function retryQuiz() {
  showLoading(() => {
    document.getElementById("settings").style.display = "block";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-screen").style.display = "none";
  });
}


  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  
  function showLoading(callback) {
  const loader = document.getElementById("loading");
  loader.style.display = "block";
  setTimeout(() => {
    loader.style.display = "none";
    callback();
  }, 1500); // 1 second delay
}

function launchConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    confetti(Object.assign({}, defaults, {
      particleCount: 35,
      origin: { x: 0, y: Math.random() - 0.2 }
    }));
    confetti(Object.assign({}, defaults, {
      particleCount: 35,
      origin: { x: 1, y: Math.random() - 0.2 }
    }));
  }, 250);
}
