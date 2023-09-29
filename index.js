const features = [
  "Total_Current_Oper_nor",
  "Total_Construction_nor",
  "Total_Purchase_nor",
  "Air_Trans_Current_Exp_nor",
  "Air_Trans_Construction_nor",
  "Air_Trans_Purchase_nor",
  "Total_Highways_Current_Exp_nor",
  "Total_Highways_Construct_Exp_nor",
  "Total_Highways_Purchase_Exp_nor",
  "Parking_Current_Exp_nor",
  "Parking_Construction_nor",
  "Parking_Purchase_nor",
  "Water_Trans_Current_Exp_nor",
  "Water_Trans_Construct_Exp_nor",
  "Water_Trans_Purchase_Exp_nor",
  "Trans_Util_Current_Exp_nor",
  "Trans_Util_Construct_Exp_nor",
  "Trans_Util_Purchase_Exp_nor",
  "white_r",
  "black_r",
  "asian_r",
  "hispanic_r",
  "median_income",
  "high_edu_ratio",
  "pop_den",
];

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
      divElement.className = " grid grid-cols-1 sm:grid-cols-2 mb-2";

      const labelElement = document.createElement("label");
      labelElement.className = "flex-1  break-words";
      labelElement.innerText = features[i - 1];

      const inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.placeholder = `Value`;
      inputElement.className = "flex-1 p-2 border rounded";
      inputElement.name = `year${year}_${features[i - 1]}`;

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
      input.value = (Math.random() * 10 - 5).toFixed(2);
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
  });

  document
    .getElementById("submit")
    .addEventListener("click", async function () {
      const input = [];
      for (let year = 1; year <= 3; year++) {
        const yearlyData = [];
        for (let i = 1; i <= 25; i++) {
          const inputValue = parseFloat(
            document.getElementsByName(`year${year}_${features[i - 1]}`)[0]
              .value
          );
          yearlyData.push(isNaN(inputValue) ? 0 : inputValue);
        }
        input.push(yearlyData);
      }

      console.log(input);
      const result = await loadModel([input]);

      // show answer at top
      const answerElement = document.getElementById("answer-number");
      console.log(result);
      answerElement.innerText = `${result}`;
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
