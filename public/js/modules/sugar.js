// client side 
let sugar_form = document.getElementById('sugarTrackerForm');
let sugar_error = document.getElementById('sugarError');
console.log(sugar_form)
if (sugar_form) 
{
    sugar_form.addEventListener('submit', (e) => 

    {
        console.log("sugar form is submitted")
        e.preventDefault();
        let sugarElement = document.getElementById('sugarInput');
        let sugar = document.getElementById('sugarInput').value;
        let fast = document.getElementById('fastingInput')

        sugar = parseFloat(sugar);
        if (fast.getAttribute('type') !== 'checkbox')
        {
            sugar_error.innerHTML = `Type of fastingInput must stay checkbox `;
        }
        else if(!sugar)
        {
            sugar_error.innerHTML = `Sugar input must be filled out`;
        }
        else if (sugar <= 0)
        {
            sugar_error.innerHTML = `Sugar value must be greater than 0`;
        }
        else if (sugar >= 300)
        {
            sugar_error.innerHTML = `Sugar reading is too high, please contact your doctor`;
        }
        else if (sugarElement.getAttribute('type') !== 'number' || isNaN(sugar))
        {
            sugar_error.innerHTML = `SugarInput must be stay a number`;
        }
        else
        {
            sugar_error.innerHTML = `you have successfully submitted your sugar reading of ${sugar}`;
            sugar_form.submit();
        }
    })
}
