let allAvailableTensions = false;

function printHarmonicCircle() {
    clearOutput();
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
    let octave = 0;
    let startingPitch = currentChord.data.components[0].getPitchClass();
    if (startingPitch < 5) {
        octave++;
    }
    for (let i = 0; i < myHarmonicCircle.chords.size; i++) {
        let chord = currentChord.data;
        let button = document.createElement("button");
        button.classList.add("chord-button");
        let header = document.createElement("h1");
        header.textContent = chord.toString();
        button.appendChild(header);
        divOutput.appendChild(button);
        if (i > 0) {
            let previousPitch = currentChord.previous.data.components[0].getPitchClass();
            let currentPitch = currentChord.data.components[0].getPitchClass();
            if (previousPitch > currentPitch) {
                octave++;
            }
        }
        chord.octave = octave;
        button.addEventListener("click", function () {
            let popup = document.getElementById("popup");
            popup.style.display = "block";
            popup.innerHTML = '';
            chord.play(chord.octave);
            let list = document.createElement("ul");
            list.classList.add("custom-list");
            for (let component of chord.components) {
                let point = document.createElement("li");
                point.textContent = component.toString();
                list.appendChild(point);
            }
            let vector = chord.getIntervalVector();
            let classSet = chord.getPitchClassSet()
            let normalOrder = getNormalOrder(classSet);
            let primeForm = getPrimeForm(normalOrder);
            let header = document.createElement('h2');
            let componentsH = document.createElement('h2');
            let vectorH = document.createElement('h2');
            let classSetH = document.createElement('h2');
            let normalOrderH = document.createElement('h2');
            let primeFormH = document.createElement('h2');
            componentsH.appendChild(list);
            header.textContent = chord.toString() + ' components: ';
            vectorH.textContent = 'Interval vector: ' + vector;
            classSetH.textContent = 'Pitch class set: [' + classSet + ']';
            normalOrderH.textContent = 'Normal order: [' + normalOrder + ']';
            primeFormH.textContent = 'Prime form: [' + primeForm + ']';
            popup.appendChild(header);
            popup.appendChild(componentsH);
            popup.appendChild(vectorH);
            popup.appendChild(classSetH);
            popup.appendChild(normalOrderH);
            popup.appendChild(primeFormH);
        });
        currentChord = currentChord.getNext();
    }
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

function openPopup(string, fragment) {
    let popup = document.getElementById("popup");
    popup.innerHTML = string;
    popup.style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function toggleTensions() {
    allAvailableTensions = !allAvailableTensions;
    printHarmonicCircle();
}