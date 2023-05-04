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