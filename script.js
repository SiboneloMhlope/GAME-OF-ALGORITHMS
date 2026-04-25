let arr = [];
let game = "bubble";
let score = 0;
let index = 0;
let done = false;

// bubble sort variables
let lastUnsorted = 0;
let pass = 0;

// quicksort variables
let quickLeft = 0;
let quickRight = 0;
let boundary = 0;
let pivotIndex = 0;
let step = 0;
let quickStack = [];

function randomArray() {
    let newArr = [];
    for (let i = 0; i < 7; i++) {
        newArr.push(Math.floor(Math.random() * 80) + 20);
    }
    return newArr;
}

function draw() {
    let container = document.getElementById("array");
    container.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        let box = document.createElement("div");
        box.className = "card";
        
        if (game == "bubble" && !done) {
            if (i == index || i == index + 1) {
                box.classList.add("highlight");
            }
            if (i > lastUnsorted) {
                box.style.background = "#cccccc";
            }
        }
        
        if (game == "quick" && !done && step < 2) {
            if (i == index) {
                box.classList.add("highlight");
            }
            if (i == pivotIndex) {
                box.style.background = "orange";
            }
            if (i == boundary) {
                box.style.borderBottom = "4px solid red";
                box.style.paddingBottom = "16px";
            }
        }
        
        box.innerHTML = arr[i] + "<br><small>[" + i + "]</small>";
        container.appendChild(box);
    }
    document.getElementById("score").innerHTML = score;
}

function checkSorted() {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i+1]) return false;
    }
    return true;
}

function reset() {
    arr = randomArray();
    score = 0;
    index = 0;
    done = false;
    
    if (game == "bubble") {
        pass = 0;
        lastUnsorted = arr.length - 1;
        document.getElementById("message").innerHTML = "Bubble Sort: Compare yellow boxes. Swap if left > right.";
    } else {
        quickLeft = 0;
        quickRight = arr.length - 1;
        quickStack = [];
        step = 0;
        startQuickSort();
        return;
    }
    draw();
}

// ========== BUBBLE SORT ==========
function nextBubble() {
    if (index >= lastUnsorted) {
        lastUnsorted--;
        pass++;
        
        if (checkSorted() || lastUnsorted <= 0) {
            done = true;
            document.getElementById("message").innerHTML = "SORTED! Completed in " + (pass+1) + " passes!";
            draw();
            return false;
        } else {
            index = 0;
            document.getElementById("message").innerHTML = "Pass " + (pass+1) + " done. Largest item at position " + (lastUnsorted+1) + ". Next pass!";
            draw();
            return false;
        }
    }
    return true;
}

function bubbleSort(swap) {
    if (done) {
        document.getElementById("message").innerHTML = "Game over! Press New Array.";
        draw();
        return;
    }
    
    let needSwap = (arr[index] > arr[index + 1]);
    
    if (swap == needSwap) {
        score++;
        if (needSwap) {
            let temp = arr[index];
            arr[index] = arr[index + 1];
            arr[index + 1] = temp;
            document.getElementById("message").innerHTML = "Correct! Swapped " + arr[index+1] + " and " + arr[index];
        } else {
            document.getElementById("message").innerHTML = "Correct! " + arr[index] + " <= " + arr[index+1] + ", no swap.";
        }
        index++;
        nextBubble();
    } else {
        document.getElementById("message").innerHTML = "Wrong! Should be " + (needSwap ? "YES" : "NO");
        index++;
        nextBubble();
    }
    
    if (checkSorted()) {
        done = true;
        document.getElementById("message").innerHTML = "SORTED! You win!";
    }
    draw();
}

// ========== QUICKSORT (Proper Partition) ==========
function startQuickSort() {
    if (quickLeft >= quickRight) {
        if (quickStack.length == 0) {
            done = true;
            document.getElementById("message").innerHTML = "QUICKSORT DONE! Array fully sorted!";
            draw();
            return;
        } else {
            let next = quickStack.pop();
            quickLeft = next.l;
            quickRight = next.r;
            startPartition();
            return;
        }
    }
    startPartition();
}

function startPartition() {
    if (quickLeft >= quickRight) {
        startQuickSort();
        return;
    }
    
    // Step 1: Pick pivot from middle, swap with last
    let mid = Math.floor((quickLeft + quickRight) / 2);
    pivotIndex = mid;
    
    let temp = arr[pivotIndex];
    arr[pivotIndex] = arr[quickRight];
    arr[quickRight] = temp;
    pivotIndex = quickRight;
    
    // Step 2: Set boundary before first item
    boundary = quickLeft;
    index = quickLeft;
    step = 1;
    
    document.getElementById("message").innerHTML = "Partition [" + quickLeft + ".." + quickRight + "]: Pivot = " + arr[pivotIndex] + " (orange). Boundary at " + boundary + " (red line). If current < pivot, swap with boundary.";
    draw();
}

function quickSort(swap) {
    if (done) {
        document.getElementById("message").innerHTML = "Game over! Press New Array.";
        draw();
        return;
    }
    
    if (step == 1) {
        // Scanning phase
        if (index >= pivotIndex) {
            step = 2;
            document.getElementById("message").innerHTML = "Scan done! Swap pivot (orange) with boundary (red line). Click YES.";
            draw();
            return;
        }
        
        let current = arr[index];
        let pivot = arr[pivotIndex];
        let needSwap = (current < pivot);
        
        if (swap == needSwap) {
            score++;
            if (needSwap) {
                let temp = arr[index];
                arr[index] = arr[boundary];
                arr[boundary] = temp;
                document.getElementById("message").innerHTML = "Correct! " + current + " < " + pivot + ", swapped with index " + boundary + ". Boundary -> " + (boundary+1);
                boundary++;
            } else {
                document.getElementById("message").innerHTML = "Correct! " + current + " >= " + pivot + ", leave it.";
            }
            index++;
        } else {
            document.getElementById("message").innerHTML = "Wrong! Answer was " + (needSwap ? "YES" : "NO");
            index++;
        }
        draw();
        
    } else if (step == 2) {
        if (swap == true) {
            // Swap pivot with boundary
            let temp = arr[pivotIndex];
            arr[pivotIndex] = arr[boundary];
            arr[boundary] = temp;
            score++;
            document.getElementById("message").innerHTML = "Pivot placed at index " + boundary + " (final position!).";
            
            // Push right sublist to stack, then handle left
            if (boundary + 1 < quickRight) {
                quickStack.push({l: boundary + 1, r: quickRight});
            }
            
            // Set up left sublist
            quickRight = boundary - 1;
            step = 0;
            startQuickSort();
        } else {
            document.getElementById("message").innerHTML = "Wrong! Must swap pivot with boundary. Click YES.";
        }
        draw();
    }
}

function handleYes() {
    if (game == "bubble") bubbleSort(true);
    else quickSort(true);
}

function handleNo() {
    if (game == "bubble") bubbleSort(false);
    else quickSort(false);
}

document.getElementById("bubbleBtn").onclick = function() {
    game = "bubble";
    document.getElementById("bubbleBtn").classList.add("active");
    document.getElementById("quickBtn").classList.remove("active");
    reset();
};

document.getElementById("quickBtn").onclick = function() {
    game = "quick";
    document.getElementById("quickBtn").classList.add("active");
    document.getElementById("bubbleBtn").classList.remove("active");
    arr = randomArray();
    score = 0;
    done = false;
    quickLeft = 0;
    quickRight = arr.length - 1;
    quickStack = [];
    step = 0;
    draw();
    startQuickSort();
};

document.getElementById("yesBtn").onclick = handleYes;
document.getElementById("noBtn").onclick = handleNo;
document.getElementById("resetBtn").onclick = function() {
    if (game == "bubble") {
        reset();
    } else {
        arr = randomArray();
        score = 0;
        done = false;
        quickLeft = 0;
        quickRight = arr.length - 1;
        quickStack = [];
        step = 0;
        draw();
        startQuickSort();
    }
};

// Initialize
reset();