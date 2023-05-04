//client side js
let weight_form = document.getElementById('weightTrackerForm');
let weight_error = document.getElementById('weightError');

if (weight_form)
{
    weight_form.addEventListener('submit', (e) =>
    {
        e.preventDefault();
        let weightElement = document.getElementById('weightInput');
        let weight = document.getElementById('weightInput').value;
        weight = parseFloat(weight);
        if(!weight)
        {
            weight_error.innerHTML = `Weight input must be filled out`;
        }
        else if (weight <= 0)
        {
            weight_error.innerHTML = `Weight value must be greater than 0`;
        }
        else if (weight >= 1000)
        {
            weight_error.innerHTML = `Weight reading is too high, please contact your doctor`;
        }
        else if (weightElement.getAttribute('type') !== 'number' || isNaN(weight))
        {
            weight_error.innerHTML = `WeightInput must be stay a number`;
        }
        else
        {
            weight_error.innerHTML = `you have successfully submitted your weight of ${weight}`;
            weight_form.submit();
        }
    })
}

async function getLastWeight() {
    let weight;
    try {
        let res = await axios.get("/modules/weight/last", {
            headers: { "X-Client-Side-Request": "true" },
        })

        if (res.data.error) {
            alert(res.data.error);
        }

        weight = res.data;
    } catch (e) {
        return;
    }
    $("#lastWeight").text(weight.weight);
}

// Listen for document load
document.addEventListener("DOMContentLoaded", async () => {
    if ($("#lastWeight").length > 0) {
        await getLastWeight();
    }
});