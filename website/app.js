//app
const apiKey = 'f483ccfd42c06f262a526387fb6b8b01&units=imperial';
const baseServerURL = 'http://localhost:3000'; // Ensure this matches your server port


const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';

let d = new Date();
let newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

document.getElementById('generate').addEventListener('click', performAction);

function performAction() {
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    if (!zipCode) {
        alert('Please enter a valid ZIP code!');
        return;
    }

    getWeather(baseUrl, zipCode, apiKey)
        .then((data) => {
            if (!data || !data.main) {
                throw new Error('Invalid weather data. Please check the ZIP code.');
            }

            return postData('/add', {
                date: newDate,
                temp: data.main.temp,
                content: feelings,
            });
        })
        .then(() => updateUI())
        .catch((error) => {
            console.error('Error in performAction:', error);
            alert('An error occurred. Please try again.');
        });
}

const getWeather = async (baseUrl, zip, key) => {
    try {
        const response = await fetch(`${baseUrl}${zip}&appid=${key}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to fetch weather data. Check your ZIP code or network.');
    }
};

const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(`${baseServerURL}${url}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to send data to server.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        alert('Unable to send data to the server.');
    }
};

const updateUI = async () => {
    try {
        const request = await fetch(`${baseServerURL}/all`);
        if (!request.ok) {
            throw new Error('Failed to fetch project data.');
        }
        const allData = await request.json();
        document.getElementById('date').innerHTML = `Date: ${allData.date || 'N/A'}`;
        document.getElementById('temp').innerHTML = `Temperature: ${Math.round(allData.temp)}°F`;
        document.getElementById('content').innerHTML = `Feelings: ${allData.content || 'N/A'}`;
    } catch (error) {
        console.error('Error updating UI:', error);
        alert('Unable to update UI. Please refresh and try again.');
    }
};
