let optionButtons = document.querySelectorAll('.option-button');
optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        optionButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = 'rgb(39, 40, 41)';
        });
        button.classList.add('selected');
        button.style.backgroundColor = 'rgb(70, 70, 70)';
    });
});
let defaultNote = document.getElementById("CButton");
defaultNote.style.backgroundColor = 'rgb(70, 70, 70)';
let defaultAlter = document.getElementById("naturalButton");
defaultAlter.style.backgroundColor = 'rgb(70, 70, 70)';
let defaultToggle = document.getElementById("ScaleButtons");
let defaultOpt = document.getElementById("scaleOption");
defaultOpt.style.backgroundColor = 'rgb(70, 70, 70)';
defaultToggle.style.display = "block";
let noteButtons = document.querySelectorAll('.toggleA-button');
let alterButtons = document.querySelectorAll('.toggleB-button');
let noteValue = "C";
let flat = false;
let sharp = false;
let doubleFlat = false;
let doubleSharp = false;
noteButtons.forEach(button => {
    button.addEventListener('click', () => {
        noteButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = 'rgb(39, 40, 41)';
        });
        button.classList.add('selected');
        button.style.backgroundColor = 'rgb(70, 70, 70)';
        noteValue = button.getAttribute('data-value');
    });
});
alterButtons.forEach(button => {
    if (button.id == "doubleFlatButton" || button.id == "doubleSharpButton") {
        button.style.display = 'none';
    }
    button.addEventListener('click', () => {
        alterButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = 'rgb(39, 40, 41)';
        });
        button.classList.add('selected');
        button.style.backgroundColor = 'rgb(70, 70, 70)';
        let alterValue = button.getAttribute('data-value');
        resetAlter();
        if (alterValue === 'FLAT') {
            flat = true;
        }
        else if (alterValue === 'SHARP') {
            sharp = true;
        }
        else if (alterValue === 'DOUBLE_FLAT') {
            doubleFlat = true;
        }
        else if (alterValue === 'DOUBLE_SHARP') {
            doubleSharp = true;
        }
    });
});

let scaleDiv = document.getElementById("ScaleButtons");
let scaleDropdowns = '<select id="scaleSelector" class="dropdown" onchange="handleScale()"><option value="DIATONIC" selected>Diatonic (natural)</option><option value="MELODIC_ASC">Melodic (ascending)</option><option value="HARMONIC_MAJOR">Harmonic major</option><option value="HARMONIC_MINOR">Harmonic minor</option><option value="BYZANTINE">Byzantine (double harmonic)</option><option value="NEAPOLITAN_MAJOR">Neapolitan major</option><option value="NEAPOLITAN_MINOR">Neapolitan minor</option><option value="HUNGARIAN_MAJOR">Hungarian major</option><option value="ROMANIAN_MAJOR">Romanian major</option></select><select id="modeSelector" class="dropdown"><option value=0 selected>I. Ionian (major)</option><option value=1>II. Dorian</option><option value=2>III. Phrygian</option><option value=3>IV. Lydian</option><option value=4>V. Mixolydian</option><option value=5>VI. Aeolian (minor)</option><option value=6>VII. Locrian</option></select>';;

let divOutput = document.getElementById("output");

function clearOutput() {
    while (divOutput.firstChild) {
        divOutput.removeChild(divOutput.firstChild);
    }
};

function toggleElements(buttonID, divID) {
    let allDivs = document.querySelectorAll('.hidden');
    allDivs.forEach(div => {
        div.style.display = 'none';
    });
    allAvailableTensions = false;
    noteGraph = new Graph(true);
    selectedNotes = [];
    selectedNotesString = "<h2> Notes: </h2>";
    clearWarning();
    clearOutput();
    closePopup();
    let selected = document.getElementById(divID);
    selected.style.display = 'block';
    if (buttonID === 'scaleOption') {
        scaleDiv.innerHTML = scaleDropdowns + '<br> Select a root note, a scale and a greek mode from above, then hit the build button to generate the scale <br> <button type="button" id="scaleButton" class="output-button" onclick="printScale()">Build scale</button>';
        alterButtons.forEach(button => {
            if (button.id == "doubleFlatButton" || button.id == "doubleSharpButton") {
                button.style.display = 'none';
            }
        });
    }
    else if (buttonID === 'harmonicCircleOption') {
        scaleDiv.innerHTML = scaleDropdowns + '<br> Select a tonic chord, a scale and a mode from above, then hit the build button to generate the harmonic circle <br> <button type="button" id="harmonicCircleButton" class="output-button" onclick="printHarmonicCircle()">Build harmonic circle</button> <br> Click on any chord to reveal its components <br> Show all available tensions <label class="switch"><input type="checkbox" onclick="toggleTensions()"><span class="slider round"></span></label>';
        alterButtons.forEach(button => {
            if (button.id == "doubleFlatButton" || button.id == "doubleSharpButton") {
                button.style.display = 'none';
            }
        });
    }
    else if (buttonID === 'finderOption') {
        alterButtons.forEach(button => {
            if (button.id == "doubleFlatButton" || button.id == "doubleSharpButton") {
                button.style.display = 'inline';
            }
        });
    }
};

function resetAlter() {
    flat = false;
    sharp = false;
    doubleFlat = false;
    doubleSharp = false;
}