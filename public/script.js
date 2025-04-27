document.getElementById("calculateButton").onclick = async () => {
  const number = document.getElementById("numberInput").value;
  const result = document.getElementById("result");

  if (number === "") {
    result.textContent = "Please enter a number.";
    return;
  }

  try {
    const response = await fetch(`/api/square?number=${number}`);
    const data = await response.json();
    result.textContent = data.error || `Square: ${data.square}`;
  } catch {
    result.textContent = "Error calculating square.";
  }
};
