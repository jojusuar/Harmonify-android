class Chord {
    constructor(root, scale, allTensions, availableTensions) {
        let scaleCopy = scale;
        let rootIndex = scaleCopy.notes.indexOfObject(root);
        scaleCopy.notes.changeReference(rootIndex);
        let components = scaleCopy.notes.toArray();

        let second = false;
        let minorThird = false;
        let majorThird = false;
        let fourth = false;
        let diminishedFifth = false;
        let perfectFifth = false;
        let augmentedFifth = false;
        let minorSixth = false;
        let majorSixth = false;
        let minorSeventh = false;
        let majorSeventh = false;
        let flatNinth = false;
        let perfectNinth = false;
        let sharpNinth = false;
        let flatEleventh = false;
        let perfectEleventh = false;
        let sharpEleventh = false;
        let flatThirteenth = false;
        let perfectThirteenth = false;
        let sharpThirteenth = false;

        let note2nd;
        let noteMinor3rd;
        let noteMajor3rd;
        let note4th;
        let noteDiminished5th;
        let note5th;
        let noteAugmented5th;
        let noteMinor6th;
        let noteMajor6th;
        let noteMinor7th;
        let noteMajor7th;
        let noteFlat9th;
        let note9th;
        let noteSharp9th;
        let noteFlat11th;
        let note11th;
        let noteSharp11th;
        let noteFlat13th;
        let note13th;
        let noteSharp13th;

        let intervals = [];
        for (let i = 1; i < components.length; i++) {
            let current = components[i];
            let tuple = { interval: getInterval(root, current), note: current };
            intervals.push(tuple);
        }

        components = [root];

        let thirdAnalysis = analyze3rd(intervals);

        if (thirdAnalysis[0] == 1) {
            majorThird = true;
            noteMajor3rd = thirdAnalysis[1];
        }
        else if (thirdAnalysis[0] == 0) {
            minorThird = true;
            noteMinor3rd = thirdAnalysis[1];
        }
        else { //this decides if the intervals just suck or the chord actually IS suspended
            let quality = any3rd(intervals);
            if (quality[0] == 0) {
                minorThird = true;
                noteMinor3rd = quality[1];
            }
            else if (quality[0] == 1) {
                majorThird = true;
                noteMajor3rd = quality[1];
            }
        }

        let fifthAnalysis = analyze5th(intervals);

        if (fifthAnalysis[0] == 2) {
            augmentedFifth = true;
            noteAugmented5th = fifthAnalysis[1];
        }
        else if (fifthAnalysis[0] == 1) {
            perfectFifth = true;
            note5th = fifthAnalysis[1];
        }
        else if (fifthAnalysis[0] == 1) {
            perfectFifth = true;
            note5th = fifthAnalysis[1];
        }
        else if (fifthAnalysis[0] == 0) {
            diminishedFifth = true;
            noteDiminished5th = fifthAnalysis[1];
        }
        else {
            let quality = any5th(intervals);
            if (quality[0] == 0) {
                diminishedFifth = true;
                noteDiminished5th = quality[1];
            }
            else if (quality[0] == 1) {
                perfectFifth = true;
                note5th = quality[1];
            }
            else if (quality[0] == 2) {
                augmentedFifth = true;
                noteAugmented5th = quality[1];
            }
        }

        for (let tuple of intervals) {
            let interval = tuple.interval;
            let note = tuple.note;
            let tonalDistance = null;
            if (interval != null) {
                for (let key of intervalMap.keys()) {
                    if (intervalMap.get(key).includes(interval)) {
                        tonalDistance = parseInt(key);
                        break;
                    }
                }
                switch (tonalDistance) {
                    case null: {
                        break;
                    }
                    case 1: {
                        flatNinth = true;
                        noteFlat9th = note;
                        break;
                    }
                    case 2: {
                        second = true;
                        note2nd = note;
                        break;
                    }
                    case 3: {
                        sharpNinth = true;
                        noteSharp9th = note;
                        break;
                    }
                    case 4: {
                        flatEleventh = true;
                        noteFlat11th = note;
                        break;
                    }
                    case 5: {
                        fourth = true;
                        note4th = note;
                        break;
                    }
                    case 6: {
                        sharpEleventh = true;
                        noteSharp11th = note;
                        break;
                    }
                    case 8: {
                        minorSixth = true;
                        noteMinor6th = note;
                        break;
                    }
                    case 9: {
                        majorSixth = true;
                        noteMajor6th = note;
                        break;
                    }
                    case 10: {
                        minorSeventh = true;
                        noteMinor7th = note;
                        break;
                    }
                    case 11: {
                        majorSeventh = true;
                        noteMajor7th = note;
                        break;
                    }
                }
            }
        }

        let stopFlat9th = false;
        if (availableTensions && getSemitoneDifference(root, noteFlat9th) != 2) {
            flatNinth = false;
            stopFlat9th = true;
        }

        //some important properties
        let brokenTriad = !second && !minorThird && !majorThird && !fourth;
        let has7th = minorSeventh || majorSeventh;

        let availableSymbols = [];  //storing all tensions and alterations
        if (has7th) {
            availableSymbols.push('(7)');
        }
        if (flatNinth && allTensions && !stopFlat9th) {
            availableSymbols.push('(♭9)');
        }

        if (perfectNinth || (second && (minorThird || majorThird))) { //deducing the 9th
            if (!perfectNinth) {
                second = false;
                perfectNinth = true;
                note9th = note2nd;
            }
            let rollback = false;
            if (availableTensions && getSemitoneDifference(root, note9th) != 2) {
                perfectNinth = false;
                rollback = true;
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(9)');
            }
        }
      
        if (sharpNinth) { //deducing the sharp 9th
            let rollback = false;
            if (availableTensions && getSemitoneDifference(root, noteSharp9th) != 2) {
                sharpNinth = false;
                rollback = true;
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(♯9)');
            }
        }
        else if (flatEleventh) { //deducing the flat 11th
            let rollback = false;
            if (availableTensions) { //this is an avoid tone, so only to be added if explicitly asked
                flatEleventh = false;
                rollback = true;
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(♭11)');
            }
        }

        if (perfectEleventh || (fourth && (second || minorThird || majorThird))) { //deducing the 11th
            if (!perfectEleventh) {
                fourth = false;
                perfectEleventh = true;
                note11th = note4th;
            }
            let rollback = false;
            if (availableTensions) {
                if (minorThird && getSemitoneDifference(noteMinor3rd, note11th) != 2) {
                    perfectEleventh = false;
                    rollback = true;
                }
                else if (majorThird && getSemitoneDifference(noteMajor3rd, note11th) != 2) {
                    perfectEleventh = false;
                    rollback = true;
                }
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(11)');
            }
        }
        if (sharpEleventh || (perfectFifth && diminishedFifth && !brokenTriad)) { //deducing the sharp 11th
            if (!sharpEleventh) {
                diminishedFifth = false;
                sharpEleventh = true;
                noteSharp11th = noteDiminished5th;
            }
            let rollback = false;
            if (availableTensions) {
                if (minorThird && getSemitoneDifference(noteMinor3rd, noteSharp11th) != 2) {
                    sharpEleventh = false;
                    rollback = true;
                }
                else if (majorThird && getSemitoneDifference(noteMajor3rd, noteSharp11th) != 2) {
                    sharpEleventh = false;
                    rollback = true;
                }
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(♯11)');
            }
        }
        if ((augmentedFifth && (diminishedFifth || perfectFifth)) || (minorSixth && majorSixth) || (minorSixth && has7th)) { //deducing  the flat 13th
            flatThirteenth = true;
            if (augmentedFifth) {
                augmentedFifth = false;
                noteFlat13th = noteAugmented5th;
            }
            if (minorSixth) {
                minorSixth = false;
                noteFlat13th = noteMinor6th;
            }
            let rollback = false;
            if (availableTensions) {
                if (diminishedFifth && getSemitoneDifference(noteDiminished5th, noteFlat13th) != 2) {
                    flatThirteenth = false;
                    rollback = true;
                }
                else if (perfectFifth && getSemitoneDifference(note5th, noteFlat13th) != 2) {
                    flatThirteenth = false;
                    rollback = true;
                }
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(♭13)');
            }
        }
        if (perfectThirteenth || (majorSixth && (minorSeventh || majorSeventh))) { //deducing the 13th
            if (!perfectThirteenth) {
                majorSixth = false;
                perfectThirteenth = true;
                note13th = noteMajor6th;
            }
            let rollback = false;
            if (availableTensions) {
                if (diminishedFifth && getSemitoneDifference(noteDiminished5th, note13th) != 2) {
                    perfectThirteenth = false;
                    rollback = true;
                }
                else if (perfectFifth && getSemitoneDifference(note5th, note13th) != 2) {
                    perfectThirteenth = false;
                    rollback = true;
                }
                else if (augmentedFifth && getSemitoneDifference(noteAugmented5th, note13th) != 2) {
                    perfectThirteenth = false;
                    rollback = true;
                }
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(13)');
            }
        }
        if (sharpThirteenth || (minorSeventh && majorSeventh)) { //deducing the sharp 13th
            if (!sharpThirteenth) {
                minorSeventh = false;
                sharpThirteenth = true;
                noteSharp13th = noteMinor7th;
            }
            let rollback = false;
            if (availableTensions) {
                if (diminishedFifth && getSemitoneDifference(noteDiminished5th, noteSharp13th) != 2) {
                    sharpThirteenth = false;
                    rollback = true;
                }
                else if (perfectFifth && getSemitoneDifference(note5th, noteSharp13th) != 2) {
                    sharpThirteenth = false;
                    rollback = true;
                }
                else if (augmentedFifth && getSemitoneDifference(noteAugmented5th, noteSharp13th) != 2) {
                    sharpThirteenth = false;
                    rollback = true;
                }
            }
            if (allTensions && !rollback) {
                availableSymbols.push('(♯13)');
            }
        }

        components = [root]; //parsing the confirmed components
        if (second) {
            components.push(note2nd);
        }
        if (minorThird) {
            components.push(noteMinor3rd);
        }
        if (majorThird) {
            components.push(noteMajor3rd);
        }
        if (fourth) {
            components.push(note4th);
        }
        if (diminishedFifth) {
            components.push(noteDiminished5th);
        }
        if (perfectFifth) {
            components.push(note5th);
        }
        if (augmentedFifth) {
            components.push(noteAugmented5th);
        }
        if (minorSixth) {
            components.push(noteMinor6th);
        }
        if (majorSixth) {
            components.push(noteMajor6th);
        }
        if (minorSeventh) {
            components.push(noteMinor7th);
        }
        if (majorSeventh) {
            components.push(noteMajor7th);
        }
        if (allTensions) {
            if (flatNinth) {
                components.push(noteFlat9th);
            }
            if (perfectNinth) {
                components.push(note9th);
            }
            if (sharpNinth) {
                components.push(noteSharp9th);
            }
            if (flatEleventh) {
                components.push(noteFlat11th);
            }
            if (perfectEleventh) {
                components.push(note11th);
            }
            if (sharpEleventh) {
                components.push(noteSharp11th);
            }
            if (flatThirteenth) {
                components.push(noteFlat13th);
            }
            if (perfectThirteenth) {
                components.push(note13th);
            }
            if (sharpThirteenth) {
                components.push(noteSharp13th);
            }
        }
        else {
            flatNinth = false;
            perfectNinth = false;
            sharpNinth = false;
            flatEleventh = false;
            perfectEleventh = false;
            sharpEleventh = false;
            flatThirteenth = false;
            perfectThirteenth = false;
            sharpThirteenth = false;
        }
        this.components = components;
        let no5th = !diminishedFifth && !perfectFifth && !augmentedFifth;
        let diminished = !second && minorThird && !majorThird && !fourth && diminishedFifth && !perfectFifth && !augmentedFifth && !minorSeventh && !majorSeventh && !flatNinth && !perfectNinth && !flatEleventh && !perfectEleventh && !flatThirteenth && !sharpThirteenth; //basically, if any interval's tonal distance is not divisible by 3 it breaks the diminished property, and at least minor 3rd and b5 must be present

        let symbol = root.toString();

        if (diminished) { //triad calculation
            symbol += 'dim';
        }
        else if (minorThird) {
            symbol += 'm';
        }

        let tensionString = ''; //tension calculation
        let breakpoint;
        if (has7th && perfectNinth && perfectEleventh && perfectThirteenth && allTensions) {
            tensionString += '13';
        }
        else if (has7th && perfectNinth && perfectEleventh && allTensions) {
            breakpoint = 3;
            tensionString += '11';
        }
        else if (has7th && perfectNinth && allTensions) {
            breakpoint = 2;
            tensionString += '9';
        }
        else if (has7th) {
            breakpoint = 1;
            tensionString += '7';
        }
        else {
            breakpoint = 0;
        }


        let alterationString = ''; // build the alteration string with everything after the tension stack stopped
        for (let i = breakpoint; i < availableSymbols.length; i++) {
            alterationString += availableSymbols[i];
        }
        if (majorSixth && !diminished) { //6th calculation
            symbol += '6';
        }
        else if (minorSeventh) { //7th calculation (the stacking of 7th-9th-11th-13th goes here)
            symbol += tensionString;
        }
        else if (majorSeventh) {
            if (minorThird) {
                symbol += '(maj' + tensionString + ')';
            }
            else {
                symbol += 'maj' + tensionString + '';
            }
        }

        if (!majorThird) { //suspensions calculation
            if (second) {
                symbol += 'sus2';
            }
            else if (fourth) {
                symbol += 'sus4';
            }
        }

        if (diminishedFifth && !diminished) { //alterations calculation (everything after breaking the 7th-9th-11th-13th order also goes here)
            symbol += '(♭5)';
        }
        else if (augmentedFifth) {
            symbol += '(♯5)';
        }
        if (minorSixth) {
            symbol += '(♭6)';
        }
        symbol += alterationString;

        if (brokenTriad) { //if no 3rd or suspension is present
            symbol += '(no3)';
        }
        if (no5th) { //if no 5th is present
            symbol += '(no5)';
        }

        this.symbol = symbol;
    }

    toString() {
        return this.symbol;
    }

    getIntervalVector() {
        let components = this.components;
        let vector = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < components.length - 1; i++) {
            let note1 = components[i];
            for (let j = i + 1; j < components.length; j++) {
                let note2 = components[j];
                let distance = getSemitoneDifference(note1, note2);
                if(distance == 1 || distance == 11){
                    vector[0]++;
                }
                else if(distance == 2 || distance == 10){
                    vector[1]++;
                }
                if(distance == 3 || distance == 9){
                    vector[2]++;
                }
                if(distance == 4 || distance == 8){
                    vector[3]++;
                }
                if(distance == 5 || distance == 7){
                    vector[4]++;
                }
                if(distance == 6){
                    vector[5]++;
                }
            }
        }
        return '<'+vector+'>';
    }
}

function analyze3rd(intervals) {
    let interval = null;
    let note = null;
    let foundAt = -1;
    for (let tuple of intervals) {
        foundAt++;
        if (tuple.interval.includes("THIRD")) {
            interval = tuple.interval;
            note = tuple.note;
            break;
        }
    }
    if (interval != null && intervalMap.get(4).includes(interval)) { //looking directly for the major 3rd interval
        intervals.splice(foundAt, 1);
        return [1, note];
    }
    else if (interval != null && intervalMap.get(3).includes(interval)) { //looking directly for the minor 3rd interval
        intervals.splice(foundAt, 1);
        return [0, note];
    }
    return [-1, null];
}

function analyze5th(intervals) {
    let interval = null;
    let note = null;
    let foundAt = -1;
    for (let tuple of intervals) {
        foundAt++;
        if (tuple.interval.includes("FIFTH")) {
            interval = tuple.interval;
            note = tuple.note;
            break;
        }
    }
    if (interval != null && intervalMap.get(8).includes(interval)) {
        intervals.splice(foundAt, 1);
        return [2, note];
    }
    else if (interval != null && intervalMap.get(7).includes(interval)) {
        intervals.splice(foundAt, 1);
        return [1, note];
    }
    else if (interval != null && intervalMap.get(6).includes(interval)) {
        intervals.splice(foundAt, 1);
        return [0, note];
    }
    return [-1, null];
}

function any3rd(intervals) {
    for (let i = 0; i < intervals.length; i++) {
        let current = intervals[i].interval;
        let note = intervals[i].note;
        if (intervalMap.get(3).includes(current)) { //looking for any other interval that can determine the 3rd
            intervals.splice(i, 1);
            return [0, note]; //for minor
        }
        else if (intervalMap.get(4).includes(current)) {
            intervals.splice(i, 1);
            return [1, note]; //for major
        }
    }
    return [-1, null];
}

function any5th(intervals) {
    for (let i = 0; i < intervals.length; i++) {
        let current = intervals[i].interval;
        let note = intervals[i].note;
        if (intervalMap.get(6).includes(current)) { //looking for any other interval that can determine the 5th
            intervals.splice(i, 1);
            return [0, note]; //for diminished
        }
        else if (intervalMap.get(7).includes(current)) {
            intervals.splice(i, 1);
            return [1, note]; //for perfect
        }
        else if (intervalMap.get(8).includes(current)) {
            intervals.splice(i, 1);
            return [2, note]; //for augmented
        }
    }
    return [-1, null];
}