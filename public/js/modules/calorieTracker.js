import * as validation from "../moduleValidation.js";

let calorieId;

let api_key;

function addFoodFormHTML(ith) {
  return `<div id="addFoodForm${ith}" class="flex space-x-4 addFoodForm">
  <button id="removeFoodBtn${ith}" value="${ith}"><i class="text-xl fa-solid fa-circle-minus"></i></button>

  <label>
    Item Name
    <input name="foodName" id="foodName" type="text" maxlength="1000" />
  </label>

  <div class="flex">
    <label>
      Calories per Serving
      <input name="calories" id="numCalories" type="number" step="any" min="0" max="30000" />
    </label>
    <label>
      No. of Servings
      <input name="servings" type="number" step="any" min="1" max="1000" />
    </label>
  </div>
</div>`;
}

// Toggle the edit modal
function toggleAddCalories() {
  $("#calorieModal").toggle();

  // Reset the form
  $("#calorieForm").attr("action", "/modules/calories");

  // clear errors
  $(".errorContainer").empty();

  // Remove all the existing food forms
  $(".addFoodForm").remove();

  // Add the event listeners to the remove food buttons
  $(".addFoodForm button").click(function () {
    let ith = $(this).val();
    $(`#addFoodForm${ith}`).remove();
  });
}

// Toggle the edit modal
async function toggleEditCalories() {
  $("#calorieModal").toggle();

  // clear errors
  $(".errorContainer").empty();

  $("#calorieForm").attr("action", `/modules/calories/${calorieId}`);

  // Get the calorie data
  let calorieData;
  try {
    let res = await axios.get(`/modules/calories/${calorieId}`, {
      headers: { "X-Client-Side-Request": "true" },
    });
    if (res.data.error) {
      alert(res.data.error);
    }
    calorieData = res.data;
  } catch (e) {
    console.log(e);
    return;
  }

  // Remove all the existing food forms
  $(".addFoodForm").remove();

  // Add the food forms
  for (let i = 0; i < calorieData.foods.length; i++) {
    $("#addFoodBtn").before(addFoodFormHTML(i));
    $(`#addFoodForm${i} input[name='foodName']`).val(
      calorieData.foods[i].food_name
    );
    $(`#addFoodForm${i} input[name='calories']`).val(
      calorieData.foods[i].calories
    );
    $(`#addFoodForm${i} input[name='servings']`).val(
      calorieData.foods[i].quantity
    );
    addAutocomplete(i);
  }

  // Add the event listeners to the remove food buttons
  $(".addFoodForm button").click(function () {
    let ith = $(this).val();
    $(`#addFoodForm${ith}`).remove();
  });
}

// get api key from server
async function getAPIKey() {
  try {
    let res = await axios.get(`/modules/calories/apikey`, {
      headers: { "X-Client-Side-Request": "true" },
    });
    api_key = res.data.key;
  } catch (e) {
    console.log(e);
  }
}

// Validate Food Form
/**
 * Validatese the ith food form
 * @param {number} ith The ith food form
 */
function validateFoodForm(ith) {
  let foodName = $(`#addFoodForm${ith} input[name="foodName"]`).val();
  let calories = $(`#addFoodForm${ith} input[name="calories"]`).val();
  let servings = $(`#addFoodForm${ith} input[name="servings"]`).val();

  // Reset invalidInput class
  $(`#addFoodForm${ith} input`).removeClass("invalidInput");

  let invalidParams = [];
  // Check if all params exist
  try {
    validation.paramExists({
      foodName,
      calories,
      servings,
    });
  } catch (e) {
    e.forEach((param) => {
      $(`#addFoodForm${ith} input[name="${param}"]`).addClass("invalidInput");
    });
    return false;
  }

  // Validate foodName
  try {
    let validName =
      typeof foodName === "string" &&
      foodName.trim().length > 0 &&
      foodName.trim().length <= 1000;
    if (!validName) {
      invalidParams.push("foodName");
    }
  } catch (e) {
    invalidParams.push("foodName");
  }

  // Validate foodSets, foodReps, and foodWeight
  try {
    validation.paramIsNum({
      calories,
      servings,
    });

    /**
     * Further validation for the specific fields
     */
    calories = Number(calories);
    servings = Number(servings);

    // Check if calories per serving is an integer between 0 and 30000
    if (!Number.isInteger(calories) || calories < 0 || calories > 30000) {
      invalidParams.push("calories");
    }

    // Check if servings is an integer between 1 and 1000
    if (!Number.isInteger(servings) || servings < 1 || servings > 1000) {
      invalidParams.push("servings");
    }
  } catch (e) {
    invalidParams = [...invalidParams, ...e];
  }

  if (invalidParams.length > 0) {
    // Add error class to invalid params
    invalidParams.forEach((param) => {
      $(`#addFoodForm${ith} input[name="${param}"]`).addClass("invalidInput");
    });
    return false;
  }

  return true;
}

// Add autocomplete to foodname
function addAutocomplete(ith) {
  let foodName = $(`#addFoodForm${ith} input[name="foodName"]`);
  let calories = $(`#addFoodForm${ith} input[name="calories"]`);
  let servings = $(`#addFoodForm${ith} input[name="servings"]`);

  const sourceFunc = async (req, res) => {
    let search = req.term;
    try {
      let results = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${api_key}&pageSize=5&query=${search}`
      );
      results = results.data.foods;
      results = results.map((entry) => {
        const name = entry.description;
        let cals = entry.foodNutrients.find(
          (obj) => obj.nutrientName === "Energy"
        );
        return {
          label: name,
          value: cals.value,
        };
      });
      res(results);
    } catch (e) {
      console.log(e);
      res([]);
    }
  };

  let form = $("#calorieForm");

  const onSelect = (event, ui) => {
    let { label, value } = ui.item;
    foodName.val(label);
    calories.val(value);
    servings.focus();
    event.preventDefault();
  };

  const onFocus = (event, ui) => {
    let label = ui.item.label;
    foodName.val(label);
    event.preventDefault();
  };

  foodName
    .autocomplete({
      source: sourceFunc,
      focus: onFocus,
      select: onSelect,
    })
    .each(function () {
      $(this).autocomplete("widget").insertAfter(form.parent());
    });
}

// Wait for document to load
document.addEventListener("DOMContentLoaded", async () => {
  getAPIKey();

  if ($("[id^='selectCalorie']").length > 0) {
    const calorieEntryButtons = $("[id^='selectCalorie']");

    calorieEntryButtons.each(function () {
      $(this).click(async function (event) {
        calorieId = event.target.id?.split("?");
        if (!calorieId) return;
        calorieId = calorieId[1];

        // Get calorie data based on the calorieId
        let calorieData;
        try {
          let res = await axios.get(`/modules/calories/${calorieId}`, {
            headers: { "X-Client-Side-Request": "true" },
          });
          if (res.data.error) {
            alert(res.data.error);
          }
          calorieData = res.data;
        } catch (e) {
          console.log(e);
          return;
        }

        // Helper function to generate the HTML
        function generateFoodsHTML(foods) {
          return foods
            .map(
              (food) => `
              <div class="calorie">
                <h3>${food.food_name}</h3>
                <p>Calories per Serving: ${food.calories}</p>
                <p>No. of Servings: ${food.quantity}</p>
              </div>
              `
            )
            .join("");
        }

        // Update panel content using the calorie entry data
        const panel2ContentHTML = generateFoodsHTML(calorieData.foods);

        const foodsContainer = $("#foodsContainer");
        foodsContainer.html(panel2ContentHTML);

        $("#caloriePanel2Title").html(`${calorieData.date}`);

        if ($("#editCalorieBtn").length > 0) {
          $("#editCalorieBtn").show();
        }
      });
    });
  }

  // Add event listener to add calorie entry button
  if ($("#addCalorieBtn").length > 0) {
    $("#addCalorieBtn").click(toggleAddCalories);
  }

  if ($("#calorieFormCancelBtn").length > 0) {
    $("#calorieFormCancelBtn").click(toggleAddCalories);
  }

  // Add event listener to edit foods button
  if ($("#editCalorieBtn").length > 0) {
    $("#editCalorieBtn").click(async () => {
      await toggleEditCalories();
    });
  }

  if ($("#addFoodBtn").length > 0) {
    $("#addFoodBtn").click(() => {
      // Get the number of food forms with id addFoodForm${ith}
      let ith = $("div[id^='addFoodForm']").length;
      // Add the new food form
      $("#addFoodBtn").before(addFoodFormHTML(ith));
      addAutocomplete(ith);

      $("button[id^='removeFoodBtn']").click((e) => {
        // Get this button's ith
        let ith = $(e.target.parentNode).val();

        // Remove the ith food form
        $(`#addFoodForm${ith}`).remove();
        return;
      });
    });
  }

  if ($("#calorieForm").length > 0) {
    $("#calorieForm").submit((e) => {
      e.preventDefault();
      $(".errorContainer").empty();

      let valid = true;

      // If there are no food forms, error
      if ($("div[id^='addFoodForm']").length > 0) {
        // Get each food form
        let foodForms = $("div[id^='addFoodForm']");
        // For each food form, validate it
        for (let i = 0; i < foodForms.length; i++) {
          valid &= validateFoodForm(i);
        }
      } else {
        $(".errorContainer").append(
          `<p class="error">You must add at least one food or beverage</p>`
        );
        return;
      }

      // If there are any invalid fields, error
      if (!valid) {
        $(".errorContainer").append(
          `<p class="error">One or more fields are invalid</p>`
        );
        return;
      }

      // Submit form
      $("#calorieForm").off("submit").submit();
    });
  }
});
