// offline data (will manage the data on indexDB available in browser -> dev tool -> application)
db.enablePersistence().catch((error) => {
  if (error.code === "failed-precondition") {
    // probably multiple tabs
    console.error("persistance failed");
  } else if (error.code == "unimplemented") {
    // browser not supported
    console.error("persistance not available");
  }
});

// real-time listener (trigger the function, when there is/are any changes in firestore)
db.collection("recipes").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((snap) => {
    console.log(snap?.doc?.data());
    if (snap.type === "added") {
      renderRecipe(snap.doc.data(), snap.doc.id);
    }
    if (snap.type === "removed") {
        removeRecipe(snap.doc.id);
    }
  });
});

// add new recipes
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const newRecipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection("recipes")
    .add(newRecipe)
    .catch((error) => {
      console.error(error);
    });

  form.title.value = "";
  form.ingredients.value = "";
});

// delete a recipe
const recipeContainer = document.querySelector('.recipes')
recipeContainer.addEventListener('click', event => {
    if (event.target.tagName === "I") {
        const id = event.target.getAttribute('data-id')
        db.collection('recipes').doc(id).delete()
    }
})