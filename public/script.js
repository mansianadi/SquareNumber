document.getElementById("cocktailForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        const ingredients = document.getElementById("ingredients").value;
        const flavor = document.getElementById("flavor").value;
        const mood = document.getElementById("mood").value;

        try {
            const response = await fetch("/api/cocktail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredients, flavor, mood }),
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById("cocktailRecipe").textContent =
                    data.recipe;
                // Display the image
                const imageElement = document.getElementById("cocktailImage");
                imageElement.src = data.imageUrl; // Set the image URL
                imageElement.alt = "Generated Cocktail Image";
                imageElement.style.display = "block";
                imageElement.classList.remove("hidden"); // Ensure it's visible

                const preElement = document.getElementById("cocktailRecipe");
                if (imageElement.src && imageElement.style.display !== "none") {
                    preElement.style.whiteSpace = "pre-wrap"; // Wrap text if the image is present
                } else {
                    preElement.style.whiteSpace = "nowrap"; // No wrap if image is hidden or not available
                }

                document.getElementById("result").classList.remove("hidden");
            }
        } catch (error) {
            alert("Error generating the cocktail recipe.");
            console.error(error);
        }
    },
);
