let allAvailableTensions = false;

function printHarmonicCircle() {
    closePopup();
    let scaleBtn = document.getElementById("scaleButton");
    let scaleCB = document.getElementById("scaleSelector");
    let modeCB = document.getElementById("modeSelector");
    let choiceIndex = scaleCB.selectedIndex;
    let choice = scaleCB[choiceIndex];
    let modeIndex = modeCB.selectedIndex;
    let myScale = new Scale(new Note(noteValue, flat, sharp, false, false), new Intervals(choice.value, modeIndex));
    let myHarmonicCircle = new HarmonicCircle(myScale, allAvailableTensions, allAvailableTensions);
    let currentChord = myHarmonicCircle.chords.reference;
    let formattedComponents = formatComponents(currentChord.getData());
    let classSet = currentChord.getData().getPitchClassSet();
    let normalOrder = getNormalOrder(classSet);
    let primeForm = getPrimeForm(normalOrder);
    let vector = currentChord.getData().getIntervalVector();
    let properties = '<h2>Interval vector: ' + vector + '</h2><h2>Pitch class set: [' + classSet + ']</h2><h2>Normal order: [' + normalOrder + ']</h2><h2>Prime form: [' + primeForm + ']</h2>';
    vector = currentChord.getData().getIntervalVector();
    formattedComponents += properties;
    let htmlCode = '<button class="chord-button" onclick="openPopup(\'' + formattedComponents + '\')"><h1>' + currentChord.getData().toString() + '</h1></button>';
    currentChord = currentChord.getNext();
    while (currentChord !== myHarmonicCircle.chords.reference) {
        formattedComponents = formatComponents(currentChord.getData());
        classSet = currentChord.getData().getPitchClassSet();
        normalOrder = getNormalOrder(classSet);
        primeForm = getPrimeForm(normalOrder);
        vector = currentChord.getData().getIntervalVector();
        properties = '<h2>Interval vector: ' + vector + '</h2><h2>Pitch class set: [' + classSet + ']</h2><h2>Normal order: [' + normalOrder + ']</h2><h2>Prime form: [' + primeForm + ']</h2>';
        formattedComponents += properties;
        htmlCode += '<button class="chord-button" onclick="openPopup(\'' + formattedComponents + '\')"><h1>' + currentChord.getData().toString() + '</h1></button>';
        currentChord = currentChord.getNext();
    }
    divOutput.innerHTML = htmlCode;
    let chordButtons = document.querySelectorAll('.chord-button');
    chordButtons.forEach(button => {
        button.addEventListener('click', () => {
            chordButtons.forEach(btn => {
                btn.style.backgroundColor = 'rgb(39, 40, 41)';
            });
            button.classList.add('selected');
            button.style.backgroundColor = 'rgb(70, 70, 70)';
        });
    });
}

function formatComponents(chord) {
    string = ' <h2>' + chord.toString() + ' components: <ul class=custom-list>';
    chord.components.forEach(note => {
        string += '<li>' + note.toString() + '</li>';
    });
    string += '</ul></h2>';
    return string;
}

function openPopup(string) {
    let popup = document.getElementById("popup");
    popup.style.display = "block";
    popup.innerHTML = string;
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function toggleTensions() {
    allAvailableTensions = !allAvailableTensions;
    printHarmonicCircle();
}