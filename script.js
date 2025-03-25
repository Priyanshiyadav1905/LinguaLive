const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    selectTag = document.querySelectorAll("select"),
    exchangeIcon = document.querySelector(".exchange i"),
    translateBtn = document.querySelector("button"),
    icons = document.querySelectorAll(".icons i");

// ✅ Fix: Ensure select options are properly added
selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        let option = document.createElement("option");
        option.value = country_code;
        option.textContent = countries[country_code];

        // ✅ Set default selected languages
        if ((id === 0 && country_code === "en-GB") || (id === 1 && country_code === "hi-IN")) {
            option.selected = true;
        }

        tag.appendChild(option);  // ✅ Properly appending to the dropdown
    }
});


// ✅ Fix: Swap language and text correctly
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;

    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

// ✅ Fix: Correct event listener typo
translateBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

    if (!text) return;  // Prevent empty requests

    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            toText.value = data.responseData.translatedText;
        })
        .catch(error => console.error("Translation API Error:", error));
});

// ✅ Fix: Copy and Speech Synthesis Functions
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id === "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id === "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
