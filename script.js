const city = document.getElementById('city');
const popup = document.getElementById('notePopup');
const popupText = document.getElementById('noteText');
const channel = new BroadcastChannel('dear-teacher');

// Assets
const cloudImgsLeft = ['clouds1.png', 'clouds2.png'];
const cloudImgsRight = ['clouds3.png', 'clouds4.png'];
const carImgs = ['car1.png', 'car3.PNG', 'car4.PNG', 'car5.PNG'];
const flagImgs = ['flag1.png', 'flag2.png', 'flag3.PNG', 'flag4.PNG'];
const shortHouseImgs = ['shorthouse.png', 'shorthouse2.png', 'shorthouse3.png', 'shorthouse4.PNG'];
const tallHouseImgs = ['tallhouse1.png', 'tallhouse2.PNG', 'tallhouse3.PNG', 'tallhouse4.PNG', 'tallhouse5.PNG', 'tallhouse6.PNG', 'tallhouse7.PNG', 'tallhouse8.PNG'];
const treeImgs = ['tree1.png', 'tree2.png', 'tree3.png', 'tree4.png', 'tree5.PNG', 'tree6.PNG', 'tree7.PNG', 'tree8.PNG', 'tree9.PNG'];
const schoolImgs = ['school1.png', 'school2.png', 'school3.PNG', 'school4.PNG'];
const signboardImgs = ['signboard1.png', 'signboard2.png', 'signboard3.PNG', 'signboard4.PNG'];
const sunImg = 'sun.PNG';
const planeImgs = ['plane1.png', 'plane2.png'];
const flowerImgs = ['flower1.png'];
const humanImgs = ['human.png'];
const monumentImgs = ['lgbtqmonument.PNG'];

let sunSpawned = false;
let cloudCounter = 0;
let planeCounter = 0;
let buildingCounter = 0;
let shortIndex = 0;
let tallIndex = 0;
let useTall = false;
let signboardIndex = 0;
let flowerIndex = 0;
let humanIndex = 0;
let monumentIndex = 0;
let cloudLayerToggle = true;

channel.addEventListener('message', (event) => {
  const message = event.data;
  spawnAsset(message);
});

function spawnAsset(message) {
  let type, src, direction;

  if (!sunSpawned) {
    type = 'sun';
    src = 'assets/' + sunImg;
    sunSpawned = true;
  }

  else if (Math.random() < 0.3) {
    direction = (cloudCounter % 4 < 2) ? 'left' : 'right';
    type = 'cloud';
    src = 'assets/' + (direction === 'left' ? cloudImgsLeft[cloudCounter % cloudImgsLeft.length] : cloudImgsRight[cloudCounter % cloudImgsRight.length]);
    cloudCounter++;

    if (cloudCounter === 3 && planeCounter === 0) {
      spawnPlane(planeCounter++, false, message);
    } else if (cloudCounter === 30 && planeCounter === 1) {
      spawnPlane(planeCounter++, true, message);
    }
  }

  else if (Math.random() < 0.1) {
    type = 'flower';
    src = 'assets/' + flowerImgs[flowerIndex++ % flowerImgs.length];
  }

  else if (Math.random() < 0.1) {
    type = 'human';
    src = 'assets/' + humanImgs[humanIndex++ % humanImgs.length];
  }

  else if (Math.random() < 0.05) {
    type = 'monument';
    src = 'assets/' + monumentImgs[monumentIndex++ % monumentImgs.length];
  }

  else if (Math.random() < 0.1) {
    type = 'signboard';
    src = 'assets/' + signboardImgs[signboardIndex++ % signboardImgs.length];
  }

  else if (Math.random() < 0.2) {
    type = 'car';
    src = 'assets/' + pick(carImgs);
  }

  else if (Math.random() < 0.3) {
    type = 'tree';
    src = 'assets/' + pick(treeImgs);
  }

  else if (Math.random() < 0.2) {
    type = 'school';
    src = 'assets/' + pick(schoolImgs);
    buildingCounter++;
  }

  else {
    type = 'house';
    if (!useTall) {
      src = 'assets/' + shortHouseImgs[shortIndex];
      shortIndex++;
      if (shortIndex >= shortHouseImgs.length) {
        useTall = true;
        shortIndex = 0;
      }
    } else {
      src = 'assets/' + tallHouseImgs[tallIndex];
      tallIndex++;
      if (tallIndex >= tallHouseImgs.length) {
        useTall = false;
        tallIndex = 0;
      }
    }
    buildingCounter++;
  }

  if (!src) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'asset-wrapper ' + type;

  const img = document.createElement('img');
  img.src = src;
  img.className = 'asset-img';

  if (type === 'sun') {
    img.style.width = '200px';
  }

  wrapper.appendChild(img);

  if (type === 'cloud') {
    wrapper.style.left = '-150px';
    const topPosition = cloudLayerToggle ? 8 + Math.random() * 2 : 14 + Math.random() * 2;
    wrapper.style.top = `${topPosition}%`;
    cloudLayerToggle = !cloudLayerToggle;
  }

  else if (type === 'car') {
    wrapper.style.left = '-150px';
    wrapper.style.bottom = '25px';
  }

  else if (type === 'sun') {
    wrapper.style.left = '80%';
    wrapper.style.top = '2%';
  }

  else {
    wrapper.style.left = Math.random() * 90 + '%';
    wrapper.style.bottom = '70px';
  }

  wrapper.addEventListener('mouseenter', () => {
    const cleanMessage = message.trim();

    if (/^Dear Teacher[,:]?/i.test(cleanMessage)) {
      popupText.innerHTML = cleanMessage.replace(/\n/g, '<br>');
    } else {
      popupText.innerHTML = `<strong>Dear Teacher,</strong><br>${cleanMessage.replace(/\n/g, '<br>')}`;
    }

    popup.style.display = 'block';
  });

  wrapper.addEventListener('mouseleave', () => {
    popup.style.display = 'none';
  });

  city.appendChild(wrapper);

  if ((type === 'house' || type === 'school') && buildingCounter % 10 === 0) {
    const flag = document.createElement('img');
    flag.src = 'assets/' + pick(flagImgs);
    flag.style.position = 'absolute';
    flag.style.top = '-30px';
    flag.style.width = '30px';
    wrapper.appendChild(flag);
  }
}

function spawnPlane(index, isAbove, message) {
  const wrapper = document.createElement('div');
  wrapper.className = 'asset-wrapper plane';
  wrapper.style.left = '-200px';
  wrapper.style.top = isAbove ? '8%' : '24%';
  wrapper.style.zIndex = '3';

  const planeImg = document.createElement('img');
  planeImg.src = 'assets/' + planeImgs[index % planeImgs.length];
  planeImg.className = 'asset-img';
  wrapper.appendChild(planeImg);

  // Same note handling as others
  wrapper.addEventListener('mouseenter', () => {
    const cleanMessage = message.trim();

    if (/^Dear Teacher[,:]?/i.test(cleanMessage)) {
      popupText.innerHTML = cleanMessage.replace(/\n/g, '<br>');
    } else {
      popupText.innerHTML = `<strong>Dear Teacher,</strong><br>${cleanMessage.replace(/\n/g, '<br>')}`;
    }

    popup.style.display = 'block';
  });

  wrapper.addEventListener('mouseleave', () => {
    popup.style.display = 'none';
  });

  city.appendChild(wrapper);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const downloadBtn = document.getElementById('downloadBtn');
const savedNotes = [];

downloadBtn.addEventListener('click', () => {
  if (savedNotes.length === 0) {
    alert("No notes to save yet!");
    return;
  }

  const blob = new Blob([savedNotes.join('\n\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'teacher_notes.txt';
  a.click();
  URL.revokeObjectURL(url);
});
