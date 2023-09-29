function animateWidth() {
  const progressBar = document.getElementById("progressBar");
  const duration = 1000; // 3 seconds
  const start = performance.now();
  let currentWidth = 1;

  // Show the progress bar container
  document.getElementById("progressContainer").classList.remove("hidden");

  function step(timestamp) {
    const elapsed = timestamp - start;
    currentWidth = (elapsed / duration) * 100;
    progressBar.style.width = `${Math.min(currentWidth, 100)}%`;

    if (currentWidth < 100) {
      requestAnimationFrame(step);
    } else {
      // Hide the progress bar after it completes
      document.getElementById("progressContainer").classList.add("hidden");
    }
  }

  requestAnimationFrame(step);
}

function createInput() {
  const formElement = document.getElementById("inputForm");

  for (let year = 1; year <= 3; year++) {
    // Create a section for each year
    const sectionElement = document.createElement("div");
    sectionElement.className = "mb-8";
    const yearHeading = document.createElement("h2");
    yearHeading.className = "text-xl mb-4";
    yearHeading.innerText = `Year ${year}`;
    sectionElement.appendChild(yearHeading);

    for (let i = 1; i <= 25; i++) {
      const divElement = document.createElement("div");
      divElement.className = "flex space-x-4 mb-2";

      const labelElement = document.createElement("label");
      labelElement.className = "flex-none w-16";
      labelElement.innerText = `Item ${i}:`;

      const inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.placeholder = `Value`;
      inputElement.className = "flex-1 p-2 border rounded";
      inputElement.name = `year${year}_item${i}`;

      divElement.appendChild(labelElement);
      divElement.appendChild(inputElement);
      sectionElement.appendChild(divElement);
    }

    // Append section to the form
    formElement.appendChild(sectionElement);
  }

  document.getElementById("fillRandom").addEventListener("click", function () {
    const inputs = formElement.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = (Math.random() * 2 - 1).toFixed(2);
    });
  });

  // Event listener to clear all inputs
  document.getElementById("clearInputs").addEventListener("click", function () {
    const inputs = formElement.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });
    //clear answer
    const answerElement = document.getElementById("answer-number");
    answerElement.innerText = "";
    document.getElementById("answer").classList.add("hidden");
  });

  document
    .getElementById("submit")
    .addEventListener("click", async function () {
      animateWidth();

      setTimeout(async () => {
        const input = [];
        for (let year = 1; year <= 3; year++) {
          const yearlyData = [];
          for (let i = 1; i <= 25; i++) {
            const inputValue = parseFloat(
              document.getElementsByName(`year${year}_item${i}`)[0].value
            );
            yearlyData.push(isNaN(inputValue) ? 0 : inputValue);
          }
          input.push(yearlyData);
        }

        const result = await loadModel([input]);

        // Show the result
        const answerElement = document.getElementById("answer-number");
        answerElement.innerText = `${result}`;

        // Show the result container
        document.getElementById("answer").classList.remove("hidden");
      }, 3000); // Wait for the progress bar to complete
    });
}

async function loadModel(input) {
  const model = await tf.loadLayersModel("/prediction_ki/model.json");

  // Convert inputData to a tf.Tensor
  const inputTensor = tf.tensor(input);

  const prediction = await model.predict(inputTensor);

  // Convert tensor to array for easier use
  const predictionArray = await prediction.array();
  return predictionArray[0][0];
}

createInput();
console.log("v1.0.3");
