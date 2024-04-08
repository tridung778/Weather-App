const buttonID = document.getElementById("buttonID");
const temp = document.getElementById("temp");
const weatherIcon = document.getElementById("weatherIcon");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const windSpeed = document.getElementById("windSpeed");
const waterWet = document.getElementById("waterWet");
const description = document.getElementById("description");
const news = document.getElementById("news");
var time = document.getElementById("time");
var dayTime = document.getElementById("day");

const weatherKeyAPI = "aa7b51157252625913e6cdc7c35b41ad";
const newsKeyAPI = "pub_416261ad502396998c6b011aa663341a0a1c9";

var lat = "";
var lon = "";

// Tạo một biến để lưu trữ danh sách các từ khóa
let keywords = [];

// Hàm để tạo ngẫu nhiên một chữ cái từ 'a' đến 'z'
function randomLetter() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

// Hàm để lấy tin tức với từ khóa là một chữ cái ngẫu nhiên
function getRandomNews() {
  const randomKeyword = randomLetter();
  keywords.push(randomKeyword); // Thêm từ khóa vào danh sách
  getNews(randomKeyword);
}

// Tạo một hàm để kiểm tra và gọi lại lấy tin tức khi currentIndex đạt cuối mảng result
async function checkAndFetchNextNews(currentIndex, data) {
  if (currentIndex >= data.results.length) {
    const randomKeyword = randomLetter();
    keywords.push(randomKeyword); // Thêm từ khóa mới vào danh sách
    getNews(randomKeyword);
  }
}

// Tạo một hàm để lấy tin tức và hiển thị chúng một cách tuần tự
async function getNews(keyWord) {
  try {
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=pub_416261ad502396998c6b011aa663341a0a1c9&q=${keyWord}&country=vi`
    );
    const data = await response.json();
    console.log(data);

    // Kiểm tra nếu có kết quả trả về
    if (data && data.results && data.results.length > 0) {
      // Gọi hàm showNextNews để hiển thị tin tức một cách tuần tự
      let currentIndex = 0;
      async function showNextNews() {
        if (currentIndex < data.results.length) {
          news.innerText = data.results[currentIndex].title;
          currentIndex++;
          // Kiểm tra và gọi lại lấy tin tức khi currentIndex đạt cuối mảng result
          await checkAndFetchNextNews(currentIndex, data);
          // Chờ 10 phút (600000 miligiây) trước khi hiển thị tin tức tiếp theo
          setTimeout(showNextNews, 600000);
        }
      }

      // Bắt đầu hiển thị tin tức
      showNextNews();
    } else {
      // Hiển thị thông báo nếu không có tin tức được tìm thấy
      news.innerText = "Không có tin tức nào được tìm thấy";
    }
  } catch (error) {
    console.error("Lỗi khi lấy tin tức:", error);
  }
}

// Bắt đầu lấy tin tức với từ khóa ngẫu nhiên khi trang được tải
window.onload = () => {
  getLocation();
  getTime();
  getRandomNews();
};

function getTime() {
  var t = new Date();
  var hours = t.getHours();
  var minutes = t.getMinutes();
  var seconds = t.getSeconds();
  var day = t.getDate();
  var month = t.getMonth() + 1;
  var year = t.getFullYear();
  time.innerText = hours + ":" + minutes + ":" + seconds;
  dayTime.innerText = day + "/" + month + "/" + year;

  setTimeout(getTime, 1000);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    fetchData();
  });
  setTimeout(getLocation, 120000);
}

function fetchData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKeyAPI}&units=metric&lang=vi`
  ).then(async (res) => {
    const data = await res.json();
    temp.innerText = data.main.temp;
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    sunrise.innerText = convertTimestampToTime(data.sys.sunrise);
    sunset.innerText = convertTimestampToTime(data.sys.sunset);
    windSpeed.innerText = data.wind.speed;
    waterWet.innerText = data.main.humidity;
    description.innerText = data.weather[0].description;
    console.log(data);
  });
}

function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
