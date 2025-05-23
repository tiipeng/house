let lockedParts = new Set();
let dropCount = {
  pfeiler: 0,
  wand: 0,
  tür: 0,
  fenster: 0,
  dach: 0,
};

const maxCount = {
  pfeiler: 4, // 4 Dropzones
  wand: 1,
  tür: 1,
  fenster: 1,
  dach: 1,
};

interact('.draggable').draggable({
  inertia: true,
  startAxis: 'xy',
  listeners: {
    move(event) {
      const target = event.target;
      if (lockedParts.has(target)) return;

      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  }
});

interact('.dropzone').dropzone({
  accept: '.draggable',
  overlap: 0.5,
  ondragenter(event) {
    event.target.classList.add('drag-target');
  },
  ondragleave(event) {
    event.target.classList.remove('drag-target');
  },
  ondrop(event) {
    const dropType = event.target.getAttribute('data-part');
    const dragType = event.relatedTarget.getAttribute('data-part');

    if (dropType === dragType && dropCount[dropType] < maxCount[dropType]) {
      event.target.innerHTML = '';
      event.target.appendChild(event.relatedTarget);

      event.relatedTarget.style.transform = '';
      event.relatedTarget.setAttribute('data-x', 0);
      event.relatedTarget.setAttribute('data-y', 0);

      dropCount[dropType]++;
      lockedParts.add(event.relatedTarget);

      checkSuccess();
    } else {
      event.relatedTarget.style.transform = 'translate(0px, 0px)';
      event.relatedTarget.setAttribute('data-x', 0);
      event.relatedTarget.setAttribute('data-y', 0);
    }
  }
});

function checkSuccess() {
  if (
    dropCount.pfeiler === 4 &&
    dropCount.wand === 1 &&
    dropCount.tür === 1 &&
    dropCount.fenster === 1 &&
    dropCount.dach === 1
  ) {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('success').classList.remove('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const partsContainer = document.getElementById('parts');
  const parts = Array.from(partsContainer.children);

  // Fisher-Yates-Shuffle
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]];
  }

  // Neu anhängen in zufälliger Reihenfolge
  parts.forEach(el => partsContainer.appendChild(el));
});

event.relatedTarget.style.transition = 'transform 0.3s ease';
event.relatedTarget.style.transform = 'translate(0px, 0px)';